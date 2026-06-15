import type { DictionaryEntry } from "@/lib/types"

export default function WordMeanings({ entries }: { entries: DictionaryEntry[] }) {
  return (
    <>
      {entries.map((entry, entryIndex) =>
        entry.meanings?.map((meaning, meaningIndex) => (
          <div
            key={`${entryIndex}-${meaningIndex}`}
            className="bg-surface border border-border rounded-xl p-5 sm:p-7 mb-4"
          >
            <h3 className="mt-0 mb-2 text-primary">{meaning.partOfSpeech}</h3>
            <ol className="m-0 pl-5 flex flex-col gap-2">
              {meaning.definitions?.map((definition, defIndex) => (
                <li key={defIndex}>
                  <p>{definition.definition}</p>
                  {definition.example && <p className="text-muted">“{definition.example}”</p>}
                </li>
              ))}
            </ol>
          </div>
        )),
      )}
    </>
  )
}
