import type { DictionaryEntry } from "@/lib/types"

export default function WordMeanings({ entries }: { entries: DictionaryEntry[] }) {
  return (
    <>
      {entries.map((entry, entryIndex) =>
        entry.meanings?.map((meaning, meaningIndex) => (
          <div key={`${entryIndex}-${meaningIndex}`} className="card meaning">
            <h3 className="meaning-pos">{meaning.partOfSpeech}</h3>
            <ol className="meaning-list">
              {meaning.definitions?.map((definition, defIndex) => (
                <li key={defIndex}>
                  <p>{definition.definition}</p>
                  {definition.example && <p className="muted">“{definition.example}”</p>}
                </li>
              ))}
            </ol>
          </div>
        )),
      )}
    </>
  )
}
