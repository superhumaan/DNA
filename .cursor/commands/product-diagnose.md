> **DNA Prompt Stem:** `product-diagnose` — read `.DNA/stems/product-diagnose/` (all files) before proceeding.

# Product diagnose

Run the product-intelligence ladder for THIS repo. Scope: $ARGUMENTS

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

## Ladder (do in order — short, evidence-backed sections)

1. **Purpose** — What the product is for (from surfaces that exist in code). Optionally deepen with `product-purpose-audit`.
2. **Strengths / weaknesses** — Architecture, UX surfaces, delivery maturity, debt. Optionally deepen with `product-swot`.
3. **Value delivered** — Gains/pains the codebase actually addresses. Optionally `product-value-proposition`.
4. **Jobs** — Top jobs users can complete end-to-end today vs broken/missing.
5. **Confidence** — High / medium / low per claim + what would raise confidence.
6. **Handoff** — Next: `competitor-landscape` then `upgrade-leverage-map` / `upgrade-recommend`.

## Persist

Write `DNA/Impressions/product/product-diagnose.md` (and fill stubs you relied on: purpose, swot, etc.).

## Output format

| Section | Finding | Evidence (path / CLI) | Confidence |
|---------|---------|----------------------|------------|
| Purpose | | | |
| Strengths (3–7) | | | |
| Weaknesses (3–7) | | | |
| Jobs done today | | | |
| Jobs broken/missing | | | |
| Stub Impressions replaced | | | |

End with: next stem + 3 open questions. No code. No feature factory yet.
