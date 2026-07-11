---
name: dna-workbench
description: >-
  DNA Workbench for dna-by-humaan — always-on default co-pilot in Cursor.
  Active on every session when .DNA/ exists. Run npx dna CLI, load .DNA/ intelligence, and ship with quality gates.
  Never wait for the user to say "use DNA". Never make them copy prompts.
---

# DNA Workbench

The user works in **plain language**. You run **DNA CLI in shell**, load **`.DNA/` intelligence**, and ship with **quality gates**.

## DNA is always on (never opt-in)

This project has DNA installed. **Every session, every message** — DNA is your default co-pilot.

- **Never** wait for the user to say "use DNA", "utilise DNA", or `/work-with-dna` before running DNA
- **Always** load `.DNA/` context and run `npx dna` when their intent matches health, analysis, features, compliance, quality, or ship
- The user speaks in plain language; you execute DNA — they do not run CLI commands or copy prompts
- Slash commands like `/work-with-dna` are optional shortcuts — not a prerequisite for DNA-aware behaviour


## Intent routing (every message)

**First step on every message:** classify intent, then follow the matching path. Do not skip classification.

| Intent | User signals | Path |
|--------|--------------|------|
| **Engineering work** | build, add, fix, change, enable, refactor, implement, wire up, scaffold | **Full 9-role agent loop** (below) — mandatory |
| **Analysis** | analyze, audit, gaps, understand repo, doctor, health, scan | `npx dna analyze` / `doctor` / `scan` — summarize; propose next steps |
| **Compliance / legal** | GDPR, HIPAA, PDPA, SOC2, legal advise, regulated data | `npx dna plan compliance` or `legal advise` — plan before code |
| **Ship / done** | push, ship, release, merge, deploy | Quality PASS → `npx dna docker build` → `npx dna github push` |
| **Q&A / explain** | what does X do, how does Y work, explain this file | Load DNA context; answer directly — **no** 9-role loop |
| **Debug** | error, bug, crash, production issue, failing test | Runtime DB / `npx dna dashboard` → fix → test → quality → push |

If intent is ambiguous between Q&A and engineering work, ask **one** clarifying question. If they want a change, use the agent loop.


## Agent flow (mandatory for engineering work)

Every **build, add, enable, fix, or change** request MUST go through the DNA feature factory. **No shortcuts. No jumping straight to code.**

### Authority chain (read before acting)

1. `AGENTS.md` — intent routing and gates
2. `.cursor/rules/product-process.mdc` — factory triggers and role rules
3. `ai/agent-loop.md` — full 9-role playbook
4. `ai/feature-request.md` — capture the user's ask **before** planning

### On every engineering request — automatically

1. **Write** `ai/feature-request.md` from their message (all sections — infer from context)
2. **Read** `ai/agent-loop.md` and execute each role **in order** — do not skip roles
3. **Product Analyst** → refine problem, users, acceptance criteria
4. **Solution Architect** → implementation plan (scope, files, API, risks)
5. **STOP — wait for user approval** before any code edits
6. After approval: **Backend** → **Frontend** → **UX** → **QA** → **Code Quality** → **Refactor** → **Final Release**
7. Close: `npx dna quality report --feature` PASS → `npx dna docker build` → `npx dna github push`

### The 9 roles (sequential — never skip)

1. Product Analyst
2. Solution Architect — **approval gate here**
3. Backend Engineer
4. Frontend Engineer
5. UX Reviewer
6. QA Engineer
7. Code Quality Analyst
8. Refactor Reviewer
9. Final Release Reviewer

### Hard gates

- **No code** until the Solution Architect plan is approved by the user
- **No role skipping** — every role reviews before ship
- **No complete** until `npx dna quality report --feature` PASS
- **No ship** until docker build succeeds and GitHub push completes
- **Never** ask the user to copy prompts or fill templates

**Admin / backoffice:** when user says admin, backoffice, or control panel — read `.cursor/rules/admin-portal.mdc`; scaffold `/admin` in a new tab with RBAC (see agent loop).


## Read first

- `AGENTS.md` — intent routing + agent flow gates
- `.cursor/skills/dna-workbench/dna-session-flow.md` — session types A–F
- `.cursor/skills/dna-workbench/prompt-patterns.md` — how to prompt and verify
- - `.cursor/rules/dna-workbench.mdc` — always-on obedience (Cursor)
- `.cursor/skills/dna-cli/SKILL.md` — CLI routing and /dna-* commands
- `ai/agent-loop.md` — feature factory roles

## Slash prompts & stem packs

Each command maps to `.DNA/stems/<id>/` — read **prompt.md, guidelines.md, expectations.md, context.md, examples.md** before acting.

| Command | Stem | Use when |
|---------|------|----------|
| `/work-with-dna` | work-with-dna | Start any DNA-aware session |
| `/analyze-project` | analyze-project | Brownfield analysis + gap plan |
| `/what-next` | what-next-after-analyze | Turn analyze output into action plan |
| `/ship-feature` | ship-feature | Plain-language feature → full agent loop |
| `/agent-loop` | agent-loop-full | All 9 roles in sequence |
| `/product-analyst` … `/final-release` | role-* | One agent-loop role at a time |
| `/health-check` | health-check | Doctor + validate |
| `/dna-update` | keep-dna-current | Upgrade CLI + refresh stems |
| `/platform-codegen` | platform-codegen | SSO, multi-tenant, flags, rollout |
| `/drift-pr` | impressions-drift-pr | Draft PR when drift exceeds threshold |
| `/memory-sync` | memory-sync | Team CellularMemory sync |
| `/dashboard-monitor` | dashboard-monitor | Live dashboard + quality trends |
| `/quality-gate` | quality-gate | Pre-push gate |
| `/plan-compliance` | plan-compliance | Compliance rollout |
| `/plan-legal` | plan-legal | Legal plan + jurisdiction packs |
| `/legal-advise` | legal-advise | Quick legal advisor (not legal advice) |
| `/legal-engineering` | legal-engineering | Sector checklist on a feature |
| `/debug-issue` | debug-issue | Debug + fix loop |
| `/ivf-shared-library` | ivf-shared-library | Extract shared UI library |

Full library (59 stems): https://dna.humaan.app/intelligence#stem-library

Commands live in `.cursor/commands/`. Stem data: `.DNA/stems/`.

## Non-negotiable

- Run real `npx dna` commands — never fake output
- Feature work stops for approval after Solution Architect plan
- Quality PASS before complete or push
