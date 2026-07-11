# DNA Command: DNA Scan

> Slash: `/dna-scan` · Category: **Analysis**

## Purpose

Detect stack, dependencies, tests, CI, and Impressions drift.

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
npx dna scan
```

## Flags

| Flag | Description |
|------|-------------|
| `[--open-pr]` | See CLI reference |

**Argument hint:** `[--open-pr]`


## Output interpretation

| Section | Meaning |
|---------|---------|
| Vertical gaps | P1 = structural blockers; P3 = enhancements |

## Exit codes

- **0** — Analysis complete

## Files touched

- DNA/Impressions/
- .DNA/CellularMemory/

## After running

Highlight risks, drift score, and whether `dna plan impressions-sync` is warranted.

## Examples

### Default invocation

```bash
npx dna scan
```

**Then:** Highlight risks, drift score, and whether `dna plan impressions-sync` is warranted.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS