import { HistoryEntity } from "../entities/history.entity"


export abstract class HistoryRepository {
  abstract create(userId: string, word: string): Promise<HistoryEntity>
  abstract findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[HistoryEntity[], number]>
}
