import { HistoryEntity } from "../entities/history.entity"
import { HistoryRepository } from "./history.repository"

export class InMemoryHistoryRepository extends HistoryRepository {
  readonly rows: HistoryEntity[] = []
  private seq = 0

  async create(userId: string, word: string): Promise<HistoryEntity> {
    const row = {
      id: ++this.seq,
      userId,
      word,
      createdAt: new Date(),
    } as HistoryEntity
    this.rows.push(row)
    return row
  }

  async findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[HistoryEntity[], number]> {
    const all = this.rows
      .filter((row) => row.userId === userId)
      .sort((a, b) => b.id - a.id)
    return [all.slice(skip, skip + take), all.length]
  }
}
