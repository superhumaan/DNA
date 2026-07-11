---
description: Sync CellularMemory from team registry — export, import, conflict resolution.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Memory sync

```bash
npx dna memory sync
npx dna memory sync --registry <path>
npx dna memory import <file> --on-conflict keep-remote
```

Registry path: from `memory.teamRegistry` in config or $ARGUMENTS.

Summarize segments synced, conflicts, and resolution strategy.
