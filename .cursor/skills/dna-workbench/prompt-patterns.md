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

- Did I load DNA context or guess?
- Did I run real commands when DNA had a command for this?
- Did I stop for approval before coding a feature?
- Would `dna quality report --feature` pass?

## 6. User-facing replies

- Lead with outcome, not command names
- Show DNA output only when it helps decision-making
- Offer one clear next step
