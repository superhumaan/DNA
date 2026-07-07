# Infrastructure Architecture Diagram

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Infrastructure Architecture Diagram.docx`

---

Infrastructure Architecture Diagram

## Uk Gdpr

UK South deployment

Logical architecture (textual)

[Product Name] is offered exclusively in the United Kingdom (England, Wales, Scotland, and Northern Ireland). Customer data is processed and stored in Microsoft Azure UK South. [Company Name] does not offer multi-region tenancy, data residency selection, or services outside the UK.

[Internet] → Azure Front Door / WAF → App Service (Node API) + Static Web (React)

App Service → Private Endpoint → Azure SQL (tenant data, audit_logs)

App Service → Private Endpoint → Blob Storage (attachments, audio)

App Service → Private Endpoint → Azure OpenAI (GPT, Whisper)

Azure AD B2C ←→ Users (OIDC)

Azure Monitor / Application Insights / Key Vault / Defender

Environment segregation

Separate subscriptions or resource groups: dev, staging, production

No production data in lower environments

Managed Identity per environment

_Template — customize confidentiality and ownership statements for your organisation before distribution._
