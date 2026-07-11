---
description: DNA AI repair workflow for classified runtime issues.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# AI repair

```bash
npx dna ai repair --issue '<json or description>'
```

Issue: $ARGUMENTS

Human review required before merge. Never auto-merge repair PRs.
