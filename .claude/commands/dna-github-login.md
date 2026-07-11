---
description: Sign in to GitHub via browser (web flow).
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: GitHub Login

> Slash: `/dna-github-login` · Category: **Delivery**

## Purpose

Sign in to GitHub via browser (web flow).

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

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never push with failing quality gate unless user explicitly overrides

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna github login
```

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

Confirm authentication succeeded for subsequent `dna github push` and issue automation.

## Examples

### Default invocation

```bash
npx dna github login
```

**Then:** Confirm authentication succeeded for subsequent `dna github push` and issue automation.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS