---
description: Shared library extraction — analyze, dry-run, scaffold packages/humaan-ui.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# IVF shared library

```bash
npx dna ivf shared-library --dry-run
npx dna ivf shared-library --scaffold
```

Scope: $ARGUMENTS

Dry-run first. Report duplicates and migration order. Scaffold only after approval.
