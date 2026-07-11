---
description: UK GDPR required document catalog (scrubbed templates).
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob
disable-model-invocation: true
---

# DNA Command: Compliance Documents

> Slash: `/dna-compliance-documents` · Category: **Compliance**

## Purpose

UK GDPR required document catalog (scrubbed templates).

## When to use

- Regulated industries
- GDPR/HIPAA/ISO/SOC2/PCI scoping

## When NOT to use

- Non-regulated internal tools with no PII

## Prerequisites

- Org tier known (startup → enterprise)

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Match controls to org tier — do not over-engineer startup tier

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** Never treat templates as legal advice — flag for human review

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna compliance documents
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| Framework | gdpr, hipaa, iso27001, soc2, pci |

## Exit codes

- **0** — Catalog listed

## Files touched

- .DNA/knowledge/compliance/
- .DNA/plans/

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Examples

### Default invocation

```bash
npx dna compliance documents
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