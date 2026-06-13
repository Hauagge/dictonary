# 📖 English Dictionary — Fullstack Challenge

Aplicação fullstack para consultar e gerenciar palavras de um dicionário de
inglês, usando como base a [Free Dictionary API](https://dictionaryapi.dev). O
back-end expõe uma API RESTful (com autenticação, histórico e favoritos) e faz
**proxy** da Words API; o front-end consome essa API.

> 🚧 **Em construção.** O projeto está sendo reconstruído **por partes**,
> seguindo o escopo de `Instrucoes.md` e boas práticas (Conventional Commits,
> commits atômicos). Veja o roadmap em `PLANO-FEATURES-FALTANTES.md`.

## 🧱 Tecnologias

- **Back-end:** Node.js · **NestJS** · TypeScript · PostgreSQL (TypeORM) · Redis (cache)
- **Front-end:** **Next.js v15** (App Router) · TypeScript
- **Infra:** Docker / Docker Compose
- **Qualidade:** Jest, Swagger/OpenAPI, validação com class-validator

## 📦 Estrutura

```
.
├── backend/    # API NestJS (RESTful)
├── frontend/   # App Next.js v15 (a ser criado)
└── Instrucoes.md
```

## 🚀 Como rodar (back-end)

Pré-requisito: Node.js 18+.

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev        # http://localhost:3001
```

Verifique a rota raiz:

```bash
curl http://localhost:3001/
# { "message": "English Dictionary" }
```

## 🗺️ Progresso (por partes)

- [x] **Parte 1** — Scaffold da API + `GET /` + tratamento de erros humanizado
- [ ] Parte 2 — Banco de dados + entidades
- [ ] Parte 3 — Autenticação (JWT): `signup` / `signin` / `user/me`
- [ ] Parte 4 — Importação da wordlist + `GET /entries/en` (paginado/busca)
- [ ] Parte 5 — Detalhes, histórico e favoritos por usuário
- [ ] Parte 6 — Cache com headers `x-cache` / `x-response-time`
- [ ] Parte 7 — Front-end Next.js v15
- [ ] Parte 8 — Diferenciais (testes e2e, fila assíncrona, deploy)

## 📝 Licença

MIT.
