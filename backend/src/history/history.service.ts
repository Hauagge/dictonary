import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { paginate, Paginated } from "../common/pagination"
import { HistoryEntity } from "./entities/history.entity"

interface HistoryItem {
  word: string
  added: string
}

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly repo: Repository<HistoryEntity>,
  ) {}

  add(userId: string, word: string): Promise<HistoryEntity> {
    return this.repo.save(this.repo.create({ userId, word }))
  }

  async list(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<Paginated<HistoryItem>> {
    const [rows, totalDocs] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })
    const results = rows.map((row) => ({
      word: row.word,
      added: row.createdAt.toISOString(),
    }))
    return paginate(results, totalDocs, page, limit)
  }
}
