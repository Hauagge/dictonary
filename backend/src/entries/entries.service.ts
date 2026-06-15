import { Injectable } from "@nestjs/common"
import { EntriesQueryDto } from "./dto/entries-query.dto"
import { EntriesRepository } from "./repositories/entries.repository"

export interface PaginatedWords {
  results: string[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

@Injectable()
export class EntriesService {
  constructor(private readonly repo: EntriesRepository) {}

  async list({ search, page, limit }: EntriesQueryDto): Promise<PaginatedWords> {
    const [rows, totalDocs] = await this.repo.findBySearch(
      search,
      (page - 1) * limit,
      limit,
    )

    const totalPages = Math.max(1, Math.ceil(totalDocs / limit))

    return {
      results: rows.map((row) => row.word),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }
}
