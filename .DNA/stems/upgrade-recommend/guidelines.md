# Guidelines

## MUST
- Run DNA CLI analyze/scan before drafting strategy or product diagnosis
- Load CellularMemory (decisions, blockers, system-map, failures/solutions) before claims
- Apply Impression Guard — stub/placeholder Impressions are EMPTY, not truth
- Emit diagnosis / competitor / upgrades artifacts (or explicitly defer with reason)
- End orchestrator stems with STRATEGY_COMPLETE JSON handoff; do not mutate application code
- Run evidence bootstrap before drafting: `npx dna analyze` and `npx dna scan` (add `npx dna document --from-code` when architecture docs are missing or stubby)
- Load `.DNA/neuralNetwork.json`, CellularMemory (system-map, decisions, blockers, debt, repeated failures/patterns), README, CHANGELOG, and real package/app entrypoints
- Treat DNA Impressions as stubs until proven otherwise — if a file is placeholder, empty, or generic boilerplate, say so and ground elsewhere
- Cite concrete evidence (paths, packages, routes, APIs, tests, debt notes) for every strength, weakness, and upgrade claim
- Label market, competitor, and user claims without primary research as **assumptions**
- Persist filled artifacts under `DNA/Impressions/product/` so stubs become real project truth
- Stay at product/competitive/upgrade altitude — hand off via `shape-feature` / agent-loop; do not implement code from these stems
- Hand off implementation only via shape-feature / plan-feature — state the approval gate

## SHOULD
- Label market/competitor claims without research as assumptions
- Prefer strangler/thin-slice upgrades tied to real debt
- List which Impression stubs were replaced with real artifacts
- Prefer thin-slice / strangler upgrades that reuse existing patterns in-repo
- Score effort × impact with explicit rationale (files touched, risk, reuse)
- End every stem with next stem in the product-intel ladder and open questions
- When Impressions were stubs, list which files you created or replaced

## NEVER
- Treat stub or template Impressions as product or market truth
- Skip grounding and invent strategy, competitors, or metrics
- Start the 9-role agent loop or edit product application code from strategy/diagnose stems
- Claim STRATEGY_COMPLETE without listing artifact paths or explicit deferrals
- Treat stub or template Impressions as product truth
- Invent competitor features, pricing, market share, or metrics — research or label as assumption
- Give upgrade advice without tying it to architecture evidence or known debt
- Start the 9-role agent loop or edit product application code from these stems
- Produce generic SWOT / competitor / roadmap text that could apply to any SaaS
- Write Solution Architect implementation plans or patches in this stem
