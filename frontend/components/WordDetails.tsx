"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { getAudio, getPhonetic } from "@/lib/dictionary"
import type { DictionaryEntry, FavoriteItem, Paginated } from "@/lib/types"
import WordMeanings from "./WordMeanings"

const GHOST_BTN =
  "w-auto px-3.5 py-2 rounded-[10px] border border-border bg-transparent text-text text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"

export default function WordDetails({ word }: { word: string }) {
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorite, setFavorite] = useState(false)

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
    <main className="max-w-[820px] mx-auto px-4 pb-12">
      <header className="flex items-center justify-between py-[18px] border-b border-border">
        <Link className="font-bold text-[1.15rem]" href="/">
          ← Voltar
        </Link>
      </header>

      <section className="py-10">
        {loading && <p className="text-muted">Carregando...</p>}
        {error && !loading && <p className="text-danger text-[0.9rem] m-0">{error}</p>}

        {entries && !loading && (
          <>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="m-0 capitalize">{word}</h1>
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
                  {favorite ? "❤️ Favorito" : "🤍 Favoritar"}
                </button>
              </div>
            </div>

            <WordMeanings entries={entries} />
          </>
        )}
      </section>
    </main>
  )
}
