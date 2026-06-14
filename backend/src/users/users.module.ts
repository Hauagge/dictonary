import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FavoritesModule } from "../favorites/favorites.module"
import { HistoryModule } from "../history/history.module"
import { UserEntity } from "./entities/user.entity"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HistoryModule, FavoritesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
