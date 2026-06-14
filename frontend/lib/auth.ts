const TOKEN_KEY = "token"
const MAX_AGE = 60 * 60 * 24 * 7

export function setToken(token: string): void {
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE}; samesite=lax`
}

export function getToken(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearToken(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
}
