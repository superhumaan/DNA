# DNA Command: Quality Report

> Slash: `/dna-quality-report` · Category: **Quality**

## Purpose

Local SonarQube-style gate — security, reliability, maintainability, coverage, and toolchain checks. No SonarQube server.

## When to use

- Before marking any feature complete
- Before `git push`
- After significant code changes

## When NOT to use

- Exploratory spikes the user will discard

## Prerequisites

- Lint and test scripts in package.json when toolchain checks are enabled

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Treat FAIL as a hard stop — fix blockers and criticals
- **MUST** Read `.DNA/reports/quality/latest.md` when report mode

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never waive security blockers without explicit user sign-off

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna quality report --feature
```

## Flags

| Flag | Description |
|------|-------------|
| `--feature` | Scope to git-changed files (feature factory default) |
| `--paths` | Specific files to scan |
| `--json` | Machine-readable output |

**Argument hint:** `[--paths <files>]`


## Output interpretation

| Section | Meaning |
|---------|---------|
| PASS | No blocker or critical issues — may proceed to push |
| FAIL | Fix listed issues and re-run until PASS |

## Exit codes

- **0** — Gate PASS
- **1** — Gate FAIL

## Files touched

- .DNA/reports/quality/

## After running

Report PASS/FAIL, blocker/critical issues, and path to `.DNA/reports/quality/`. Fix blockers before marking work complete.

## Related slash commands

- `/dna-quality-scan`
- `/dna-docker-build`
- `/dna-github-push`

## Examples

### Feature close-out

```bash
npx dna quality report --feature
```

**Then:** Fix FAIL items; then docker build and github push

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS