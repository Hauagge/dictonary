import { WordEntity } from "../entities/word.entity"
import { EntriesRepository } from "./entries.repository"


export class InMemoryEntriesRepository extends EntriesRepository {
  constructor(private readonly words: string[] = []) {
    super()
  }

  async findBySearch(
    search: string | undefined,
    skip: number,
    take: number,
  ): Promise<[WordEntity[], number]> {
    let all = [...this.words].sort((a, b) => a.localeCompare(b))

    if (search) {
      const prefix = search.trim().toLowerCase()
      all = all.filter((word) => word.toLowerCase().startsWith(prefix))
    }

    const rows = all
      .slice(skip, skip + take)
      .map((word, index) => ({ id: skip + index + 1, word }) as WordEntity)
    return [rows, all.length]
  }
}
