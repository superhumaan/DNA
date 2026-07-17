---
description: Define operational and health KPIs with owners, thresholds, and review cadence.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Define KPIs

Define **health / operational** metrics the team reviews continuously. KPIs are not OKRs — they monitor the business; OKRs drive change for a period.

Scope: $ARGUMENTS

## For each KPI

| Field | Content |
|-------|---------|
| **Name** | |
| **Definition** | Formula / event definition |
| **Type** | Leading / lagging |
| **Baseline** | Current or TBD |
| **Target / thresholds** | Green / amber / red |
| **Cadence** | Daily / weekly / monthly |
| **Owner** | Role |
| **Source** | Analytics, SQL, tool |
| **Related OKR / North Star** | Optional link |

## Suggested buckets

Acquisition · Activation · Engagement · Retention · Revenue · Reliability/Quality · Compliance (if regulated)

Prefer 8–15 KPIs at product level — not a metrics landfill.

## Persist

Write `DNA/Impressions/product/kpis.md`.

## Output

KPI table + what we deliberately omit + next stem (`goal-cascade` or `north-star-metric` if missing).
