import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { EntriesQueryDto } from "./dto/entries-query.dto"
import { WordEntity } from "./entities/word.entity"

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
  constructor(
    @InjectRepository(WordEntity)
    private readonly repo: Repository<WordEntity>,
  ) {}

  async list({ search, page, limit }: EntriesQueryDto): Promise<PaginatedWords> {
    const qb = this.repo.createQueryBuilder("w").orderBy("w.word", "ASC")

    if (search) {
      const prefix = search.trim().toLowerCase().replace(/[%_\\]/g, "\\$&")
      qb.where("w.word ILIKE :prefix ESCAPE '\\'", { prefix: `${prefix}%` })
    }

    const [rows, totalDocs] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

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
