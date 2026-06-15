"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import type { Paginated } from "@/lib/types"
import WordModal from "./WordModal"

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("")

export default function DictionaryList() {
  const [data, setData] = useState<Paginated<string> | null>(null)
  const [page, setPage] = useState(1)
  const [letter, setLetter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const search = letter ? `&search=${letter}` : ""
    apiFetch<Paginated<string>>(`/entries/en?page=${page}&limit=24${search}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [page, letter])

  function selectLetter(next: string | null): void {
    setLetter(next)
    setPage(1)
  }

  return (
    <div>
      <nav className="alpha-index" aria-label="Filtrar por inicial">
        <button
          className={`alpha-letter${letter === null ? " alpha-letter--active" : ""}`}
          onClick={() => selectLetter(null)}
        >
          Todas
        </button>
        {ALPHABET.map((char) => (
          <button
            key={char}
            className={`alpha-letter${letter === char ? " alpha-letter--active" : ""}`}
            onClick={() => selectLetter(char)}
          >
            {char}
          </button>
        ))}
      </nav>

      {loading && <p className="muted">Carregando...</p>}

      {data && !loading && (
        <>
          {data.results.length === 0 ? (
            <p className="muted">Nenhuma palavra encontrada.</p>
          ) : (
            <ul className="word-grid">
              {data.results.map((word) => (
                <li key={word}>
                  <button className="word-chip" onClick={() => setSelected(word)}>
                    {word}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {data.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn--ghost"
                disabled={!data.hasPrev}
                onClick={() => setPage((current) => current - 1)}
              >
                ← Anterior
              </button>
              <span className="muted">
                Página {data.page} de {data.totalPages}
              </span>
              <button
                className="btn btn--ghost"
                disabled={!data.hasNext}
                onClick={() => setPage((current) => current + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      {selected && <WordModal word={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
