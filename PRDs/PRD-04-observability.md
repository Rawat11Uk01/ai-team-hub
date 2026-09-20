# PRD-04: Observability — Logs, Metrics, Traces with OTEL

## Goal

Instrument the API with OpenTelemetry and build one dashboard showing latency, errors, and DB/cache performance.

## Problem

You can’t fix what you can’t see. Logs alone don’t show request journeys.

## Scope

**In:** OTEL traces, metrics, structured logs; dashboard; sampling.
**Out:** cloud deployment, Kafka.

## Functional Requirements

- Instrument HTTP requests, DB queries, Redis calls.
- Metrics: request count, latency histogram, error rate, DB query time, cache hit rate.
- Logs: JSON with `trace_id`, `span_id`.
- Dashboard: p95 latency, error rate, DB query time, cache hit rate.
- Document cardinality and sampling.

## Non-Functional

- Trace every request in dev; sample 10% in prod.
- Dashboard loads in < 2s.

## Architecture

OTEL SDK → collector → backend (SigNoz or Grafana/Prometheus/Jaeger).

## Tech Stack

OTEL SDK, SigNoz or Grafana + Prometheus + Jaeger.

## Milestones

1. OTEL SDK setup.
2. Traces for HTTP/DB/Redis.
3. Metrics + logs.
4. Dashboard.
5. Sampling + cardinality doc.

## Acceptance Criteria

- One trace shows full request path: API → service → DB → cache.
- Dashboard shows live metrics.
- Logs correlate with traces via `trace_id`.

## Testing

Load test with k6/Locust; verify traces/metrics appear.

## Deliverables

Dashboard JSON, instrumentation code, design doc on monitoring vs observability.

## Risks/Stretch

High cardinality. Stretch: add alerting rule for error rate > 5%.
