# DNA session flow

## A. First message in a DNA project

DNA is already active — the user does **not** need to say "use DNA".

1. **Classify intent** — engineering work vs analysis vs Q&A vs ship vs debug (see `AGENTS.md`)
2. Load neuralNetwork + relevant behaviour immediately
3. If task is unclear, ask one focused question
4. **Engineering work** → write `ai/feature-request.md`, start agent loop at Product Analyst
5. **Other intents** → matching DNA CLI path; no 9-role loop for pure Q&A

## B. "Analyze / understand / audit"

1. `npx dna analyze` (and `npx dna scan` if drift matters)
2. Summarize: stack, surfaces, auth, integrations, P1–P3 gaps
3. Recommend ordered next steps (IVF, packs, features)

## C. "Build / add / fix" (feature) — mandatory agent loop

1. Capture quote in `ai/feature-request.md`
2. Execute **all 9 roles** in `ai/agent-loop.md` — Product Analyst through Solution Architect
3. Present architect plan; **wait for approval** — no code before approval
4. After approval: Backend → Frontend → UX → QA → Code Quality → Refactor → Final Release
5. Close: quality PASS → docker → github push

## D. "Ship / push / done"

1. `npx dna quality report --feature` — must PASS
2. `npx dna docker build`
3. `npx dna github push`
4. Confirm CI/preview triggered

## E. "Debug / production error"

1. Check `.DNA/data/runtime.db` / dashboard: `npx dna dashboard`
2. Classify against Behaviour + Immune System
3. If fix requires code changes → **agent loop** (capture in `ai/feature-request.md`)
4. Fix → test → quality → push
5. Optional: `npx dna ai repair` (human review only)

## F. "Compliance / GDPR / HIPAA"

1. `npx dna compliance list`
2. `npx dna plan compliance` with tier + frameworks
3. Install packs; implement; document in Impressions

## G. "Legal / banking / healthcare / PDPA / jurisdiction"

1. `npx dna legal advise --quote "..."`
2. `npx dna plan legal` with domains + jurisdictions
3. Install `legal/regions/*` packs; read `.DNA/workflows/legal.workflow.md`
4. Pair with `npx dna plan compliance` for control frameworks
5. Load `npx dna context legal` before implementing regulated features
