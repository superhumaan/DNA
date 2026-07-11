---
description: List available knowledge packs.
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: Marketplace List

> Slash: `/dna-marketplace-list` · Category: **Marketplace**

## Purpose

List available knowledge packs.

## When to use

- Need stack, compliance, or vertical knowledge packs

## When NOT to use

- When pack is already installed — check `.DNA/config.dna.json` first

## Prerequisites

- Network for remote catalog; bundled fallback works offline

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Record installed pack IDs in config after install

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never hand-edit files under `.DNA/knowledge/` when reinstalling packs

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna marketplace list
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| packId | Install path like `frameworks/nextjs` or `compliance/gdpr` |

## Exit codes

- **0** — Catalog or install succeeded

## Files touched

- .DNA/knowledge/
- .DNA/config.dna.json

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna marketplace list
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