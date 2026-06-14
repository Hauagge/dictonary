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
import { Response } from "express"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { WordParamPipe } from "../common/pipes/word-param.pipe"
import { DictionaryService } from "../dictionary/dictionary.service"
import { FavoritesService } from "../favorites/favorites.service"
import { HistoryService } from "../history/history.service"
import { UserEntity } from "../users/entities/user.entity"
import { EntriesQueryDto } from "./dto/entries-query.dto"
import { EntriesService } from "./entries.service"

@Controller("entries")
export class EntriesController {
  constructor(
    private readonly entries: EntriesService,
    private readonly dictionary: DictionaryService,
    private readonly history: HistoryService,
    private readonly favorites: FavoritesService,
  ) {}

  @Get("en")
  list(@Query() query: EntriesQueryDto) {
    return this.entries.list(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get("en/:word")
  async detail(
    @Param("word", WordParamPipe) word: string,
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, cached } = await this.dictionary.fetch(word)
    await this.history.add(user.id, word)
    res.setHeader("x-cache", cached ? "HIT" : "MISS")
    return data
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post("en/:word/favorite")
  async favorite(@Param("word", WordParamPipe) word: string, @CurrentUser() user: UserEntity) {
    await this.favorites.add(user.id, word)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete("en/:word/unfavorite")
  async unfavorite(@Param("word", WordParamPipe) word: string, @CurrentUser() user: UserEntity) {
    await this.favorites.remove(user.id, word)
  }
}
