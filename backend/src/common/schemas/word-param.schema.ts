import { z } from "zod"

export const wordParamSchema = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[A-Za-z][A-Za-z\s'-]*$/, "Invalid word")
  .toLowerCase()
