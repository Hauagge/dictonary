"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { getAudio, getPhonetic } from "@/lib/dictionary"
import type { DictionaryEntry, FavoriteItem, Paginated } from "@/lib/types"
import WordMeanings from "./WordMeanings"

const GHOST_BTN =
  "w-auto px-3.5 py-2 rounded-[10px] border border-border bg-transparent text-text text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"

export default function WordModal({ word, onClose }: { word: string; onClose: () => void }) {
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiFetch<DictionaryEntry[]>(`/entries/en/${encodeURIComponent(word)}`)
      .then(setEntries)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [word])

  useEffect(() => {
    apiFetch<Paginated<FavoriteItem>>("/user/me/favorites?limit=100")
      .then((data) => setFavorite(data.results.some((item) => item.word === word.toLowerCase())))
      .catch(() => setFavorite(false))
  }, [word])

  async function toggleFavorite() {
    const next = !favorite
    setFavorite(next)
    try {
      if (next) {
        await apiFetch(`/entries/en/${encodeURIComponent(word)}/favorite`, { method: "POST" })
      } else {
        await apiFetch(`/entries/en/${encodeURIComponent(word)}/unfavorite`, { method: "DELETE" })
      }
    } catch {
      setFavorite(!next)
    }
  }

  const phonetic = entries ? getPhonetic(entries) : ""
  const audio = entries ? getAudio(entries) : null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-[14px] w-full max-w-[600px] max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-[18px] border-b border-border">
          <div>
            <h2 className="m-0 capitalize">{word}</h2>
            {phonetic && <span className="text-muted">{phonetic}</span>}
          </div>
          <div className="flex gap-2">
            {audio && (
              <button
                className={GHOST_BTN}
                onClick={() => {
                  void new Audio(audio).play().catch(() => {})
                }}
              >
                🔊
              </button>
            )}
            <button className={GHOST_BTN} onClick={toggleFavorite}>
              {favorite ? "❤️" : "🤍"}
            </button>
            <button className={GHOST_BTN} onClick={onClose} aria-label="Fechar">
              ✕
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto">
          {loading && <p className="text-muted">Carregando...</p>}
          {error && !loading && <p className="text-danger text-[0.9rem] m-0">{error}</p>}
          {entries && !loading && <WordMeanings entries={entries} />}
        </div>
      </div>
    </div>
  )
}
