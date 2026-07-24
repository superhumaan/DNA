> **DNA Prompt Stem:** `product-kano-scan` — read `.DNA/stems/product-kano-scan/` (all files) before proceeding.

# Product Kano scan

Classify product capabilities with the Kano model — grounded in shipped reality.

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

## Categories

| Category | Meaning | How to detect in-repo |
|----------|---------|----------------------|
| **Must-be** | Expected; absence angers | Core flows broken/missing; baseline hygiene (auth, install, docs) |
| **Performance** | More → more satisfaction | Speed, coverage, depth of packs, Lab insight quality |
| **Delighters** | Unexpected joy | Unique mechanisms competitors lack (cite assumption if comparing) |
| **Indifferent / reverse** | Low value or annoyance | Dead features, noise, ceremony without payoff |

## Persist

`DNA/Impressions/product/kano.md`

## Output

1. Table: capability · Kano class · evidence · upgrade implication
2. Must-be failures to fix first (often cheapest trust wins)
3. Delighters to double down on
4. Next: `upgrade-leverage-map`
