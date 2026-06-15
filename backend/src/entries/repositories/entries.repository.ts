import { WordEntity } from "../entities/word.entity"

/**
 * Contrato de consulta do dicionario de palavras. O detalhe de como o prefixo
 * e casado (ILIKE/ESCAPE no SQL) e infra e vive na implementacao; a service so
 * passa o termo e a paginacao.
 */
export abstract class EntriesRepository {
  abstract findBySearch(
    search: string | undefined,
    skip: number,
    take: number,
  ): Promise<[WordEntity[], number]>
}
