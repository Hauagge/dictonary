"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { apiFetch } from "@/lib/api"
import type { Paginated } from "@/lib/types"

export default function SearchBox() {
  const router = useRouter()
  const [term, setTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const query = term.trim()
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    const id = setTimeout(() => {
      apiFetch<Paginated<string>>(`/entries/en?search=${encodeURIComponent(query)}&limit=8`)
        .then((data) => setSuggestions(data.results))
        .catch(() => setSuggestions([]))
    }, 350)
    return () => clearTimeout(id)
  }, [term])

  function go(word: string) {
    const value = word.trim().toLowerCase()
    if (!value) return
    setOpen(false)
    router.push(`/words/${encodeURIComponent(value)}`)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    go(term)
  }

  return (
    <form className="search" onSubmit={handleSubmit} autoComplete="off">
      <div className="search-box">
        <input
          className="input"
          value={term}
          onChange={(event) => {
            setTerm(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Digite uma palavra (ex.: fire)"
          aria-label="Buscar palavra"
        />
        {open && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((word) => (
              <li key={word}>
                <button type="button" className="suggestion-item" onMouseDown={() => go(word)}>
                  {word}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="btn search-btn" type="submit" disabled={!term.trim()}>
        Buscar
      </button>
    </form>
  )
}
