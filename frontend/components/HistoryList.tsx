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
    return <p className="text-muted">Carregando histórico...</p>
  }

  if (items.length === 0) {
    return <p className="text-muted">Nenhuma palavra pesquisada ainda.</p>
  }

  return (
    <ul className="list-none p-0 mt-3 flex flex-col gap-2">
      {items.map((item, index) => (
        <li
          key={`${item.word}-${index}`}
          className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border rounded-[10px] px-4 py-3"
        >
          <Link className="font-semibold capitalize" href={`/words/${encodeURIComponent(item.word)}`}>
            {item.word}
          </Link>
          <span className="text-muted">{formatDate(item.added)}</span>
        </li>
      ))}
    </ul>
  )
}
