# PRD-10: Full-Stack AI Capstone

## Goal

Build a React frontend for the API and agent, with real-time chat over SSE, deployed end-to-end.

## Problem

Backend + LLM + cloud + frontend must work together. This is the portfolio project.

## Scope

**In:** list/detail views, forms, routing, loading/error/optimistic states, chat UI with SSE, a11y, testing, deploy.
**Out:** native mobile, advanced animations.

## Functional Requirements

- Task list and detail views.
- Create/update task form with validation.
- Client-side routing.
- Loading, error, optimistic update states.
- Chat UI that streams agent responses over SSE.
- Real-time task updates via SSE/WebSocket.
- Accessibility: semantic HTML, keyboard nav, ARIA.
- Client-side caching: stale-while-revalidate.
- Build tooling: Vite, Tailwind.
- E2E tests: Playwright/Cypress.

## Non-Functional

- Lighthouse accessibility > 90.
- First contentful paint < 2s.
- E2E tests cover main flows.

## Architecture

React SPA → API/Agent. SSE for chat. Client cache layer (React Query/SWR). Deployed via CI/CD.

## Tech Stack

React, Vite, Tailwind, React Query/SWR, Playwright, cloud deploy.

## Milestones

1. Scaffold + routing.
2. Task CRUD UI.
3. Real-time updates.
4. Chat UI + SSE.
5. A11y + tests.
6. Deploy + observability.

## Acceptance Criteria

- User can create task and see it update live.
- Chat streams agent response token by token.
- E2E tests pass in CI.
- Deployed URL works.

## Testing

Unit for components; e2e for flows; a11y audit.

## Deliverables

Frontend repo, deployed URL, E2E test report, design doc on rendering, state, data fetching, real-time consumption, styling, build tooling, a11y.

## Risks/Stretch

SSE reconnect. Stretch: add SSR/SSG comparison for one page.
