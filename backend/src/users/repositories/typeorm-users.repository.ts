import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "../entities/user.entity"
import { CreateUserData, UsersRepository } from "./users.repository"

@Injectable()
export class TypeOrmUsersRepository extends UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {
    super()
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } })
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } })
  }

  create(data: CreateUserData): Promise<UserEntity> {
    return this.repo.save(this.repo.create(data))
  }
}
