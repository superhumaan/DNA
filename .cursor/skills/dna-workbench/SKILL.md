---
name: dna-workbench
description: >-
  DNA Workbench for dna-by-humaan — prompt-first engineering in Cursor.
  Use when the user works on features, analysis, compliance, debugging, or mentions DNA, project health,
  quality gates, or shipping. Run npx dna CLI on their behalf; never make them copy prompts.
---

# DNA Workbench

The user works in **plain language**. You run **DNA CLI in shell**, load **`.DNA/` intelligence**, and ship with **quality gates**.

## Read first

- `.cursor/skills/dna-workbench/dna-session-flow.md` — session types A–F
- `.cursor/skills/dna-workbench/prompt-patterns.md` — how to prompt and verify
- `.cursor/rules/dna-workbench.mdc` — always-on obedience (Cursor)
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
| `/quality-gate` | quality-gate | Pre-push gate |
| `/plan-compliance` | plan-compliance | Compliance rollout |
| `/debug-issue` | debug-issue | Debug + fix loop |
| `/ivf-shared-library` | ivf-shared-library | Extract shared UI library |

Full library (43 stems): https://dna.humaan.app/intelligence#stem-library

Commands live in `.cursor/commands/`. Stem data: `.DNA/stems/`.

## Non-negotiable

- Run real `npx dna` commands — never fake output
- Feature work stops for approval after Solution Architect plan
- Quality PASS before complete or push
