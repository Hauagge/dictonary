import { UserEntity } from "../entities/user.entity"

export interface CreateUserData {
  name: string
  email: string
  passwordHash: string
}

/**
 * Contrato de persistencia de usuarios. A regra de negocio depende desta
 * abstracao; a infra (TypeORM) e os fakes de teste (InMemory) a implementam.
 */
export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>
  abstract findById(id: string): Promise<UserEntity | null>
  abstract create(data: CreateUserData): Promise<UserEntity>
}
