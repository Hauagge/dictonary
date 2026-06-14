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
    return <p className="muted">Carregando...</p>
  }

  if (items.length === 0) {
    return <p className="muted">Você ainda não tem favoritos.</p>
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item.word} className="list-item">
          <Link className="list-word" href={`/words/${encodeURIComponent(item.word)}`}>
            {item.word}
          </Link>
          <span className="muted">{formatDate(item.added)}</span>
          <button className="btn btn--ghost" onClick={() => remove(item.word)}>
            Remover
          </button>
        </li>
      ))}
    </ul>
  )
}
