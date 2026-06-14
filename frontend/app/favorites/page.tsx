import AppHeader from "@/components/AppHeader"
import FavoritesList from "@/components/FavoritesList"

export default function FavoritesPage() {
  return (
    <main className="shell">
      <AppHeader />
      <section className="content">
        <h1>Favoritos</h1>
        <FavoritesList />
      </section>
    </main>
  )
}
