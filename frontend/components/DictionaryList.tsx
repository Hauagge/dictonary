"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import type { Paginated } from "@/lib/types"
import WordModal from "./WordModal"

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("")

const ALPHA_LETTER =
  "min-w-[34px] px-2 py-1.5 bg-surface border border-border text-text rounded-lg cursor-pointer uppercase text-[13px] leading-none hover:border-primary hover:text-primary"
const ALPHA_ACTIVE = " bg-primary border-primary text-white"
const GHOST_BTN =
  "w-auto px-3.5 py-2 rounded-[10px] border border-border bg-transparent text-text text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"

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
      <nav className="flex flex-wrap gap-1 mt-4" aria-label="Filtrar por inicial">
        <button
          className={`${ALPHA_LETTER}${letter === null ? ALPHA_ACTIVE : ""}`}
          onClick={() => selectLetter(null)}
        >
          Todas
        </button>
        {ALPHABET.map((char) => (
          <button
            key={char}
            className={`${ALPHA_LETTER}${letter === char ? ALPHA_ACTIVE : ""}`}
            onClick={() => selectLetter(char)}
          >
            {char}
          </button>
        ))}
      </nav>

      {loading && <p className="text-muted">Carregando...</p>}

      {data && !loading && (
        <>
          {data.results.length === 0 ? (
            <p className="text-muted">Nenhuma palavra encontrada.</p>
          ) : (
            <ul className="list-none p-0 mt-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
              {data.results.map((word) => (
                <li key={word}>
                  <button
                    className="w-full text-left bg-surface border border-border text-text px-3 py-2.5 rounded-[10px] cursor-pointer capitalize hover:border-primary hover:text-primary"
                    onClick={() => setSelected(word)}
                  >
                    {word}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                className={GHOST_BTN}
                disabled={!data.hasPrev}
                onClick={() => setPage((current) => current - 1)}
              >
                ← Anterior
              </button>
              <span className="text-muted">
                Página {data.page} de {data.totalPages}
              </span>
              <button
                className={GHOST_BTN}
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
