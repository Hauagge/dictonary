import { NestFactory } from "@nestjs/core"
import { DataSource } from "typeorm"
import { AppModule } from "../app.module"
import { WordEntity } from "../entries/entities/word.entity"

const WORDS_URL =
  process.env.WORDS_URL ||
  "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"

const BATCH_SIZE = 5000

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error"],
  })
  const repo = app.get(DataSource).getRepository(WordEntity)

  console.log(`[import] baixando lista de ${WORDS_URL}`)
  const response = await fetch(WORDS_URL)
  if (!response.ok) {
    throw new Error(`Falha ao baixar a lista (HTTP ${response.status})`)
  }
  const text = await response.text()

  const words = Array.from(
    new Set(
      text
        .split(/\r?\n/)
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0),
    ),
  )
  console.log(`[import] ${words.length} palavras únicas a importar`)

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE).map((word) => ({ word }))
    await repo.createQueryBuilder().insert().values(batch).orIgnore().execute()
    console.log(`[import] ${Math.min(i + BATCH_SIZE, words.length)}/${words.length}`)
  }

  const total = await repo.count()
  console.log(`[import] concluído. Total na base: ${total}`)
  await app.close()
}

bootstrap().catch((error) => {
  console.error(`[import] erro: ${(error as Error).message}`)
  process.exit(1)
})
