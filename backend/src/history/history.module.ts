import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { HistoryEntity } from "./entities/history.entity"
import { HistoryService } from "./history.service"
import { HistoryRepository } from "./repositories/history.repository"
import { TypeOrmHistoryRepository } from "./repositories/typeorm-history.repository"

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity])],
  providers: [
    HistoryService,
    { provide: HistoryRepository, useClass: TypeOrmHistoryRepository },
  ],
  exports: [HistoryService],
})
export class HistoryModule {}
