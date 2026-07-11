---
name: dna-cli
description: >-
  DNA by Humaan CLI — always-on default co-pilot. Active on every session when .DNA/ exists. Route engineering work through ai/agent-loop.md (9 roles). Run and obey all dna commands and /dna-* slash commands. Never wait for the user to say "use DNA".
disable-model-invocation: false
---

# DNA CLI skill — dna-by-humaan

You operate inside a **DNA by Humaan** project. DNA is the source of truth for stack, behaviour, memory, and delivery gates.

**DNA is always on** — never wait for the user to say "use DNA" before running commands or loading `.DNA/` context.

Engineering work (build, add, fix, change) **must** follow `ai/agent-loop.md` — all 9 roles, architect approval before code.

## Absolute rules (obey always)

1. **Run real commands** — execute `npx dna …` in the shell; never fabricate output.
2. **Respect gates** — quality PASS, docker build, github push are mandatory for feature close-out.
3. **Feature factory** — stop after Solution Architect plan; wait for approval before coding.
4. **Context first** — read `.DNA/neuralNetwork.json`, behaviour files, and Impressions before structural changes.
5. **No secrets in git** — tokens live in `~/.config/dna/` or env vars only.

## Command routing

| Slash | Title | CLI |
|-------|-------|-----|
| `/dna-doctor` | DNA Doctor | npx dna doctor |
| `/dna-init` | DNA Init | npx dna init |
| `/dna-update` | DNA Update | npx dna update |
| `/dna-validate` | DNA Validate | npx dna validate |
| `/dna-watch` | DNA Watch | npx dna watch |
| `/dna-dashboard` | DNA Dashboard | npx dna dashboard --port 3200 |
| `/dna-credits` | DNA Credits | npx dna credits |
| `/dna-analyze` | DNA Analyze | npx dna analyze |
| `/dna-scan` | DNA Scan | npx dna scan |
| `/dna-document` | DNA Document | npx dna document --from-code |
| `/dna-recommend` | DNA Recommend | npx dna recommend |
| `/dna-context` | DNA Context | npx dna context <args> |
| `/dna-feature` | DNA Feature | npx dna feature "<args>" |
| `/dna-feature-factory-install` | Feature Factory Install | npx dna feature-factory install |
| `/dna-commands-install` | DNA Commands Install | npx dna commands install |
| `/dna-quality-report` | Quality Report | npx dna quality report --feature |
| `/dna-quality-scan` | Quality Scan | npx dna quality scan --feature |
| `/dna-ci-install` | CI Install | npx dna ci install |
| `/dna-docker-build` | Docker Build | npx dna docker build |
| `/dna-docker-install` | Docker Install | npx dna docker install |
| `/dna-github-push` | GitHub Push | npx dna github push |
| `/dna-github-login` | GitHub Login | npx dna github login |
| `/dna-plan-rbac` | Plan RBAC | npx dna plan rbac "<args>" |
| `/dna-plan-feature` | Plan Feature | npx dna plan feature "<args>" |
| `/dna-plan-compliance` | Plan Compliance | npx dna plan compliance |
| `/dna-plan-legal` | Plan Legal | npx dna plan legal |
| `/dna-legal-advise` | Legal Advise | npx dna legal advise --quote "<args>" |
| `/dna-legal-list` | Legal List | npx dna legal list |
| `/dna-plan-ivf` | Plan IVF | npx dna plan ivf |
| `/dna-plan-impressions-sync` | Plan Impressions Sync | npx dna plan impressions-sync |
| `/dna-ivf` | DNA IVF | npx dna ivf run |
| `/dna-ivf-shared-library` | IVF Shared Library | npx dna ivf shared-library --dry-run |
| `/dna-marketplace-list` | Marketplace List | npx dna marketplace list |
| `/dna-marketplace-search` | Marketplace Search | npx dna marketplace search "<args>" |
| `/dna-marketplace-install` | Marketplace Install | npx dna marketplace install <args> |
| `/dna-memory-export` | Memory Export | npx dna memory export --out .DNA/exports/memory.json |
| `/dna-memory-import` | Memory Import | npx dna memory import <args> --merge |
| `/dna-compliance-list` | Compliance List | npx dna compliance list |
| `/dna-compliance-documents` | Compliance Documents | npx dna compliance documents |
| `/dna-platform-list` | Platform List | npx dna platform list |
| `/dna-platform-projects` | Platform Projects | npx dna platform projects |
| `/dna-stack-show` | Stack Show | npx dna stack show |
| `/dna-stack-recommend` | Stack Recommend | npx dna stack recommend |
| `/dna-ai-connect` | AI Connect | npx dna ai connect |
| `/dna-ai-repair` | AI Repair | npx dna ai repair |
| `/dna-generate-feature` | Generate Feature | npx dna generate feature <args> |
| `/dna-runtime-install` | Runtime Install | npx dna runtime install |

Full detail: read `.cursor/skills/dna-cli/commands-reference.md` or invoke any `/dna-*` slash command.

## When user intent maps to DNA

| User says | Run |
|-----------|-----|
| health / setup / fix DNA | `/dna-doctor` |
| understand codebase / gaps | `/dna-analyze` |
| build feature / add X | `/dna-feature` or auto factory |
| lint / quality / gate | `/dna-quality-report` |
| push / ship / PR | `/dna-github-push` (after quality PASS) |
| GDPR / HIPAA / compliance | `/dna-plan-compliance` |
| Banking / healthcare / PDPA / legal | `/dna-legal-advise` → `/dna-plan-legal` |
| install knowledge pack | `/dna-marketplace-install` |
| brownfield / legacy | `/dna-ivf` |

## Supporting files

- `commands-reference.md` — all 47 commands with purpose and must-rules
- `workflows.md` — chained workflows and hard gates
- `.cursor/commands/dna-*.md` — per-command extreme detail (invoke with `/`)

Regenerate package: `npx dna commands install`
Catalog: https://dna.humaan.app/intelligence
