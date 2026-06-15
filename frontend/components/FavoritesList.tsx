"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { formatDate } from "@/lib/format"
import type { FavoriteItem, Paginated } from "@/lib/types"

export default function FavoritesList() {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    apiFetch<Paginated<FavoriteItem>>("/user/me/favorites?limit=100")
      .then((data) => setItems(data.results))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function remove(word: string) {
    setItems((prev) => prev.filter((item) => item.word !== word))
    try {
      await apiFetch(`/entries/en/${encodeURIComponent(word)}/unfavorite`, { method: "DELETE" })
    } catch {
      load()
    }
  }

  if (loading) {
    return <p className="text-muted">Carregando...</p>
  }

  if (items.length === 0) {
    return <p className="text-muted">Você ainda não tem favoritos.</p>
  }

  return (
    <ul className="list-none p-0 mt-3 flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.word}
          className="flex items-center justify-between gap-3 bg-surface border border-border rounded-[10px] px-4 py-3"
        >
          <Link className="font-semibold capitalize" href={`/words/${encodeURIComponent(item.word)}`}>
            {item.word}
          </Link>
          <span className="text-muted">{formatDate(item.added)}</span>
          <button
            className="w-auto px-3.5 py-2 rounded-[10px] border border-border bg-transparent text-text text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => remove(item.word)}
          >
            Remover
          </button>
        </li>
      ))}
    </ul>
  )
}
