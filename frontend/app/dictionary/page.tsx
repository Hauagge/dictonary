import AppHeader from "@/components/AppHeader"
import DictionaryList from "@/components/DictionaryList"

export default function DictionaryPage() {
  return (
    <main className="shell">
      <AppHeader />
      <section className="content">
        <h1>Dicionário</h1>
        <DictionaryList />
      </section>
    </main>
  )
}
