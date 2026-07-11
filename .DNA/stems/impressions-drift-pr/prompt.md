> **DNA Prompt Stem:** `impressions-drift-pr` — read `.DNA/stems/impressions-drift-pr/` (all files) before proceeding.

# Impressions drift PR

```bash
npx dna scan
npx dna scan --open-pr
npx dna plan impressions-sync --open-pr
```

Check `.DNA/config.dna.json` → `impressions.driftThreshold`, `impressions.autoPrThreshold`.

If drift exceeds threshold: run `scan --open-pr` to open a draft PR with sync plan. Summarize PR URL and files touched.
