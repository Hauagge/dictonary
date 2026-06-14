import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FavoriteEntity } from "./entities/favorite.entity"
import { FavoritesQueueService } from "./favorites-queue.service"
import { FavoritesService } from "./favorites.service"

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  providers: [FavoritesService, FavoritesQueueService],
  exports: [FavoritesService, FavoritesQueueService],
})
export class FavoritesModule {}
