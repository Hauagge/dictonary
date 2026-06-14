import { ConfigService } from "@nestjs/config"
import { FavoritesQueueService } from "./favorites-queue.service"
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
