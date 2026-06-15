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
    <form className="flex gap-2 mt-4" onSubmit={handleSubmit} autoComplete="off">
      <div className="relative flex-1">
        <input
          className="w-full px-3.5 py-3 border border-border rounded-[10px] bg-bg text-text text-base focus:outline-2 focus:outline-primary"
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
          <ul className="absolute top-[calc(100%+4px)] left-0 right-0 m-0 p-1 list-none bg-surface border border-border rounded-[10px] z-20 max-h-[260px] overflow-y-auto">
            {suggestions.map((word) => (
              <li key={word}>
                <button
                  type="button"
                  className="block w-full text-left bg-transparent border-0 text-text px-3 py-[9px] rounded-lg cursor-pointer text-[0.95rem] hover:bg-bg hover:text-primary"
                  onMouseDown={() => go(word)}
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="w-auto px-5 py-3 rounded-[10px] bg-primary text-white text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={!term.trim()}
      >
        Buscar
      </button>
    </form>
  )
}
