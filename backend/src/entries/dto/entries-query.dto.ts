import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const entriesQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export class EntriesQueryDto extends createZodDto(entriesQuerySchema) {}
