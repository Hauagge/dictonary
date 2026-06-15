"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { apiFetch } from "@/lib/api"
import { setToken } from "@/lib/auth"

interface AuthFormProps {
  mode: "signin" | "signup"
}

interface AuthResponse {
  id: string
  name: string
  token: string
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const isSignup = mode === "signup"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = isSignup ? { name, email, password } : { email, password }
      const data = await apiFetch<AuthResponse>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      setToken(data.token)
      router.push("/")
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        className="bg-surface border border-border rounded-xl p-7 w-full max-w-[360px] flex flex-col gap-[14px]"
        onSubmit={handleSubmit}
      >
        <h1 className="m-0 mb-1.5 text-center">{isSignup ? "Criar conta" : "Entrar"}</h1>

        {isSignup && (
          <input
            className="w-full px-3.5 py-3 border border-border rounded-[10px] bg-bg text-text text-base focus:outline-2 focus:outline-primary"
            placeholder="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        )}

        <input
          className="w-full px-3.5 py-3 border border-border rounded-[10px] bg-bg text-text text-base focus:outline-2 focus:outline-primary"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className="w-full px-3.5 py-3 border border-border rounded-[10px] bg-bg text-text text-base focus:outline-2 focus:outline-primary"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="text-danger text-[0.9rem] m-0">{error}</p>}

        <button
          className="w-full px-4 py-3 rounded-[10px] bg-primary text-white text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "Aguarde..." : isSignup ? "Cadastrar" : "Entrar"}
        </button>

        <p className="text-center text-[0.9rem] text-muted m-0">
          {isSignup ? (
            <>
              Já tem conta? <Link href="/login">Entrar</Link>
            </>
          ) : (
            <>
              Não tem conta? <Link href="/signup">Cadastre-se</Link>
            </>
          )}
        </p>
      </form>
    </div>
  )
}
