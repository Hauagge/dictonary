import { Injectable } from "@nestjs/common"
import { UserEntity } from "./entities/user.entity"
import { CreateUserData, UsersRepository } from "./repositories/users.repository"

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findByEmail(email)
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findById(id)
  }

  create(data: CreateUserData): Promise<UserEntity> {
    return this.repo.create(data)
  }
}
