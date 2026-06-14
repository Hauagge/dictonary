import { INestApplication } from "@nestjs/common"
import request from "supertest"
import { createTestApp, MISSING_WORD } from "./create-app"

describe("Dictionary API (e2e)", () => {
  let app: INestApplication
  let http: ReturnType<typeof request>
  let token: string

  const user = { name: "Ada Lovelace", email: "ada@example.com", password: "s3cret" }

  beforeAll(async () => {
    app = await createTestApp()
    http = request(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  describe("GET /", () => {
    it("retorna a mensagem de boas-vindas", async () => {
      const res = await http.get("/").expect(200)
      expect(res.body).toEqual({ message: "English Dictionary" })
    })
  })

  describe("Auth", () => {
    it("POST /auth/signup cria usuario e retorna token Bearer", async () => {
      const res = await http.post("/auth/signup").send(user).expect(201)
      expect(res.body).toMatchObject({ name: user.name })
      expect(res.body.id).toBeDefined()
      expect(res.body.token).toMatch(/^Bearer /)
      token = res.body.token
    })

    it("POST /auth/signup com email duplicado retorna 409", async () => {
      const res = await http.post("/auth/signup").send(user).expect(409)
      expect(res.body.message).toBe("Email already registered")
    })

    it("POST /auth/signup com payload invalido retorna 400", async () => {
      await http
        .post("/auth/signup")
        .send({ name: "", email: "nope", password: "x" })
        .expect(400)
    })

    it("POST /auth/signin retorna 200 e token", async () => {
      const res = await http
        .post("/auth/signin")
        .send({ email: user.email, password: user.password })
        .expect(200)
      expect(res.body.token).toMatch(/^Bearer /)
    })

    it("POST /auth/signin com senha errada retorna 401", async () => {
      const res = await http
        .post("/auth/signin")
        .send({ email: user.email, password: "wrong" })
        .expect(401)
      expect(res.body.message).toBe("Invalid credentials")
    })
  })

  describe("GET /user/me", () => {
    it("sem token retorna 401", async () => {
      await http.get("/user/me").expect(401)
    })

    it("com token retorna o perfil", async () => {
      const res = await http.get("/user/me").set("Authorization", token).expect(200)
      expect(res.body).toMatchObject({ name: user.name, email: user.email })
    })
  })

  describe("GET /entries/en", () => {
    it("retorna lista paginada", async () => {
      const res = await http.get("/entries/en").expect(200)
      expect(res.body).toMatchObject({
        page: 1,
        totalDocs: 4,
        hasPrev: false,
      })
      expect(res.body.results).toContain("hello")
    })

    it("filtra por prefixo com search", async () => {
      const res = await http.get("/entries/en?search=fire").expect(200)
      expect(res.body.totalDocs).toBe(3)
      expect(res.body.results).toEqual(["fire", "firefly", "fireman"])
    })

    it("respeita page e limit", async () => {
      const res = await http.get("/entries/en?limit=2&page=2").expect(200)
      expect(res.body).toMatchObject({
        page: 2,
        totalPages: 2,
        hasNext: false,
        hasPrev: true,
      })
      expect(res.body.results).toHaveLength(2)
    })

    it("rejeita query invalida com 400", async () => {
      await http.get("/entries/en?page=0").expect(400)
    })
  })

  describe("GET /entries/en/:word", () => {
    it("sem token retorna 401", async () => {
      await http.get("/entries/en/fire").expect(401)
    })

    it("com token retorna definicao, grava historico e header x-cache", async () => {
      const res = await http
        .get("/entries/en/fire")
        .set("Authorization", token)
        .expect(200)
      expect(res.headers["x-cache"]).toBe("MISS")
      expect(res.body[0]).toMatchObject({ word: "fire" })
    })

    it("palavra sem definicao retorna 404 humanizado", async () => {
      const res = await http
        .get(`/entries/en/${MISSING_WORD}`)
        .set("Authorization", token)
        .expect(404)
      expect(res.body.message).toContain("No definitions found")
    })

    it("palavra invalida retorna 400", async () => {
      await http.get("/entries/en/123").set("Authorization", token).expect(400)
    })
  })

  describe("Favoritos", () => {
    it("POST /entries/en/:word/favorite retorna 204", async () => {
      await http.post("/entries/en/hello/favorite").set("Authorization", token).expect(204)
    })

    it("favoritar de novo continua 204 (idempotente)", async () => {
      await http.post("/entries/en/hello/favorite").set("Authorization", token).expect(204)
    })

    it("GET /user/me/favorites lista a palavra", async () => {
      const res = await http.get("/user/me/favorites").set("Authorization", token).expect(200)
      expect(res.body.totalDocs).toBe(1)
      expect(res.body.results[0]).toMatchObject({ word: "hello" })
      expect(res.body.results[0].added).toBeDefined()
    })

    it("DELETE /entries/en/:word/unfavorite retorna 204 e remove", async () => {
      await http.delete("/entries/en/hello/unfavorite").set("Authorization", token).expect(204)
      const res = await http.get("/user/me/favorites").set("Authorization", token).expect(200)
      expect(res.body.totalDocs).toBe(0)
    })
  })

  describe("GET /user/me/history", () => {
    it("lista a palavra visitada anteriormente", async () => {
      const res = await http.get("/user/me/history").set("Authorization", token).expect(200)
      expect(res.body.totalDocs).toBeGreaterThanOrEqual(1)
      expect(res.body.results[0]).toMatchObject({ word: "fire" })
      expect(res.body.results[0].added).toBeDefined()
    })
  })
})
