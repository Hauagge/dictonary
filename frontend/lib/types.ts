export interface Phonetic {
  text?: string
  audio?: string
}

export interface Definition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
  synonyms?: string[]
  antonyms?: string[]
}

export interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics?: Phonetic[]
  meanings: Meaning[]
}

export interface Paginated<T> {
  results: T[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface HistoryItem {
  word: string
  added: string
}

export interface FavoriteItem {
  word: string
  added: string
}
