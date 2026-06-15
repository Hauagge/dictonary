import AppHeader from "@/components/AppHeader"
import DictionaryList from "@/components/DictionaryList"

export default function DictionaryPage() {
  return (
    <main className="max-w-[820px] mx-auto px-4 pb-12">
      <AppHeader />
      <section className="py-10">
        <h1>Dicionário</h1>
        <DictionaryList />
      </section>
    </main>
  )
}
