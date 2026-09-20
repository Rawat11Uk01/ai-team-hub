# PRD-07: Scale & Failure Patterns

## Goal

Make the API resilient and scalable: rate limiting, retries, circuit breaker, idempotency keys, consistent hashing.

## Problem

Real systems fail. You need patterns to isolate failure and protect resources.

## Scope

**In:** token bucket rate limiter, retries with backoff, circuit breaker, idempotency keys, consistent hashing for cache.
**Out:** multi-region, full CAP theorem implementation.

## Functional Requirements

- Rate limit middleware: 100 req/min per user; returns 429.
- Retry external calls with exponential backoff + jitter.
- Circuit breaker for external service (mock).
- `Idempotency-Key` header on POST; prevents duplicates.
- Consistent hashing for Redis sharding.
- Load test: k6/Locust.
- Document CAP theorem tradeoffs.

## Non-Functional

- Rate limiter adds < 5ms.
- Circuit breaker opens after 5 failures.
- Idempotency key TTL 24h.

## Architecture

Middleware → rate limiter. Service → circuit breaker wrapper. Cache → consistent hash ring.

## Tech Stack

Redis, k6/Locust, mock external service.

## Milestones

1. Rate limiter.
2. Retries + circuit breaker.
3. Idempotency keys.
4. Consistent hashing.
5. Load test.

## Acceptance Criteria

- 429 after limit.
- Duplicate POST with same key returns same response.
- Circuit breaker opens and recovers.
- Load test report shows p95 under load.

## Testing

Unit for limiter/breaker; integration for idempotency; load test.

## Deliverables

Load test report, design doc on scaling, load balancing, failure isolation.

## Risks/Stretch

Tuning thresholds. Stretch: add bulkhead pattern.
