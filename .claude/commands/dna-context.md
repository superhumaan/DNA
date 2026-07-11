---
description: Generate AI-ready context for a domain (cursor, claude, security, qa, etc.).
argument-hint: <target>
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: DNA Context

> Slash: `/dna-context` · Category: **Analysis**

## Purpose

Emit focused domain context for AI tools — loads neuralNetwork routes to knowledge, behaviour, and memory.

## When to use

- Brownfield onboarding
- Architecture review
- Before planning IVF or compliance

## When NOT to use

- When the user only wants a single file explained — use Read/Grep instead

## Prerequisites

- DNA installed (`dna init` or `dna doctor`) for full gap analysis

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Prioritize P1 gaps over P3 in recommendations

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never recommend a full rewrite when IVF phased migration is available

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna context $ARGUMENTS
```

**Argument hint:** `<target>`


## Output interpretation

| Section | Meaning |
|---------|---------|
| Targets | cursor, claude, backend, frontend, security, qa, compliance, legal, ivf, all, etc. |

## Exit codes

- **0** — Analysis complete

## Files touched

- DNA/Impressions/
- .DNA/CellularMemory/

## After running

Use the generated context in this session — load relevant `.DNA/knowledge/` paths it references.

## Related slash commands

- `/dna-analyze`
- `/dna-validate`

## Examples

### Security work

```bash
npx dna context security
```

**Then:** Apply output to current session before editing auth code

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS