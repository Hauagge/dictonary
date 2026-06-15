import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { HistoryService } from "./history.service"
import { InMemoryHistoryRepository } from "./repositories/in-memory-history.repository"

function page(page: number, limit: number): PaginationQueryDto {
  return { page, limit } as PaginationQueryDto
}

describe("HistoryService", () => {
  function build() {
    const repo = new InMemoryHistoryRepository()
    const service = new HistoryService(repo)
    return { service, repo }
  }

  it("add registra a palavra para o usuario e devolve a entidade", async () => {
    const { service, repo } = build()

    const entry = await service.add("user-1", "hello")

    expect(entry).toMatchObject({ userId: "user-1", word: "hello" })
    expect(repo.rows).toHaveLength(1)
  })

  it("list devolve o historico do usuario do mais recente para o mais antigo", async () => {
    const { service } = build()
    await service.add("user-1", "primeiro")
    await service.add("user-1", "segundo")
    await service.add("user-2", "outro")

    const result = await service.list("user-1", page(1, 10))

    expect(result.results.map((r) => r.word)).toEqual(["segundo", "primeiro"])
    expect(result).toMatchObject({ totalDocs: 2, totalPages: 1, hasNext: false, hasPrev: false })
  })

  it("list respeita page/limit", async () => {
    const { service } = build()
    await service.add("user-1", "a")
    await service.add("user-1", "b")
    await service.add("user-1", "c")

    const result = await service.list("user-1", page(2, 2))

    expect(result.results.map((r) => r.word)).toEqual(["a"])
    expect(result).toMatchObject({ page: 2, totalDocs: 3, totalPages: 2, hasNext: false, hasPrev: true })
  })
})
