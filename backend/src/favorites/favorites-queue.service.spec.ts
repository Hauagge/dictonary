import { ConfigService } from "@nestjs/config"
import { FavoritesQueueService, isForeignKeyViolation } from "./favorites-queue.service"
import { FavoritesService } from "./favorites.service"

describe("FavoritesQueueService (fallback sincrono)", () => {
  function build() {
    const favorites = {
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    }
    const config = { get: jest.fn().mockReturnValue(undefined) }
    const service = new FavoritesQueueService(
      config as unknown as ConfigService,
      favorites as unknown as FavoritesService,
    )
    service.onModuleInit()
    return { service, favorites, config }
  }

  it("sem REDIS_URL, enqueueAdd persiste direto via FavoritesService.add", async () => {
    const { service, favorites, config } = build()

    await service.enqueueAdd("user-1", "hello")

    expect(config.get).toHaveBeenCalledWith("REDIS_URL")
    expect(favorites.add).toHaveBeenCalledWith("user-1", "hello")
    expect(favorites.remove).not.toHaveBeenCalled()
  })

  it("sem REDIS_URL, enqueueRemove remove direto via FavoritesService.remove", async () => {
    const { service, favorites } = build()

    await service.enqueueRemove("user-1", "hello")

    expect(favorites.remove).toHaveBeenCalledWith("user-1", "hello")
    expect(favorites.add).not.toHaveBeenCalled()
  })
})

describe("FavoritesQueueService.process (worker)", () => {
  function build() {
    const favorites = {
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    }
    const config = { get: jest.fn().mockReturnValue(undefined) }
    const service = new FavoritesQueueService(
      config as unknown as ConfigService,
      favorites as unknown as FavoritesService,
    )
    return { service, favorites }
  }

  it("action 'add' chama FavoritesService.add", async () => {
    const { service, favorites } = build()

    await (service as any).process({ data: { action: "add", userId: "user-1", word: "hello" } })

    expect(favorites.add).toHaveBeenCalledWith("user-1", "hello")
    expect(favorites.remove).not.toHaveBeenCalled()
  })

  it("action 'remove' chama FavoritesService.remove", async () => {
    const { service, favorites } = build()

    await (service as any).process({ data: { action: "remove", userId: "user-1", word: "hello" } })

    expect(favorites.remove).toHaveBeenCalledWith("user-1", "hello")
    expect(favorites.add).not.toHaveBeenCalled()
  })

  it("ignora o job de add quando o usuario nao existe mais (violacao de FK)", async () => {
    const { service, favorites } = build()
    favorites.add.mockRejectedValue({ code: "23503" })

    await expect(
      (service as any).process({ data: { action: "add", userId: "ghost", word: "hello" } }),
    ).resolves.toBeUndefined()
    expect(favorites.add).toHaveBeenCalledWith("ghost", "hello")
  })

  it("propaga erros nao relacionados a FK (para re-tentar)", async () => {
    const { service, favorites } = build()
    favorites.add.mockRejectedValue(new Error("connection lost"))

    await expect(
      (service as any).process({ data: { action: "add", userId: "user-1", word: "hello" } }),
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
