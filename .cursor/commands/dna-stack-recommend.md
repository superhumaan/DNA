# DNA Command: Stack Recommend

> Slash: `/dna-stack-recommend` · Category: **Stack**

## Purpose

Recommend a stack archetype for this project.

## When to use

- Stack conflicts detected
- New project archetype selection

## When NOT to use

- When stack is validated and documented

## Prerequisites

- package.json and lockfile present

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Resolve archetype conflicts before adding new frameworks

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never mix incompatible archetypes (e.g. Next.js + Vite app roots)

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna stack recommend
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| Conflicts | Technologies that violate chosen archetype |

## Exit codes

- **0** — Stack report generated

## Files touched

- .DNA/config.dna.json

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna stack recommend
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