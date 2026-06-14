import { HttpModule } from "@nestjs/axios"
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { DictionaryService } from "./dictionary.service"

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL:
          config.get<string>("DICTIONARY_API_URL") ||
          "https://api.dictionaryapi.dev/api/v2/entries",
        timeout: Number(config.get("HTTP_TIMEOUT") || 8000),
      }),
    }),
  ],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
