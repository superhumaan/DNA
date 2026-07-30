> **DNA Prompt Stem:** `incident-postmortem` — read `.DNA/stems/incident-postmortem/` (all files) before proceeding.

# Incident postmortem

Incident / symptom: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Loop (mandatory)

1. **Observe** — `.DNA/data/runtime.db`, Lab, CI, recent changes
2. **Orient** — blast radius; load blockers + repeated-failures + previous-solutions
3. **Root cause** — falsifiable hypothesis; fix cause not symptoms
4. **Regression** — test that fails without the fix
5. **Quality** — `npx dna quality report --feature` PASS
6. **Push** — preview/feature branch; never auto-merge AI repair PRs
7. **Write-up** — timeline, impact, cause, fix, follow-ups

```bash
npx dna lab serve --port 3200
npx dna ai repair --dry-run
npx dna quality report --feature
```

## Checklist

- [ ] Fingerprint / issue linked (dedupe — comment on existing)
- [ ] Root cause stated with evidence
- [ ] Fix + regression test
- [ ] Quality PASS
- [ ] Push
- [ ] Postmortem artifact

## Artifacts

| Artifact | Path |
|----------|------|
| Postmortem | `.DNA/reports/incidents/<fingerprint-or-date>.md` or `DNA/Impressions/qa/incident-postmortem.md` |
| CellularMemory | Update `temporalLobe/previous-solutions.md` / amygdala as appropriate |

## Failure modes

| Mode | Response |
|------|----------|
| Cannot reproduce | Document attempts; do not fake root cause |
| Duplicate issue | Comment on existing; do not open second |
| Gateway 502/503/504 | Check origin/deploy/health — not only app try/catch |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
