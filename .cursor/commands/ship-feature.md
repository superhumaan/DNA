> **DNA Prompt Stem:** `ship-feature` — read `.DNA/stems/ship-feature/` (all files) before proceeding.

# Ship a feature (DNA feature factory)

User request: $ARGUMENTS

## Phase 1 — Capture
Write `ai/feature-request.md` (Problem, Users, Behaviour, Edge Cases, Success Criteria).

## Phase 2 — Agent loop (`ai/agent-loop.md`)
Product Analyst → Solution Architect → **STOP for approval** → Backend → Frontend → UX → QA → Quality → Refactor → Final Review

## Phase 3 — Close-out
`npx dna quality report --feature` PASS → `npx dna docker build` → `npx dna github push`
