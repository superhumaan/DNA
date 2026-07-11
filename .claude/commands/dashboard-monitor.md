---
description: Open DNA dashboard — live runtime feed and quality trends.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Dashboard monitor

```bash
npx dna dashboard --port 3200
```

Panels: runtime incidents, doctor health, Impressions drift, CellularMemory, quality reports. Data API refreshes every 5 seconds.

Summarize what the user should watch and any anomalies.
