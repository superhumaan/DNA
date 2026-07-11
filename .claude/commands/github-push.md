---
description: Commit and push feature branch after quality PASS.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# GitHub push

Prerequisite: quality PASS.

```bash
npx dna github push --message "feat: <summary>"
```

Message context: $ARGUMENTS
