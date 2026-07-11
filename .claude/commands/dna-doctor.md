---
description: Scaffold, repair, and health-check DNA in this project.
argument-hint: [--check-only]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: DNA Doctor

> Slash: `/dna-doctor` · Category: **Core**

## Purpose

Single orchestrator for DNA health: scaffold missing files, refresh CI/Docker/hooks, wire runtime, refresh AI rules, and install slash commands.

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
npx dna doctor
```

## Flags

| Flag | Description |
|------|-------------|
| `--check-only` | Report only — no fixes, no browser GitHub login |
| `--ivf` | Run brownfield IVF pipeline when legacy project detected |
| `--quote <text>` | IVF integration quote |

**Argument hint:** `[--check-only]`


## Output interpretation

| Section | Meaning |
|---------|---------|
| DNA Doctor checks | ✓ = healthy; ✗ = missing or broken — doctor attempts repair unless --check-only |
| Doctor actions | Files created/updated during this run |
| Validation | Behaviour validation issue count |

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

Summarize ✓/✗ checks, doctor actions taken, and any remaining fixes (especially git hooks and CI workflows).

## Related slash commands

- `/dna-init`
- `/dna-commands-install`
- `/dna-feature-factory-install`
- `/dna-ci-install`

## Typical workflows

- dna doctor → dna analyze → dna plan ivf (brownfield)
- dna doctor → dna feature (new work)

## Examples

### First clone

```bash
npx dna doctor
```

**Then:** Run npm install if package.json changed; verify git hooks

### Audit only

```bash
npx dna doctor --check-only
```

**Then:** List ✗ items without fixing

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS