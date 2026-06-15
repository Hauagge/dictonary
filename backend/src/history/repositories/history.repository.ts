import { HistoryEntity } from "../entities/history.entity"

/**
 * Contrato de persistencia de historico. Devolve entidades cruas; o mapeamento
 * para DTO e a paginacao ficam na HistoryService (regra de negocio).
 */
export abstract class HistoryRepository {
  abstract create(userId: string, word: string): Promise<HistoryEntity>
  abstract findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[HistoryEntity[], number]>
}
