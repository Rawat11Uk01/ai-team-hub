# PRD-03: Real-Time API — Polling, Long Polling, SSE, WebSocket

## Goal

Add real-time communication patterns so clients can receive updates without refreshing.

## Problem

Request/response is not enough for live updates, chat, or LLM streaming.

## Scope

**In:** polling endpoint, long polling endpoint, SSE stream, WebSocket endpoint.
**Out:** Kafka, cloud, LLM.

## Functional Requirements

- `GET /api/v1/tasks/poll?since=timestamp` returns new tasks.
- `GET /api/v1/tasks/long-poll?since=timestamp` holds until change or timeout.
- `GET /api/v1/events/stream` SSE stream for task events.
- `WS /api/v1/ws/counter` two-way live counter.
- Heartbeats and reconnect guidance.
- Document when to use each pattern.

## Non-Functional

- SSE supports 100 concurrent clients locally.
- WebSocket reconnects with exponential backoff.
- Long polling timeout 30s.

## Architecture

Event emitter in service layer. SSE and WebSocket subscribe to internal event bus. For this project, in-memory event emitter is fine.

## API Contract

SSE event: `{ type: "task.created", data: {...} }`.
WebSocket message: `{ type: "increment", value: 1 }`.

## Tech Stack

FastAPI/Express, EventSource, `ws` library.

## Milestones

1. Polling.
2. Long polling.
3. SSE.
4. WebSocket.
5. Compare and document.

## Acceptance Criteria

- Creating a task pushes SSE event within 1s.
- WebSocket counter updates in both directions.
- Long polling returns immediately on change.

## Testing

Manual with browser/Postman; automated with test clients.

## Deliverables

Demo video/GIF, design doc comparing polling, long polling, SSE, WebSocket, and gRPC conceptually.

## Risks/Stretch

Backpressure. Stretch: add gRPC streaming demo for service-to-service.
