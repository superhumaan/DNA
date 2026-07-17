---
description: Write Objectives and Key Results for a period — outcomes, not task lists.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Define OKRs

Create Objectives and Key Results for the stated period. OKRs are **outcomes**; leave tasks for roadmap/features.

Period / scope: $ARGUMENTS

## Rules

- **Objective** — qualitative, inspiring, time-bound (usually 1–3 per level)
- **Key Results** — 2–4 per Objective; quantitative; verifiable; not a to-do list
- Stretch but not fantasy; label confidence
- Align to North Star, strategy pillars, and initiatives
- Explicitly separate from KPIs (health metrics live in `define-kpis`)

## Template (repeat per Objective)

```
### O#: <objective>
Why: <link to pillar / North Star>
KR1: <metric> from <baseline> → <target> by <date>
KR2: …
Owner: <role>
Initiatives that feed this: <names>
```

## Levels

Fill what applies: Company → Product/Squad → optional Team. Use `goal-cascade` for full alignment map.

## Persist

Write `DNA/Impressions/product/okrs.md` (include period in H1).

## Output

OKR set + confidence notes + next stem (`define-kpis`, `goal-cascade`, or `roadmap-now-next-later`).
