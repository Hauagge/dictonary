# 📖 English Dictionary — Fullstack Challenge

Aplicação fullstack para consultar e gerenciar palavras de um dicionário de
inglês, usando como base a [Free Dictionary API](https://dictionaryapi.dev). O
back-end expõe uma API RESTful (autenticação JWT, histórico e favoritos por
usuário, cache) e faz **proxy** da Words API; o front-end em **Next.js** consome
essa API.

## 🧱 Tecnologias

- **Back-end:** Node.js · **NestJS** · TypeScript · PostgreSQL (TypeORM) · Redis (cache) · JWT (Passport) · Zod (nestjs-zod) · Swagger/OpenAPI · Jest
- **Front-end:** **Next.js 15** (App Router) · React 19 · TypeScript
- **Infra:** Docker / Docker Compose

## ✨ Funcionalidades

- 🔐 Cadastro e login com **JWT**; rotas protegidas por usuário
- 🔍 Busca de palavras (com autocomplete) e **proxy** da Free Dictionary API
- 📚 Lista completa do dicionário (paginada, ~370k palavras importadas)
- 🕑 Histórico de palavras visualizadas (por usuário)
- ❤️ Favoritar / desfavoritar palavras (persistência via **fila assíncrona** BullMQ/Redis, com fallback síncrono)
- ⚡ Cache Redis das definições, com headers `x-cache` (HIT/MISS) e `x-response-time`
- 🧾 Mensagens de erro  (`{ "message": "..." }`)
- 📖 Documentação **OpenAPI 3.0** em `/docs`

## 📦 Estrutura

```
.
├── backend/            # API NestJS (RESTful)
├── frontend/           # App Next.js 15 (App Router)
└── docker-compose.yml  # db + redis + backend + frontend
```

## 🚀 Como rodar

### Opção A — Docker (tudo de uma vez)

Pré-requisito: Docker + Docker Compose.

```bash
docker compose up --build
```

- Front-end: <http://localhost:3000>
- Back-end:  <http://localhost:3001>
- Docs: <http://localhost:3001/docs>

Depois de subir, importe a lista de palavras (uma vez):

```bash
docker compose exec backend node dist/scripts/import-words.js
```

### Opção B — Local

Pré-requisitos: Node.js 18+, PostgreSQL e Redis. A forma mais simples de obter a
infra é via Docker:

```bash
docker compose up -d db redis
```

**1. Back-end**

```bash
cd backend
cp .env.example .env
npm install
npm run words:import     # baixa e importa a wordlist (~370k palavras)
npm run dev        # http://localhost:3001
```

**2. Front-end** (em outro terminal)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:3000
```

## 🔌 Principais rotas da API

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET    | `/` | Mensagem de identificação |
| POST   | `/auth/signup` · `/auth/signin` | Cadastro / login (retorna `token`) |
| GET    | `/entries/en?search=&page=&limit=` | Lista do dicionário (paginada/busca) |
| GET    | `/entries/en/:word` | Detalhes da palavra (registra histórico) |
| POST   | `/entries/en/:word/favorite` | Favoritar (204) |
| DELETE | `/entries/en/:word/unfavorite` | Desfavoritar (204) |
| GET    | `/user/me` | Perfil do usuário |
| GET    | `/user/me/history` | Histórico paginado |
| GET    | `/user/me/favorites` | Favoritos paginados |

Documentação interativa completa em **`/docs`** (Swagger).

Respostas com cache trazem os headers `x-cache: HIT|MISS` e `x-response-time`.

## 🧪 Testes

```bash
cd backend
npm test
```

## 📝 Licença

MIT.
