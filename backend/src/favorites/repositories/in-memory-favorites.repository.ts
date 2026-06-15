import { FavoriteEntity } from "../entities/favorite.entity"
import { FavoritesRepository } from "./favorites.repository"

/**
 * Implementacao em memoria do contrato de favoritos, para testes unitarios.
 * Ordena por id desc (equivalente a createdAt desc para insercoes monotonas).
 */
export class InMemoryFavoritesRepository extends FavoritesRepository {
  readonly rows: FavoriteEntity[] = []
  private seq = 0

  async insertIgnore(userId: string, word: string): Promise<void> {
    if (this.rows.some((row) => row.userId === userId && row.word === word)) {
      return
    }
    this.rows.push({
      id: ++this.seq,
      userId,
      word,
      createdAt: new Date(),
    } as FavoriteEntity)
  }

  async delete(userId: string, word: string): Promise<void> {
    for (let i = this.rows.length - 1; i >= 0; i--) {
      if (this.rows[i].userId === userId && this.rows[i].word === word) {
        this.rows.splice(i, 1)
      }
    }
  }

  async findPage(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[FavoriteEntity[], number]> {
    const all = this.rows
      .filter((row) => row.userId === userId)
      .sort((a, b) => b.id - a.id)
    return [all.slice(skip, skip + take), all.length]
  }
}
