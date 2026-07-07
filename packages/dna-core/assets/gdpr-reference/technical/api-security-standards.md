# API Security Standards

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/API Security Standards.docx`

---

API Security Standards

## Uk Gdpr

Purpose

This document defines mandatory security requirements for [Product Name] public REST APIs behind Application Gateway WAF.

Protects tenant data at the primary application boundary.

### The objective of this document is to ensure that

authentication, authorisation, input validation, and abuse protection apply on every request,

alignment with OWASP API Security Top 10 is demonstrable,

penetration test and SAST evidence is supported.

### This document establishes

API security baseline, OpenAPI review gates, and rate limiting standards.

### This document supports

OWASP/SAST/DAST Evidence and Penetration Test Reports.

Scope

This document governs all HTTP APIs exposed to customers and internal microservices processing personal data for [Company Name] in relation to the [Product Name] platform.

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

Trust Zones and Security Boundaries

Public zone

Internet-facing WAF and Static Web Apps. Only TLS 1.2+ HTTP(S) permitted.

No direct database or storage endpoints exposed publicly.

Application zone

App Service API tier — authentication middleware, tenant resolution, RBAC, rate limits.

All customer data operations originate here; browser never calls Azure OpenAI directly.

Data zone

Azure SQL, Blob, Key Vault, OpenAI — private endpoints only; network deny public access.

Managed Identity from App Service; human operator access to tenant workspace content prohibited by default.

Identity zone

Azure AD B2C (customers) separate from Microsoft Entra ID ([Company Name] staff).

Service principals scoped per environment; production credentials invalid in dev/staging.

OWASP API Security Top 10 Alignment

Broken object level authorisation — tenant-scoped RBAC on every resource operation.

Broken authentication — JWT validation middleware; no auth bypass.

Unrestricted resource consumption — rate limits per IP, user, tenant; stricter on auth and AI routes.

Unsafe consumption of APIs — schema validation, size limits, rejection of unexpected fields.

Security misconfiguration — CORS, security headers, error sanitisation.

Inventory and monitoring — OpenAPI specs reviewed on material change.

WAF and Edge Controls

Application Gateway WAF (OWASP CRS) in front of API tier. TLS 1.2+ end-to-end; weak ciphers disabled.

File uploads: type/size validation; tenant-scoped Blob paths only.

Authentication and Authorisation

Every request

Every API request MUST authenticate via valid JWT unless explicitly documented public endpoint — Enforcement: middleware; OpenAPI securitySchemes; CI contract tests

Authorisation MUST enforce tenant-scoped RBAC on every resource operation — Enforcement: central policy engine; integration tests per endpoint

IDOR and mass assignment MUST be tested in CI and annual pentest — Enforcement: SAST/DAST per OWASP evidence document

Transport and Input

TLS and validation

TLS 1.2+ MUST be enforced end-to-end; weak ciphers disabled on Application Gateway — Enforcement: SSL labs scan quarterly; Azure Policy

Input validation MUST use schema validation with size limits and rejection of unexpected fields — Enforcement: validator middleware; fuzz testing in DAST

Error responses MUST NOT leak stack traces, internal IDs, or other tenants' existence — Enforcement: standard error handler; DAST checks

Abuse and Headers

Rate limiting and CORS

Rate limiting MUST apply per IP, user, and tenant with stricter limits on auth and AI routes — Enforcement: WAF + API rules; abuse alerts

CORS MUST allow only approved [Product Name] web origins in production — Enforcement: config review each release

Security headers (HSTS, CSP where applicable) MUST be set on API and static responses — Enforcement: header lint in CI

Lifecycle

Versioning and incidents

OpenAPI specifications MUST be reviewed by Security on material change — Enforcement: PR label security-review-required

Service accounts MUST use Managed Identity; API keys only for approved integrations with rotation — Enforcement: Secrets Management Standard

Breaking security fix MUST be deployable within vulnerability SLA — Enforcement: Incident Response linkage; emergency change process

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Design API → threat model → implement controls → OpenAPI review → SAST/DAST → pentest → release.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

OpenAPI specs

Security schemes documented

CI security test results

Per release

WAF logs

Monthly review

Escalation

Critical API vulnerability: emergency patch; customer notification if exploitation detected.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Deprecated API version extension requires Security risk acceptance with expiry.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
