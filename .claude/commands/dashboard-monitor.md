---
description: Open DNA Lab — runtime feed, performance, and quality at /labs.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Dashboard monitor

```bash
npx dna lab serve --port 3200
```

Open http://localhost:3200/labs — runtime incidents, doctor health, Impressions drift, CellularMemory, quality reports, releases.

Production: `npx dna register lab --url <deploy-url>` then sign in at `/labs`.

Summarize what the user should watch and any anomalies.
