import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
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
  getHistory(@CurrentUser() user: UserEntity, @Query() query: PaginationQueryDto) {
    return this.history.list(user.id, query)
  }

  @Get("me/favorites")
  getFavorites(@CurrentUser() user: UserEntity, @Query() query: PaginationQueryDto) {
    return this.favorites.list(user.id, query)
  }
}
