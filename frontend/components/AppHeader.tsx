import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        📖 English Dictionary
      </Link>
      <LogoutButton />
    </header>
  )
}
