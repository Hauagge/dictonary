import { INestApplication, NotFoundException, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { DataSource } from "typeorm"
import { AppModule } from "../src/app.module"
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter"
import { DictionaryService, DictionaryResult } from "../src/dictionary/dictionary.service"
import { WordEntity } from "../src/entries/entities/word.entity"

export const MISSING_WORD = "missingword"

export const fakeDictionary = {
  async fetch(word: string): Promise<DictionaryResult> {
    if (word === MISSING_WORD) {
      throw new NotFoundException(`No definitions found for "${word}"`)
    }
    return {
      data: [{ word, meanings: [{ partOfSpeech: "noun", definitions: [{ definition: `${word} definition` }] }] }],
      cached: false,
    }
  },
}

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DictionaryService)
    .useValue(fakeDictionary)
    .compile()

  const app = moduleRef.createNestApplication()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.init()

  const dataSource = app.get(DataSource)
  await dataSource.synchronize(true)
  await dataSource
    .getRepository(WordEntity)
    .save(["fire", "firefly", "fireman", "hello"].map((word) => ({ word })))

  return app
}
