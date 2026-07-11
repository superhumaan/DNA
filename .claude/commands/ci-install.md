---
description: Scaffold GitHub Actions — lint, test, coverage, security.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# CI install

```bash
npx dna ci install
```

Workflows: lint/test/coverage (`dna-ci.yml`), security (`dna-security.yml`), preview (`dna-preview.yml` only when hosting is Vercel or Netlify — not guessed).

Summarize workflows created. Verify with doctor.
