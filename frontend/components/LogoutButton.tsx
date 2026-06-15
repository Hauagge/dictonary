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
    <button
      className="w-auto px-3.5 py-2 rounded-[10px] border border-border bg-transparent text-text text-base font-semibold cursor-pointer enabled:hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={handleLogout}
    >
      Sair
    </button>
  )
}
