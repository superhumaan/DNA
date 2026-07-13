---
description: Runtime error → classify → fix → test → quality → push.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Debug issue

Symptom: $ARGUMENTS

1. Check runtime: `npx dna lab serve` (http://localhost:3200/labs) or `.DNA/data/runtime.db`
2. Classify against Immune System + Behaviour
3. Root-cause fix + tests
4. `npx dna quality report --feature` PASS
5. Push when green
