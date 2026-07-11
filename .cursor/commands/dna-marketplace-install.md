# DNA Command: Marketplace Install

> Slash: `/dna-marketplace-install` · Category: **Marketplace**

## Purpose

Install a knowledge pack into .DNA/knowledge/ and register version in config.

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
- **MUST** Verify packId exists via list/search if install fails

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never hand-edit files under `.DNA/knowledge/` when reinstalling packs

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna marketplace install $ARGUMENTS
```

## Flags

| Flag | Description |
|------|-------------|
| `--channel` | stable | beta |

**Argument hint:** `<packId>`


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

### Next.js pack

```bash
npx dna marketplace install frameworks/nextjs
```

**Then:** Load new knowledge before frontend work

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS