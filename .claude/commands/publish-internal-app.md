---
description: Publish an internal app with the repository's existing publish script and a dry run first.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Publish internal app

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.

## Preconditions

Find the publish script and host config **already in this repository** (package scripts, docs, or deploy config). If none exist, **stop**. Do not invent a host name, a new script, or a second deploy path.

## Checklist

- [ ] Publish command cited by path or script name from this repo
- [ ] Dry run first; paste the dry-run result, not a guessed success
- [ ] Target environment comes from this repo's config or the user's argument
- [ ] Env values come from the example file; real secrets stay out of git and out of the reply
- [ ] Build artifact matches what the script expects
- [ ] After a real publish, record the URL or release id the script printed
- [ ] Rollback is the script's existing rollback, or "none" if the repo has no rollback

## Artifacts

| Artifact | Path |
|----------|------|
| Publish record | `.DNA/plans/internal-publish.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No publish script | Stop |
| Dry run fails | Do not run the real publish |
| Secret missing | Name the variable; stop |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
