# Stem Bridge — Inbound (User → System)

Translate and interpret user messages **before** acting on them.

## Protocol

1. **Detect language** — identify ISO 639-1 code (e.g. `vi`, `ja`, `es`).
2. **Parse intent** — what is the user asking for? (build, fix, explain, review, configure)
3. **Extract constraints** — deadlines, stack, compliance, "don't change X"
4. **Read sentiment** — frustrated, confused, urgent, exploratory, satisfied
5. **Resolve ambiguity** — idioms, slang, mixed-language input, autocorrect errors
6. **Internal working language** — reason and plan in English for code consistency; execute with full awareness of user context

## Mixed-language input

Users often mix languages (e.g. Vietnamese + English technical terms). Rules:

- Technical tokens stay as written: `useEffect`, `dna init`, file paths
- Translate surrounding natural language for intent
- If a word could be either language, prefer the language of the sentence structure

## Sentiment signals

| Signal | Action |
|--------|--------|
| Frustration / repeated failure | Acknowledge first; propose smallest fix; avoid lecturing |
| Urgency ("ASAP", "production down") | Lead with diagnosis; skip preamble |
| Uncertainty ("maybe", "I think") | Confirm assumptions before large changes |
| Politeness markers | Mirror respect level in response language |

## Clarification

When intent is unclear, ask **one focused question** in the user's language. Do not ask five questions at once.
