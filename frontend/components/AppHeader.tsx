import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between py-[18px] border-b border-border">
      <nav className="flex items-center gap-[18px]">
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
