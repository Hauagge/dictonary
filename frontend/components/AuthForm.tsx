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
    <div className="auth">
      <form className="card auth__form" onSubmit={handleSubmit}>
        <h1>{isSignup ? "Criar conta" : "Entrar"}</h1>

        {isSignup && (
          <input
            className="input"
            placeholder="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        )}

        <input
          className="input"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Aguarde..." : isSignup ? "Cadastrar" : "Entrar"}
        </button>

        <p className="auth__switch">
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
