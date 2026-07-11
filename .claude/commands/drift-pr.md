---
description: Open a draft GitHub PR when Impressions drift exceeds threshold.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Impressions drift PR

```bash
npx dna scan
npx dna scan --open-pr
npx dna plan impressions-sync --open-pr
```

Check `.DNA/config.dna.json` → `impressions.driftThreshold`, `impressions.autoPrThreshold`.

If drift exceeds threshold: run `scan --open-pr` to open a draft PR with sync plan. Summarize PR URL and files touched.
