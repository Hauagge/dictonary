import { HttpService } from "@nestjs/axios"
import { NotFoundException, ServiceUnavailableException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { of, throwError } from "rxjs"
import { RedisService } from "../redis/redis.service"
import { DictionaryService } from "./dictionary.service"

describe("DictionaryService", () => {
  function build(lang?: string) {
    const http = { get: jest.fn() }
    const config = { get: jest.fn().mockReturnValue(lang) }
    const redis = { get: jest.fn(), set: jest.fn() }
    const service = new DictionaryService(
      http as unknown as HttpService,
      config as unknown as ConfigService,
      redis as unknown as RedisService,
    )
    return { service, http, config, redis }
  }

  it("devolve o valor do cache sem chamar a API quando ja existe", async () => {
    const { service, http, redis } = build("en")
    redis.get.mockResolvedValue([{ word: "hello" }])

    const result = await service.fetch("hello")

    expect(result).toEqual({ data: [{ word: "hello" }], cached: true })
    expect(redis.get).toHaveBeenCalledWith("dictionary:en:hello")
    expect(http.get).not.toHaveBeenCalled()
  })

  it("busca na API, grava no cache e retorna cached=false no miss", async () => {
    const { service, http, redis } = build("en")
    redis.get.mockResolvedValue(null)
    http.get.mockReturnValue(of({ data: [{ word: "hello" }] }))

    const result = await service.fetch("hello")

    expect(http.get).toHaveBeenCalledWith("/en/hello")
    expect(redis.set).toHaveBeenCalledWith("dictionary:en:hello", [{ word: "hello" }])
    expect(result).toEqual({ data: [{ word: "hello" }], cached: false })
  })

  it("usa 'en' como idioma padrao quando DICTIONARY_API_LANG nao esta definido", async () => {
    const { service, http, redis } = build(undefined)
    redis.get.mockResolvedValue(null)
    http.get.mockReturnValue(of({ data: [] }))

    await service.fetch("hello")

    expect(redis.get).toHaveBeenCalledWith("dictionary:en:hello")
    expect(http.get).toHaveBeenCalledWith("/en/hello")
  })

  it("lanca NotFoundException quando a API responde 404", async () => {
    const { service, http, redis } = build("en")
    redis.get.mockResolvedValue(null)
    const axiosError = { isAxiosError: true, response: { status: 404 } }
    http.get.mockReturnValue(throwError(() => axiosError))

    await expect(service.fetch("ghostword")).rejects.toBeInstanceOf(NotFoundException)
  })

  it("lanca ServiceUnavailableException em outras falhas da API", async () => {
    const { service, http, redis } = build("en")
    redis.get.mockResolvedValue(null)
    http.get.mockReturnValue(throwError(() => new Error("network down")))

    await expect(service.fetch("hello")).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    )
  })
})
