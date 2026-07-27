> **DNA Prompt Stem:** `strategy-ladder` — read `.DNA/stems/strategy-ladder/` (all files) before proceeding.

# Strategy ladder

Walk purpose → strategy → goals/metrics → product → initiatives → features → roadmap for this project.

Scope: $ARGUMENTS

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


## Altitude order (do not skip upward without cause)

1. **Golden Circle** — Why / How / What
2. **Business strategy canvas** — pillars, positioning, bets
3. **Product canvas** — users, problems, value, metrics
4. **Product diagnose** (optional deepen) — purpose/SWOT/jobs from code + debt when Impressions are stubs — `product-diagnose`
5. **North Star metric** — single primary product success signal
6. **Define OKRs** — Objectives + Key Results for the period
7. **Define KPIs** — health / operational metrics (distinct from OKRs)
8. **Goal cascade** — company → team → initiative alignment
9. **Define initiative** — outcome-shaped bets
10. **Define product** — scope, ICP, non-goals
11. **Shape feature** — brief ready for feature factory
12. **Roadmap Now / Next / Later** — horizon plan
13. **Upgrade recommend** (optional) — high-leverage changes from competitor + debt — `upgrade-recommend`

## Run

```bash
npx dna context cursor
```

Load Impressions under `DNA/Impressions/product/` and any strategy notes. Reuse what exists; fill gaps only.

## Output

For each rung: short filled artifact path + 3–7 bullets. End with:

- Recommended next stem if the user wants to go deeper on one rung
- Open assumptions needing discovery
- Reminder: engineering starts only after `shape-feature` → `plan-feature` / agent-loop with approval
- Emit `STRATEGY_COMPLETE` JSON (see Grounding section) before any Feature Factory handoff
