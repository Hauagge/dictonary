import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default function AppHeader() {
  return (
    <header className="topbar">
      <nav className="nav">
        <Link className="brand" href="/">
          📖 English Dictionary
        </Link>
        <Link className="nav-link" href="/">
          Buscar
        </Link>
        <Link className="nav-link" href="/favorites">
          Favoritos
        </Link>
        <Link className="nav-link" href="/dictionary">
          Dicionário
        </Link>
      </nav>
      <LogoutButton />
    </header>
  )
}
