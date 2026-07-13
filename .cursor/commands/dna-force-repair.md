# DNA Force Repair

Run aggressive repair for open runtime blockers.

## When to use

- Same production error keeps recurring (502, crashes, repeated failures)
- `amygdala/blockers.md` has open entries
- `dna ai repair` produced no real code changes

## CLI

```bash
npx dna ai force-repair
npx dna ai force-repair --fingerprint <id>
npx dna ai force-repair --dry-run
```

## Mandatory agent behaviour

1. Read `amygdala/blockers.md`, `repeated-failures.md`, `temporalLobe/previous-solutions.md`
2. Run full 9-role agent loop — no marking complete without code change + test
3. Gateway 502/503/504 → check origin health, deploy, `/health` — not just try/catch
4. Never create duplicate GitHub issues for same fingerprint

## Config

`.DNA/config.dna.json` → `ai.repair.aggressive` (default true)
