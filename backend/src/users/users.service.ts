import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } })
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } })
  }

  create(data: { name: string; email: string; passwordHash: string }): Promise<UserEntity> {
    return this.repo.save(this.repo.create(data))
  }
}
