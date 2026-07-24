---
description: Value Proposition Canvas — customer jobs/pains/gains vs what the product actually delivers in code.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Product value proposition

Value Proposition Canvas for THIS product — products & services must map to real surfaces.

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

## Canvas

**Customer profile (jobs / pains / gains)** — from ICP in README/Impressions if non-stub; else infer from who the UX/CLI addresses; label inferences.

**Value map**

| Block | Fill with evidence |
|-------|-------------------|
| Products & services | Packages, apps, commands that exist |
| Pain relievers | How code removes specific pains |
| Gain creators | How code creates specific gains |
| Fit gaps | Pains with no reliever; services with no job |

## Persist

`DNA/Impressions/product/value-proposition.md`

## Output

Filled canvas + worst fit gaps + next stem (`product-kano-scan` or `upgrade-recommend`).
