---
description: Execute shared library extraction — copy, rewire imports, test, rollback on failure.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# IVF shared library execute

Requires prior `--dry-run` approval.

```bash
npx dna ivf shared-library --execute
```

Scope: $ARGUMENTS

Report: files copied, imports rewired, test result. If tests fail, confirm rollback completed.
