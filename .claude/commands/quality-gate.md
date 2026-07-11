---
description: Pre-ship lint, coverage, SAST — must PASS before push.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Quality gate

Scope: $ARGUMENTS

```bash
npx dna quality report --feature
```

Fix blockers until PASS. Then offer docker + github push.
