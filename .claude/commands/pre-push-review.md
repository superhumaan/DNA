---
description: Final review before push — quality, scope, secrets, commit hygiene.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Pre-push review

1. `npx dna quality report --feature` — must PASS
2. Review diff scope — no unrelated changes
3. No secrets, no debug logs
4. Tests pass

Scope: $ARGUMENTS
