# PRD-09: Tool-Using Agent + LLM-Ops

## Goal

Build a single agent that can call your API tools, with memory, guardrails, tracing, semantic cache, and SSE streaming.

## Problem

Agents are LLMs that decide when to call functions. You need to build the loop by hand before using frameworks.

## Scope

**In:** ReAct loop, function calling, memory, guardrails, semantic cache, OTEL tracing, SSE streaming.
**Out:** multi-agent, fine-tuning.

## Functional Requirements

- Agent tools: `create_task`, `list_tasks`, `get_task`, `update_task`, `delete_task`.
- Hand-rolled function-calling loop: reason → act → observe → repeat.
- Short-term memory: conversation window.
- Long-term memory: RAG over past conversations.
- Guardrails: input validation, output validation, PII filter.
- Semantic cache for repeated queries.
- OTEL traces: token usage, latency, cost per request.
- `POST /api/v1/agent/chat` with SSE streaming.

## Non-Functional

- Tool call latency < 3s.
- Trace every LLM call.
- Cache hit rate > 30% on repeated queries.

## Architecture

User → agent loop → LLM + tools → API. OTEL spans around LLM, tools, cache. SSE streams tokens.

## Tech Stack

Claude/OpenAI function calling, optional LangChain/LlamaIndex after hand-rolled, OTEL.

## Milestones

1. Tool definitions.
2. Hand-rolled loop.
3. Memory.
4. Guardrails.
5. Semantic cache + tracing.
6. SSE streaming.

## Acceptance Criteria

- Agent can create and list tasks via natural language.
- Traces show token/cost per request.
- SSE streams partial responses.
- Guardrails block PII.

## Testing

Unit for tools; integration for agent loop; eval harness for agent outputs.

## Deliverables

Agent API, eval harness, trace dashboard, design doc on ReAct, context/memory, LLM-Ops.

## Risks/Stretch

Prompt injection. Stretch: add multi-agent orchestrator-worker.
