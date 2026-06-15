import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { NestFactory } from "@nestjs/core"
import { DataSource } from "typeorm"
import { AppModule } from "../app.module"
import { WordEntity } from "../entries/entities/word.entity"

const WORDS_FILE =
  process.env.WORDS_FILE || resolve(process.cwd(), "data/words.json")

const BATCH_SIZE = 5000

/** Aceita JSON (`{ "word": 1 }` ou `["word"]`) ou texto (uma palavra por linha). */
function parseWords(raw: string, isJson: boolean): string[] {
  if (isJson) {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data.map(String) : Object.keys(data)
  }
  return raw.split(/\r?\n/)
}

function normalize(words: string[]): string[] {
  return Array.from(
    new Set(
      words
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0),
    ),
  )
}

async function loadWords(): Promise<string[]> {
  console.log(`[import] lendo arquivo local ${WORDS_FILE}`)
  const raw = readFileSync(WORDS_FILE, "utf8")
  return normalize(parseWords(raw, WORDS_FILE.endsWith(".json")))
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error"],
  })
  const repo = app.get(DataSource).getRepository(WordEntity)

  const words = await loadWords()
  console.log(`[import] ${words.length} palavras únicas a importar`)

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE).map((word) => ({ word }))
    await repo.createQueryBuilder().insert().values(batch).orIgnore().execute()
    console.log(
      `[import] ${Math.min(i + BATCH_SIZE, words.length)}/${words.length}`,
    )
  }

  const total = await repo.count()
  console.log(`[import] concluído. Total na base: ${total}`)
  await app.close()
}

bootstrap().catch((error) => {
  console.error(`[import] erro: ${(error as Error).message}`)
  process.exit(1)
})
