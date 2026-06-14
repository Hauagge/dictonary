"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import type { Paginated } from "@/lib/types"
import WordModal from "./WordModal"

export default function DictionaryList() {
  const [data, setData] = useState<Paginated<string> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    apiFetch<Paginated<string>>(`/entries/en?page=${page}&limit=24`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      {loading && <p className="muted">Carregando...</p>}

      {data && (
        <>
          <ul className="word-grid">
            {data.results.map((word) => (
              <li key={word}>
                <button className="word-chip" onClick={() => setSelected(word)}>
                  {word}
                </button>
              </li>
            ))}
          </ul>

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
        </>
      )}

      {selected && <WordModal word={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
