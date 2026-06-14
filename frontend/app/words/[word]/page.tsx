"use client"

import { useParams } from "next/navigation"
import WordDetails from "@/components/WordDetails"

export default function WordPage() {
  const params = useParams()
  const word = decodeURIComponent(String(params.word))
  return <WordDetails word={word} />
}
