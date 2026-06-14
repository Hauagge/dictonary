import { Controller, Get, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UserEntity } from "./entities/user.entity"

@Controller("user")
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: UserEntity) {
    return { id: user.id, name: user.name, email: user.email }
  }
}
