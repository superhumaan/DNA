# Guidelines

## MUST
- Run DNA CLI analyze/scan before drafting strategy or product diagnosis
- Load CellularMemory (decisions, blockers, system-map, failures/solutions) before claims
- Apply Impression Guard — stub/placeholder Impressions are EMPTY, not truth
- Emit diagnosis / competitor / upgrades artifacts (or explicitly defer with reason)
- End orchestrator stems with STRATEGY_COMPLETE JSON handoff; do not mutate application code
- Load `.DNA/neuralNetwork.json`, Impressions product/strategy artifacts, and CellularMemory before drafting
- Write durable outputs to `DNA/Impressions/` (and CellularMemory when decisions are made) — not chat-only
- Stay at the intended altitude of the stem — do not jump to code or Solution Architect implementation
- Hand off downstream via workflow stems; end strategy outputs with explicit next stem
- Key Results must be measurable — reject task-shaped KRs ("launch X", "ship Y") unless framed as outcome metrics

## SHOULD
- Label market/competitor claims without research as assumptions
- Prefer strangler/thin-slice upgrades tied to real debt
- List which Impression stubs were replaced with real artifacts
- Reuse existing Impressions content; revise rather than duplicate
- Flag open questions and validation needs for discovery stems
- Keep Now / Next / Later mutually exclusive and outcome-oriented

## NEVER
- Treat stub or template Impressions as product or market truth
- Skip grounding and invent strategy, competitors, or metrics
- Start the 9-role agent loop or edit product application code from strategy/diagnose stems
- Claim STRATEGY_COMPLETE without listing artifact paths or explicit deferrals
- Invent market facts, competitor claims, or metrics without labeling them as assumptions
- Skip Why (purpose) when running golden-circle or strategy-ladder from scratch
- Treat DNA's own docs/product/product-canvas.md as the host project's canvas — build for THIS project
- Start the 9-role agent loop or edit product code from a strategy stem
- Confuse OKRs with KPI dashboards — link to define-kpis for health metrics
- Invent baselines; mark unknown baselines as TBD assumptions
