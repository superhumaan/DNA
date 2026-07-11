# Legal Knowledge — Overview

DNA Legal packs help engineering teams **consider law** when designing products — especially in regulated sectors (banking, healthcare, fintech).

## What DNA provides
- **Domain packs** — privacy, banking, healthcare, IP, consumer, employment, AI governance
- **Regional packs** — PDPA (SG/TH/MY), GDPR, CCPA, PIPEDA, LGPD, DPDP, PIPL, and more
- **Legal advisor** — `dna legal advise` surfaces jurisdiction and sector risks for your question

## What DNA does NOT provide
- Legal advice — always engage qualified counsel
- Guaranteed compliance — packs are engineering checklists, not certifications

## Workflow

1. `dna init` installs `legal/tiered-standards` by default
2. Country packs auto-install from project description heuristics
3. Before features: `dna legal advise --quote "..."` or slash `/legal-advise`
4. For launch: `dna plan legal` + `dna plan compliance`
5. Load context: `dna context legal` or slash `/legal-engineering`

## Intelligence prompts (dna.humaan.app/intelligence)

| Slash | Use when |
| --- | --- |
| `/legal-advise` | Quick question — banking, healthcare, PDPA, cross-border |
| `/plan-legal` | Full legal plan + matrix for launch markets |
| `/legal-list` | Browse domains and jurisdictions |
| `/legal-engineering` | Sector checklist on a specific feature flow |

CLI: `/dna-legal-advise`, `/dna-plan-legal`, `/dna-legal-list`

Automation: follow `.DNA/workflows/legal.workflow.md`

## Pair with compliance
Legal ≠ compliance alone. Use both:
- `dna plan compliance` — ISO 27001, SOC 2, control matrices
- `dna plan legal` — jurisdiction-specific law, sector regulation, counsel gates
