"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { formatDate } from "@/lib/format"
import type { HistoryItem, Paginated } from "@/lib/types"

export default function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Paginated<HistoryItem>>("/user/me/history?limit=20")
      .then((data) => setItems(data.results))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="muted">Carregando histórico...</p>
  }

  if (items.length === 0) {
    return <p className="muted">Nenhuma palavra pesquisada ainda.</p>
  }

  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={`${item.word}-${index}`} className="list-item">
          <Link className="list-word" href={`/words/${encodeURIComponent(item.word)}`}>
            {item.word}
          </Link>
          <span className="muted">{formatDate(item.added)}</span>
        </li>
      ))}
    </ul>
  )
}
