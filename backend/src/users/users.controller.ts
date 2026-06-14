import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger"
import { ZodValidationPipe } from "nestjs-zod"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { FavoritesService } from "../favorites/favorites.service"
import { HistoryService } from "../history/history.service"
import { UserEntity } from "./entities/user.entity"

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly history: HistoryService,
    private readonly favorites: FavoritesService,
  ) {}

  @Get("me")
  me(@CurrentUser() user: UserEntity) {
    return { id: user.id, name: user.name, email: user.email }
  }

  @Get("me/history")
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  getHistory(@CurrentUser() user: UserEntity, @Query(new ZodValidationPipe(PaginationQueryDto)) query: PaginationQueryDto) {
    return this.history.list(user.id, query)
  }

  @Get("me/favorites")
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  getFavorites(@CurrentUser() user: UserEntity, @Query(new ZodValidationPipe(PaginationQueryDto)) query: PaginationQueryDto) {
    return this.favorites.list(user.id, query)
  }
}
