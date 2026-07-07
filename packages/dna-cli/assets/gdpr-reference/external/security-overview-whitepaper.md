# Security Overview - Whitepaper

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `External - Customer-Facing Documents/Security Overview - Whitepaper.docx`

---

Security Overview / Whitepaper

## Uk Gdpr

Executive summary

[Product Name] security posture

[Product Name] is a multi-tenant SaaS platform hosted exclusively in Azure UK South for UK customers.

[Product Name] is a workspace and productivity platform. It is not a medical device, clinical system, or regulated health record. Users must not rely on [Product Name] for diagnosis, treatment, or clinical decision-making. AI outputs are assistive drafts only.

Defence in depth: identity, network, application, data, and operational layers.

Architecture highlights

Layers

Users authenticate via Azure AD B2C (HTTPS, MFA supported)

React SPA → Node.js API → Azure SQL + Blob

Azure OpenAI via private endpoint; Managed Identity only

Row-Level Security and mandatory tenantId on queries

Immutable audit logging; encrypted at rest (TDE, SSE)

Compliance

Standards alignment

UK GDPR and DPA 2018

SOC 2 Type II (roadmap / in progress — update status before customer distribution)

Annual penetration test; continuous SAST/SCA

_Template — customize confidentiality and ownership statements for your organisation before distribution._
