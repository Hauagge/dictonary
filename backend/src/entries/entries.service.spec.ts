import { EntriesQueryDto } from "./dto/entries-query.dto"
import { EntriesService } from "./entries.service"
import { InMemoryEntriesRepository } from "./repositories/in-memory-entries.repository"

function query(partial: Partial<EntriesQueryDto>): EntriesQueryDto {
  return { page: 1, limit: 10, ...partial } as EntriesQueryDto
}

describe("EntriesService", () => {
  function build(words: string[]) {
    const repo = new InMemoryEntriesRepository(words)
    const service = new EntriesService(repo)
    return { service, repo }
  }

  it("lista palavras em ordem alfabetica com metadados de paginacao", async () => {
    const { service } = build(["banana", "apple", "cherry"])

    const result = await service.list(query({ page: 1, limit: 10 }))

    expect(result.results).toEqual(["apple", "banana", "cherry"])
    expect(result).toMatchObject({
      totalDocs: 3,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    })
  })

  it("filtra por prefixo case-insensitive", async () => {
    const { service } = build(["apple", "apricot", "banana", "Application"])

    const result = await service.list(query({ search: "AP" }))

    // ordem entre maiusculas/minusculas depende da collation; valida o conjunto
    expect([...result.results].sort()).toEqual(["Application", "apple", "apricot"])
    expect(result.totalDocs).toBe(3)
  })

  it("pagina os resultados (page 2)", async () => {
    const { service } = build(["a", "b", "c", "d", "e"])

    const result = await service.list(query({ page: 2, limit: 2 }))

    expect(result.results).toEqual(["c", "d"])
    expect(result).toMatchObject({
      totalDocs: 5,
      page: 2,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })
  })

  it("devolve lista vazia mantendo totalPages minimo de 1", async () => {
    const { service } = build(["apple"])

    const result = await service.list(query({ search: "zzz" }))

    expect(result.results).toEqual([])
    expect(result).toMatchObject({ totalDocs: 0, totalPages: 1, hasNext: false, hasPrev: false })
  })
})
