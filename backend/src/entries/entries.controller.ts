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
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger"
import { ZodValidationPipe } from "nestjs-zod"
import { Response } from "express"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { wordParamSchema } from "../common/schemas/word-param.schema"
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
  list(@Query(new ZodValidationPipe(EntriesQueryDto)) query: EntriesQueryDto) {
    return this.entries.list(query)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("en/:word")
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
  async favorite(@Param("word", new ZodValidationPipe(wordParamSchema)) word: string, @CurrentUser() user: UserEntity) {
    await this.favoritesQueue.enqueueAdd(user.id, word)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete("en/:word/unfavorite")
  async unfavorite(@Param("word", new ZodValidationPipe(wordParamSchema)) word: string, @CurrentUser() user: UserEntity) {
    await this.favoritesQueue.enqueueRemove(user.id, word)
  }
}
