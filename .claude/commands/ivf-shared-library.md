---
description: Shared library extraction — analyze, dry-run, scaffold packages/humaan-ui.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# IVF shared library

```bash
npx dna ivf shared-library --dry-run
npx dna ivf shared-library --scaffold
npx dna ivf shared-library --execute
```

Scope: $ARGUMENTS

Dry-run first. `--execute` copies components, rewires imports, runs tests, rolls back on failure — only after approval.
