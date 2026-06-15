import { ConflictException, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { UsersService } from "../users/users.service"
import { AuthService } from "./auth.service"

jest.mock("bcryptjs")

const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>

describe("AuthService", () => {
  function build() {
    const users = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    }
    const jwt = { sign: jest.fn().mockReturnValue("signed-token") }
    const service = new AuthService(
      users as unknown as UsersService,
      jwt as unknown as JwtService,
    )
    return { service, users, jwt }
  }

  describe("signup", () => {
    it("rejeita quando o email ja esta cadastrado", async () => {
      const { service, users } = build()
      users.findByEmail.mockResolvedValue({ id: "u1" })

      await expect(
        service.signup({ name: "Ana", email: "a@b.com", password: "123456" }),
      ).rejects.toBeInstanceOf(ConflictException)
      expect(users.create).not.toHaveBeenCalled()
    })

    it("cria o usuario com senha hasheada e devolve token Bearer", async () => {
      const { service, users, jwt } = build()
      users.findByEmail.mockResolvedValue(null)
      ;(bcryptMock.hash as jest.Mock).mockResolvedValue("hashed")
      users.create.mockResolvedValue({ id: "u1", name: "Ana", email: "a@b.com" })

      const result = await service.signup({
        name: "Ana",
        email: "a@b.com",
        password: "123456",
      })

      expect(bcryptMock.hash).toHaveBeenCalledWith("123456", 10)
      expect(users.create).toHaveBeenCalledWith({
        name: "Ana",
        email: "a@b.com",
        passwordHash: "hashed",
      })
      expect(jwt.sign).toHaveBeenCalledWith({ sub: "u1", email: "a@b.com" })
      expect(result).toEqual({ id: "u1", name: "Ana", token: "Bearer signed-token" })
    })
  })

  describe("signin", () => {
    it("rejeita quando o usuario nao existe", async () => {
      const { service, users } = build()
      users.findByEmail.mockResolvedValue(null)

      await expect(
        service.signin({ email: "a@b.com", password: "123456" }),
      ).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it("rejeita quando a senha nao confere", async () => {
      const { service, users } = build()
      users.findByEmail.mockResolvedValue({ id: "u1", passwordHash: "hashed" })
      ;(bcryptMock.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        service.signin({ email: "a@b.com", password: "errada" }),
      ).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it("autentica e devolve token Bearer quando a senha confere", async () => {
      const { service, users } = build()
      users.findByEmail.mockResolvedValue({
        id: "u1",
        name: "Ana",
        email: "a@b.com",
        passwordHash: "hashed",
      })
      ;(bcryptMock.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.signin({ email: "a@b.com", password: "123456" })

      expect(bcryptMock.compare).toHaveBeenCalledWith("123456", "hashed")
      expect(result).toEqual({ id: "u1", name: "Ana", token: "Bearer signed-token" })
    })
  })
})
