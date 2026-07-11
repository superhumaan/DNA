# DNA intelligence — Cursor commands

**dna-by-humaan** — 59 prompt stem packs (bundled catalog v5) + 47 `/dna-*` CLI commands.

## Prompt stems (`.DNA/stems/<id>/`)

Each stem: **prompt + guidelines + expectations + context + examples**.

| Slash | Stem |
|-------|------|
| `/work-with-dna` | Work with DNA |
| `/load-context` | Load context |
| `/health-check` | Health check |
| `/dna-update` | Keep DNA current |
| `/analyze-project` | Analyze project |
| `/what-next` | What next after analyze? |
| `/scan-project` | Scan project |
| `/stack-hosting` | Stack & hosting |
| `/recommend-stack` | Recommend architecture |
| `/security-audit` | Security audit |
| `/ship-feature` | Ship a feature |
| `/plan-feature` | Plan feature |
| `/plan-rbac` | Plan RBAC |
| `/generate-feature` | Generate feature scaffold |
| `/platform-codegen` | Platform codegen |
| `/quality-gate` | Quality gate |
| `/quality-scan` | Quality scan |
| `/pre-push-review` | Pre-push review |
| `/plan-compliance` | Plan compliance |
| `/compliance-documents` | Compliance documents |
| `/gdpr-engineering` | GDPR engineering checklist |
| `/plan-legal` | Plan legal |
| `/legal-advise` | Legal advise |
| `/legal-list` | Legal catalog |
| `/legal-engineering` | Legal engineering checklist |
| `/debug-issue` | Debug issue |
| `/ai-repair` | AI repair |
| `/runtime-investigate` | Runtime investigate |
| `/dashboard-monitor` | Dashboard monitor |
| `/sync-impressions` | Sync Impressions |
| `/drift-pr` | Impressions drift PR |
| `/document-code` | Document from code |
| `/plan-ivf` | Plan IVF |
| `/ivf-run` | Run IVF |
| `/ivf-shared-library` | IVF shared library |
| `/ivf-execute` | IVF shared library execute |
| `/docker-build` | Docker build |
| `/github-push` | GitHub push |
| `/ci-install` | CI install |
| `/marketplace-search` | Marketplace search |
| `/marketplace-install` | Marketplace install |
| `/memory-export` | Memory export |
| `/memory-import` | Memory import |
| `/memory-sync` | Memory sync |
| `/product-analyst` | Product Analyst |
| `/solution-architect` | Solution Architect |
| `/backend-engineer` | Backend Engineer |
| `/frontend-engineer` | Frontend Engineer |
| `/ux-reviewer` | UX Reviewer |
| `/qa-engineer` | QA Engineer |
| `/code-quality` | Code Quality Analyst |
| `/refactor-reviewer` | Refactor Reviewer |
| `/final-release` | Final Release Reviewer |
| `/agent-loop` | Run full agent loop |
| `/methodology-setup` | Methodology setup |
| `/create-ticket` | Create ticket |
| `/write-spec` | Write spec |
| `/break-down-work` | Break down work |
| `/align-delivery` | Align delivery |

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

Skill: `.cursor/skills/dna-workbench/` · Rule: `.cursor/rules/dna-workbench.mdc`

## CLI slash commands (`/dna-*`)

Power-user wrappers for every `dna` subcommand — skill: `.cursor/skills/dna-cli/`, rule: `.cursor/rules/dna-cli-commands.mdc`.

Regenerate: `npx dna workbench install` or `npx dna commands install`

Remove workbench: `npx dna workbench uninstall` · Remove CLI commands: `npx dna commands uninstall`
