"use client"

import { useRouter } from "next/navigation"
import { clearToken } from "@/lib/auth"

export default function LogoutButton() {
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push("/login")
    router.refresh()
  }

  return (
    <button className="btn btn--ghost" onClick={handleLogout}>
      Sair
    </button>
  )
}
