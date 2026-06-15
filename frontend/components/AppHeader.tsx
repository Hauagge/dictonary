import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default function AppHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-[18px] border-b border-border">
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-[18px]">
        <Link className="font-bold text-[1.15rem]" href="/">
          📖 English Dictionary
        </Link>

        <Link className="text-muted font-medium hover:text-primary" href="/favorites">
          Favoritos
        </Link>
        <Link className="text-muted font-medium hover:text-primary" href="/dictionary">
          Dicionário
        </Link>
      </nav>
      <LogoutButton />
    </header>
  )
}
