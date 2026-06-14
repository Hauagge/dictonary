"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { getAudio, getPhonetic } from "@/lib/dictionary"
import type { DictionaryEntry, FavoriteItem, Paginated } from "@/lib/types"
import WordMeanings from "./WordMeanings"

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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2 className="word-title">{word}</h2>
            {phonetic && <span className="muted">{phonetic}</span>}
          </div>
          <div className="word-actions">
            {audio && (
              <button
                className="btn btn--ghost"
                onClick={() => {
                  void new Audio(audio).play().catch(() => {})
                }}
              >
                🔊
              </button>
            )}
            <button className="btn btn--ghost" onClick={toggleFavorite}>
              {favorite ? "❤️" : "🤍"}
            </button>
            <button className="btn btn--ghost" onClick={onClose} aria-label="Fechar">
              ✕
            </button>
          </div>
        </div>
        <div className="modal-body">
          {loading && <p className="muted">Carregando...</p>}
          {error && !loading && <p className="error">{error}</p>}
          {entries && !loading && <WordMeanings entries={entries} />}
        </div>
      </div>
    </div>
  )
}
