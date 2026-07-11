---
description: Import CellularMemory from an export file.
argument-hint: <file>
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: Memory Import

> Slash: `/dna-memory-import` · Category: **Memory**

## Purpose

Import CellularMemory from an export file.

## When to use

- Sharing CellularMemory across repos
- Backup before major refactor

## When NOT to use

- Replacing git history or Impressions docs

## Prerequisites

- DNA CellularMemory scaffolded

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Use `--merge` on import unless user requested full replace

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never commit export files with secrets from runtime events

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna memory import $ARGUMENTS --merge
```

## Flags

| Flag | Description |
|------|-------------|
| `<file>` | See CLI reference |

**Argument hint:** `<file>`


## Output interpretation

| Section | Meaning |
|---------|---------|
| Segments | Seven memory regions exported as JSON |

## Exit codes

- **0** — Export/import succeeded

## Files touched

- .DNA/CellularMemory/
- .DNA/exports/

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna memory import  --merge
```

**Then:** Summarize output and recommend next command.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS