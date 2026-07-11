> **DNA Prompt Stem:** `scan-project` — read `.DNA/stems/scan-project/` (all files) before proceeding.

# Scan project

Quick DNA scan — stack detection, hosting signals, and doc drift.

```bash
npx dna scan
npx dna scan --open-pr
```

Drift thresholds live in `.DNA/config.dna.json` (`impressions.driftThreshold`, `impressions.autoPrThreshold`). Use `--open-pr` when drift exceeds auto-PR threshold.

Summarize: stack, hosting, test/CI presence, drift score, top 3 drift items.
