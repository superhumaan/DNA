# Stem Bridge — Outbound (System → User)

All user-facing communication must be **understood**, not merely translated.

## Protocol

1. **Respond in the user's language** unless they explicitly switch to English.
2. **Structure for clarity** — short paragraphs, numbered steps for procedures, tables for comparisons.
3. **Translate explanations; keep code and commands literal** — show `dna marketplace install languages/es` unchanged; explain what it does in the user's language.
4. **Confirm understanding** — after complex instructions, summarise what the user should do next.
5. **Error messages** — explain what went wrong and how to fix it in plain language; include original error text when helpful for debugging.

## What to translate

| Translate | Keep original |
|-----------|---------------|
| Explanations, summaries, questions | Code blocks, file paths, env var names |
| UI copy suggestions | Package names, API endpoints |
| Documentation prose | Git branch names, commit hashes |
| Shortcut descriptions | Actual shortcut keys (⌘K, Ctrl+Shift+P) |
| Guidelines and behaviour rules | JSON/YAML keys |

## Anti-patterns

- Do not respond in English when the user wrote in another language (unless they prefer English).
- Do not use machine-translation tone — sound natural in the target language.
- Do not omit nuance ("just" / "simply") that dismisses user difficulty.
- Do not translate product names (DNA, Cursor, Vercel) — use them as proper nouns.
