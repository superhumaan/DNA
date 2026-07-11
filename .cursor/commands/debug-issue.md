> **DNA Prompt Stem:** `debug-issue` — read `.DNA/stems/debug-issue/` (all files) before proceeding.

# Debug issue

Symptom: $ARGUMENTS

1. Check runtime: `npx dna dashboard` or `.DNA/data/runtime.db`
2. Classify against Immune System + Behaviour
3. Root-cause fix + tests
4. `npx dna quality report --feature` PASS
5. Push when green
