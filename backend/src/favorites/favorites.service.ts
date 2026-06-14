import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { paginate, Paginated } from "../common/pagination"
import { FavoriteEntity } from "./entities/favorite.entity"

interface FavoriteItem {
  word: string
  added: string
}

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly repo: Repository<FavoriteEntity>,
  ) {}

  async add(userId: string, word: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ userId, word })
      .orIgnore()
      .execute()
  }

  async remove(userId: string, word: string): Promise<void> {
    await this.repo.delete({ userId, word })
  }

  async list(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<Paginated<FavoriteItem>> {
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
