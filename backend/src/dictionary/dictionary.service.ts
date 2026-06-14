import { HttpService } from "@nestjs/axios"
import { Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import { firstValueFrom } from "rxjs"

@Injectable()
export class DictionaryService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async fetch(word: string): Promise<unknown> {
    const lang = this.config.get<string>("DICTIONARY_API_LANG") || "en"
    try {
      const response = await firstValueFrom(
        this.http.get(`/${lang}/${encodeURIComponent(word)}`),
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException(`No definitions found for "${word}"`)
      }
      throw new ServiceUnavailableException("Dictionary provider is currently unavailable")
    }
  }
}
