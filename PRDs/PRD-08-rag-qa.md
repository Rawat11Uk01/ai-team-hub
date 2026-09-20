# PRD-08: RAG Q&A System

## Goal

Build a RAG system over your own project docs/API docs with citations and evals.

## Problem

LLMs don’t know your private data. RAG injects relevant knowledge at request time.

## Scope

**In:** ingestion, chunking, embeddings, vector store, retrieval, re-ranking, answer generation, citations, eval set.
**Out:** fine-tuning, model training.

## Functional Requirements

- `POST /api/v1/rag/ingest` ingest docs.
- Chunking strategy: 500 tokens, 50 overlap.
- Embedding model + pgvector.
- `POST /api/v1/rag/ask` returns answer + citations.
- Re-ranking top 20 → top 5.
- Eval harness: 20 Q&A pairs; metrics: recall@5, faithfulness.
- Guardrails: refuse if no context.

## Non-Functional

- Retrieval < 2s.
- Answer includes source chunks.
- Eval score > 80% recall@5.

## Architecture

Docs → chunker → embedder → pgvector. Query → embed → search → re-rank → LLM prompt → answer.

## Tech Stack

pgvector, embedding model, Claude/OpenAI SDK.

## Milestones

1. Ingest + chunk.
2. Embed + store.
3. Retrieve + re-rank.
4. Generate + cite.
5. Eval harness.

## Acceptance Criteria

- Ask “How does RLS work?” returns cited answer from PRD-02.
- Eval harness reports metrics.
- No hallucination when context missing.

## Testing

Eval set, retrieval tests, guardrail tests.

## Deliverables

RAG API, eval report, design doc on chunking, embeddings, re-ranking.

## Risks/Stretch

Chunking quality. Stretch: add semantic caching.
