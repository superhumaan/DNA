---
description: Show detected stack, hosting, and which CI workflows DNA scaffolds.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Stack & hosting

```bash
npx dna stack show
npx dna scan
```

Explain detected stack, hosting provider, database signals, and whether `dna-preview.yml` applies (Vercel/Netlify only — not guessed).
