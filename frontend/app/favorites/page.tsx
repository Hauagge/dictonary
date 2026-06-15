import AppHeader from "@/components/AppHeader"
import FavoritesList from "@/components/FavoritesList"

export default function FavoritesPage() {
  return (
    <main className="max-w-[820px] mx-auto px-4 pb-12">
      <AppHeader />
      <section className="py-8 sm:py-10">
        <h1>Favoritos</h1>
        <FavoritesList />
      </section>
    </main>
  )
}
