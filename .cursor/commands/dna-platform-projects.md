# DNA Command: Platform Projects

> Slash: `/dna-platform-projects` · Category: **Platform**

## Purpose

List reference production projects (aistudio, colorparty, humaan, soli).

## When to use

- Implementing Humaan production patterns
- Scoping admin portal, SSO, audit logging

## When NOT to use

- Greenfield with no platform feature overlap

## Prerequisites

- Reference projects available for context

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Cross-check with `dna platform project <id>` before planning

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna platform projects
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| featureId | Platform feature slug from catalog |

## Exit codes

- **0** — Catalog displayed

## Files touched

- .DNA/knowledge/platforms/

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna platform projects
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