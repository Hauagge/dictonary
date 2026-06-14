"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import type { DictionaryEntry, FavoriteItem, Paginated } from "@/lib/types"

function getPhonetic(entries: DictionaryEntry[]): string {
  for (const entry of entries) {
    if (entry.phonetic) return entry.phonetic
    const text = entry.phonetics?.find((item) => item.text)?.text
    if (text) return text
  }
  return ""
}

function getAudio(entries: DictionaryEntry[]): string | null {
  for (const entry of entries) {
    const audio = entry.phonetics?.find((item) => item.audio)?.audio
    if (audio) return audio
  }
  return null
}

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
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/">
          ← Voltar
        </Link>
      </header>

      <section className="content">
        {loading && <p className="muted">Carregando...</p>}
        {error && !loading && <p className="error">{error}</p>}

        {entries && !loading && (
          <>
            <div className="word-head">
              <div>
                <h1 className="word-title">{word}</h1>
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
                  {favorite ? "❤️ Favorito" : "🤍 Favoritar"}
                </button>
              </div>
            </div>

            {entries.map((entry, entryIndex) =>
              entry.meanings?.map((meaning, meaningIndex) => (
                <div key={`${entryIndex}-${meaningIndex}`} className="card meaning">
                  <h3 className="meaning-pos">{meaning.partOfSpeech}</h3>
                  <ol className="meaning-list">
                    {meaning.definitions?.map((definition, defIndex) => (
                      <li key={defIndex}>
                        <p>{definition.definition}</p>
                        {definition.example && <p className="muted">“{definition.example}”</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )),
            )}
          </>
        )}
      </section>
    </main>
  )
}
