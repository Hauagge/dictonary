import { HttpService } from "@nestjs/axios"
import { Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import { firstValueFrom } from "rxjs"
import { RedisService } from "../redis/redis.service"

export interface DictionaryResult {
  data: unknown
  cached: boolean
}

@Injectable()
export class DictionaryService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async fetch(word: string): Promise<DictionaryResult> {
    const lang = this.config.get<string>("DICTIONARY_API_LANG") || "en"
    const cacheKey = `dictionary:${lang}:${word}`

    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return { data: cached, cached: true }
    }

    try {
      const response = await firstValueFrom(
        this.http.get(`/${lang}/${encodeURIComponent(word)}`),
      )
      await this.redis.set(cacheKey, response.data)
      return { data: response.data, cached: false }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException(`No definitions found for "${word}"`)
      }
      throw new ServiceUnavailableException("Dictionary provider is currently unavailable")
    }
  }
}
