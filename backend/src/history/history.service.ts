import { Injectable } from "@nestjs/common"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { Paginated, paginateQuery } from "../common/pagination"
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

  list(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<Paginated<HistoryItem>> {
    return paginateQuery(
      { page, limit },
      (skip, take) => this.repo.findPage(userId, skip, take),
      (row) => ({ word: row.word, added: row.createdAt.toISOString() }),
    )
  }
}
