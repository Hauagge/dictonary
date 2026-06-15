import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FavoriteEntity } from "./entities/favorite.entity"
import { FavoritesQueueService } from "./favorites-queue.service"
import { FavoritesService } from "./favorites.service"
import { FavoritesRepository } from "./repositories/favorites.repository"
import { TypeOrmFavoritesRepository } from "./repositories/typeorm-favorites.repository"

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  providers: [
    FavoritesService,
    FavoritesQueueService,
    { provide: FavoritesRepository, useClass: TypeOrmFavoritesRepository },
  ],
  exports: [FavoritesService, FavoritesQueueService],
})
export class FavoritesModule {}
