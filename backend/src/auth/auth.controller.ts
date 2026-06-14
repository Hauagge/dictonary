import { Body, Controller, HttpCode, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { ZodValidationPipe } from "nestjs-zod"
import { AuthService } from "./auth.service"
import { SignInDto } from "./dto/sign-in.dto"
import { SignUpDto } from "./dto/sign-up.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("signup")
  signup(@Body(new ZodValidationPipe(SignUpDto)) dto: SignUpDto) {
    return this.auth.signup(dto)
  }

  @HttpCode(200)
  @Post("signin")
  signin(@Body(new ZodValidationPipe(SignInDto)) dto: SignInDto) {
    return this.auth.signin(dto)
  }
}
