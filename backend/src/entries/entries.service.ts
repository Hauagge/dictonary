import { Injectable } from "@nestjs/common"
import { Paginated, paginateQuery } from "../common/pagination"
import { EntriesQueryDto } from "./dto/entries-query.dto"
import { EntriesRepository } from "./repositories/entries.repository"

export type PaginatedWords = Paginated<string>

@Injectable()
export class EntriesService {
  constructor(private readonly repo: EntriesRepository) {}

  list({ search, page, limit }: EntriesQueryDto): Promise<PaginatedWords> {
    return paginateQuery(
      { page, limit },
      (skip, take) => this.repo.findBySearch(search, skip, take),
      (row) => row.word,
    )
  }
}
