> **DNA Prompt Stem:** `competitor-feature-matrix` — read `.DNA/stems/competitor-feature-matrix/` (all files) before proceeding.

# Competitor feature matrix

Build a capability matrix for competitive decisions.

Competitors: $ARGUMENTS

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

## Matrix rules

| Column | Rule |
|--------|------|
| **Capability** | User-valued job or feature theme |
| **Us** | `shipped` / `partial` / `absent` + path evidence |
| **Competitor N** | `yes` / `partial` / `no` / `unknown` + source or **assumption** |
| **Gap type** | parity / differentiate / ignore |

Pick 8–15 capabilities max — from purpose-audit jobs + Kano must-bes + SWOT weaknesses.

## Persist

`DNA/Impressions/product/competitor-feature-matrix.md`

## Output

1. Matrix
2. Parity gaps worth closing (high user value, feasible)
3. Differentiate bets (lean on strengths)
4. Explicit ignore list
5. Next: `upgrade-leverage-map`
