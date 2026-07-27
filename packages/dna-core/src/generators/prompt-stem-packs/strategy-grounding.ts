/**
 * Shared strategy grounding — Impression Guard + STRATEGY_COMPLETE handoff.
 * Approved blueprint: docs/engineering/knowledge-pack-zero-stubs-plan.md
 */
import type { StemGuidelines } from "./types.js";

/** Markdown block injected into strategy / product-intel orchestrator stems. */
export const STRATEGY_GROUNDING_MARKDOWN = `## Grounding & Verification (mandatory — before strategy)

Execute in order. Do **not** invent product strategy from stub Impressions.

### 1. DNA CLI (structural truth)

\`\`\`bash
npx dna analyze
npx dna scan
\`\`\`

Optional when architecture docs are missing/stubby: \`npx dna document --from-code\`

### 2. CellularMemory (system history)

Load \`.DNA/CellularMemory/\` — especially \`prefrontalCortex/decisions.md\`, \`amygdala/blockers.md\`, \`parietalLobe/system-map.md\`, repeated-failures / previous-solutions.

### 3. Impression Guard

For each file under \`DNA/Impressions/\` you open:
- If empty, TODO, placeholder, or generic boilerplate that could belong to any product → mark **EMPTY_STUB_RESOLVED**
- Do **not** cite stubs as evidence
- Ground in code + CellularMemory instead; then **write** real artifacts

### Artifacts (strategy / diagnose outputs)

| Artifact | Path | Contents |
|----------|------|----------|
| Diagnosis | \`./artifacts/diagnosis.md\` or \`DNA/Impressions/product/product-diagnose.md\` | Debt ledger + friction |
| Competitor map | \`./artifacts/competitor_map.md\` or Impressions competitor docs | Capability delta |
| Upgrades | \`./artifacts/upgrades.md\` or upgrade-* Impressions | High-leverage targets + risk |

### Handoff — do not mutate application code

When the strategy/diagnose pass is done, emit:

\`\`\`json
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
\`\`\`

Then hand off via \`shape-feature\` / agent-loop — **no** app code edits from this stem.
`;

export const STRATEGY_GROUNDING_GUIDELINES: StemGuidelines = {
  must: [
    "Run DNA CLI analyze/scan before drafting strategy or product diagnosis",
    "Load CellularMemory (decisions, blockers, system-map, failures/solutions) before claims",
    "Apply Impression Guard — stub/placeholder Impressions are EMPTY, not truth",
    "Emit diagnosis / competitor / upgrades artifacts (or explicitly defer with reason)",
    "End orchestrator stems with STRATEGY_COMPLETE JSON handoff; do not mutate application code",
  ],
  never: [
    "Treat stub or template Impressions as product or market truth",
    "Skip grounding and invent strategy, competitors, or metrics",
    "Start the 9-role agent loop or edit product application code from strategy/diagnose stems",
    "Claim STRATEGY_COMPLETE without listing artifact paths or explicit deferrals",
  ],
  should: [
    "Label market/competitor claims without research as assumptions",
    "Prefer strangler/thin-slice upgrades tied to real debt",
    "List which Impression stubs were replaced with real artifacts",
  ],
};

export function mergeGuidelines(
  base: StemGuidelines,
  extra: StemGuidelines,
): StemGuidelines {
  return {
    must: [...new Set([...extra.must, ...base.must])],
    never: [...new Set([...extra.never, ...base.never])],
    should: [...new Set([...(extra.should ?? []), ...(base.should ?? [])])],
  };
}
