---
description: List legal domains and supported jurisdictions (PDPA, GDPR, CCPA, etc.).
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Legal catalog

```bash
npx dna legal list
npx dna marketplace search --query pdpa --category legal
```

Context: $ARGUMENTS

Show domains table and jurisdictions. Suggest packs to install for user's markets.
