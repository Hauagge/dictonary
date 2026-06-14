import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { UserEntity } from "../users/entities/user.entity"
import { UsersService } from "../users/users.service"
import { SignInDto } from "./dto/sign-in.dto"
import { SignUpDto } from "./dto/sign-up.dto"

interface AuthResponse {
  id: string
  name: string
  token: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: SignUpDto): Promise<AuthResponse> {
    const existing = await this.users.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException("Email already registered")
    }
    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = await this.users.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    })
    return this.buildResponse(user)
  }

  async signin(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.users.findByEmail(dto.email)
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return this.buildResponse(user)
  }

  private buildResponse(user: UserEntity): AuthResponse {
    const token = this.jwt.sign({ sub: user.id, email: user.email })
    return { id: user.id, name: user.name, token: `Bearer ${token}` }
  }
}
