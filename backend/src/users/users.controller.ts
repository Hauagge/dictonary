import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { ZodValidationPipe } from "nestjs-zod"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import {
  errorSchema,
  userProfileSchema,
  wordItemsPageSchema,
} from "../common/swagger/responses"
import { FavoritesService } from "../favorites/favorites.service"
import { HistoryService } from "../history/history.service"
import { UserEntity } from "./entities/user.entity"

@ApiTags("User")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Token ausente ou invalido", schema: errorSchema })
@Controller("user")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly history: HistoryService,
    private readonly favorites: FavoritesService,
  ) {}

  @Get("me")
  @ApiOkResponse({ description: "Perfil do usuario", schema: userProfileSchema })
  me(@CurrentUser() user: UserEntity) {
    return { id: user.id, name: user.name, email: user.email }
  }

  @Get("me/history")
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiOkResponse({ description: "Palavras visitadas", schema: wordItemsPageSchema })
  getHistory(@CurrentUser() user: UserEntity, @Query(new ZodValidationPipe(PaginationQueryDto)) query: PaginationQueryDto) {
    return this.history.list(user.id, query)
  }

  @Get("me/favorites")
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiOkResponse({ description: "Palavras favoritas", schema: wordItemsPageSchema })
  getFavorites(@CurrentUser() user: UserEntity, @Query(new ZodValidationPipe(PaginationQueryDto)) query: PaginationQueryDto) {
    return this.favorites.list(user.id, query)
  }
}
