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
4. **Product diagnose** (optional deepen) — purpose/SWOT/jobs from code + debt when Impressions are stubs — `product-diagnose`
5. **North Star metric** — single primary product success signal
6. **Define OKRs** — Objectives + Key Results for the period
7. **Define KPIs** — health / operational metrics (distinct from OKRs)
8. **Goal cascade** — company → team → initiative alignment
9. **Define initiative** — outcome-shaped bets
10. **Define product** — scope, ICP, non-goals
11. **Shape feature** — brief ready for feature factory
12. **Roadmap Now / Next / Later** — horizon plan
13. **Upgrade recommend** (optional) — high-leverage changes from competitor + debt — `upgrade-recommend`

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
