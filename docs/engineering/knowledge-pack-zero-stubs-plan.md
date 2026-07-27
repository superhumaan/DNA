# Knowledge pack zero-stubs + strategy grounding (approved plan)

_Approved 2026-07-24. Do not regress._

## Goals

1. **Zero stubs** across ~965 marketplace knowledge packs — jam each with knowledge, diagrams, images, documents, templates, fixtures, examples, references.
2. **Purpose Combos** — one purpose per bundle; install installs linked packs.
3. **Strategy grounding** — no hallucinated product strategy from stub Impressions.

## Pack review structure (canvas)

```
Category
  Subcategory
    Pack row columns:
      Pack | Depth | Files | Chars | Missing docs | Advancements
      | New depth | New files | New chars | New docs
```

Advancements / Missing docs / New docs: **one item per line**.

Use cases:

```
Purpose / use case
  Pack id
  Pack id
  …
```

## Pack richness bar

| Layer | Minimum |
|-------|---------|
| Docs | positioning, architecture, integration, checklist, examples, anti-patterns, references (≥8 files) |
| Diagrams | ≥3 Mermaid + SVG/PNG |
| Images | ≥2 with captions |
| Documents/templates | ≥2 filled (no blank shells) |
| Fixtures | JSON/YAML/OpenAPI/seeds |
| References | ≥3 GitHub repos + official docs |
| P0 depth | ≥12k chars; stub rate target **0%** |

### Richness CI (Wave 1–2 + long-tail)

- Helper: `packages/dna-core/src/marketplace/pack-richness.ts` (`p0Depth`, `longtailDepth`, `liftPackToRichness`, `finalizeCatalogPacks`)
- Floor: every marketplace pack ≥16 files / ≥4k chars (`LONGTAIL_MIN_CHARS`)
- P0: ≥12k chars (`P0_MIN_CHARS`) via `meetsP0DepthBar`
- Gates: `pack-richness-gate.test.ts`, `longtail-richness-gate.test.ts`
- Wave factory: `packsFromDefs` emits rich packs (no 4-file stubs)
- Assembly: `PACKS = finalizeCatalogPacks(PACKS_RAW)` in `bundled-catalog-packs.ts`

### Strategy grounding

- Shared contract: `packages/dna-core/src/generators/prompt-stem-packs/strategy-grounding.ts`
- Wired into `strategy-ladder` + `product-diagnose` (Impression Guard + `STRATEGY_COMPLETE`)

## Purpose Combos

- **Required** — always install with the combo
- **Preferred** — default on
- **Recommended** — suggested
- Precedent: `healthcare-country-bundles.ts` + `installKnowledgePackById` bundle install

## Strategy stem operational blueprint

### Phase 1 — Grounding & Verification

1. DNA CLI — structural truth (blueprint, types, file tree)
2. CellularMemory — history, debt, modifications
3. Impression Guard — if Impression matches stub schema → clear & mark EMPTY; else pass through

### Phase 2 — Diagnostic & Strategy Artifacts

1. Product Diagnosis → `diagnosis.md` (debt ledger + friction analysis)
2. Competitor Mapping → `competitor_map.md` (capability delta + integration vectors)
3. Architectural Upgrades → `upgrades.md` (high-leverage targets + prerequisites/risk)

### Phase 3 — Chaining Pipeline

Package artifacts → `STRATEGY_COMPLETE` handoff → Feature Factory.  
Strategy stem does **not** mutate application code.

### Handoff payload shape

```json
{
  "status": "STRATEGY_COMPLETE",
  "source_stem": "architect_strategy_v2",
  "context_grounding": {
    "dna_checksum": "sha256_…",
    "cellular_memory_epoch": 0,
    "impressions_state": "EMPTY_STUB_RESOLVED"
  },
  "artifacts": {
    "diagnostic_path": "./artifacts/diagnosis.md",
    "competitor_path": "./artifacts/competitor_map.md",
    "upgrade_path": "./artifacts/upgrades.md"
  },
  "next_step": "TRIGGER_FEATURE_FACTORY"
}
```

## Enforced stem behaviours

- No code-loop blindness — verify environment before strategy execution
- Grounding first — DNA CLI + CellularMemory at the edge
- Stub deflation — unpopulated Impressions = null/empty
- Isolated strategy stem — analytical engine → markdown → Feature Factory

## Implementation waves

1. Combos + grounding contract + richness CI + P0 pack enrichment start
2. High-traffic platforms
3. Long-tail tiering / dedupe

## Related

- `ai/feature-request.md`
- `.DNA/CellularMemory/prefrontalCortex/current-plan.md`
- Canvas: knowledge-pack-advancement
