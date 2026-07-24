---
description: Top upgrade recommendations with why, evidence, effort, and handoff into shape-feature — major impact, minimal effort.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Upgrade recommend

Synthesize the product-intel ladder into **actionable** upgrade recommendations.

Focus: $ARGUMENTS

## Evidence bootstrap (mandatory — run first)

```bash
npx dna analyze
npx dna scan
```

Then load (skip nothing that exists):

1. **Code** — package manifests, app entrypoints, routes/APIs, tests, config
2. **CellularMemory** — `.DNA/CellularMemory/parietalLobe/system-map.md`, `prefrontalCortex/decisions.md`, `amygdala/blockers.md`, debt / repeated-failures / previous-solutions
3. **Docs** — README, CHANGELOG, `DNA/Impressions/architecture/` **only if non-stub**
4. **Product Impressions** — if stub/placeholder → note `STUB` and do not cite as evidence

If architecture Impressions are missing or stubby:

```bash
npx dna document --from-code
```

## Stub test

For each Impression you open: if it is empty, "TODO", or could belong to any product → mark **STUB** and ground in code/memory instead. After analysis, **write** the real artifact.

Prefer existing artifacts: product-diagnose, swot, competitor-*, kano, upgrade-leverage-map, upgrade-modernization.

## Deliver top 5 recommendations

For each:

1. **Change** — outcome-shaped (not "refactor everything")
2. **Why now** — weakness, parity gap, must-be, or positioning trap
3. **Evidence** — paths / debt / matrix
4. **Impact / Effort** — H/M/L
5. **Minimal approach** — smallest slice that unlocks the outcome
6. **Risks**
7. **Next stem** — usually `shape-feature` (then plan-feature / agent-loop with **approval gate**)

## Rules

- Order by leverage (impact ÷ effort), not by excitement
- Refuse recommendations that ignore active blockers if they are prerequisites
- If Impressions were stubs at start, include at least one "make truth durable" recommendation if still open

## Persist

`DNA/Impressions/product/upgrade-recommendations.md`

## Output

Ranked top 5 + explicitly not recommended + reminder: **no code until Solution Architect plan is approved**.
