---
description: Shape a feature brief from strategy — then hand off to plan-feature / agent loop.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Shape feature

Produce a feature brief ready for DNA feature factory — **no code, no architect plan yet**.

Feature: $ARGUMENTS

## Brief sections

- **Problem** — user pain with evidence or labeled assumption
- **Users** — who benefits
- **Desired behaviour**
- **Success criteria** — testable
- **Parent initiative / product**
- **Scope** — in / out
- **Dependencies** — auth, data, compliance
- **Open questions**

## Persist

Update `ai/feature-request.md` (all sections). Optionally add a row to product feature map Impressions.

## Hand-off (mandatory)

1. Next stem: `plan-feature` or `agent-loop-full` / `role-product-analyst`
2. **Stop** — Solution Architect plan requires **user approval** before any code
3. Do not implement from this stem

## Output

Filled brief + confirmation that feature-request.md was updated.
