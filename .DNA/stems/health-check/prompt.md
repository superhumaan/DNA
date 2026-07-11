> **DNA Prompt Stem:** `health-check` — read `.DNA/stems/health-check/` (all files) before proceeding.

# DNA health check

Verify DNA scaffolding and behaviour compliance.

Scope: $ARGUMENTS

## Run

```bash
npx dna doctor
npx dna validate
npx dna update --check-only
```

Doctor repairs scaffolding; `dna update` upgrades the CLI and refreshes prompt stems from dna.humaan.app.

## Report

For each check: ✓ or ✗ in plain English. Fix gaps (hooks, workflows, rules) when doctor repairs them. Re-run if needed.
