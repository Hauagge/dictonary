import { ConfigService } from "@nestjs/config"
import Redis from "ioredis"
import { RedisService } from "./redis.service"

jest.mock("ioredis")

const RedisMock = Redis as unknown as jest.Mock

function buildClient() {
  const handlers: Record<string, () => void> = {}
  const client = {
    on: jest.fn((event: string, cb: () => void) => {
      handlers[event] = cb
    }),
    connect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn(),
    set: jest.fn().mockResolvedValue("OK"),
    quit: jest.fn().mockResolvedValue(undefined),
  }
  return { client, handlers }
}

function build({ url, ttl }: { url?: string; ttl?: string } = {}) {
  const { client, handlers } = buildClient()
  RedisMock.mockImplementation(() => client)
  const config = {
    get: jest.fn((key: string) =>
      key === "REDIS_URL" ? url : key === "CACHE_TTL" ? ttl : undefined,
    ),
  }
  const service = new RedisService(config as unknown as ConfigService)
  return {
    service,
    client,
    config,
    ready: () => handlers.ready?.(),
  }
}

describe("RedisService (sem REDIS_URL, cache desativado)", () => {
  it("nao instancia client e get/set viram no-op", async () => {
    const { service, config } = build({ url: undefined })

    expect(config.get).toHaveBeenCalledWith("REDIS_URL")
    expect(RedisMock).not.toHaveBeenCalled()
    await expect(service.get("chave")).resolves.toBeNull()
    await expect(service.set("chave", { a: 1 })).resolves.toBeUndefined()
  })

  it("onModuleDestroy nao quebra quando nao ha client", async () => {
    const { service } = build({ url: undefined })
    await expect(service.onModuleDestroy()).resolves.toBeUndefined()
  })
})

describe("RedisService (com REDIS_URL)", () => {
  it("instancia o client e tenta conectar", () => {
    const { client } = build({ url: "redis://localhost:6379" })

    expect(RedisMock).toHaveBeenCalledWith(
      "redis://localhost:6379",
      expect.objectContaining({ lazyConnect: true }),
    )
    expect(client.connect).toHaveBeenCalled()
  })

  it("get retorna null enquanto o client nao esta pronto", async () => {
    const { service, client } = build({ url: "redis://localhost:6379" })

    await expect(service.get("chave")).resolves.toBeNull()
    expect(client.get).not.toHaveBeenCalled()
  })

  it("get faz parse do JSON quando o client esta pronto", async () => {
    const { service, client, ready } = build({ url: "redis://localhost:6379" })
    ready()
    client.get.mockResolvedValue(JSON.stringify({ word: "hello" }))

    await expect(service.get("dictionary:en:hello")).resolves.toEqual({
      word: "hello",
    })
    expect(client.get).toHaveBeenCalledWith("dictionary:en:hello")
  })

  it("get retorna null quando a chave nao existe", async () => {
    const { service, client, ready } = build({ url: "redis://localhost:6379" })
    ready()
    client.get.mockResolvedValue(null)

    await expect(service.get("ausente")).resolves.toBeNull()
  })

  it("get retorna null e nao propaga erro de JSON invalido", async () => {
    const { service, client, ready } = build({ url: "redis://localhost:6379" })
    ready()
    client.get.mockResolvedValue("{json invalido")

    await expect(service.get("corrompida")).resolves.toBeNull()
  })

  it("set grava com EX usando o TTL padrao (86400)", async () => {
    const { service, client, ready } = build({ url: "redis://localhost:6379" })
    ready()

    await service.set("chave", { a: 1 })

    expect(client.set).toHaveBeenCalledWith(
      "chave",
      JSON.stringify({ a: 1 }),
      "EX",
      86400,
    )
  })

  it("set usa o CACHE_TTL configurado como padrao", async () => {
    const { service, client, ready } = build({
      url: "redis://localhost:6379",
      ttl: "100",
    })
    ready()

    await service.set("chave", "valor")

    expect(client.set).toHaveBeenCalledWith(
      "chave",
      JSON.stringify("valor"),
      "EX",
      100,
    )
  })

  it("set respeita o TTL informado por chamada", async () => {
    const { service, client, ready } = build({ url: "redis://localhost:6379" })
    ready()

    await service.set("chave", "valor", 60)

    expect(client.set).toHaveBeenCalledWith(
      "chave",
      JSON.stringify("valor"),
      "EX",
      60,
    )
  })

  it("set vira no-op enquanto o client nao esta pronto", async () => {
    const { service, client } = build({ url: "redis://localhost:6379" })

    await service.set("chave", "valor")

    expect(client.set).not.toHaveBeenCalled()
  })

  it("set engole erro do client sem propagar", async () => {
    const { service, client, ready } = build({ url: "redis://localhost:6379" })
    ready()
    client.set.mockRejectedValue(new Error("connection lost"))

    await expect(service.set("chave", "valor")).resolves.toBeUndefined()
  })

  it("onModuleDestroy encerra o client", async () => {
    const { service, client } = build({ url: "redis://localhost:6379" })

    await service.onModuleDestroy()

    expect(client.quit).toHaveBeenCalled()
  })

  it("onModuleDestroy engole erro do quit", async () => {
    const { service, client } = build({ url: "redis://localhost:6379" })
    client.quit.mockRejectedValue(new Error("already closed"))

    await expect(service.onModuleDestroy()).resolves.toBeUndefined()
  })
})
