/** Core problem-solving logic — always-on, not stem packs. */

export const REASONING_BEHAVIOUR_FILE = "reasoning.behaviour.md";

export const REASONING_MARKER = "System-wide critical thinking";

/** Compact always-on section — full toolkit in `.DNA/behaviour/reasoning.behaviour.md`. */
export const DNA_CRITICAL_THINKING_SECTION = `## Critical thinking (system-wide — every message)

DNA thinks **across the whole system by default**, not just the file in front of you. Before any answer, fix, or feature:

1. **Observe** — What is the actual symptom vs assumed cause? What changed recently? (\`.DNA/CellularMemory/hippocampus/recent-changes.md\`, runtime DB, CI, git log)
2. **Orient** — Map the blast radius: API, DB, auth, UI, jobs, infra, compliance. Load \`.DNA/neuralNetwork.json\` + behaviour + knowledge.
3. **Pattern match** — Search \`CellularMemory/\` (cerebellum/repeated-patterns, temporalLobe/previous-solutions, amygdala/repeated-failures) and repo history for prior fixes.
4. **Hypothesize** — Rank causes by evidence; state falsifiable predictions. **OODA loop:** Observe → Orient → Decide → Act.
5. **Adapt** — Reuse existing patterns, clients, components, and conventions. Do not invent parallel architectures.
6. **Verify** — One change at a time; reproduce → fix → regression test → quality gate. Confirm no collateral damage.

**Never:** patch symptoms, guess stack/auth/compliance, fix locally without checking system impact, or ship without evidence the root cause is addressed.

**Full toolkit:** \`.DNA/behaviour/reasoning.behaviour.md\` — debugging, pattern recognition, solution adaptation, and 30+ techniques. Read it on debug, analysis, and non-trivial engineering work.
`;

export const DNA_AGGRESSIVE_REPAIR_SECTION = `## Aggressive repair loop (mandatory on blockers)

On **every session start** and **debug/engineering intent**:

1. Read \`.DNA/CellularMemory/amygdala/blockers.md\` and \`.DNA/data/runtime.db\` fingerprints
2. If open blockers exist → run \`npx dna ai force-repair\` (or \`--dry-run\` first)
3. Load \`amygdala/repeated-failures.md\` + \`temporalLobe/previous-solutions.md\` before any fix attempt
4. **Mandatory 9-role agent loop** for blockers — do not mark complete without code change + test + quality PASS
5. Gateway errors (502/503/504): check origin health, deploy config, \`/health\` route — not just app try/catch
6. Never create duplicate GitHub issues for the same fingerprint — DNA dedupes; comment on existing issues

**Cannot skip repair** when \`ai.repair.forceAgentLoop\` is true (default) and blockers are open.
`;

export function reasoningBehaviourMarkdown(): string {
  return `<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Reasoning Behaviour

${REASONING_MARKER} is **mandatory on every task** — not optional, not stem-pack-only. This file is DNA's core problem-solving engine.

## Mandate

- Think **system-wide** first: frontend ↔ API ↔ DB ↔ auth ↔ jobs ↔ infra ↔ compliance ↔ observability.
- **Critically evaluate** user assumptions, error messages, and your own first hypothesis.
- **Prefer evidence** over intuition; prefer **root cause** over symptom patches.
- **Adapt solutions** to this repo's patterns — read before writing.

---

## OODA loop (default cadence)

Use on **every** non-trivial task:

| Phase | Actions |
|-------|---------|
| **Observe** | Read errors/logs/tests verbatim. Check \`.DNA/data/runtime.db\`, CI, \`git log\`, recent PRs. No code until you have facts. |
| **Orient** | Load neuralNetwork, behaviour, knowledge, CellularMemory, Impressions. Map components and data flow. |
| **Decide** | Rank hypotheses; pick smallest next experiment. State expected outcome if hypothesis is correct. |
| **Act** | One change → measure → compare to prediction. Loop until verified. |

---

## Pattern recognition playbook

Before proposing a fix or design:

1. **Repo patterns** — Grep for similar features, errors, or API shapes. Match naming, folder structure, error handling.
2. **CellularMemory** — \`cerebellum/repeated-patterns.md\`, \`temporalLobe/previous-solutions.md\`, \`amygdala/repeated-failures.md\`, \`prefrontalCortex/decisions.md\`.
3. **Knowledge packs** — \`.DNA/knowledge/\` for stack, security, QA, compliance patterns.
4. **Impressions** — \`DNA/Impressions/\` for documented architecture and past decisions.
5. **Immune system** — \`.DNA/immuneSystem/\` for classified issue types and severity.
6. **Cross-project** — If this smells like a platform bug vs app bug, classify with DNA immune / feedback rules.

**Signal:** If you've seen this failure mode before, reuse the proven fix — do not rediscover.

---

## Debugging methodology (scientific)

1. **Reproduce reliably** — exact steps, env, seed data, branch.
2. **Minimize** — strip unrelated changes; bisect git history if regression.
3. **Isolate** — divide: network / auth / data / UI / timing / permissions.
4. **Hypothesize** — write down top 3 causes with evidence for/against each.
5. **Experiment** — change **one variable** per iteration; log result.
6. **Root cause** — ask **5 Whys** until process/design gap is exposed, not just bad line of code.
7. **Fix + guard** — code fix + regression test + update CellularMemory if recurring.
8. **Post-check** — lint, tests, coverage, \`dna quality report --feature\`, no new runtime errors.

### Debugging techniques (use as needed)

| Technique | When |
|-----------|------|
| **Binary search / git bisect** | Regression with unknown commit |
| **Differential diagnosis** | Multiple possible causes; eliminate by evidence |
| **Rubber duck / explain aloud** | Logic error hidden in familiarity |
| **Trace end-to-end** | Request path unclear (proxy, middleware, cache) |
| **Log at boundaries** | Inputs/outputs at API, DB, job edges — not everywhere |
| **Minimal repro** | Flaky or complex stack |
| **Split in half** | Narrow which subsystem owns the failure |
| **Swap components** | Auth provider, DB row, feature flag — isolate layer |
| **Time travel** | Compare working vs broken deploy/config |
| **Capture replay** | Record failing request/response for CI |

---

## Solution adaptation (fit the system)

Before adding code:

1. **Inventory** — List existing hooks, services, components, utilities that already solve 80%.
2. **Extend, don't fork** — Add to established modules; avoid duplicate API clients or UI primitives.
3. **Match conventions** — Types, error shapes, loading states, RBAC patterns, test layout.
4. **Constraint check** — Stack archetype, compliance tier, security behaviour, coverage gate.
5. **Smallest diff** — Minimum change that solves root cause; no drive-by refactors.
6. **Rollback path** — Feature flags, migrations reversible, deploy-safe increments.

**Anti-patterns:** new folder for one-off logic, bypassing established auth, copy-paste from other projects, "temporary" hacks without ticket.

---

## Problem-solving techniques catalog

Apply the technique that matches the problem shape:

### Analysis & framing
- **First principles** — strip assumptions; rebuild from facts
- **Inversion** — how would we guarantee failure? avoid those
- **MECE** — mutually exclusive, collectively exhaustive buckets
- **5 Whys** — drill to systemic cause
- **Pre-mortem** — imagine ship failed; what killed it?
- **Assumption ledger** — list beliefs; mark confirmed vs guessed
- **Stakeholder map** — who breaks if this changes?

### Narrowing & decisions
- **Decision matrix** — score options on weighted criteria
- **Constraint relaxation** — which constraint is actually fixed?
- **Pareto (80/20)** — fix the vital few causes first
- **Kill criteria** — define when to stop digging and escalate
- **One-way vs two-way doors** — reversible experiments first

### Creative & structural
- **Analogical reasoning** — similar solved problem in repo or domain pack
- **Decomposition** — split epic into independently verifiable slices
- **Abstraction ladder** — move up (pattern) or down (instance) until clarity
- **Red team** — how would security/UX/ops break this?

### Verification & learning
- **Hypothesis → prediction → test** — scientific method
- **Falsification** — seek disconfirming evidence actively
- **Counterfactual** — what if we had not changed X?
- **Blast radius analysis** — what else could this touch?
- **Definition of done** — measurable exit before coding

---

## System-wide checklist (before you reply or ship)

- [ ] Did I load DNA context or guess architecture?
- [ ] Did I check CellularMemory for prior solutions / failures?
- [ ] Is this root cause or a symptom patch?
- [ ] Did I consider auth, data, API contract, UI, jobs, and deploy impact?
- [ ] Did I match existing repo patterns?
- [ ] Can I reproduce / prove the fix with tests or commands?
- [ ] Would \`dna quality report --feature\` pass?
- [ ] Did I update memory/docs if this is a new recurring pattern?

---

## DNA integrations

| Source | Use for |
|--------|---------|
| \`npx dna analyze\` | Brownfield map, gaps, system surfaces |
| \`npx dna context <target>\` | Deep domain load |
| \`.DNA/data/runtime.db\` | Production errors |
| \`npx dna lab serve\` | Live local repro + monitor |
| \`npx dna quality report\` | SAST + coverage gate |
| Immune system | Classify severity, blockers, repeat failures |
| Agent loop | Features/fixes through 9 roles — architect approval before code |

---

## When to escalate

**Automatic escalation (no user prompt needed):**
- Open entry in \`amygdala/blockers.md\` → run aggressive repair loop immediately
- Same fingerprint repeatCount ≥ 5 → treat as production blocker
- Previous repair produced zero file changes → retry with \`npx dna ai force-repair\`

Ask the user **one focused question** when:
- Reproduction blocked (access, data, env)
- Competing hypotheses remain after 2–3 experiments
- Fix requires compliance/legal/architecture decision
- Blast radius spans multiple services beyond this repo
`;
}
