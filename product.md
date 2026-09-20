# Product: AI Team Knowledge & Task Hub

**AI Team Knowledge & Task Hub** is a small internal workspace where a team can track work, keep a searchable record of how that work changed, ask questions of their own docs, and talk to an agent that can actually do things — create a task, look one up, update it — instead of only chatting.

It is one product, not ten demos. Each PRD adds a layer the product needs: persistence, live updates, history, retrieval, an agent, then a UI. The learning roadmap is how we build it; this document is what it is for.

## The problem

Teams already have tasks, docs, and chat. They still lose context in three places:

1. **Work is scattered.** Tasks live in one tool, decisions in another, and “what happened to this ticket?” is tribal knowledge.
2. **Docs don’t answer questions.** API specs and design notes exist, but people still ping each other instead of asking the corpus.
3. **AI assistants can’t act.** A chatbot that cannot create or update a task is a search box with extra steps.

The Hub is the thinnest product that closes those gaps for a small team: tasks as the source of work, events as the source of history, docs as the source of knowledge, and an agent as the interface that ties them together.

## Who it is for

- A small engineering team that wants one place for “what are we doing?” and “what do we know?”
- Someone who would rather type “create a high-priority task to add RLS tests” than click through a form — and still wants the form when they prefer it.
- Operators who need to see latency, errors, and cost, not only feature screens.

It is **not** a Linear/Jira competitor, a Notion replacement, or a production multi-tenant SaaS. Scope stays small so every layer stays explainable.

## What you can do

| You want to… | The product does… |
| --- | --- |
| Capture work | Create, list, update, and delete tasks with title, status, priority, and flexible metadata |
| Stay in your own data | Each user only sees their own tasks (row-level security) |
| See changes as they happen | Live task updates over SSE; two-way channel for interactive surfaces |
| Ask “what happened to this task?” | Replay an append-only event log into an audit timeline |
| Ask “how does our API / RLS / caching work?” | RAG over project and API docs, with citations |
| Delegate busywork | Chat with an agent that calls task tools (create, list, get, update, delete) |
| Use it in a browser | Task list/detail, forms, live updates, and streaming chat |

## Product shape

```
┌─────────────────────────────────────────────────────────┐
│  Web app (list, detail, forms, streaming chat)          │
└───────────────────────────┬─────────────────────────────┘
                            │  REST + SSE + WebSocket
┌───────────────────────────▼─────────────────────────────┐
│  API  /api/v1                                           │
│  tasks · events · audit · rag · agent                   │
└───────┬─────────────┬──────────────┬────────────────────┘
        │             │              │
        ▼             ▼              ▼
   Postgres      Redis cache    Kafka / event log
   + pgvector    + rate limits  (audit + replay)
```

**Tasks** are the core object. Everything else is a way to store them, watch them, explain them, or act on them.

A task has: `id`, `title`, `description`, `status`, `priority`, `metadata`, timestamps, and an owning user.

## How the layers become one product

These are product capabilities, not tutorial names.

1. **Work API** — A versioned REST API for tasks, with auth, logging, and a swappable store so the rest of the product does not care how data is saved.
2. **Durable, isolated data** — Postgres holds users and tasks. RLS enforces “your tasks only.” Redis speeds hot reads. JSONB leaves room for extra fields without a schema churn every week.
3. **Live workspace** — Creating a task should show up for a connected client without refresh. Polling, long polling, SSE, and WebSockets exist so we pick the right shape: SSE for feeds and token streaming, WebSockets where both sides talk.
4. **Operability** — Logs, metrics, and traces so a slow list or a cache miss is visible, not guessed.
5. **History** — `task.created` / `updated` / `deleted` events. The current task is also reconstructable from the log. That is the audit trail and the notification backbone.
6. **It runs in the real world** — Same API as a container and as a serverless function, with IaC, CI, secrets, and a load balancer. The product is not “works on my laptop.”
7. **It survives load and failure** — Rate limits, retries, circuit breakers, idempotent creates. Duplicate “create task” clicks must not create two tasks.
8. **Knowledge** — Ingest the PRDs, design docs, and API spec. Ask questions and get cited answers from *this* product’s docs, not the public internet.
9. **An agent that works here** — Natural language in, tool calls out. Memory, guardrails, tracing, and SSE so chat is a first-class interface to the same task API.
10. **The Hub UI** — The thing a person actually opens: tasks on the left, live updates, chat on the right that streams and can change the board.

After step 10, a user can create a task in the UI, see it appear live, ask the docs why RLS exists, and tell the agent to update the task’s priority — in one product.

## What “done” looks like (product, not PRD)

A teammate can:

1. Sign in (API key early; session later if needed).
2. Create a task in the web app and see it in the list without refreshing.
3. Open the task and see an audit timeline of creates/updates.
4. Ask: “How does RLS work?” and get an answer with a citation from the product docs.
5. Type: “Make that task high priority” and watch the agent update it, tokens streaming in the chat.
6. An operator can open a dashboard and see latency, error rate, cache hit rate, and LLM cost.

If those six flows work, the Hub is a product. Individual PRDs are how we get there.

## What we are not building

- Multi-team orgs, SSO, billing, or a public marketplace
- A general chatbot with no tools
- Fine-tuned or self-hosted foundation models
- A self-managed Kubernetes platform
- Mobile apps

Those would hide the patterns this repo exists to practice.

## How this doc relates to the others

| Document | Job |
| --- | --- |
| [product.md](./product.md) | What the Hub is and why it exists |
| [mission.md](./mission.md) | How we learn by growing this product in 10 milestones |
| [PRDs/](./PRDs/README.md) | The contract for each milestone |
| [Learning_Roadmap.pdf](./Learning_Roadmap.pdf) | Concept → Pattern → Tool curriculum behind the sequence |

When a PRD and this doc disagree on *product intent*, this doc wins. When they disagree on *scope for a given milestone*, the PRD wins.
