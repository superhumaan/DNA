---
description: Plan tiered GDPR, HIPAA, ISO 27001, SOC 2, or PCI controls.
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: Plan Compliance

> Slash: `/dna-plan-compliance` · Category: **Plan**

## Purpose

Tiered compliance plan for GDPR, HIPAA, ISO 27001, SOC 2, PCI — scoped to org tier.

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
npx dna plan compliance
```

## Flags

| Flag | Description |
|------|-------------|
| `--frameworks` | gdpr, hipaa, iso27001, soc2, pci |
| `--tier` | startup | sme | corporate | enterprise |
| `--quote` | Project context |

## Output interpretation

| Section | Meaning |
|---------|---------|
| Plan path | Markdown plan under `.DNA/plans/` |

## Exit codes

- **0** — Plan generated

## Files touched

- .DNA/plans/
- .DNA/knowledge/

## After running

Match org tier to controls and list knowledge packs to install.

## Related slash commands

- `/dna-compliance-list`
- `/dna-context`
- `/dna-marketplace-install`

## Examples

### Default invocation

```bash
npx dna plan compliance
```

**Then:** Match org tier to controls and list knowledge packs to install.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS