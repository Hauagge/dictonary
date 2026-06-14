import { ConfigService } from "@nestjs/config"
import { FavoritesQueueService, isForeignKeyViolation } from "./favorites-queue.service"
import { FavoritesService } from "./favorites.service"

describe("FavoritesQueueService (fallback sincrono)", () => {
  it("sem REDIS_URL, enqueueAdd persiste direto via FavoritesService", async () => {
    const favorites = { add: jest.fn().mockResolvedValue(undefined) }
    const config = { get: jest.fn().mockReturnValue(undefined) }

    const service = new FavoritesQueueService(
      config as unknown as ConfigService,
      favorites as unknown as FavoritesService,
    )
    service.onModuleInit()
    await service.enqueueAdd("user-1", "hello")

    expect(config.get).toHaveBeenCalledWith("REDIS_URL")
    expect(favorites.add).toHaveBeenCalledWith("user-1", "hello")
  })
})

describe("FavoritesQueueService.process (worker)", () => {
  function build(addImpl: jest.Mock) {
    const favorites = { add: addImpl }
    const config = { get: jest.fn().mockReturnValue(undefined) }
    const service = new FavoritesQueueService(
      config as unknown as ConfigService,
      favorites as unknown as FavoritesService,
    )
    return { service, favorites }
  }

  it("ignora o job quando o usuario nao existe mais (violacao de FK)", async () => {
    const add = jest.fn().mockRejectedValue({ code: "23503" })
    const { service } = build(add)

    await expect(
      (service as any).process({ data: { userId: "ghost", word: "hello" } }),
    ).resolves.toBeUndefined()
    expect(add).toHaveBeenCalledWith("ghost", "hello")
  })

  it("propaga erros nao relacionados a FK (para re-tentar)", async () => {
    const add = jest.fn().mockRejectedValue(new Error("connection lost"))
    const { service } = build(add)

    await expect(
      (service as any).process({ data: { userId: "user-1", word: "hello" } }),
    ).rejects.toThrow("connection lost")
  })
})

describe("isForeignKeyViolation", () => {
  it("reconhece o codigo 23503 em code", () => {
    expect(isForeignKeyViolation({ code: "23503" })).toBe(true)
  })

  it("reconhece o codigo 23503 em driverError", () => {
    expect(isForeignKeyViolation({ driverError: { code: "23503" } })).toBe(true)
  })

  it("ignora outros erros", () => {
    expect(isForeignKeyViolation({ code: "23505" })).toBe(false)
    expect(isForeignKeyViolation(new Error("boom"))).toBe(false)
    expect(isForeignKeyViolation(undefined)).toBe(false)
  })
})
