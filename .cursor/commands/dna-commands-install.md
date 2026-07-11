# DNA Command: DNA Commands Install

> Slash: `/dna-commands-install` · Category: **Feature factory**

## Purpose

Install Cursor and Claude slash command packages for every DNA CLI command.

## When to use

- User describes a feature in plain language
- Starting net-new product work
- Re-enabling DNA agent workflows

## When NOT to use

- Trivial one-line typo fixes
- When user explicitly asked for read-only review

## Prerequisites

- Feature factory installed (`dna feature-factory install`)

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Stop after Solution Architect plan and **wait for user approval** before coding
- **MUST** Run `dna quality report --feature` before marking feature complete
- **MUST** Close with `dna docker build` then `dna github push`

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never implement without updating `ai/feature-request.md` first
- **NEVER** Never skip the quality gate

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna commands install
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| Feature slug | Used for quality report path `.DNA/reports/quality/<slug>.md` |

## Exit codes

- **0** — Factory files written

## Files touched

- ai/feature-request.md
- ai/agent-loop.md
- .cursor/rules/
- .cursor/commands/
- .claude/

## After running

Tell the user to type `/` in Cursor or Claude and search for `dna-` commands.

## Examples

### Default invocation

```bash
npx dna commands install
```

**Then:** Tell the user to type `/` in Cursor or Claude and search for `dna-` commands.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS