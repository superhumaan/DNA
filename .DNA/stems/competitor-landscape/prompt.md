> **DNA Prompt Stem:** `competitor-landscape` — read `.DNA/stems/competitor-landscape/` (all files) before proceeding.

# Competitor landscape

Map the competitive field for THIS product. Our capabilities come from code; theirs from named research or **assumptions**.

Scope / known competitors: $ARGUMENTS

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

## Landscape

1. **Category** — one sentence (what buying decision are we in?)
2. **Alternatives** — direct / indirect / substitute / **do-nothing**
3. **Axes** — 2–3 positioning dimensions that matter (e.g. agent-native vs IDE plugin; OSS vs closed)
4. **Players** — table: name · type · hypothesized position · evidence level (known / assumed)
5. **Our position** — where code + purpose-audit place us on those axes
6. **White space** — opportunities (assumption-labeled)

## Research rule

- If user named competitors or asked for web research → use tools and cite sources
- Otherwise → category reasoning + ask one clarifying question for missing names
- Never invent pricing, ARR, or feature checklists for competitors

## Persist

`DNA/Impressions/product/competitor-landscape.md`

## Output

Landscape + our position + next `competitor-feature-matrix` or `competitor-positioning`.
