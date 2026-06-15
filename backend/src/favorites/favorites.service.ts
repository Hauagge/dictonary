import { Injectable } from "@nestjs/common"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { Paginated, paginateQuery } from "../common/pagination"
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

  list(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<Paginated<FavoriteItem>> {
    return paginateQuery(
      { page, limit },
      (skip, take) => this.repo.findPage(userId, skip, take),
      (row) => ({ word: row.word, added: row.createdAt.toISOString() }),
    )
  }
}
