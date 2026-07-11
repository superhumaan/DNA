---
description: Start the feature factory from a plain-language request.
argument-hint: <plain-language quote>
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: DNA Feature

> Slash: `/dna-feature` · Category: **Feature factory**

## Purpose

Bootstrap feature factory: write ai/feature-request.md, baseline quality report, and trigger agent-loop workflow.

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
- **MUST** Read ai/agent-loop.md and execute role-by-role
- **MUST** Stop after Solution Architect plan — wait for approval

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
npx dna feature "$ARGUMENTS"
```

## Flags

| Flag | Description |
|------|-------------|
| `<plain-language quote>` | See CLI reference |

**Argument hint:** `<plain-language quote>`


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

Read `ai/feature-request.md` and `ai/agent-loop.md`. Stop after Solution Architect plan for approval.

## Related slash commands

- `/dna-quality-report`
- `/dna-docker-build`
- `/dna-github-push`

## Examples

### New capability

```bash
npx dna feature "Add admin dashboard for support"
```

**Then:** Follow agent-loop; run quality report before done

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS