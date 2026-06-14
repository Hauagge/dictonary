import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UserEntity } from "../../users/entities/user.entity"
import { UsersService } from "../../users/users.service"

interface JwtPayload {
  sub: string
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly users: UsersService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET") || "dev-secret",
    })
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.users.findById(payload.sub)
    if (!user) {
      throw new UnauthorizedException("Invalid token")
    }
    return user
  }
}
