import { UserEntity } from "../entities/user.entity"
import { CreateUserData, UsersRepository } from "./users.repository"

/**
 * Implementacao em memoria do contrato de usuarios, para testes unitarios.
 */
export class InMemoryUsersRepository extends UsersRepository {
  readonly users: UserEntity[] = []
  private seq = 0

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user: UserEntity = {
      id: `user-${++this.seq}`,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    }
    this.users.push(user)
    return user
  }
}
