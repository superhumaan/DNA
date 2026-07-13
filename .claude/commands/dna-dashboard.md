---
description: Start DNA Lab — local observability at /labs (alias: dna dashboard).
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: DNA Lab

> Slash: `/dna-dashboard` · Category: **Core**

## Purpose

Start DNA Lab — local observability at /labs (alias: dna dashboard).

## When to use

- Project health is unknown
- After cloning a DNA-enabled repo
- Before major feature work

## When NOT to use

- When `--check-only` was requested and fixes are explicitly forbidden

## Prerequisites

- Project root with `package.json` or DNA already partially installed

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Report every ✓ and ✗ line from doctor-style output literally

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never disable DNA hooks or CI to 'fix' a failing gate without user approval

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna lab serve --port 3200
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| Checks | Each line is pass/fail for a DNA subsystem |

## Exit codes

- **0** — Success or acceptable validation warnings
- **1** — Validation failed — fix before proceeding

## Files touched

- .DNA/
- DNA/Impressions/
- .cursor/
- .claude/
- .github/workflows/

## After running

Tell the user the URL (http://localhost:3200/labs). Localhost has no login; production uses register lab pairing.

## Examples

### Default invocation

```bash
npx dna lab serve --port 3200
```

**Then:** Tell the user the URL (http://localhost:3200/labs). Localhost has no login; production uses register lab pairing.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS