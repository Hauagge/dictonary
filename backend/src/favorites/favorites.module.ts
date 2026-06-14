import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FavoriteEntity } from "./entities/favorite.entity"
import { FavoritesService } from "./favorites.service"

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
