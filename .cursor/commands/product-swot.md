> **DNA Prompt Stem:** `product-swot` — read `.DNA/stems/product-swot/` (all files) before proceeding.

# Product SWOT

Build a SWOT that would embarrass a stub canvas.

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

## Quadrants

| Quadrant | Source of truth | Rules |
|----------|-----------------|-------|
| **Strengths** | Code, tests, delivery, unique mechanisms | Must cite path/package/CLI finding |
| **Weaknesses** | Debt, blockers, missing tests, stub docs, UX gaps, fragility | Must cite memory or code smell |
| **Opportunities** | Competitor gaps, unmet jobs, platform leverage | Label **assumption** unless evidenced |
| **Threats** | Market, dependency, compliance, talent, platform risk | Label **assumption** unless evidenced |

## Persist

Write `DNA/Impressions/product/swot.md`.

## Output

1. Four tables (item · evidence · confidence)
2. Top 3 weaknesses that block major upgrades
3. Top 3 strengths to lean on for low-effort wins
4. Next: `competitor-landscape` or `upgrade-leverage-map`
