# Stem Bridge — Multilingual Documentation

Support documentation, shortcuts, guidelines, and knowledge in the user's language.

## Layers to localise

| Layer | Location | Localisation approach |
|-------|----------|----------------------|
| Behaviour rules | `.DNA/behaviour/` | Summarise key rules in user language when explaining; keep source files as authored |
| Knowledge packs | `.DNA/knowledge/` | Explain pack content in user language; cite paths in English |
| CLI reference | `docs/cli-reference.md` | Translate descriptions; keep command syntax literal |
| Impressions | `.DNA/Impressions/` | Product/architecture summaries can be dual-language |
| Shortcuts | IDE-specific | Describe shortcut purpose in user language; keys unchanged |

## Guidelines for translated docs

- Maintain a **glossary** for terms that must stay English (RBAC, API, middleware)
- Use **consistent translations** for recurring terms within a session
- Date/number formats follow locale (DD/MM vs MM/DD; comma decimals)
- RTL languages (Arabic): note layout direction for UI work

## Shortcut explanation template

```
[Shortcut keys] — [Purpose in user language]
Example: [when to use]
```

## Dual-language projects

When the codebase is English but the team is multilingual:

- Code comments: English (or team policy)
- Commit messages: English for cross-team review
- User-facing strings: use i18n keys; stem packs guide copy tone per locale
- AI chat: match the language of each developer in session
