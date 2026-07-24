> **DNA Prompt Stem:** `upgrade-leverage-map` — read `.DNA/stems/upgrade-leverage-map/` (all files) before proceeding.

# Upgrade leverage map

Find **major upgrades with minimal effort** — 80/20 moves grounded in debt and competitive gaps.

Scope: $ARGUMENTS

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

Also load (if present): swot.md, competitor-feature-matrix.md, kano.md, blockers, repeated-failures, previous-solutions.

## Scoring

For each candidate change:

| Field | Rule |
|-------|------|
| **Outcome** | User/business state change — not a task name |
| **Why** | Tie to weakness, parity gap, or must-be failure |
| **Evidence** | Paths / debt / matrix cells |
| **Impact** | H / M / L + rationale |
| **Effort** | H / M / L — files, risk, reuse of existing patterns |
| **Leverage** | Prefer high impact + low/medium effort |
| **Approach** | Thin-slice / strangler / config-only / docs-truth |

## Quadrants

Place 8–12 candidates on Effort × Impact. Highlight the **leverage cluster** (high impact, low–med effort).

## Persist

`DNA/Impressions/product/upgrade-leverage-map.md`

## Output

1. Scored table
2. Top leverage cluster (3–5)
3. Explicitly deferred high-effort items
4. Next: `upgrade-modernization` (sequence) or `upgrade-recommend` (top picks)
