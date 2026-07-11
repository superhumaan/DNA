---
description: Move a validated opportunity into feature factory and delivery.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Handoff to engineering

Bridge validated discovery work to DNA feature factory.

Opportunity: $ARGUMENTS

## Checklist (discovery/handoff-to-delivery)

- [ ] Opportunity validated with evidence in opportunity-tree.md
- [ ] Assumptions tested or explicitly accepted
- [ ] Success metrics defined

## Run

```bash
npx dna context discovery
```

Update `ai/feature-request.md` with Problem, Users, Desired behaviour, Success criteria from discovery artifacts.

## Output

- Draft feature-request.md sections
- Feature-map.md row
- Reminder: Solution Architect plan → **user approval** before code
