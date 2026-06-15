import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { HistoryEntity } from "../entities/history.entity"
import { HistoryRepository } from "./history.repository"

@Injectable()
export class TypeOrmHistoryRepository extends HistoryRepository {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly repo: Repository<HistoryEntity>,
  ) {
    super()
  }

  create(userId: string, word: string): Promise<HistoryEntity> {
    return this.repo.save(this.repo.create({ userId, word }))
  }

  findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[HistoryEntity[], number]> {
    return this.repo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip,
      take,
    })
  }
}
