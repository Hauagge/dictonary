import { Body, Controller, HttpCode, Post } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { ZodValidationPipe } from "nestjs-zod"
import { authResponseSchema, errorSchema } from "../common/swagger/responses"
import { AuthService } from "./auth.service"
import { SignInDto } from "./dto/sign-in.dto"
import { SignUpDto } from "./dto/sign-up.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("signup")
  @ApiCreatedResponse({ description: "Usuario criado", schema: authResponseSchema })
  @ApiBadRequestResponse({ description: "Dados invalidos", schema: errorSchema })
  @ApiConflictResponse({ description: "Email ja cadastrado", schema: errorSchema })
  signup(@Body(new ZodValidationPipe(SignUpDto)) dto: SignUpDto) {
    return this.auth.signup(dto)
  }

  @HttpCode(200)
  @Post("signin")
  @ApiOkResponse({ description: "Autenticado", schema: authResponseSchema })
  @ApiBadRequestResponse({ description: "Dados invalidos", schema: errorSchema })
  @ApiUnauthorizedResponse({ description: "Credenciais invalidas", schema: errorSchema })
  signin(@Body(new ZodValidationPipe(SignInDto)) dto: SignInDto) {
    return this.auth.signin(dto)
  }
}
