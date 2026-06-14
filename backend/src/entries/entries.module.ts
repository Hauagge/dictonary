import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DictionaryModule } from "../dictionary/dictionary.module"
import { FavoritesModule } from "../favorites/favorites.module"
import { HistoryModule } from "../history/history.module"
import { EntriesController } from "./entries.controller"
import { EntriesService } from "./entries.service"
import { WordEntity } from "./entities/word.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([WordEntity]),
    DictionaryModule,
    HistoryModule,
    FavoritesModule,
  ],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
