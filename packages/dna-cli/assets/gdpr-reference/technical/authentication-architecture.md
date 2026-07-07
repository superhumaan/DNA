# Authentication Architecture

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Authentication Architecture.docx`

---

Authentication Architecture

## Uk Gdpr

Purpose

This document describes [Product Name] customer and staff authentication: Azure AD B2C, token validation, session management, MFA, and service identity.

Supports Access Control Policy and Password & Authentication Policy implementation evidence.

### The objective of this document is to ensure that

only authenticated, authorised principals access tenant data,

token lifetimes, MFA, and logging without credential leakage are documented,

customer B2C flows are separated from staff Entra ID flows.

### This document establishes

identity architecture narrative, configuration export cadence, and break-glass rules.

### This document supports

Article 32 access control demonstrations and customer security questionnaires.

Scope

This document governs authentication and session management for customer users, customer administrators, and [Company Name] staff accessing [Product Name] systems for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Production customer personal data SHALL remain in Microsoft Azure UK South only; no multi-region tenancy or data residency selection is offered.

[Product Name] is a non-medical, non-clinical workspace platform (notes, work boards, teams, search, optional AI and STT). It does not provide diagnosis, treatment, or clinical decision support.

Approved production stack: Internet → Azure Application Gateway (WAF) → Azure App Service (Node.js API) + Azure Static Web Apps (React); private endpoints to Azure SQL, Blob Storage, Azure OpenAI, and Azure Key Vault (UK South); Azure AD B2C (OIDC) for customer identity; Azure Monitor / Application Insights / Microsoft Defender for Cloud.

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Aligns with ICO Data Protection Audit Framework — Information & cyber security and Records management toolkits.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Engineering Lead

Architecture accuracy, diagram updates, control implementation

Security Lead

Security review, evidence acceptance, access and pentest governance

DPO

Privacy alignment, retention, DPIA and ROPA linkage

Operations Lead

Backup, restore, availability evidence

Compliance

Audit pack curation and control matrix alignment

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Identity Flows (Summary)

Customer (B2C)

Browser → B2C hosted UI → OIDC tokens → API validates issuer, audience, expiry, tenantId → session context.

B2C custom attributes for tenantId MUST be immutable by end users post-provisioning.

Staff (Entra ID)

Entra ID → Conditional Access MFA → Azure portal / CI/CD / observability — separate from customer B2C tenant.

Production Azure RBAC via PIM time-bound elevation where available.

Service identity

App Service Managed Identity → Key Vault, SQL, Blob, OpenAI — no user delegation; no shared API keys in production.

Token and Session Controls

Session and refresh token lifetimes align with Password & Authentication Policy maximums.

Logout and token revocation paths invalidate refresh tokens where supported.

CORS and cookies restrict token exposure to approved [Product Name] origins.

Customer Identity (B2C)

OIDC requirements

Customer authentication MUST use Azure AD B2C with OIDC; local password stores in application database are prohibited — Enforcement: B2C configuration reviewed quarterly; custom policies version-controlled

MFA MUST be available and enforced for customer administrators per tenant policy — Enforcement: B2C Conditional Access; quarterly MFA enrollment report

Password reset flows MUST not disclose account existence beyond necessary UX — Enforcement: security review of error messages; DAST checks

API Token Validation

JWT enforcement

API MUST validate JWT signature, issuer, audience, expiry, and tenantId on every request except documented public health endpoints — Enforcement: middleware enforced; negative tests in CI; auth bypass is Sev-1

Authentication events MUST be logged per Audit Logging Design without passwords, tokens, or secrets — Enforcement: log schema review; sample log audit quarterly

Failed authentication MUST trigger rate limiting and alerting per Logging & Monitoring Policy — Enforcement: WAF + API rate limits; SIEM rules tested semi-annually

Staff and Service Authentication

Privileged access

[Company Name] staff MUST use MFA on Entra ID for production systems — Enforcement: Conditional Access policies; Access Review Records include staff MFA

Service-to-service calls MUST use Managed Identity or certificate-based auth within Azure UK South — Enforcement: Key Vault references only; secret scan in CI blocks keys in code

Break-glass accounts MUST be named, limited count, MFA-protected, reviewed monthly — Enforcement: Access Review Records; unused break-glass disabled

Integration and Lifecycle

Keys and updates

API keys for integrations MUST be tenant-scoped, rotatable, and stored in Key Vault — Enforcement: Secrets Management Standard; rotation within 4 hours on compromise

Architecture document MUST be updated within 30 days of IdP, token, or MFA policy change — Enforcement: change ticket linkage; Compliance tracks staleness

CORS and cookie settings MUST restrict token exposure to approved [Product Name] origins — Enforcement: periodic configuration scan; pentest token theft scenarios

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Maintain architecture narrative and sequence diagrams → review on auth change → align B2C and Entra configs → export quarterly config snapshot to evidence repo.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Authentication architecture

Versioned PDF

B2C/Entra config export

Quarterly

Auth event log samples

Redacted, quarterly

MFA enrollment report

Quarterly

Escalation

Authentication bypass or token forgery: emergency patch; incident per Incident Response Plan.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Legacy integration auth extension requires Security + DPO approval with sunset date.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
