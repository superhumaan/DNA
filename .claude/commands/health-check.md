---
description: Doctor + validate — scaffold health, hooks, CI, rules, with plain-English results.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# DNA health check

Verify DNA scaffolding and behaviour compliance.

Scope: $ARGUMENTS

## Run

```bash
npx dna doctor
npx dna validate
```

## Report

For each check: ✓ or ✗ in plain English. Fix gaps (hooks, workflows, rules) when doctor repairs them. Re-run if needed.
