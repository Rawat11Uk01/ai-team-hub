# PRD-01: Layered CRUD API + Test Suite

## Goal

Build a small but properly layered REST API for tasks/bookmarks that demonstrates request lifecycle, controller/service/repository separation, middleware, versioning, and testing pyramid.

## Problem

Most beginners put routing, business logic, and DB access in one file. This project forces separation so you can swap infrastructure later.

## Scope

**In:** CRUD for tasks; in-memory repository; middleware chain; versioned endpoints; OpenAPI docs; tests.
**Out:** real database, caching, real-time, auth beyond simple API key.

## Functional Requirements

- `POST /api/v1/tasks` create task.
- `GET /api/v1/tasks` list tasks.
- `GET /api/v1/tasks/{id}` get task.
- `PATCH /api/v1/tasks/{id}` update task.
- `DELETE /api/v1/tasks/{id}` delete task.
- Middleware: request logging, API-key auth, error handling, request ID.
- Versioning: `/api/v1`; document URI vs header tradeoff.
- Repository interface must be swappable.

## Non-Functional

- p95 latency < 50ms for in-memory.
- 80%+ unit coverage on service layer.
- Clean OpenAPI spec.

## Architecture

`Controller → Service → Repository`. Controller handles HTTP shape only. Service holds business rules. Repository abstracts storage.

## API Contract

Task: `id`, `title`, `description`, `status`, `priority`, `metadata` (JSON), `createdAt`, `updatedAt`.

## Tech Stack

FastAPI or Express; pytest/Jest; Bruno/Postman.

## Milestones

1. Repo + layering.
2. Middleware + versioning.
3. Tests: unit, integration, e2e.
4. Swap repository to prove layering.

## Acceptance Criteria

- Swapping in-memory repo to a fake repo requires zero service/controller changes.
- All tests pass.
- OpenAPI docs available at `/docs`.

## Testing

Unit: service logic. Integration: API + repo. E2E: full request via test client.

## Deliverables

Repo, README, OpenAPI, test report, design doc explaining layering and middleware as chain-of-responsibility.

## Risks/Stretch

Over-engineering. Stretch: add GraphQL endpoint and document why REST was chosen.
