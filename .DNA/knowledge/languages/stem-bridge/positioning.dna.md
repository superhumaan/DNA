# Language Stem Bridge — Positioning

Stem packs for human languages act as **translators** between the user and the AI system. They are not code libraries — they are guidance that ensures:

1. **Inbound:** The system understands exactly what the user means in their language — including sentiment, tone, idioms, and implicit context.
2. **Outbound:** The AI communicates back in the user's language so they fully understand responses, documentation, shortcuts, and guidelines.
3. **Documentation:** Project docs, CLI shortcuts, behaviour rules, and knowledge packs can be surfaced in the user's language without losing technical precision.

## When to install

- User communicates in a language other than English
- Project serves multilingual users (i18n/l10n)
- Team documentation must be available in multiple languages
- AI pair-programming with non-English-speaking developers

## Pack pairing

Always install `languages/stem-bridge` first, then one or more locale packs (e.g. `languages/es`, `languages/ja`).

```bash
dna marketplace install languages/stem-bridge
dna marketplace install languages/vi
```

## Rules

- **Never guess** user intent when translation is ambiguous — ask a clarifying question in the user's language.
- **Preserve technical terms** (API names, file paths, CLI commands) in their original form; translate explanations around them.
- **Match formality** to the user's register (formal/informal) unless the project style guide says otherwise.
- **Sentiment is signal** — frustration, urgency, and politeness affect priority and tone of the response.
