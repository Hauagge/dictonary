import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { FavoritesService } from "./favorites.service"
import { InMemoryFavoritesRepository } from "./repositories/in-memory-favorites.repository"

function page(page: number, limit: number): PaginationQueryDto {
  return { page, limit } as PaginationQueryDto
}

describe("FavoritesService", () => {
  function build() {
    const repo = new InMemoryFavoritesRepository()
    const service = new FavoritesService(repo)
    return { service, repo }
  }

  it("add persiste o favorito do usuario", async () => {
    const { service, repo } = build()

    await service.add("user-1", "hello")

    expect(repo.rows).toHaveLength(1)
    expect(repo.rows[0]).toMatchObject({ userId: "user-1", word: "hello" })
  })

  it("add e idempotente para o mesmo usuario+palavra", async () => {
    const { service, repo } = build()

    await service.add("user-1", "hello")
    await service.add("user-1", "hello")

    expect(repo.rows).toHaveLength(1)
  })

  it("remove apaga apenas o favorito daquele usuario+palavra", async () => {
    const { service, repo } = build()
    await service.add("user-1", "hello")
    await service.add("user-1", "world")
    await service.add("user-2", "hello")

    await service.remove("user-1", "hello")

    expect(repo.rows).toHaveLength(2)
    expect(repo.rows.some((r) => r.userId === "user-1" && r.word === "hello")).toBe(false)
  })

  it("list devolve itens do usuario ordenados do mais novo, com metadados de paginacao", async () => {
    const { service } = build()
    await service.add("user-1", "alpha")
    await service.add("user-1", "beta")
    await service.add("user-2", "outro")

    const result = await service.list("user-1", page(1, 1))

    expect(result.results).toEqual([{ word: "beta", added: expect.any(String) }])
    expect(result).toMatchObject({
      totalDocs: 2,
      page: 1,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
    })
  })

  it("list pagina a segunda pagina corretamente", async () => {
    const { service } = build()
    await service.add("user-1", "alpha")
    await service.add("user-1", "beta")

    const result = await service.list("user-1", page(2, 1))

    expect(result.results).toEqual([{ word: "alpha", added: expect.any(String) }])
    expect(result).toMatchObject({ hasNext: false, hasPrev: true })
  })
})
