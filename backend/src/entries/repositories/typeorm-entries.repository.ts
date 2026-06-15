import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { WordEntity } from "../entities/word.entity"
import { EntriesRepository } from "./entries.repository"

@Injectable()
export class TypeOrmEntriesRepository extends EntriesRepository {
  constructor(
    @InjectRepository(WordEntity)
    private readonly repo: Repository<WordEntity>,
  ) {
    super()
  }

  findBySearch(
    search: string | undefined,
    skip: number,
    take: number,
  ): Promise<[WordEntity[], number]> {
    const qb = this.repo.createQueryBuilder("w").orderBy("w.word", "ASC")

    if (search) {
      const prefix = search.trim().toLowerCase().replace(/[%_\\]/g, "\\$&")
      qb.where("w.word ILIKE :prefix ESCAPE '\\'", { prefix: `${prefix}%` })
    }

    return qb.skip(skip).take(take).getManyAndCount()
  }
}
