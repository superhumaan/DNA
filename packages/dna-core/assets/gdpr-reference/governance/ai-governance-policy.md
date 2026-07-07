# AI Governance Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/AI Governance Policy.docx`

---

AI Governance Policy

## Uk Gdpr

AI Request Pipeline (Mandatory Order)

Principle

User content is never sent directly to the model without prior checks. [Company Name] controls system prompts; users cannot override system instructions in production.

Purpose: quota enforcement, cost control, and appropriateness at input and output.

LLM features (summarise, commands, etc.)

1. Receive request — authenticated API only; browser never calls Azure OpenAI directly

2. Token quota check — calculate estimated tokens/cost; reject with HTTP 429 if tenant or user budget insufficient (no AI call made)

3. Input appropriateness check — content screened for policy violations before any model call

4. If checks pass — assemble request in-memory: [Company Name] system prompts (versioned, not user-editable) plus approved context only

5. Call Azure OpenAI (UK South, private endpoint) via Managed Identity

6. Output appropriateness check — response screened before return to user

7. Return sanitised result — user may save; only cleaned final output is eligible for persistence

Speech-to-text and refinement

1. Receive audio stream — buffered in-memory during session

2. Token / usage check — audio minutes and cost quota validated before Whisper call

3. Whisper transcription — Azure OpenAI Whisper (UK South); raw audio buffer discarded after call

4. Transcript sense-check — appropriateness and quality screening on returned text

5. Optional AI refinement — only after sense-check passes: system prompts added to guide restructuring (never raw uncontrolled user text sent without checks)

6. Output check — refined text screened again

7. Persist only: cleaned transcript and final user-approved content — not intermediate prompts or raw model payloads

What we store

User-authored prompts (if any) are never permanently stored

[Company Name] system prompt templates are versioned in source code only — not stored per request

Raw prompts sent to the model and raw completions are in-memory only for the duration of the request

Telemetry stores metadata only: token counts, cost attribution, latency, feature, tenantId — never prompt or response body

Durable storage allowed: cleaned transcript (STT) and final structured content the user explicitly saves

Governance model

Purpose

Defines accountability for AI in [Product Name]: Azure OpenAI (GPT-4o, Whisper) in UK South only.

[Product Name] is a workspace and productivity platform. It is not a medical device, clinical system, or regulated health record. Users must not rely on [Product Name] for diagnosis, treatment, or clinical decision-making. AI outputs are assistive drafts only.

Aligns with UK GDPR, ICO guidance, and internal risk management.

Roles

AI Governance Lead (Product + Engineering) — feature approval, prompt versioning

DPO — privacy impact and transparency

Security — abuse prevention, monitoring, incident linkage

Legal — customer-facing statements and DPA annexes

Lifecycle controls

Design to retirement

DPIA required for new AI features or material model changes

Prompt templates versioned in source control; code review mandatory

Pre-release evaluation per AI Testing & Evaluation Process

Post-release monitoring of error rates, abuse signals, and cost

Deprecation plan when models are retired by Microsoft

Prohibited uses

Never permitted

Clinical diagnosis, treatment recommendations, or regulated medical advice

Fully automated decisions without human review for rights-impacting outcomes

Training custom models on customer data

Sending customer data to non-Azure OpenAI endpoints

Cross-tenant prompt context

_Template — customize confidentiality and ownership statements for your organisation before distribution._
