import { InMemoryUsersRepository } from "./repositories/in-memory-users.repository"
import { UsersService } from "./users.service"

describe("UsersService", () => {
  function build() {
    const repo = new InMemoryUsersRepository()
    const service = new UsersService(repo)
    return { service, repo }
  }

  it("create persiste e gera id/createdAt", async () => {
    const { service } = build()

    const user = await service.create({
      name: "Ana",
      email: "a@b.com",
      passwordHash: "hash",
    })

    expect(user.id).toBeDefined()
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user).toMatchObject({ name: "Ana", email: "a@b.com", passwordHash: "hash" })
  })

  it("findByEmail encontra usuario criado e devolve null para inexistente", async () => {
    const { service } = build()
    await service.create({ name: "Ana", email: "a@b.com", passwordHash: "hash" })

    await expect(service.findByEmail("a@b.com")).resolves.toMatchObject({ name: "Ana" })
    await expect(service.findByEmail("ghost@b.com")).resolves.toBeNull()
  })

  it("findById encontra usuario criado e devolve null para inexistente", async () => {
    const { service } = build()
    const created = await service.create({
      name: "Ana",
      email: "a@b.com",
      passwordHash: "hash",
    })

    await expect(service.findById(created.id)).resolves.toMatchObject({ id: created.id })
    await expect(service.findById("missing")).resolves.toBeNull()
  })
})
