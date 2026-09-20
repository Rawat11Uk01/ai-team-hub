# PRDs — AI Team Knowledge & Task Hub

These are 10 cumulative PRDs. Treat them as one evolving product. Each PRD builds on the previous one. Implement in order; don’t skip the “why” docs.

Product intent lives in [`../product.md`](../product.md). The PRD is the contract; the design doc is your reasoning.

The PRD is the contract; the design doc is your reasoning. That keeps you aligned with the roadmap’s **Concept → Pattern → Tool** philosophy.

## Files

| File | PRD |
| --- | --- |
| [00-global-conventions.md](./00-global-conventions.md) | Shared repo, API, auth, and Definition of Done rules |
| [PRD-01-layered-crud-api.md](./PRD-01-layered-crud-api.md) | Layered CRUD API + Test Suite |
| [PRD-02-postgres-redis.md](./PRD-02-postgres-redis.md) | Postgres + Redis + Migrations + Indexes + RLS |
| [PRD-03-realtime-api.md](./PRD-03-realtime-api.md) | Real-Time API — Polling, Long Polling, SSE, WebSocket |
| [PRD-04-observability.md](./PRD-04-observability.md) | Observability — Logs, Metrics, Traces with OTEL |
| [PRD-05-event-driven-audit.md](./PRD-05-event-driven-audit.md) | Event-Driven Audit & Notification Service |
| [PRD-06-cloud-deployment.md](./PRD-06-cloud-deployment.md) | Cloud Deployment Two Ways — Container + Serverless |
| [PRD-07-scale-failure-patterns.md](./PRD-07-scale-failure-patterns.md) | Scale & Failure Patterns |
| [PRD-08-rag-qa.md](./PRD-08-rag-qa.md) | RAG Q&A System |
| [PRD-09-tool-using-agent.md](./PRD-09-tool-using-agent.md) | Tool-Using Agent + LLM-Ops |
| [PRD-10-fullstack-capstone.md](./PRD-10-fullstack-capstone.md) | Full-Stack AI Capstone |
| [11-build-order.md](./11-build-order.md) | Recommended build order |

For each PRD, also create a `docs/prd-XX.md` copy if needed and a `docs/design-XX.md` with the reasoning.
