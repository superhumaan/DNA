---
description: Orchestrate purpose → SWOT → value → JTBD from real architecture and debt, then hand off to competitor and upgrade stems.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Product diagnose

Run the product-intelligence ladder for THIS repo. Scope: $ARGUMENTS

## Grounding & Verification (mandatory — before strategy)

Execute in order. Do **not** invent product strategy from stub Impressions.

### 1. DNA CLI (structural truth)

```bash
npx dna analyze
npx dna scan
```

Optional when architecture docs are missing/stubby: `npx dna document --from-code`

### 2. CellularMemory (system history)

Load `.DNA/CellularMemory/` — especially `prefrontalCortex/decisions.md`, `amygdala/blockers.md`, `parietalLobe/system-map.md`, repeated-failures / previous-solutions.

### 3. Impression Guard

For each file under `DNA/Impressions/` you open:
- If empty, TODO, placeholder, or generic boilerplate that could belong to any product → mark **EMPTY_STUB_RESOLVED**
- Do **not** cite stubs as evidence
- Ground in code + CellularMemory instead; then **write** real artifacts

### Artifacts (strategy / diagnose outputs)

| Artifact | Path | Contents |
|----------|------|----------|
| Diagnosis | `./artifacts/diagnosis.md` or `DNA/Impressions/product/product-diagnose.md` | Debt ledger + friction |
| Competitor map | `./artifacts/competitor_map.md` or Impressions competitor docs | Capability delta |
| Upgrades | `./artifacts/upgrades.md` or upgrade-* Impressions | High-leverage targets + risk |

### Handoff — do not mutate application code

When the strategy/diagnose pass is done, emit:

```json
{
  "status": "STRATEGY_COMPLETE",
  "source_stem": "<this-stem-id>",
  "context_grounding": {
    "dna_checksum": "sha256_or_analyze_summary",
    "cellular_memory_epoch": "decisions-or-recent-changes-date",
    "impressions_state": "EMPTY_STUB_RESOLVED | PARTIAL | GROUNDED"
  },
  "artifacts": {
    "diagnostic_path": "…",
    "competitor_path": "…",
    "upgrade_path": "…"
  },
  "next_step": "TRIGGER_FEATURE_FACTORY"
}
```

Then hand off via `shape-feature` / agent-loop — **no** app code edits from this stem.


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
6. **Handoff** — Next: `competitor-landscape` then `upgrade-leverage-map` / `upgrade-recommend`. Emit `STRATEGY_COMPLETE` when the diagnose→upgrade ladder for this pass is done.

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

End with: next stem + 3 open questions + `STRATEGY_COMPLETE` JSON when ready for Feature Factory. No code. No feature factory yet.
