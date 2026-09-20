Use **one evolving product** instead of 10 disconnected tutorials. I’d suggest building an **AI-powered Team Knowledge & Task Hub**: tasks/bookmarks → live updates → events → cloud → scale → RAG → agent → full-stack chat UI. Each project is a milestone that adds one layer from the roadmap.

> Reality check: 4 months is enough for a compressed survey with projects, not deep mastery. Your goal should be: can explain the pattern, build a small version, and know which tool implements it.

## 10-project sequence

| #   | Project                                       | Roadmap phase         | Core patterns                                                                         | Suggested tools                                                     |
| --- | --------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Layered CRUD API + tests                      | Phase 1               | Controller/service/repo, middleware, versioning, testing pyramid                      | FastAPI/Express, pytest/Jest, Bruno/Postman                         |
| 2   | Postgres + Redis + migrations/indexes/RLS     | Phase 2               | SQL vs NoSQL, indexing, migrations, cache-aside, RLS, JSONB                           | Postgres, Redis, Alembic, SQLAlchemy                                |
| 3   | Real-time API: SSE + WebSocket + long polling | Phase 1 real-time     | One-way vs two-way streaming, reconnection                                            | EventSource, `ws`, FastAPI/Express                                  |
| 4   | Observability dashboard                       | Phase 3               | Logs, metrics, traces, OTEL, cardinality, sampling                                    | OTEL SDK, SigNoz or Grafana/Prometheus/Jaeger                       |
| 5   | Event-driven audit/notification service       | Phase 4               | Event sourcing, pub-sub, event bus, DLQ, idempotency                                  | Kafka/Redpanda                                                      |
| 6   | Deploy two ways: container + serverless       | Phase 5               | Containers, FaaS, IaC, CI/CD, load balancing, secrets                                 | Docker, ECS/Fargate or Cloud Run, Lambda, Terraform, GitHub Actions |
| 7   | Scale/failure mini-system                     | Phase 6               | Rate limiting, retries/backoff, circuit breaker, consistent hashing, idempotency keys | Redis, Nginx/Envoy, load-testing tool                               |
| 8   | RAG Q&A over your own docs/API                | Phase 7.1–7.2, 7.5    | Chunking, embeddings, vector search, re-ranking, evals                                | pgvector, embedding model, Claude/OpenAI SDK                        |
| 9   | Tool-using agent + memory + LLM-Ops           | Phase 7.3–7.6         | ReAct, function calling, context/memory, guardrails, semantic cache, token tracing    | Native function calling, optional LangChain/LlamaIndex, OTEL        |
| 10  | Full-stack AI app capstone                    | Phase 8 + integration | CSR/SSR, state, client caching, SSE chat, deploy, cost/scale                          | React, Vite, Tailwind, Playwright, cloud                            |

## Project details

### 1. Layered CRUD API + tests

Build a “tasks/bookmarks” API with strict `controller → service → repository` separation. Add API versioning, middleware for auth/logging/error handling, and a test suite: unit, integration, e2e.  
**Deliverable:** OpenAPI docs, tests, and a deliberate DB/ORM swap to prove layering worked.

### 2. Database + caching layer

Move the API to Postgres. Add migrations, composite indexes, a JSONB column, an RLS policy, and Redis cache-aside on a hot read path.  
**Deliverable:** before/after latency measurements with and without index/cache. Explain why each index costs writes.

### 3. Real-time endpoints

Add one SSE endpoint for live task updates and one WebSocket endpoint for a live counter/chat. Also implement a simple long-polling endpoint.  
**Deliverable:** compare polling vs long polling vs SSE vs WebSocket. Handle reconnect/backoff.

### 4. Observability

Instrument the API with OpenTelemetry. Emit traces, metrics, and structured logs. Build one dashboard showing request latency, error rate, DB query time, and cache hit rate.  
**Deliverable:** a working dashboard and a short explanation of monitoring vs observability.

### 5. Event-driven audit/notification service

Emit `task.created`, `task.updated`, `task.deleted` to Kafka/Redpanda. Build a consumer that reconstructs current state by replaying events. Add a DLQ and idempotency handling.  
**Deliverable:** an audit timeline and a replayable event log independent of the source DB.

### 6. Cloud deployment two ways

Deploy the same API once as a container on a managed service, once as a serverless function. Put a load balancer in front. Write the infrastructure in Terraform. Wire CI/CD to run tests before deploy.  
**Deliverable:** public URLs, Terraform repo, CI pipeline, and a cold-start/cost comparison.

### 7. Scale and failure patterns

Implement a token-bucket rate limiter, retries with exponential backoff, a circuit breaker, idempotency keys, and consistent hashing for cache routing. Load-test it.  
**Deliverable:** load-test report and a whiteboard design defending your choices. This is your interview-readiness checkpoint.

### 8. RAG Q&A system

Ingest your project docs/API docs. Build chunking, embeddings, pgvector similarity search, re-ranking, and citations. Create a small eval set and score answers.  
**Deliverable:** `/ask` endpoint that answers from your docs, with retrieval quality metrics.

### 9. Tool-using agent + LLM-Ops

Build an agent that can query your Phase 1–4 API. Hand-roll the function-calling loop first. Add memory, guardrails, semantic caching, token/cost tracing, and SSE streaming.  
**Deliverable:** chat agent with traces for latency, token usage, cost, and cache hit rate per request.

### 10. Full-stack AI capstone

Build a React/Vite/Tailwind frontend for the API: list/detail views, forms, routing, loading/error/optimistic states, and a chat UI that streams agent responses over SSE. Deploy it with CI/CD, observability, and a cost/scale design doc.  
**Deliverable:** one end-to-end project exercising backend, cloud, LLM, and frontend.

## 4-month pacing

- Weeks 1–2: Project 1
- Weeks 3–4: Project 2
- Week 5: Project 3
- Week 6: Project 4
- Weeks 7–8: Project 5
- Weeks 9–10: Project 6
- Week 11: Project 7
- Weeks 12–13: Project 8
- Week 14: Project 9
- Weeks 15–16: Project 10

If time gets tight, merge Project 3 into Project 2, and merge Project 7 into Project 6/10. For every project, write a one-page design doc answering: **What problem does this solve? What is the pattern? Which tool did I pick and why?** That keeps you aligned with the roadmap’s “Concept → Pattern → Tool” philosophy.
