# DNA Command: Generate Feature

> Slash: `/dna-generate-feature` · Category: **Generate**

## Purpose

Generate code scaffold for a platform feature (e.g. audit-logging).

## When to use

- Platform feature codegen requested
- Audit logging or similar scaffolds

## When NOT to use

- When full feature factory plan is not yet approved

## Prerequisites

- Valid platform feature ID from `dna platform list`

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Review generated scaffold before wiring into production routes

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna generate feature $ARGUMENTS
```

## Flags

| Flag | Description |
|------|-------------|
| `<featureId>` | See CLI reference |

**Argument hint:** `<featureId>`


## Output interpretation

| Section | Meaning |
|---------|---------|
| Created files | Scaffold paths printed by CLI |

## Exit codes

- **0** — Scaffold generated

## Files touched

- src/ or project-specific scaffold paths

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna generate feature
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