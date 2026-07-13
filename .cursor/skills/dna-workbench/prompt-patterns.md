# DNA prompt patterns

Patterns for working in Cursor/Claude with DNA. Use these internally; the user stays in plain language.

## 1. Layered context (load bottom-up)

```
neuralNetwork.json  →  which knowledge/behaviour/memory to load
behaviour/*.md        →  non-negotiable project rules
.DNA/knowledge/       →  stack + domain packs
DNA/Impressions/      →  human system docs
CellularMemory/       →  project history
```

## 2. Plan-then-act (features)

```
User quote → feature-request.md → Product Analyst → Solution Architect
→ [STOP for approval] → Backend → Frontend → UX → QA → Quality → Ship
```

## 3. CLI-as-tool (not CLI-as-product)

DNA CLI is a **tool you invoke**, like tests or lint. The product experience is conversation in Cursor.

Example internal chain:
- User: "Is DNA set up correctly?"
- You: run `npx dna doctor` → parse output → explain in plain English → fix if needed

## 4. Structured handoffs

When switching roles (agent-loop), emit:
- **Done** — what was decided
- **Next** — what the next role needs
- **Files** — paths touched or to read

## 5. Verification prompts (self-check before reply)

- Did I think system-wide (API, DB, auth, UI, jobs, compliance) — not just the open file?
- Did I load DNA context or guess?
- Did I check CellularMemory for prior solutions / repeated failures?
- Is this root cause or a symptom patch?
- Did I run real commands when DNA had a command for this?
- Did I stop for approval before coding a feature?
- Would `dna quality report --feature` pass?

## 6. Critical thinking (always-on)

Read `.DNA/behaviour/reasoning.behaviour.md` on debug, analysis, and non-trivial work. Default: OODA → pattern match → hypothesize → one change → verify.

## 7. User-facing replies

- Lead with outcome, not command names
- Show DNA output only when it helps decision-making
- Offer one clear next step

## 8. Legal / regulated features

When banking, healthcare, payments, PDPA, GDPR, or cross-border data appears:

```
dna legal advise --quote "..."  →  domains + jurisdictions + counsel checklist
dna plan legal                →  matrix in CellularMemory
dna plan compliance           →  control frameworks (pair with legal)
dna context legal             →  load packs for AI session
```

Slash stems: `/legal-advise`, `/plan-legal`, `/legal-engineering`

**Never** present DNA legal output as legal advice.
