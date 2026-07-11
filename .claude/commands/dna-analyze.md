---
description: Deep analysis — structure, auth, integrations, and vertical gaps.
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: DNA Analyze

> Slash: `/dna-analyze` · Category: **Analysis**

## Purpose

Deep brownfield analysis: package manager, frontend/backend stack, auth patterns, integrations, shared library health, and prioritized vertical gaps (IVF).

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
npx dna analyze
```

## Flags

| Flag | Description |
|------|-------------|
| `--deep` | Extended analysis |
| `--verticals` | Comma-separated verticals to inspect |

## Output interpretation

| Section | Meaning |
|---------|---------|
| Structure | Source roots, features folder, admin routes, test count |
| Surfaces | Routes, API endpoints, pages detected |
| Vertical gaps | P1 = must fix for DNA maturity; P3 = nice-to-have |

## Exit codes

- **0** — Analysis complete

## Files touched

- DNA/Impressions/
- .DNA/CellularMemory/

## After running

Summarize stack detection, surfaces, auth patterns, integrations, and P1–P3 vertical gaps with recommended next steps.

## Related slash commands

- `/dna-scan`
- `/dna-document`
- `/dna-plan-ivf`
- `/dna-ivf`

## Examples

### New repo assessment

```bash
npx dna analyze
```

**Then:** Address P1 gaps; run dna plan ivf for migration plan

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS