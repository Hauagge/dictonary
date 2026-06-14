export interface Paginated<T> {
  results: T[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
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
