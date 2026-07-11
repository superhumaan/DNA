# DNA Command: Plan RBAC

> Slash: `/dna-plan-rbac` · Category: **Plan**

## Purpose

Generate RBAC + zero trust plan: roles, permission matrix, route guards, API middleware, and knowledge pack install.

## When to use

- User needs RBAC, compliance, IVF, or Impressions reconciliation plans

## When NOT to use

- When implementation is already approved and scoped

## Prerequisites

- Plain-language quote or flags describing requirements

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Write plans to `.DNA/plans/` and present summary before implementation

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never implement compliance controls without referencing generated plan files

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna plan rbac "$ARGUMENTS"
```

## Flags

| Flag | Description |
|------|-------------|
| `--quote` | Plain-language RBAC requirement |
| `--roles` | Comma-separated role list |
| `--feature` | Feature scope name |

**Argument hint:** `<requirement>`


## Output interpretation

| Section | Meaning |
|---------|---------|
| Plan path | Markdown plan under `.DNA/plans/` |

## Exit codes

- **0** — Plan generated

## Files touched

- .DNA/plans/rbac-*.md
- .DNA/knowledge/security/

## After running

Read the generated plan in `.DNA/` and implement with route guards + API middleware.

## Related slash commands

- `/dna-plan-feature`
- `/dna-marketplace-install`

## Examples

### Default invocation

```bash
npx dna plan rbac ""
```

**Then:** Read the generated plan in `.DNA/` and implement with route guards + API middleware.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS