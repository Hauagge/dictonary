import type { DictionaryEntry } from "./types"

export function getPhonetic(entries: DictionaryEntry[]): string {
  for (const entry of entries) {
    if (entry.phonetic) return entry.phonetic
    const text = entry.phonetics?.find((item) => item.text)?.text
    if (text) return text
  }
  return ""
}

export function getAudio(entries: DictionaryEntry[]): string | null {
  for (const entry of entries) {
    const audio = entry.phonetics?.find((item) => item.audio)?.audio
    if (audio) return audio
  }
  return null
}
