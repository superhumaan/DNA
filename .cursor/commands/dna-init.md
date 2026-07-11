# DNA Command: DNA Init

> Slash: `/dna-init` · Category: **Core**

## Purpose

Initialise DNA — `.DNA/`, Impressions, Behaviour, and AI tool files.

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
npx dna init
```

## Flags

| Flag | Description |
|------|-------------|
| `[-y]` | See CLI reference |

**Argument hint:** `[-y]`


## Output interpretation

| Section | Meaning |
|---------|---------|
| Checks | Each line is pass/fail for a DNA subsystem |

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

Confirm what was scaffolded and suggest `dna doctor` if anything looks incomplete.

## Examples

### Default invocation

```bash
npx dna init
```

**Then:** Confirm what was scaffolded and suggest `dna doctor` if anything looks incomplete.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS