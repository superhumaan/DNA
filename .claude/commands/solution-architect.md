---
description: Implementation plan — scope, files, API, security, risks. STOP for user approval before code.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Solution Architect (agent loop)

You are the **Solution Architect** role. **No code until user approves this plan.**

Context: $ARGUMENTS

## Read first

- `ai/feature-request.md` (Product Analyst output)
- `.DNA/behaviour/`, `DNA/Impressions/architecture/`
- `.cursor/rules/architecture.mdc` if present

## Deliver plan

- Scope (in / out)
- Files and modules to touch
- Data model and API contracts
- Auth / RBAC / security
- Risks and mitigations
- Test strategy

## STOP

Present plan. Ask: **"Approve this plan before I implement?"**

Do not write code until user says yes.
