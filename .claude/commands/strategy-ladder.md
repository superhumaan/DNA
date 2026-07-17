---
description: Run the full strategy → canvas → goals (North Star/OKRs/KPIs) → initiative → product → feature → Now-Next-Later ladder.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Strategy ladder

Walk purpose → strategy → goals/metrics → product → initiatives → features → roadmap for this project.

Scope: $ARGUMENTS

## Altitude order (do not skip upward without cause)

1. **Golden Circle** — Why / How / What
2. **Business strategy canvas** — pillars, positioning, bets
3. **Product canvas** — users, problems, value, metrics
4. **North Star metric** — single primary product success signal
5. **Define OKRs** — Objectives + Key Results for the period
6. **Define KPIs** — health / operational metrics (distinct from OKRs)
7. **Goal cascade** — company → team → initiative alignment
8. **Define initiative** — outcome-shaped bets
9. **Define product** — scope, ICP, non-goals
10. **Shape feature** — brief ready for feature factory
11. **Roadmap Now / Next / Later** — horizon plan

## Run

```bash
npx dna context cursor
```

Load Impressions under `DNA/Impressions/product/` and any strategy notes. Reuse what exists; fill gaps only.

## Output

For each rung: short filled artifact path + 3–7 bullets. End with:

- Recommended next stem if the user wants to go deeper on one rung
- Open assumptions needing discovery
- Reminder: engineering starts only after `shape-feature` → `plan-feature` / agent-loop with approval
