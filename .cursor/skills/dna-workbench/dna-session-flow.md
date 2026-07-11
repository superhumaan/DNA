# DNA session flow

## A. First message in a DNA project

1. Acknowledge DNA is active (no lecture).
2. If task is unclear, ask one focused question.
3. Load neuralNetwork + relevant behaviour.
4. Proceed.

## B. "Analyze / understand / audit"

1. `npx dna analyze` (and `npx dna scan` if drift matters)
2. Summarize: stack, surfaces, auth, integrations, P1–P3 gaps
3. Recommend ordered next steps (IVF, packs, features)

## C. "Build / add / fix" (feature)

1. Capture quote in `ai/feature-request.md`
2. Run agent-loop through Solution Architect
3. Present plan; **wait**
4. Implement with role discipline
5. Close: quality → docker → github push

## D. "Ship / push / done"

1. `npx dna quality report --feature` — must PASS
2. `npx dna docker build`
3. `npx dna github push`
4. Confirm CI/preview triggered

## E. "Debug / production error"

1. Check `.DNA/data/runtime.db` / dashboard: `npx dna dashboard`
2. Classify against Behaviour + Immune System
3. Fix → test → quality → push
4. Optional: `npx dna ai repair` (human review only)

## F. "Compliance / GDPR / HIPAA"

1. `npx dna compliance list`
2. `npx dna plan compliance` with tier + frameworks
3. Install packs; implement; document in Impressions
