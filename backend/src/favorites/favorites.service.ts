import { Injectable } from "@nestjs/common"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { paginate, Paginated } from "../common/pagination"
import { FavoritesRepository } from "./repositories/favorites.repository"

interface FavoriteItem {
  word: string
  added: string
}

@Injectable()
export class FavoritesService {
  constructor(private readonly repo: FavoritesRepository) {}

  async add(userId: string, word: string): Promise<void> {
    await this.repo.insertIgnore(userId, word)
  }

  async remove(userId: string, word: string): Promise<void> {
    await this.repo.delete(userId, word)
  }

  async list(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<Paginated<FavoriteItem>> {
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
