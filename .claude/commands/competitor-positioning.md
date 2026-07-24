---
description: Positioning statement and perceptual map — our proof points from architecture; competitor placement labeled.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Competitor positioning

Produce a crisp positioning statement and map.

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

## Deliverables

1. **Positioning statement** — For [ICP] who [job], [product] is [category] that [key benefit]. Unlike [alternative], we [proof from architecture].
2. **Proof points** — 3–5 claims each backed by a path or mechanism in-repo
3. **Perceptual map** — place us + alternatives on 2 axes from landscape
4. **Traps** — messaging we must not use because code does not support it yet
5. **Moves** — product changes that would unlock stronger positioning (feed upgrade stems)

## Persist

`DNA/Impressions/product/competitor-positioning.md`

## Output

Statement + map + traps + next `upgrade-recommend`.
