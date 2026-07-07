# Password & Authentication Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Password & Authentication Policy.docx`

---

Password & Authentication Policy

## Uk Gdpr

Purpose

Defines authentication and credential requirements for [Product Name] customer users and [Company Name] personnel.

Aligns identity controls with Azure AD B2C for customers and corporate Entra ID for operators.

### The objective of this document is to ensure that

protect accounts through strong authentication and secure credential lifecycle,

reduce account takeover risk affecting personal data,

eliminate shared and embedded long-lived secrets where Managed Identity is available.

### This document establishes

MFA and B2C policy requirements

service identity and Key Vault patterns

### This document supports

Authentication Architecture

Change Management Policy

Scope

This document governs authentication to [Product Name] application, customer IdP federation, and corporate access to Azure production for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes service accounts, Managed Identities, and API keys where unavoidable

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Protect accounts through strong authentication and secure credential lifecycle.

Reduce account takeover risk affecting personal data.

Eliminate shared and embedded long-lived secrets where Managed Identity is available.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Security Lead

Authentication standard owner and exception approval

Engineering Lead

Implements B2C policies, token lifetimes, and service identity patterns

IT / Identity Admin

Configures MFA, conditional access, and password policies

Customer Success

Communicates MFA requirements to enterprise customers

Support Lead

Account recovery procedures without exposing customer content

Customer Authentication

Mandatory controls

Customer administrative roles MUST enforce MFA via Azure AD B2C or federated IdP equivalent.

MFA MUST be offered to all [Product Name] users; enterprise contracts MAY mandate MFA for all tenant users.

Passwords where used MUST be minimum 12 characters with breach list checking or passphrase equivalent.

Password reset MUST verify identity through B2C flows; support MUST NOT set passwords manually without strong verification.

Federated SSO customers MUST use SAML/OIDC with signed assertions; insecure protocols prohibited.

Service Identities and Secrets

Mandatory controls

Service accounts for [Product Name] workloads MUST use Managed Identity; static keys prohibited except documented legacy with rotation ≤90 days.

API keys MUST be stored in Key Vault; injection at runtime only; never in source control.

Session tokens MUST expire per Authentication Architecture; refresh token rotation MUST be enabled.

Credential compromise MUST trigger forced global sign-out and token revocation within one hour.

B2C custom policies MUST be version-controlled and reviewed on change per Change Management Policy.

Monitoring and Personnel

Mandatory controls

Failed login attempts MUST be rate-limited with lockout thresholds and Security alerting.

Authentication logs MUST capture user ID, tenant, timestamp, result, and source IP without password values.

Corporate personnel accessing production MUST use hardware-backed MFA and compliant devices.

Break-glass accounts MUST be vaulted, monitored, and reviewed after each use.

Legacy authentication methods MUST have sunset dates approved by Security Lead.

Assurance

Mandatory controls

Quarterly review of service principals and Managed Identities for unused permissions.

Annual test of account recovery flows in staging without using production customer data.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Engineering defines token lifetimes and documents in Authentication Architecture.

2. IT configures B2C MFA and conditional access baselines for production tenant.

3. Enterprise customers onboard SSO with Security review of metadata and certificate expiry monitoring.

4. Security Operations monitors failed login anomalies daily.

5. Quarterly review of service principals and Managed Identities for unused permissions.

6. Credential compromise playbooks executed: revoke sessions, rotate secrets, notify DPO if personal data accessed.

7. Annual test of account recovery flows in staging without using production customer data.

8. Policy updates communicated to customers when authentication requirements change.

9. B2C policy changes tested in staging before production promotion.

10. Break-glass account usage reviewed within 48 hours.

11. Certificate expiry monitored with 30-day alerts.

12. Legacy auth sunset dates tracked monthly until decommissioned.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

B2C policy export

MFA enforcement for admin roles

Conditional access

Corporate production access policies

Auth logs sample

Failed login alert configuration

Key Vault audit

Secret access and rotation events

SSO review

Enterprise federation checklist completions

Escalation

Widespread credential stuffing: Security declares incident; temporary tightened rate limits deployed.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Legacy auth requires Security approval, compensating monitoring, and published sunset date.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
