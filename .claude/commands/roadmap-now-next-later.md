---
description: Build an outcome roadmap across Now, Next, and Later horizons.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Roadmap — Now / Next / Later

Place initiatives and features on a three-horizon roadmap.

Context: $ARGUMENTS

## Horizons

| Horizon | Meaning | Rule |
|---------|---------|------|
| **Now** | Committed / in flight | Capacity-realistic; outcome + owner |
| **Next** | Queued after Now | Clear trigger to pull forward |
| **Later** | Intentional parking | Not a junk drawer — link to strategy |

## Rules

- Items are **outcomes or features**, not vague themes without a why
- Every Now item links to an initiative or product definition
- Later items must still connect to pillars — drop or park with reason
- Call out dependencies and sequencing

## Persist

Write `DNA/Impressions/product/roadmap.md` (Now / Next / Later tables). Sync decisions to CellularMemory when the roadmap commits strategy.

## Output

1. Three tables (item · outcome · parent initiative · notes)
2. Capacity / sequencing risks
3. Suggested discovery or `shape-feature` for under-specified Now items
4. Next stems: `shape-feature`, `prioritize-opportunities`, or `align-delivery`
