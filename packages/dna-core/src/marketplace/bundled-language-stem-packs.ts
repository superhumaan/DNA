import type { KnowledgePack } from "@superhumaan/dna-config";
import { stemPack } from "./bundled-catalog-helpers.js";

/** Core bidirectional translation bridge — install before any locale-specific stem pack. */
export const LANGUAGE_STEM_BRIDGE_PACK: KnowledgePack = stemPack(
  "languages/stem-bridge",
  "Language Stem Bridge",
  "languages",
  "Bidirectional translation protocol — user input understanding, AI output clarity, sentiment, and context",
  [
    {
      path: "languages/stem-bridge/positioning.dna.md",
      content: `# Language Stem Bridge — Positioning

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

Always install \`languages/stem-bridge\` first, then one or more locale packs (e.g. \`languages/es\`, \`languages/ja\`).

\`\`\`bash
dna marketplace install languages/stem-bridge
dna marketplace install languages/vi
\`\`\`

## Rules

- **Never guess** user intent when translation is ambiguous — ask a clarifying question in the user's language.
- **Preserve technical terms** (API names, file paths, CLI commands) in their original form; translate explanations around them.
- **Match formality** to the user's register (formal/informal) unless the project style guide says otherwise.
- **Sentiment is signal** — frustration, urgency, and politeness affect priority and tone of the response.
`,
    },
    {
      path: "languages/stem-bridge/inbound.dna.md",
      content: `# Stem Bridge — Inbound (User → System)

Translate and interpret user messages **before** acting on them.

## Protocol

1. **Detect language** — identify ISO 639-1 code (e.g. \`vi\`, \`ja\`, \`es\`).
2. **Parse intent** — what is the user asking for? (build, fix, explain, review, configure)
3. **Extract constraints** — deadlines, stack, compliance, "don't change X"
4. **Read sentiment** — frustrated, confused, urgent, exploratory, satisfied
5. **Resolve ambiguity** — idioms, slang, mixed-language input, autocorrect errors
6. **Internal working language** — reason and plan in English for code consistency; execute with full awareness of user context

## Mixed-language input

Users often mix languages (e.g. Vietnamese + English technical terms). Rules:

- Technical tokens stay as written: \`useEffect\`, \`dna init\`, file paths
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
`,
    },
    {
      path: "languages/stem-bridge/outbound.dna.md",
      content: `# Stem Bridge — Outbound (System → User)

All user-facing communication must be **understood**, not merely translated.

## Protocol

1. **Respond in the user's language** unless they explicitly switch to English.
2. **Structure for clarity** — short paragraphs, numbered steps for procedures, tables for comparisons.
3. **Translate explanations; keep code and commands literal** — show \`dna marketplace install languages/es\` unchanged; explain what it does in the user's language.
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
`,
    },
    {
      path: "languages/stem-bridge/sentiment.dna.md",
      content: `# Stem Bridge — Sentiment & Pragmatics

Language stem packs encode **pragmatic** understanding — what the user means, not just what they typed.

## Dimensions

1. **Sentiment** — positive, neutral, negative, frustrated
2. **Certainty** — directive ("do X") vs exploratory ("could we maybe")
3. **Scope** — single file vs whole system vs documentation only
4. **Relationship** — peer collaborator vs requesting expert help
5. **Cultural context** — direct vs indirect refusal, hierarchy cues, face-saving

## Indirect communication

Some languages rarely say "no" directly. Recognise:

- "That might be difficult" → likely objection
- "We should consider..." → often a preference or concern
- Excessive politeness before a request → may indicate sensitivity of the topic

Respond with equal care — do not bulldoze with blunt English-directness unless the user prefers it.

## Emotional continuity

If the user was frustrated in turn 1 and you fixed the issue, turn 2 can be warmer and briefer. Match their emotional arc.

## Validation

Before executing destructive or large-scope work, confirm in the user's language:

> "I'm about to [action]. This will [effect]. Proceed?"

Use locale-appropriate phrasing (see per-language stem packs).
`,
    },
    {
      path: "languages/stem-bridge/documentation.dna.md",
      content: `# Stem Bridge — Multilingual Documentation

Support documentation, shortcuts, guidelines, and knowledge in the user's language.

## Layers to localise

| Layer | Location | Localisation approach |
|-------|----------|----------------------|
| Behaviour rules | \`.DNA/behaviour/\` | Summarise key rules in user language when explaining; keep source files as authored |
| Knowledge packs | \`.DNA/knowledge/\` | Explain pack content in user language; cite paths in English |
| CLI reference | \`docs/cli-reference.md\` | Translate descriptions; keep command syntax literal |
| Impressions | \`.DNA/Impressions/\` | Product/architecture summaries can be dual-language |
| Shortcuts | IDE-specific | Describe shortcut purpose in user language; keys unchanged |

## Guidelines for translated docs

- Maintain a **glossary** for terms that must stay English (RBAC, API, middleware)
- Use **consistent translations** for recurring terms within a session
- Date/number formats follow locale (DD/MM vs MM/DD; comma decimals)
- RTL languages (Arabic): note layout direction for UI work

## Shortcut explanation template

\`\`\`
[Shortcut keys] — [Purpose in user language]
Example: [when to use]
\`\`\`

## Dual-language projects

When the codebase is English but the team is multilingual:

- Code comments: English (or team policy)
- Commit messages: English for cross-team review
- User-facing strings: use i18n keys; stem packs guide copy tone per locale
- AI chat: match the language of each developer in session
`,
    },
  ],
);

function localePack(
  id: string,
  name: string,
  iso: string,
  nativeName: string,
  rtl: boolean,
  formality: string,
  notes: string,
): KnowledgePack {
  return stemPack(id, name, "languages", `${nativeName} (${iso}) — translation, sentiment, documentation, and UI copy`, [
    {
      path: `languages/${id.split("/")[1]}/positioning.dna.md`,
      content: `# ${nativeName} (${iso}) — Language Stem Pack

Locale stem pack for **${name}**. Pair with \`languages/stem-bridge\`.

- **ISO 639-1:** \`${iso}\`
- **Native name:** ${nativeName}
- **Direction:** ${rtl ? "RTL (right-to-left)" : "LTR (left-to-right)"}
- **Default formality:** ${formality}

## Locale notes

${notes}

## Usage

When the user writes in ${nativeName}, load this pack via \`dna context multilingual\` or install:

\`\`\`bash
dna marketplace install ${id}
\`\`\`
`,
    },
    {
      path: `languages/${id.split("/")[1]}/translation.dna.md`,
      content: `# ${nativeName} — Translation Patterns

## Register

${formality}

## Technical terms

Keep untranslated: DNA, API, CLI, Git, PR, CI/CD, framework names, file extensions.
Translate: user-facing labels, error explanations, step-by-step instructions.

## Common pitfalls

- False friends and calques — verify meaning in ${nativeName}, not word-for-word from English
- Over-formalising casual chat or under-formalising compliance docs
- Mixing regional variants — pick one (${name}) and stay consistent unless user specifies region

## Bidirectional checklist

- [ ] User message fully understood (intent + sentiment)
- [ ] Response entirely in ${nativeName} (except code/commands)
- [ ] Technical accuracy preserved
- [ ] Tone matches user register
`,
    },
    {
      path: `languages/${id.split("/")[1]}/documentation.dna.md`,
      content: `# ${nativeName} — Documentation & Guidelines

## Document types

| Type | Tone |
|------|------|
| README / getting started | Clear, welcoming |
| API docs | Precise, neutral |
| Error guides | Empathetic, actionable |
| Compliance / security | Formal, unambiguous |
| CLI shortcuts | Terse + example |

## Localisation

- Dates and numbers: follow ${iso} locale conventions
${rtl ? "- Layout: support RTL mirroring for UI components (icons, navigation, forms)\n" : ""}- Quotation marks and punctuation: use ${nativeName} typographic norms

## Explaining DNA concepts in ${nativeName}

Use consistent terms for: Knowledge Pack, Behaviour, Cellular Memory, Impressions, Neural Network, Stem Pack.
Define on first use if non-obvious.
`,
    },
  ]);
}

export const LANGUAGE_STEM_PACKS: KnowledgePack[] = [
  LANGUAGE_STEM_BRIDGE_PACK,
  localePack(
    "languages/en",
    "English",
    "en",
    "English",
    false,
    "Neutral professional; match US/UK spelling to user preference",
    "Base reference locale. Use for teams that prefer English. Still apply stem-bridge for sentiment and clarity.",
  ),
  localePack(
    "languages/es",
    "Spanish",
    "es",
    "Español",
    false,
    "Use **tú** for dev tooling chat unless user uses **usted**; formal for compliance docs",
    "Watch European vs Latin American vocabulary (ordenador/computadora, archivo/fichero). Default to neutral international Spanish unless user signals region.",
  ),
  localePack(
    "languages/fr",
    "French",
    "fr",
    "Français",
    false,
    "Use **vous** in professional context; **tu** only if user initiates tutoiement",
    "Preserve French technical borrowings (le commit, le debug) common in dev culture. Accents required in user-facing copy.",
  ),
  localePack(
    "languages/de",
    "German",
    "de",
    "Deutsch",
    false,
    "Formal **Sie** for enterprise/compliance; **du** acceptable in startup/dev chat if user uses du",
    "Compound nouns for concepts are natural. Keep English API terms; translate descriptions. Mind capitalization of nouns.",
  ),
  localePack(
    "languages/ja",
    "Japanese",
    "ja",
    "日本語",
    false,
    "Polite **です・ます** default; casual only if user uses plain form",
    "Technical katakana for loanwords (API, コミット). Indirect refusals common — read between lines. Avoid overly literal translations.",
  ),
  localePack(
    "languages/zh-cn",
    "Chinese (Simplified)",
    "zh-CN",
    "简体中文",
    false,
    "Professional 您 in formal docs; 你 in collaborative dev chat",
    "Simplified characters only unless user requests Traditional (zh-TW). Technical terms often stay English or use established 中文 equivalents.",
  ),
  localePack(
    "languages/pt",
    "Portuguese",
    "pt",
    "Português",
    false,
    "Neutral Brazilian-leaning unless user signals European Portuguese",
    "PT-BR vs PT-PT: verb conjugation and vocabulary differ (você/tu, telemóvel/celular). Ask if unclear.",
  ),
  localePack(
    "languages/ko",
    "Korean",
    "ko",
    "한국어",
    false,
    "Honorific **합니다** default; match user's speech level",
    "Hangul for explanations; Latin for code. Age/hierarchy affects formality — follow user's lead.",
  ),
  localePack(
    "languages/ar",
    "Arabic",
    "ar",
    "العربية",
    true,
    "Modern Standard Arabic for docs; dialect only if user writes in dialect",
    "RTL layout mandatory for UI work. Technical terms often transliterated or English. Formal plural and gender agreement in user-facing strings.",
  ),
  localePack(
    "languages/vi",
    "Vietnamese",
    "vi",
    "Tiếng Việt",
    false,
    "Friendly professional; **anh/chị** if user uses kinship pronouns",
    "Heavy English mixing in tech speech is normal — do not 'correct' mixed input. Diacritics (tone marks) required. Southern vs Northern vocabulary minor — stay neutral.",
  ),
  localePack(
    "languages/th",
    "Thai",
    "th",
    "ไทย",
    false,
    "Polite particles (ครับ/ค่ะ) when user uses them; avoid overly stiff royal/formal register in dev chat",
    "No spaces between words in Thai — still format markdown lists clearly. English tech terms commonly embedded.",
  ),
  localePack(
    "languages/id",
    "Indonesian",
    "id",
    "Bahasa Indonesia",
    false,
    "Professional but approachable; **Anda** in formal docs, **kamu** in casual dev chat if user does",
    "Heavy English loanwords in tech (deploy, commit, push). Do not over-translate established terms. Clear, direct sentences preferred over long clauses.",
  ),
  localePack(
    "languages/hi",
    "Hindi",
    "hi",
    "हिन्दी",
    false,
    "Respectful **आप** default; match user's level of formality",
    "Dev discourse often Hinglish (Hindi + English technical terms). Preserve English tokens for APIs and tools. Use Devanagari for explanations; avoid awkward transliteration of common tech words.",
  ),
  localePack(
    "languages/zh-tw",
    "Chinese (Traditional)",
    "zh-TW",
    "繁體中文",
    false,
    "Professional 您 in formal docs; 你 in collaborative dev chat",
    "Traditional characters only — never simplify to 简体. Vocabulary differs from zh-cn (軟體/软件, 程式/程序, 伺服器/服务器). Default to Taiwan usage unless user signals HK/Macau.",
  ),
  localePack(
    "languages/it",
    "Italian",
    "it",
    "Italiano",
    false,
    "Use **Lei** in enterprise/compliance; **tu** common in startup and dev chat",
    "English tech terms widely used (commit, deploy, branch). Accents required. Prefer clear Italian over literal calques from English.",
  ),
  localePack(
    "languages/nl",
    "Dutch",
    "nl",
    "Nederlands",
    false,
    "Informal **je/jij** in dev chat; **u** for formal compliance and enterprise docs",
    "High English proficiency — users may switch languages mid-conversation. Dutch compound words natural for concepts. Belgian (Flemish) vs Netherlands Dutch minor — stay neutral unless user specifies.",
  ),
  localePack(
    "languages/he",
    "Hebrew",
    "he",
    "עברית",
    true,
    "Modern Hebrew; formal plural for docs, conversational for dev chat",
    "RTL layout mandatory for UI work. English tech terms very common — keep API names and CLI commands in Latin script. Gendered grammar affects UI strings — note gender-neutral options where possible.",
  ),
];

export const LANGUAGE_STEM_PACK_IDS = LANGUAGE_STEM_PACKS.map((p) => p.id);
