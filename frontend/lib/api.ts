import { getToken } from "./auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  const token = typeof window !== "undefined" ? getToken() : null
  if (token) {
    headers["Authorization"] = token
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Erro inesperado" }))
    throw new Error(body.message || "Erro inesperado")
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
