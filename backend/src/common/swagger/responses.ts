import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

/** `{ "message": "Error message" }` — formato humanizado de erro (HttpExceptionFilter). */
export const errorSchema: SchemaObject = {
  type: "object",
  properties: {
    message: { type: "string", example: "Error message" },
  },
}

/** Resposta de signup/signin. */
export const authResponseSchema: SchemaObject = {
  type: "object",
  properties: {
    id: { type: "string", example: "f3a106sa65dv53ab2c1380acef" },
    name: { type: "string", example: "User 1" },
    token: {
      type: "string",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature",
    },
  },
}

/** Perfil do usuario (`GET /user/me`). */
export const userProfileSchema: SchemaObject = {
  type: "object",
  properties: {
    id: { type: "string", example: "f3a106sa65dv53ab2c1380acef" },
    name: { type: "string", example: "User 1" },
    email: { type: "string", example: "example@email.com" },
  },
}

const paginationProps: Record<string, SchemaObject> = {
  totalDocs: { type: "integer", example: 20 },
  page: { type: "integer", example: 1 },
  totalPages: { type: "integer", example: 5 },
  hasNext: { type: "boolean", example: true },
  hasPrev: { type: "boolean", example: false },
}

/** Lista paginada de palavras (`GET /entries/en`). */
export const wordsPageSchema: SchemaObject = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { type: "string" },
      example: ["fire", "firefly", "fireplace", "fireman"],
    },
    ...paginationProps,
  },
}

/** Lista paginada de itens `{ word, added }` (historico e favoritos). */
export const wordItemsPageSchema: SchemaObject = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          word: { type: "string", example: "fire" },
          added: {
            type: "string",
            format: "date-time",
            example: "2024-05-05T19:28:13.531Z",
          },
        },
      },
    },
    ...paginationProps,
    page: { type: "integer", example: 2 },
    hasPrev: { type: "boolean", example: true },
  },
}

/** Resposta da palavra (proxy da Free Dictionary API) — `GET /entries/en/:word`. */
export const dictionaryEntrySchema: SchemaObject = {
  type: "array",
  items: { type: "object" },
  example: [
    {
      word: "fire",
      phonetic: "/ˈfaɪɚ/",
      phonetics: [
        {
          text: "/ˈfaɪɚ/",
          audio: "https://api.dictionaryapi.dev/media/pronunciations/en/fire-us.mp3",
        },
      ],
      meanings: [
        {
          partOfSpeech: "noun",
          definitions: [
            {
              definition:
                "A (usually self-sustaining) chemical reaction involving the bonding of oxygen with carbon or other fuel.",
              example: "The fire spread rapidly through the building.",
              synonyms: [],
              antonyms: [],
            },
          ],
        },
      ],
      sourceUrls: ["https://en.wiktionary.org/wiki/fire"],
    },
  ],
}

/** Headers obrigatorios de cache na resposta de `GET /entries/en/:word`. */
export const cacheHeaders = {
  "x-cache": {
    description: "HIT (veio do cache Redis) ou MISS (buscou na API externa)",
    schema: { type: "string", example: "MISS" },
  },
  "x-response-time": {
    description: "Duracao da requisicao em milissegundos",
    schema: { type: "string", example: "12ms" },
  },
}
