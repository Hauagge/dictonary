import AppHeader from "@/components/AppHeader"
import HistoryList from "@/components/HistoryList"
import SearchBox from "@/components/SearchBox"

export default function HomePage() {
  return (
    <main className="max-w-[820px] mx-auto px-4 pb-12">
      <AppHeader />
      <section className="py-8 sm:py-10">
        <h1>Buscar palavra</h1>
        <SearchBox />
        <h2 className="mt-9 text-[1.1rem] text-muted">Histórico de pesquisas</h2>
        <HistoryList />
      </section>
    </main>
  )
}
