import { Injectable } from "@nestjs/common"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { paginate, Paginated } from "../common/pagination"
import { HistoryEntity } from "./entities/history.entity"
import { HistoryRepository } from "./repositories/history.repository"

interface HistoryItem {
  word: string
  added: string
}

@Injectable()
export class HistoryService {
  constructor(private readonly repo: HistoryRepository) {}

  add(userId: string, word: string): Promise<HistoryEntity> {
    return this.repo.create(userId, word)
  }

  async list(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<Paginated<HistoryItem>> {
    const [rows, totalDocs] = await this.repo.findPage(
      userId,
      (page - 1) * limit,
      limit,
    )
    const results = rows.map((row) => ({
      word: row.word,
      added: row.createdAt.toISOString(),
    }))
    return paginate(results, totalDocs, page, limit)
  }
}
