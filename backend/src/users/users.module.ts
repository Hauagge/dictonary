import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FavoritesModule } from "../favorites/favorites.module"
import { HistoryModule } from "../history/history.module"
import { UserEntity } from "./entities/user.entity"
import { TypeOrmUsersRepository } from "./repositories/typeorm-users.repository"
import { UsersRepository } from "./repositories/users.repository"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HistoryModule, FavoritesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: TypeOrmUsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
