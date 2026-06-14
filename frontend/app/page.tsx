"use client"

import { useEffect, useState } from "react"
import LogoutButton from "@/components/LogoutButton"
import { apiFetch } from "@/lib/api"

interface Me {
  id: string
  name: string
  email: string
}

export default function HomePage() {
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    apiFetch<Me>("/user/me")
      .then(setMe)
      .catch(() => setMe(null))
  }, [])

  return (
    <main className="shell">
      <header className="topbar">
        <span className="brand">📖 English Dictionary</span>
        <LogoutButton />
      </header>
      <section className="content">
        <h1>Bem-vindo{me ? `, ${me.name}` : ""}</h1>
        <p className="muted">A busca de palavras, histórico e favoritos chegam nas próximas etapas.</p>
      </section>
    </main>
  )
}
