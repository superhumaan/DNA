# DNA Command: IVF Shared Library

> Slash: `/dna-ivf-shared-library` · Category: **IVF**

## Purpose

Shared library extraction — analyze and dry-run.

## When to use

- Existing production codebase without DNA
- Brownfield integration without rewrite

## When NOT to use

- Greenfield projects — use `dna init` instead

## Prerequisites

- Existing source tree with detectable stack

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Prefer phased migration over big-bang restructure

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never delete existing production code paths without user approval

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna ivf shared-library --dry-run
```

## Flags

| Flag | Description |
|------|-------------|
| `[--scaffold]` | See CLI reference |

**Argument hint:** `[--scaffold]`


## Output interpretation

| Section | Meaning |
|---------|---------|
| IVF phases | Ordered integration steps — follow sequence |

## Exit codes

- **0** — IVF step completed

## Files touched

- .DNA/
- DNA/Impressions/

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna ivf shared-library --dry-run
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