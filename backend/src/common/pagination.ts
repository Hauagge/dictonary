export interface Paginated<T> {
  results: T[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface PageParams {
  page: number
  limit: number
}


type PageFetcher<R> = (skip: number, take: number) => Promise<[R[], number]>


export function offsetOf({ page, limit }: PageParams): number {
  return (page - 1) * limit
}


export function paginate<T>(
  results: T[],
  totalDocs: number,
  page: number,
  limit: number,
): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  return {
    results,
    totalDocs,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export async function paginateQuery<R, T>(
  params: PageParams,
  fetcher: PageFetcher<R>,
  map: (row: R) => T,
): Promise<Paginated<T>> {
  const { page, limit } = params
  const [rows, totalDocs] = await fetcher(offsetOf(params), limit)
  return paginate(rows.map(map), totalDocs, page, limit)
}
