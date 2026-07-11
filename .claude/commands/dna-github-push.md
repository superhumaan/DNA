---
description: Commit and push the current feature branch to GitHub.
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: GitHub Push

> Slash: `/dna-github-push` · Category: **Delivery**

## Purpose

Commit and push current feature branch — feature factory mandatory close-out step.

## When to use

- Feature factory close-out
- CI missing or broken
- Preparing preview deploy

## When NOT to use

- Mid-implementation before quality gate passes

## Prerequisites

- Docker installed for `docker build`
- GitHub auth for `github push`

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Ensure pre-push hook runs `dna quality report` on every push
- **MUST** Confirm quality gate PASS before push unless user explicitly overrides

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never push with failing quality gate unless user explicitly overrides

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna github push
```

## Flags

| Flag | Description |
|------|-------------|
| `--message` | Commit message |
| `--branch` | Branch name |
| `--create-branch` | Create branch if missing |

## Output interpretation

| Section | Meaning |
|---------|---------|
| Workflow files | Created under `.github/workflows/` |

## Exit codes

- **0** — Delivery step succeeded
- **1** — Build or auth failed

## Files touched

- .github/workflows/
- Dockerfile
- .DNA/hooks/pre-push

## After running

Confirm branch pushed and CI triggered. Never force-push main.

## Related slash commands

- `/dna-quality-report`
- `/dna-github-login`

## Examples

### Default invocation

```bash
npx dna github push
```

**Then:** Confirm branch pushed and CI triggered. Never force-push main.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS