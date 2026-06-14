import AppHeader from "@/components/AppHeader"
import HistoryList from "@/components/HistoryList"
import SearchBox from "@/components/SearchBox"

export default function HomePage() {
  return (
    <main className="shell">
      <AppHeader />
      <section className="content">
        <h1>Buscar palavra</h1>
        <SearchBox />
        <h2 className="section-title">Histórico de pesquisas</h2>
        <HistoryList />
      </section>
    </main>
  )
}
