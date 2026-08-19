# Delivery Pipeline Workflow

## On every change

1. Implement with feature factory roles
2. Local gates: lint, test, coverage >= 80%, `dna quality report --feature`, `dna docker build`
3. `dna github push` — **current trunk / user-chosen branch** (default: no auto `feature/*` hop)
4. CI runs DNA CI (+ preview workflows when hosting supports them) on that push
5. Fix any failures — bug loop until green on the **same** line of work

## Never

- Invent parallel remotes or hop branches to "test on preview"
- Dual-track the same feature across multiple feature branches

## On runtime error

1. Classified in `.DNA/data/runtime.db`
2. GitHub issue (if high/critical)
3. AI repair drafts PR (if enabled + API key)
4. Human review → merge → redeploy
