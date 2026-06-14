import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(4).max(72),
})

export class SignUpDto extends createZodDto(signUpSchema) {}
