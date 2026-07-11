# DNA Command: Plan Legal

> Slash: `/dna-plan-legal` · Category: **Legal**

## Purpose

Legal plan — domains, jurisdictions, counsel gates, regional packs (not legal advice).

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
npx dna plan legal
```

## Flags

| Flag | Description |
|------|-------------|
| `--domains` | privacy, banking, healthcare, ip, consumer, employment, ai_governance |
| `--jurisdictions` | eu, uk, us, sg, th, my, au, ca, in, br, jp, kr, id, ph, vn, hk, tw, cn |
| `--tier` | startup | sme | corporate | enterprise |
| `--quote` | Product or launch context |

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

Map domains and jurisdictions to packs; update legal matrix; flag counsel gates.

## Related slash commands

- `/dna-legal-advise`
- `/dna-legal-list`
- `/dna-context`
- `/dna-plan-compliance`

## Typical workflows

- dna legal list → dna legal advise → dna plan legal → dna context legal

## Examples

### Default invocation

```bash
npx dna plan legal
```

**Then:** Map domains and jurisdictions to packs; update legal matrix; flag counsel gates.

## Session context

Before follow-up implementation, load:

- `.DNA/neuralNetwork.json` — intent routing
- `.DNA/behaviour/*.behaviour.md` — project rules
- `.DNA/knowledge/` — stack-matched packs
- `DNA/Impressions/` — human-facing system docs

**User context (if any):**

$ARGUMENTS