# 🗺️ Plano — Features Faltantes (conformidade com `Instrucoes.md`)

Este documento cruza os requisitos do desafio (`Instrucoes.md`) com o que já
está implementado e define um **plano por fases** para fechar as lacunas.

> **Resumo executivo:** a base atual (NestJS + TypeORM + Redis + React) cobre
> bem a **mecânica de dicionário** (proxy da API, detalhes, histórico, favoritos,
> cache, Swagger, Docker), mas **não atende ao contrato do desafio** em pontos
> obrigatórios: **autenticação JWT + multiusuário**, **rotas no formato exigido**
> (`/`, `/auth/*`, `/entries/en*`, `/user/me*`), **script de importação da
> wordlist**, **headers de cache** (`x-cache`/`x-response-time`) e **front em
> Next.js v15**.

---

## 1. Tabela de conformidade

Legenda: ✅ feito · ⚠️ parcial/divergente · ❌ faltando

### Back-End — Obrigatório 1 (casos de uso)

| Requisito | Status | Observação |
| --- | --- | --- |
| Login com usuário e senha | ❌ | Não há auth/usuário no projeto. |
| Visualizar lista de palavras do dicionário | ❌ | Hoje só há autocomplete das palavras **já buscadas**; falta a lista completa importada. |
| Visualizar detalhes de uma palavra | ✅ | `GET /api/words/:word` (lógica pronta; rota precisa virar `/entries/en/:word`). |
| Guardar no histórico ao visualizar | ⚠️ | Registra histórico, mas **global** (não por usuário). |
| Visualizar histórico | ⚠️ | `GET /api/history`; falta ser por usuário e no formato `{word, added}`. |
| Guardar favorita | ⚠️ | `POST /api/favorites`; falta por usuário e rota `/entries/en/:word/favorite`. |
| Apagar favorita | ⚠️ | `DELETE /api/favorites/:word`; falta rota `/entries/en/:word/unfavorite`. |
| Proxy da Words API | ✅ | `DictionaryService` faz proxy do dictionaryapi.dev. |

### Back-End — Obrigatório 2 (contrato de rotas)

| Rota exigida | Status | Hoje |
| --- | --- | --- |
| `GET /` → `{ "message": "English Dictionary" }` | ❌ | Não existe (root dá 404; só `/health`). |
| `POST /auth/signup` | ❌ | — |
| `POST /auth/signin` | ❌ | — |
| `GET /entries/en?search=&limit=` (paginado) | ⚠️ | Existe `GET /api/words?search=` mas retorna `string[]`, **não** `{results,totalDocs,page,totalPages,hasNext,hasPrev}`, e só sobre palavras buscadas. |
| `GET /entries/en/:word` | ⚠️ | Lógica existe em `/api/words/:word`. |
| `POST /entries/en/:word/favorite` | ⚠️ | Existe como `POST /api/favorites {word}`. |
| `DELETE /entries/en/:word/unfavorite` | ⚠️ | Existe como `DELETE /api/favorites/:word`. |
| `GET /user/me` | ❌ | Sem usuário. |
| `GET /user/me/history` | ⚠️ | Existe `/api/history` (global, formato diferente). |
| `GET /user/me/favorites` | ⚠️ | Existe `/api/favorites` (global, formato diferente). |
| Status `200/204/400` com erro humanizado `{ "message": "..." }` | ⚠️ | Erro atual é `{ status, message, details? }`; falta o formato `{ message }` e uso consistente de `204`. |

### Back-End — Obrigatório 3 e 4

| Requisito | Status | Observação |
| --- | --- | --- |
| **Obg 3** — script para baixar e importar a wordlist no banco | ❌ | Não existe; a tabela `words` só guarda definições buscadas. |
| **Obg 4** — cache das requisições | ✅ | Redis com estratégia Redis→banco→API. |
| **Obg 4** — header `x-cache: HIT/MISS` | ❌ | Não enviado. |
| **Obg 4** — header `x-response-time` (ms) | ❌ | Não enviado. |

### Back-End — Diferenciais

| Diferencial | Status |
| --- | --- |
| Documentação OpenAPI 3.0 | ✅ `@nestjs/swagger` em `/docs`. |
| Unit tests dos endpoints | ⚠️ Há testes do `WordsService`/util; faltam testes **de endpoint** (e2e). |
| Docker para deploy | ✅ docker-compose + Dockerfiles. |
| Deploy em servidor (CI opcional) | ❌ |
| Comunicação assíncrona p/ persistir favoritas | ❌ |
| Paginação por cursor | ❌ (opcional) |

### Front-End (vaga Full-Stack) — **exige Next.js v15 + App Router**

| Requisito | Status | Observação |
| --- | --- | --- |
| App em **Next.js v15 (App Router)** | ❌ | Hoje é **React + Vite (SPA)**. |
| Tela de Cadastro | ❌ | — |
| Tela de Login | ❌ | — |
| Tela inicial (busca + histórico de pesquisas) | ⚠️ | Busca + histórico existem (em React/Vite). |
| Página de detalhes da palavra | ⚠️ | Hoje é **modal**, não página dedicada. |
| Favoritar/desfavoritar na página de detalhes | ✅ | (lógica existe) |
| Lista de favoritas (desfavoritar + abrir detalhes) | ✅ | (em React/Vite) |
| **Lista completa do dicionário** (clique → modal) | ❌ | Não há (depende da wordlist importada). |
| Logout | ❌ | Sem auth. |

---

## 2. Decisões a confirmar (impactam o escopo)

1. **Frontend: migrar para Next.js v15?** O desafio **exige** Next.js v15 + App
   Router. A recomendação é **migrar** (mantendo os componentes/estilos atuais,
   que são reaproveitáveis) — caso contrário o requisito do front fica não
   atendido. *Decisão recomendada: migrar.*
2. **Contrato de rotas:** alinhar exatamente ao desafio (sem prefixo `/api`,
   usando `/entries/en*`, `/auth/*`, `/user/me*`). *Recomendado: alinhar* (e
   apontar o front para as novas rotas).
3. **Multiusuário:** histórico e favoritos passam a ser **por usuário** (FK
   `userId`), protegidos por JWT. Isso muda as entidades `History`/`Favorite`.
4. **Wordlist:** usar o repositório `dwyl/english-words`
   (`words_dictionary.json`, ~370k) como fonte do `GET /entries/en`.

---

## 3. Plano por fases

Ordem pensada para destravar dependências (auth e wordlist primeiro).

### Fase 0 — Ajustes de contrato (rápidos, alto valor)
- [ ] `GET /` → `{ "message": "English Dictionary" }` (novo `AppController`; remover/relaxar o prefixo global ou expor essa rota fora do prefixo).
- [ ] **Erro humanizado**: `AllExceptionsFilter` passar a responder **`{ "message": "..." }`** (manter `details` só em dev, se desejado). Mensagens de validação concatenadas numa frase legível.
- [ ] **Status codes**: usar `204` nas operações sem corpo (ex.: `unfavorite`, limpar histórico) e `200/201` conforme o caso.
- **Arquivos:** `src/app.controller.ts` (novo), `src/main.ts`, `src/common/filters/all-exceptions.filter.ts`.
- **Aceite:** `curl /` retorna a mensagem; um 400 retorna só `{ message }`.

### Fase 1 — Autenticação JWT + multiusuário (Obg 1 e 2)
- [ ] Entidade **`User`** (`id` uuid, `name`, `email` único, `passwordHash`, `createdAt`).
- [ ] **`AuthModule`**: `bcrypt` p/ hash, `@nestjs/jwt` + `@nestjs/passport` (estratégia JWT), `JwtAuthGuard`.
- [ ] `POST /auth/signup` e `POST /auth/signin` → retornam `{ id, name, token: "Bearer <jwt>" }`.
- [ ] **`UsersModule`**: `GET /user/me`, `GET /user/me/history`, `GET /user/me/favorites` (protegidos).
- [ ] Adicionar **`userId`** em `History` e `Favorite`; `WordsService` passa a receber o usuário (do `req.user`) em todas as operações de histórico/favorito.
- [ ] DTOs `SignUpDto`/`SignInDto` com `class-validator` (email válido, senha mín.).
- **Arquivos:** `src/users/user.entity.ts`, `src/auth/**` (module, controller, service, jwt.strategy, guard, dto), alterações em `History`/`Favorite` e `WordsService`/controllers.
- **Aceite:** signup→signin→`/user/me` funciona; histórico/favoritos isolados por usuário; rotas sem token retornam `401`.

### Fase 2 — Importação da wordlist + `GET /entries/en` (Obg 3)
- [ ] Entidade **`DictionaryWord`** (tabela `dictionary`, coluna `word` única e indexada).
- [ ] **Script de importação** `src/scripts/import-words.ts` (rodável via `npm run words:import`): baixa `words_dictionary.json` do `dwyl/english-words`, faz **bulk insert** em lotes (ex.: `INSERT ... ON CONFLICT DO NOTHING`, batches de ~5k).
- [ ] **`EntriesController`** `GET /entries/en?search=&limit=&page=` consultando a tabela `dictionary` com `ILIKE` + paginação, retornando **exatamente**: `{ results: string[], totalDocs, page, totalPages, hasNext, hasPrev }`.
- [ ] Migrar o autocomplete do front para usar esse endpoint.
- **Arquivos:** `src/entries/dictionary-word.entity.ts`, `src/scripts/import-words.ts`, `src/entries/entries.controller.ts` + service, `package.json` (script).
- **Aceite:** `GET /entries/en?search=fire&limit=4` devolve a estrutura do enunciado; banco com ~370k palavras.

### Fase 3 — Rotas `/entries/en/*` e `/user/me/*` no formato do desafio
- [ ] `GET /entries/en/:word` → detalhes (proxy + cache) **e registra histórico** do usuário.
- [ ] `POST /entries/en/:word/favorite` (204) e `DELETE /entries/en/:word/unfavorite` (204).
- [ ] `GET /user/me/history` e `GET /user/me/favorites` no formato `{ results: [{ word, added }], totalDocs, page, totalPages, hasNext, hasPrev }`.
- [ ] Adaptar o envelope de paginação (`total → totalDocs`, campos no nível raiz).
- **Aceite:** todas as rotas do Obg 2 respondem no formato e status corretos.

### Fase 4 — Headers de cache (Obg 4)
- [ ] **Interceptor global** `ResponseTimeInterceptor`: mede a duração e seta `x-response-time: <ms>`.
- [ ] **`x-cache: HIT|MISS`**: o `WordsService` sinaliza a origem (já temos `source`); o interceptor/controller seta `HIT` quando veio do cache e `MISS` quando precisou de banco/API.
- **Arquivos:** `src/common/interceptors/response-time.interceptor.ts`, ajuste no fluxo de `/entries/en/:word`.
- **Aceite:** 1ª chamada `x-cache: MISS`, 2ª `x-cache: HIT`; ambas com `x-response-time`.

### Fase 5 — Frontend em Next.js v15 (App Router)
- [ ] Novo app **Next.js v15** (`/frontend` reescrito ou `/web` novo) com App Router, TypeScript.
- [ ] **Auth**: telas de **Cadastro** e **Login**; armazenamento do token (cookie httpOnly via route handler ou storage), `middleware.ts` para proteger rotas.
- [ ] **Tela inicial**: campo de pesquisa (mantém debounce/autocomplete) + histórico de pesquisas (clique → página de detalhes).
- [ ] **Página de detalhes** `/(app)/words/[word]` (Server Component buscando do backend) + favoritar/desfavoritar.
- [ ] **Favoritas** `/(app)/favorites` (desfavoritar inline + abrir detalhes).
- [ ] **Lista completa** `/(app)/dictionary` consumindo `GET /entries/en` (paginada/infinite scroll); clique → **modal** de detalhes.
- [ ] **Logout** (limpa sessão).
- [ ] Reaproveitar componentes/estilos atuais (`WordCard`, `WordDetailModal`, tema claro/escuro, `index.css`).
- **Aceite:** fluxo cadastro→login→buscar→detalhe→favoritar→lista→logout completo, conectado ao backend.

### Fase 6 — Diferenciais
- [ ] **Testes e2e** dos endpoints (`@nestjs/testing` + `supertest`): auth, entries, favoritos, user/me.
- [ ] **Fila assíncrona** para persistir favoritas (ex.: BullMQ/Redis): `favorite` enfileira e um worker grava.
- [ ] **Paginação por cursor** opcional no `/entries/en` (formato `{ previous, next }`).
- [ ] **Deploy** (Render/Railway/Fly p/ API + Vercel p/ Next) e README com URLs.

---

## 4. Mudanças de modelo de dados (resumo)

```
User        (novo)   id(uuid) · name · email(unique) · passwordHash · createdAt
DictionaryWord(novo) id · word(unique, index)                # lista completa importada
History     (alterar) + userId(FK) ; resposta { word, added }
Favorite    (alterar) + userId(FK) ; unique (userId, word)
Word        (mantém)  cache de definições (jsonb)
```

---

## 5. Checklist final de entrega (Instrucoes.md)

- [ ] README com: título, descrição, lista de tecnologias, instruções de instalação/uso.
- [ ] `.gitignore` presente (já existe).
- [ ] Repositório **público no GitHub**, com push de **todos** os arquivos.
- [ ] Conferir que `node_modules`/`.env` não foram commitados.
- [ ] (Diferencial) Deploy público + link no teste.
- [ ] Documentação clara (README + `DOCUMENTACAO.md` + Swagger `/docs`).

---

## 6. Ordem sugerida de execução

```
Fase 0  →  Fase 1 (auth)  →  Fase 2 (wordlist/entries)  →  Fase 3 (contrato rotas)
        →  Fase 4 (headers cache)  →  Fase 5 (Next.js)  →  Fase 6 (diferenciais)
```

Cada fase é entregável e testável de forma independente; ao fim da Fase 4 o
**backend** já atende a todos os obrigatórios, e a Fase 5 fecha o **front**.
