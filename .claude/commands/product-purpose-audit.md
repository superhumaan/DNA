---
description: Derive Why / How / What and jobs-to-be-done from real surfaces in the codebase — not from stub canvases.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Product purpose audit

Derive purpose and jobs from what the system **does**, not what stub docs claim.

Context: $ARGUMENTS

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

## Method (Golden Circle + JTBD)

| Layer | Derive from |
|-------|-------------|
| **What** | Shipable surfaces: apps, CLIs, APIs, admin, docs sites — list with paths |
| **How** | Distinctive mechanisms in code (packs, runtime, gates, marketplace, etc.) |
| **Why** | Belief implied by architecture bets + README mission — mark if inferred |
| **Jobs** | End-to-end user jobs completable today (trigger → action → outcome) |
| **Non-jobs** | What the architecture refuses (non-goals evidenced by absence or guards) |

## Rules

- Every What item needs a path or package
- Why must not be a feature list; if unclear, write candidate Why + validation question
- Cross-check existing `golden-circle.md` / `product-canvas.md` — overwrite stubs; reconcile conflicts with code winning

## Persist

- `DNA/Impressions/product/purpose-audit.md`
- Update `DNA/Impressions/product/golden-circle.md` if stub or drifted
- Optionally refresh product-canvas one-liner + jobs rows

## Output

1. Why / How / What table with evidence
2. JTBD table (job · current support · gap)
3. Stub files replaced
4. Next: `product-swot` or `product-diagnose`
