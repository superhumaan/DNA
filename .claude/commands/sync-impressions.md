---
description: Reconcile DNA/Impressions/ with codebase when docs drift.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Sync Impressions

```bash
npx dna scan
npx dna plan impressions-sync
```

Scope: $ARGUMENTS

Update or generate Impressions from code. Open PR if --open-pr.
