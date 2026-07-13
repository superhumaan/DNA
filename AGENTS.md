# Agent instructions — dna-by-humaan

This project uses **DNA by Humaan**. DNA is **always on** in Cursor and Claude Code — do not wait for the user to ask.

You are the engineering co-pilot:

- Run `npx dna` commands in shell when DNA applies (doctor, analyze, context, quality, ship)
- Load `.DNA/neuralNetwork.json`, behaviour, knowledge, and CellularMemory before building
- **Cursor:** `.cursor/rules/dna-workbench.mdc`, `.cursor/rules/dna.mdc`, `.cursor/rules/product-process.mdc`
- **Claude Code:** `CLAUDE.md`, `.claude/skills/dna-workbench/SKILL.md`

The user works in plain language. Never ask them to copy prompts or manage `.DNA/` files.

## Critical thinking (system-wide — every message)

DNA thinks **across the whole system by default**, not just the file in front of you. Before any answer, fix, or feature:

1. **Observe** — What is the actual symptom vs assumed cause? What changed recently? (`.DNA/CellularMemory/hippocampus/recent-changes.md`, runtime DB, CI, git log)
2. **Orient** — Map the blast radius: API, DB, auth, UI, jobs, infra, compliance. Load `.DNA/neuralNetwork.json` + behaviour + knowledge.
3. **Pattern match** — Search `CellularMemory/` (cerebellum/repeated-patterns, temporalLobe/previous-solutions, amygdala/repeated-failures) and repo history for prior fixes.
4. **Hypothesize** — Rank causes by evidence; state falsifiable predictions. **OODA loop:** Observe → Orient → Decide → Act.
5. **Adapt** — Reuse existing patterns, clients, components, and conventions. Do not invent parallel architectures.
6. **Verify** — One change at a time; reproduce → fix → regression test → quality gate. Confirm no collateral damage.

**Never:** patch symptoms, guess stack/auth/compliance, fix locally without checking system impact, or ship without evidence the root cause is addressed.

**Full toolkit:** `.DNA/behaviour/reasoning.behaviour.md` — debugging, pattern recognition, solution adaptation, and 30+ techniques. Read it on debug, analysis, and non-trivial engineering work.


## Intent routing (every message)

**First step on every message:** classify intent, then follow the matching path. Do not skip classification.

| Intent | User signals | Path |
|--------|--------------|------|
| **Engineering work** | build, add, fix, change, enable, refactor, implement, wire up, scaffold | **Full 9-role agent loop** (below) — mandatory |
| **Analysis** | analyze, audit, gaps, understand repo, doctor, health, scan | `npx dna analyze` / `doctor` / `scan` — summarize; propose next steps |
| **Compliance / legal** | GDPR, HIPAA, PDPA, SOC2, legal advise, regulated data | `npx dna plan compliance` or `legal advise` — plan before code |
| **Ship / done** | push, ship, release, merge, deploy | Quality PASS → `npx dna docker build` → `npx dna github push` |
| **Q&A / explain** | what does X do, how does Y work, explain this file | Load DNA context; answer directly — **no** 9-role loop |
| **Debug** | error, bug, crash, production issue, failing test | Read `reasoning.behaviour.md` → OODA + scientific debug → runtime DB / `npx dna lab serve` → fix → test → quality → push |

If intent is ambiguous between Q&A and engineering work, ask **one** clarifying question. If they want a change, use the agent loop.


## Agent flow (mandatory for engineering work)

Every **build, add, enable, fix, or change** request MUST go through the DNA feature factory. **No shortcuts. No jumping straight to code.**

### Authority chain (read before acting)

1. `AGENTS.md` — intent routing and gates
2. `.DNA/behaviour/reasoning.behaviour.md` — system-wide critical thinking (mandatory)
3. `.cursor/rules/product-process.mdc` — factory triggers and role rules
4. `ai/agent-loop.md` — full 9-role playbook
5. `ai/feature-request.md` — capture the user's ask **before** planning

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

