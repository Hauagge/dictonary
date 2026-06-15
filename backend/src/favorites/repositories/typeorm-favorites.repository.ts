import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FavoriteEntity } from "../entities/favorite.entity"
import { FavoritesRepository } from "./favorites.repository"

@Injectable()
export class TypeOrmFavoritesRepository extends FavoritesRepository {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly repo: Repository<FavoriteEntity>,
  ) {
    super()
  }

  async insertIgnore(userId: string, word: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ userId, word })
      .orIgnore()
      .execute()
  }

  async delete(userId: string, word: string): Promise<void> {
    await this.repo.delete({ userId, word })
  }

  findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[FavoriteEntity[], number]> {
    return this.repo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip,
      take,
    })
  }
}
