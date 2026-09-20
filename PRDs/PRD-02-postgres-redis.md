# PRD-02: Postgres + Redis + Migrations + Indexes + RLS

## Goal

Replace in-memory storage with Postgres. Add migrations, indexes, JSONB, RLS, and Redis cache-aside.

## Problem

In-memory data disappears and doesn’t teach real DB tradeoffs. Caching is a pattern, not a Redis feature.

## Scope

**In:** Postgres schema; Alembic/Flyway migrations; indexes; RLS; JSONB metadata; Redis cache-aside for hot reads.
**Out:** event-driven, observability, cloud.

## Functional Requirements

- Migrate tasks to Postgres.
- Tables: `users`, `tasks`.
- RLS policy: users can only access their own tasks.
- JSONB `metadata` column for flexible fields.
- Composite index on `(user_id, status, created_at)`.
- Redis cache-aside for `GET /tasks/{id}` and `GET /tasks`.
- Cache invalidation on create/update/delete.
- TTL and LRU eviction documented.

## Non-Functional

- Cache hit rate > 70% on repeated reads.
- Index reduces query time by 50%+ on 10k rows.
- Migrations are reversible.

## Architecture

Controller → Service → Repository → Postgres. Cache layer sits in repository or service. RLS enforced at DB.

## Data Model

`users(id, email, created_at)`
`tasks(id, user_id, title, description, status, priority, metadata JSONB, created_at, updated_at)`

## API Contract

Same as PRD-01, plus `X-User-Id` or API key maps to user.

## Tech Stack

Postgres, Redis, Alembic/SQLAlchemy or Prisma, pgAdmin/psql.

## Milestones

1. Schema + migrations.
2. RLS + JSONB.
3. Indexes + `EXPLAIN ANALYZE`.
4. Redis cache-aside + invalidation.
5. Measure before/after.

## Acceptance Criteria

- RLS blocks cross-user access.
- `EXPLAIN ANALYZE` shows index usage.
- Cache reduces DB calls by measurable amount.

## Testing

Integration tests with test Postgres; cache invalidation tests; RLS tests.

## Deliverables

Migration files, benchmark report, design doc on SQL vs NoSQL and caching patterns.

## Risks/Stretch

Cache stampede. Stretch: add write-through cache for updates.
