> **DNA Prompt Stem:** `upgrade-modernization` — read `.DNA/stems/upgrade-modernization/` (all files) before proceeding.

# Upgrade modernization

Turn leverage candidates into a sequenced modernization path.

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

Load `upgrade-leverage-map.md` if present; otherwise run scoring inline.

## Sequencing model

| Wave | Intent | Rules |
|------|--------|-------|
| **Wave 0 — Truth** | Docs/Impressions/memory match code | Unblocks every later decision |
| **Wave 1 — Quick wins** | High leverage, low risk | Ship in days; reuse patterns |
| **Wave 2 — Platform** | Shared capability that multiplies features | Thin interface; strangler around old path |
| **Wave 3 — Later** | High effort or speculative | Park with trigger to pull forward |

For each item: dependency, rollback, reuse target (existing module), success signal.

## Persist

`DNA/Impressions/product/upgrade-modernization.md`

## Output

Wave plan + risks + next `upgrade-recommend` or `shape-feature` for Wave 1 item #1. No code.
