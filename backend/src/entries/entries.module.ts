import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EntriesController } from "./entries.controller"
import { EntriesService } from "./entries.service"
import { WordEntity } from "./entities/word.entity"

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity])],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
