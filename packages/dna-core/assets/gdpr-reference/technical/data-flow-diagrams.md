# Data Flow Diagrams

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Data Flow Diagrams.docx`

---

Data Flow Diagrams

## Uk Gdpr

Primary flows

User authentication

Browser → B2C (login) → JWT → API validates issuer/tenant → session established. Tokens not logged.

Note create / edit

Browser → API (HTTPS, JWT) → SQL insert/update scoped by tenantId + teamId → audit event.

Attachments: Browser → API → Blob (tenant prefix) → SQL metadata row.

AI summarisation (LLM)

Browser triggers feature → API: quota/token cost check → input appropriateness check → system prompts + approved context assembled in-memory → Azure OpenAI → output check → sanitised result to user.

Only final user-saved content stored. No permanent storage of user prompts or raw model payloads.

Speech-to-text

Browser streams audio → API: usage check → Whisper → transcript sense-check → optional AI restructure (system prompts only after checks) → output check → cleaned transcript to user.

Persist: cleaned transcript and final approved content only. Audio archive to Blob on session end per retention policy.

[Product Name] is a workspace and productivity platform. It is not a medical device, clinical system, or regulated health record. Users must not rely on [Product Name] for diagnosis, treatment, or clinical decision-making. AI outputs are assistive drafts only.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
