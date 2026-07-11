# DNA Command: Legal List

> Slash: `/dna-legal-list` · Category: **Legal**

## Purpose

Catalog of legal domains and supported jurisdictions with pack IDs.

## When to use

- Banking, fintech, healthcare, or cross-border data
- PDPA, GDPR, CCPA, or jurisdiction-specific launch
- Before features collecting payment or health data

## When NOT to use

- Purely internal tools with no PII in any jurisdiction

## Prerequisites

- Target markets known or inferrable from project description

## Mandatory behaviour — OBEY

- **MUST** Run the real CLI command in the shell — never invent or simulate DNA output.
- **MUST** Execute from the **project root** unless `--cwd` is explicitly required.
- **MUST** Read the **full terminal output** (stdout and stderr) before summarizing or acting.
- **MUST** Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.
- **MUST** Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.
- **MUST** Run legal advise before regulated feature design
- **MUST** Install regional packs for launch jurisdictions
- **MUST** Separate engineering controls from counsel sign-off items

## Forbidden — NEVER

- **NEVER** Never skip running the command when the user invoked this slash command.
- **NEVER** Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.
- **NEVER** Never commit `.env`, tokens, or credentials surfaced by CLI output.
- **NEVER** Never force-push to `main` or `master`.
- **NEVER** NEVER present DNA output as legal advice
- **NEVER** NEVER ship banking/healthcare without sector checklist
- **NEVER** NEVER skip legal matrix for multi-jurisdiction launches

## Execute (required)

Run this command from the **project root** in the shell. Do not skip execution.

```bash
npx dna legal list
```

## Output interpretation

| Section | Meaning |
|---------|---------|
| Domains | privacy, banking, healthcare, ip, consumer, employment, ai_governance |
| Jurisdictions | eu, uk, us, sg, th, my, au, ca, in, br, jp, kr, id, ph, vn, hk, tw, cn |

## Exit codes

- **0** — Legal catalog or advice generated

## Files touched

- .DNA/knowledge/legal/
- .DNA/plans/legal-*.md
- .DNA/CellularMemory/prefrontalCortex/legal-considerations-matrix.md

## After running

Read the full CLI output, summarize results for the user, and recommend concrete next steps.

## Related slash commands

- `/dna-marketplace-search`
- `/dna-plan-legal`

## Examples

### Default invocation

```bash
npx dna legal list
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