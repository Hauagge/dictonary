import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export class SignInDto extends createZodDto(signInSchema) {}
