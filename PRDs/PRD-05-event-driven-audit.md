# PRD-05: Event-Driven Audit & Notification Service

## Goal

Emit task events to Kafka/Redpanda and build a consumer that reconstructs state by replaying events.

## Problem

CRUD hides history. Event-driven design enables auditability, replay, and decoupling.

## Scope

**In:** event producer, consumer, event log, DLQ, idempotency.
**Out:** cloud, LLM.

## Functional Requirements

- Emit events: `task.created`, `task.updated`, `task.deleted`.
- Event schema: `eventId`, `type`, `timestamp`, `userId`, `taskId`, `payload`.
- Consumer stores events append-only.
- Replay endpoint: `GET /api/v1/audit/tasks/{id}` reconstructs state.
- DLQ for failed messages.
- Idempotent consumer using `eventId`.

## Non-Functional

- At-least-once delivery.
- Consumer lag < 1s locally.
- DLQ retries 3 times.

## Architecture

API → Kafka producer → topic `task-events` → consumer → event store. DLQ topic for failures.

## Tech Stack

Kafka/Redpanda, Kafka client, Postgres for event store.

## Milestones

1. Kafka setup.
2. Producer on CRUD.
3. Consumer + event store.
4. Replay endpoint.
5. DLQ + idempotency.

## Acceptance Criteria

- Replay reconstructs current task state without source DB.
- DLQ captures poison messages.
- Duplicate events don’t duplicate state.

## Testing

Integration tests with embedded Kafka/Redpanda; idempotency tests.

## Deliverables

Event schema, replay demo, design doc on event sourcing, pub-sub, delivery guarantees.

## Risks/Stretch

Exactly-once myth. Stretch: add RabbitMQ comparison.
