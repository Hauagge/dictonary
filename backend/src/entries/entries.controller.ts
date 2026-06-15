import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { ZodValidationPipe } from "nestjs-zod"
import { Response } from "express"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { wordParamSchema } from "../common/schemas/word-param.schema"
import {
  cacheHeaders,
  dictionaryEntrySchema,
  errorSchema,
  wordsPageSchema,
} from "../common/swagger/responses"
import { DictionaryService } from "../dictionary/dictionary.service"
import { FavoritesQueueService } from "../favorites/favorites-queue.service"
import { HistoryService } from "../history/history.service"
import { UserEntity } from "../users/entities/user.entity"
import { EntriesQueryDto } from "./dto/entries-query.dto"
import { EntriesService } from "./entries.service"

@ApiTags("Entries")
@Controller("entries")
export class EntriesController {
  constructor(
    private readonly entries: EntriesService,
    private readonly dictionary: DictionaryService,
    private readonly history: HistoryService,
    private readonly favoritesQueue: FavoritesQueueService,
  ) {}

  @Get("en")
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiOkResponse({ description: "Lista paginada de palavras", schema: wordsPageSchema })
  list(@Query(new ZodValidationPipe(EntriesQueryDto)) query: EntriesQueryDto) {
    return this.entries.list(query)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("en/:word")
  @ApiOkResponse({
    description: "Dados da palavra (proxy da Free Dictionary API)",
    schema: dictionaryEntrySchema,
    headers: cacheHeaders,
  })
  @ApiUnauthorizedResponse({ description: "Token ausente ou invalido", schema: errorSchema })
  @ApiNotFoundResponse({ description: "Palavra sem definicoes", schema: errorSchema })
  @ApiServiceUnavailableResponse({
    description: "Provedor de dicionario indisponivel",
    schema: errorSchema,
  })
  async detail(
    @Param("word", new ZodValidationPipe(wordParamSchema)) word: string,
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, cached } = await this.dictionary.fetch(word)
    await this.history.add(user.id, word)
    res.setHeader("x-cache", cached ? "HIT" : "MISS")
    return data
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post("en/:word/favorite")
  @ApiNoContentResponse({ description: "Palavra marcada como favorita" })
  @ApiUnauthorizedResponse({ description: "Token ausente ou invalido", schema: errorSchema })
  async favorite(@Param("word", new ZodValidationPipe(wordParamSchema)) word: string, @CurrentUser() user: UserEntity) {
    await this.favoritesQueue.enqueueAdd(user.id, word)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete("en/:word/unfavorite")
  @ApiNoContentResponse({ description: "Palavra removida dos favoritos" })
  @ApiUnauthorizedResponse({ description: "Token ausente ou invalido", schema: errorSchema })
  async unfavorite(@Param("word", new ZodValidationPipe(wordParamSchema)) word: string, @CurrentUser() user: UserEntity) {
    await this.favoritesQueue.enqueueRemove(user.id, word)
  }
}
