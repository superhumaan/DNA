---
description: Rank opportunities on the OST using ICE, RICE, or team framework.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Prioritize opportunities

Rank opportunities from opportunity-tree.md for the next cycle.

Context: $ARGUMENTS

## Before prioritising

```bash
npx dna context discovery
```

Read `DNA/Impressions/product/opportunity-tree.md`.

## Output

- Scored/ranked opportunity list with rationale
- Top pick with evidence
- Experiments or research still needed
- Update instructions for opportunity-tree.md
