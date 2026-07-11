# Delivery Pipeline Workflow

## On every change

1. Implement with feature factory roles
2. Local gates: lint, test, coverage >= 80%, `dna quality report --feature`, `dna docker build`
3. `dna github push` — feature branch to GitHub
4. CI runs DNA CI + DNA Preview workflows
5. Fix any failures — bug loop until green

## On runtime error

1. Classified in `.DNA/data/runtime.db`
2. GitHub issue (if high/critical)
3. AI repair drafts PR (if enabled + API key)
4. Human review → merge → redeploy preview
