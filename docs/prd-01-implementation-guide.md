# PRD-01 Implementation Guide (remaining steps)

You already have Task types in `apps/api/src/types/task.ts`. This guide covers everything left to finish PRD-01.

**Contract:** [PRDs/PRD-01-layered-crud-api.md](../PRDs/PRD-01-layered-crud-api.md)  
**Conventions:** [PRDs/00-global-conventions.md](../PRDs/00-global-conventions.md)

---

## Current status

| Done | Remaining |
| --- | --- |
| Task / CreateTask / UpdateTask Zod schemas | Fix `UpdateTask` to be partial |
| Empty `app.ts` / `index.ts` stubs | Repository → Service → Controller → Routes |
| Root Express + Zod deps | Middleware, OpenAPI, tests, design doc, README |

---

## Target folder layout

Create these under `apps/api` as you go:

```
apps/api/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config.ts
│   ├── types/
│   │   ├── task.ts              ← you have this
│   │   └── problem-details.ts   ← RFC 7807 error shape
│   ├── repositories/
│   │   ├── task.repository.ts           ← interface only
│   │   ├── in-memory.task.repository.ts
│   │   └── fake.task.repository.ts      ← milestone 4
│   ├── services/
│   │   └── tasks.service.ts
│   ├── controllers/
│   │   └── tasks.controller.ts
│   ├── routes/
│   │   └── v1/
│   │       └── tasks.routes.ts
│   ├── middleware/
│   │   ├── request-id.ts
│   │   ├── request-logger.ts
│   │   ├── api-key-auth.ts
│   │   └── error-handler.ts
│   └── openapi/
│       └── setup.ts             ← Swagger UI at /docs
├── tests/
│   ├── unit/
│   │   └── tasks.service.test.ts
│   ├── integration/
│   │   └── tasks.api.test.ts
│   └── e2e/
│       └── tasks.e2e.test.ts
├── package.json                 ← optional if you keep deps at repo root
└── tsconfig.json                ← or extend root tsconfig
```

Docs deliverables (repo root):

```
docs/
├── design-01.md                 ← required
├── prd-01.md                    ← optional notes copy
└── prd-01-implementation-guide.md  ← this file
```

---

## Step 0 — Small type fixes (do first)

### 0.1 Make update partial

In `apps/api/src/types/task.ts`, `UpdateTaskSchema` currently looks like create. PATCH bodies are partial:

```ts
export const UpdateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();
```

### 0.2 Export schemas used by controllers

Keep exporting:

- `TaskSchema`, `CreateTaskSchema`, `UpdateTaskSchema`
- types `Task`, `CreateTask`, `UpdateTask`

### 0.3 Add Problem Details type

Create `apps/api/src/types/problem-details.ts`:

```ts
// RFC 7807 — used by error middleware
export type ProblemDetails = {
  type: string;        // e.g. "about:blank" or a URI
  title: string;       // short summary
  status: number;      // HTTP status
  detail?: string;     // human-readable explanation
  instance?: string;   // request path
  // optional extras:
  requestId?: string;
};
```

Do **not** add `createdBy` / `updatedBy` / `userId` yet — that is PRD-02.

---

## Step 1 — Wire TypeScript + scripts to `apps/api`

Root `package.json` currently points at `src/index.ts`. Point scripts at the API app:

Suggested scripts (root or `apps/api`):

```json
{
  "scripts": {
    "dev": "tsx watch apps/api/src/index.ts",
    "build": "tsc -p apps/api/tsconfig.json",
    "start": "node apps/api/dist/index.js",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

Also:

1. Set `tsconfig` so `rootDir` / includes cover `apps/api/src`.
2. Enable Node types (`"types": ["node"]`) if not already.
3. Add a `.env.example` with `PORT=3000` and `API_KEY=dev-secret`.
4. Load env in `config.ts` (or use `process.env` with defaults).

Install remaining deps when you need them (typical set):

```bash
npm i uuid swagger-ui-express
npm i -D vitest @types/supertest @types/swagger-ui-express @types/uuid supertest @vitest/coverage-v8
```

(Use `crypto.randomUUID()` instead of `uuid` if you prefer zero extra deps.)

---

## Step 2 — Repository interface + in-memory implementation

**Goal:** Storage is behind an interface so you can swap implementations later with zero service/controller changes.

### 2.1 Interface — `repositories/task.repository.ts`

Define methods only (no Express, no Zod):

```ts
import type { Task, CreateTask, UpdateTask } from "../types/task.js";

export interface TaskRepository {
  create(data: CreateTask): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(id: string, data: UpdateTask): Promise<Task | null>;
  delete(id: string): Promise<boolean>; // true if deleted
}
```

### 2.2 In-memory — `repositories/in-memory.task.repository.ts`

- Hold tasks in a `Map<string, Task>`.
- On `create`: generate `id`, set `createdAt` / `updatedAt` to `new Date()`.
- On `update`: merge partial fields, bump `updatedAt`. Return `null` if missing.
- On `delete`: return whether the id existed.
- Implement `TaskRepository`.

**Rule:** Repository does persistence only. No “title required” business rules beyond what storage needs.

### 2.3 Fake — leave a stub file for Step 9

Create `fake.task.repository.ts` later (or empty stub now). Same interface; different behavior (e.g. always empty, or fixed fixtures).

---

## Step 3 — Service layer

**File:** `services/tasks.service.ts`

**Rules:**

- Constructor takes `TaskRepository` (interface), not a concrete class.
- No `req` / `res` / Express types.
- Throw domain-friendly errors the error middleware can map (e.g. custom `NotFoundError`, `ValidationError`).

### Methods to implement

| Method | Behavior |
| --- | --- |
| `create(input)` | Optionally re-validate with Zod; call `repo.create` |
| `list()` | `repo.findAll()` |
| `getById(id)` | If null → throw not-found |
| `update(id, input)` | If null → throw not-found; else return updated |
| `delete(id)` | If not deleted → throw not-found |

**Business rules to put here (examples):**

- Title must be non-empty after trim (if not already enforced only in Zod).
- Default `status` / `priority` / `metadata` if create omits them (or require them in schema — pick one and stick to it).

Target: **≥80% unit coverage** on this file (Step 8).

---

## Step 4 — Controller + routes

### 4.1 Controller — `controllers/tasks.controller.ts`

HTTP only:

- Parse / validate body with Zod (`CreateTaskSchema` / `UpdateTaskSchema`).
- Call service.
- Map results to status codes:
  - create → `201` + body
  - list / get → `200` + body
  - update → `200` + body
  - delete → `204` (no body)
- On Zod failure → throw / next with 400 problem details.
- Do **not** talk to the repository.

Pass `next` errors to the error handler; do not `res.status(...).json(...)` for every error inline if middleware owns that.

### 4.2 Routes — `routes/v1/tasks.routes.ts`

Mount:

| Method | Path | Handler |
| --- | --- | --- |
| POST | `/` | create |
| GET | `/` | list |
| GET | `/:id` | getById |
| PATCH | `/:id` | update |
| DELETE | `/:id` | delete |

Factory pattern tip: `createTasksRouter(controller)` so tests can inject fakes.

### 4.3 Mount under version prefix

In `app.ts`:

```ts
app.use("/api/v1/tasks", tasksRouter);
```

Final public URLs:

- `POST /api/v1/tasks`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/{id}`
- `PATCH /api/v1/tasks/{id}`
- `DELETE /api/v1/tasks/{id}`

---

## Step 5 — Middleware chain + versioning

**Order matters** (chain of responsibility):

```
request → requestId → requestLogger → apiKeyAuth → routes → errorHandler
```

Put `errorHandler` **after** routes (Express 4-arg signature).

### 5.1 Request ID — `middleware/request-id.ts`

- Read `X-Request-Id` if present; else generate UUID.
- Attach to `res.setHeader("X-Request-Id", ...)`.
- Store on `req` (extend Express `Request` via declaration merging or a small typed field).

### 5.2 Request logger — `middleware/request-logger.ts`

Log method, path, status, duration, request id (on `finish` / `close`).

### 5.3 API key auth — `middleware/api-key-auth.ts`

- Expect header e.g. `X-API-Key` (or `Authorization: ApiKey ...` — pick one and document it).
- Compare to `process.env.API_KEY`.
- Missing/invalid → `401` problem details.
- Optional: skip auth for `/docs` and OpenAPI JSON so the UI loads without a key.

### 5.4 Error handler — `middleware/error-handler.ts`

- Map known errors → status + RFC 7807 body (`Content-Type: application/problem+json`).
- Unknown → `500` with safe title (no stack in production responses).
- Include `requestId` when available.

### 5.5 Versioning note (for design doc)

You are using **URI versioning** (`/api/v1`). In `docs/design-01.md` briefly contrast:

| Approach | Pros | Cons |
| --- | --- | --- |
| URI `/api/v1` | Explicit, cache-friendly, easy to route | URL churn on major bumps |
| Header (`Accept-Version`) | Cleaner resource URLs | Harder to discover / debug / cache |

PRD asks you to **document** the tradeoff, not implement both.

---

## Step 6 — Compose `app.ts` and `index.ts`

### `app.ts`

1. Create Express app.
2. `express.json()`.
3. Register middleware (request id, logger, auth).
4. Mount `/api/v1/tasks`.
5. Mount OpenAPI `/docs` (Step 7).
6. Register error handler last.
7. **Export** `app` (and a `createApp(deps)` factory) so tests do not call `listen`.

Composition root (wiring):

```ts
const repo = new InMemoryTaskRepository();
const service = new TasksService(repo);
const controller = new TasksController(service);
// mount router(controller)
```

Only this place knows the concrete repository class.

### `index.ts`

- Import `app`.
- `app.listen(PORT)`.
- Log “listening on …”.

---

## Step 7 — OpenAPI at `/docs`

Acceptance criterion: docs available at `/docs`.

Options (pick one):

1. **swagger-ui-express** + a hand-written `openapi.yaml` / `openapi.json`.
2. **zod-to-openapi** / similar if you want schemas generated from Zod.

Minimum paths to document:

- All five task endpoints
- Request/response Task shape
- `X-API-Key` security scheme
- Error responses as problem+json (at least 400 / 401 / 404)

Serve UI at `/docs`. Optionally serve raw spec at `/openapi.json`.

---

## Step 8 — Testing pyramid

Use Vitest + Supertest (fits Express/TS).

### 8.1 Unit — `tests/unit/tasks.service.test.ts`

- Mock or fake `TaskRepository`.
- Cover create / get / update / delete / not-found paths.
- Aim for **≥80% coverage on the service file**.

### 8.2 Integration — `tests/integration/tasks.api.test.ts`

- Real `createApp` with in-memory repo.
- Hit routes with Supertest + valid API key.
- Assert status codes and body shape.
- No `listen`; use `request(app)`.

### 8.3 E2E — `tests/e2e/tasks.e2e.test.ts`

- Full flow: create → list → get → patch → delete.
- Same test client is fine for this PRD (true multi-process e2e is optional).

### 8.4 Auth cases

At least one test: missing API key → `401` problem details.

### 8.5 Coverage script

Run `npm run test:coverage` and keep the report (screenshot or text) as demo evidence.

---

## Step 9 — Prove the repository is swappable

1. Implement `FakeTaskRepository` with the **same interface**.
2. In a test (or a one-line toggle in `createApp`), inject the fake instead of in-memory.
3. Confirm **service and controller files are unchanged**.

That is the main acceptance criterion for layering.

---

## Step 10 — Deliverables checklist

### 10.1 `docs/design-01.md` (required)

One page answering:

1. **What problem?** Fat route handlers mixing HTTP + rules + storage.
2. **What pattern?** Layered architecture (Controller → Service → Repository) + middleware as chain of responsibility.
3. **Which tool and why?** Express + Zod + in-memory Map (swap-ready for Postgres in PRD-02).
4. URI vs header versioning tradeoff.
5. How the middleware chain is ordered and why.

### 10.2 README

At repo root or `apps/api/README.md`:

- How to install
- How to set `API_KEY` / `PORT`
- How to run `dev` / `test`
- Example curl for create + list
- Link to `/docs`

### 10.3 Optional `docs/prd-01.md`

Short notes or a copy of the contract if you want a working doc next to the design.

### 10.4 Demo evidence

- Tests green
- Coverage ≥80% on service
- Screenshot or note that `/docs` loads
- Optional Bruno/Postman collection under `apps/api/` or `docs/`

---

## Suggested build order (day-by-day)

| Order | Focus | Done when |
| --- | --- | --- |
| 0 | Type fixes + ProblemDetails | Update is `.partial()` |
| 1 | Config + scripts point at `apps/api` | `npm run dev` starts empty app |
| 2 | Repository interface + in-memory | Can create/list in a tiny script |
| 3 | Service | Unit-testable without HTTP |
| 4 | Controller + routes | CRUD works with curl + API key skipped temporarily |
| 5 | Middleware | Auth + logging + errors + request id |
| 6 | OpenAPI `/docs` | Browser shows spec |
| 7 | Tests (unit → integration → e2e) | All green + coverage |
| 8 | Fake repo swap | Service/controller untouched |
| 9 | design-01.md + README | Definition of Done met |

---

## Acceptance criteria (exit gate)

- [ ] All five CRUD endpoints under `/api/v1/tasks`
- [ ] Middleware: request id, logging, API key, error handler (RFC 7807)
- [ ] OpenAPI UI at `/docs`
- [ ] Unit + integration + e2e tests pass
- [ ] ≥80% unit coverage on service layer
- [ ] Swap in-memory → fake repo with **zero** service/controller edits
- [ ] `docs/design-01.md` + README complete
- [ ] No real DB / Redis / auth beyond API key (out of scope)

---

## Out of scope (do not do in PRD-01)

- Postgres, Redis, migrations, RLS (PRD-02)
- `userId` / `createdBy` / `updatedBy`
- SSE / WebSockets (PRD-03)
- OTEL / dashboards (PRD-04)
- GraphQL stretch — only if you finish core first

---

## Quick reference — request example

```bash
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret" \
  -d "{\"title\":\"First task\",\"description\":\"hi\",\"status\":\"todo\",\"priority\":\"medium\",\"metadata\":{}}"
```

---

*Source of truth for scope remains the PRD. If this guide and the PRD disagree, follow the PRD.*
