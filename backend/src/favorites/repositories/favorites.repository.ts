import { FavoriteEntity } from "../entities/favorite.entity"

/**
 * Contrato de persistencia de favoritos. Devolve entidades cruas; o mapeamento
 * para DTO e a paginacao ficam na FavoritesService (regra de negocio).
 */
export abstract class FavoritesRepository {
  /** Insere ignorando duplicatas (userId + word ja existente). */
  abstract insertIgnore(userId: string, word: string): Promise<void>
  abstract delete(userId: string, word: string): Promise<void>
  abstract findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[FavoriteEntity[], number]>
}
