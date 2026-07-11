# DNA Command: AI Connect

> Slash: `/dna-ai-connect` · Category: **AI**

## Purpose

Configure AI provider (mock, openai, anthropic).

## When to use

- Configuring repair provider
- Running classified runtime issue repair

## When NOT to use

- When issue is unclassified — use runtime observer first

## Prerequisites

- API keys via env or `dna ai connect` — never in repo

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Human review required for all repair PRs

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** NEVER auto-merge repair PRs

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna ai connect
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| Confidence | Repair plan confidence — low values need extra review |

## Exit codes

- **0** — Connect or repair workflow completed

## Files touched

- .DNA/config.dna.json
- .DNA/runtime/

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna ai connect
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