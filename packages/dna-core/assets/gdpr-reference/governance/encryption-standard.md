# Encryption Standard

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Encryption Standard.docx`

---

Encryption Standard

## Uk Gdpr

Purpose

Defines cryptographic controls for [Product Name] data in transit and at rest across Azure UK South services.

Specifies key management using Azure Key Vault and prohibited algorithms.

### The objective of this document is to ensure that

meet Article 32 confidentiality requirements with industry-standard cryptography,

centralise key lifecycle in Key Vault UK South,

prevent weak protocol or algorithm use.

### This document establishes

TLS, at-rest encryption, and Key Vault requirements

crypto agility planning

### This document supports

Access Control Policy

Backup & Recovery Policy

Scope

This document governs encryption for SQL Database, Blob Storage, App Service TLS, Service Bus, backups, and secrets for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes corporate VPN and device encryption for personnel accessing production

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Meet Article 32 confidentiality requirements with industry-standard cryptography.

Centralise key lifecycle in Key Vault UK South.

Prevent weak protocol or algorithm use.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Security Lead

Crypto standard owner, algorithm approvals, compromise response

Engineering Lead

Application TLS configuration and database encryption enablement

DevOps Lead

Key Vault configuration, rotation automation, and certificate management

Data Protection Officer

Assesses customer-managed key requests and transfer impacts

Compliance Manager

Maintains evidence of TLS and encryption configuration reviews

Encryption in Transit

Mandatory controls

All customer-facing endpoints MUST enforce TLS 1.2 or higher with modern cipher suites; TLS 1.0/1.1 disabled.

Database connections from App Service MUST use encrypted connections with certificate validation.

Private endpoints MUST be used for Azure OpenAI and Key Vault where supported in production.

Penetration tests MUST include TLS configuration assessment annually.

Certificate expiry MUST be monitored with alerts 30 days before expiration.

Encryption at Rest and Keys

Mandatory controls

Data at rest in Azure SQL and Blob MUST use platform encryption; customer-managed keys supported where contracted.

Application secrets MUST be stored in Azure Key Vault UK South with RBAC and audit logging enabled.

Cryptographic keys MUST be rotated at least annually or immediately on suspected compromise.

Key access MUST be limited to Managed Identities and named break-glass accounts with logging.

Hard-coded keys in configuration files are prohibited; pipeline scanners MUST enforce.

Prohibited Algorithms and Legacy

Mandatory controls

Deprecated algorithms (MD5, SHA-1 for signatures, DES, RC4) MUST NOT be used for new implementations.

Field-level encryption for highly sensitive Restricted data MUST use approved libraries and keys from Key Vault.

Crypto agility plan MUST document migration path if algorithms become deprecated.

Encryption exceptions for legacy integrations MUST have risk acceptance and sunset date.

Backups

Mandatory controls

Backup encryption MUST match or exceed production data encryption per Backup & Recovery Policy.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Engineering enables encryption by default in IaC templates for SQL, Blob, and storage accounts.

2. DevOps configures Key Vault keys, access policies, and rotation automation.

3. Security runs quarterly TLS external scan on production endpoints.

4. Certificate renewal tickets created from monitoring alerts; completed before expiry.

5. On compromise: rotate affected keys, revoke sessions, assess breach procedure for data exposure.

6. Customer-managed key onboarding documented with DPO review of access and deletion capabilities.

7. Annual review of cipher suites against NCSC and vendor guidance.

8. Update standard when Azure deprecates protocols; emergency change if critical advisory issued.

9. Legacy crypto exceptions reviewed quarterly for sunset compliance.

10. Key Vault access reviewed quarterly with access review records.

11. Private endpoint configuration verified monthly for OpenAI and Key Vault.

12. Encryption evidence exported for customer diligence on request.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

TLS scan

Quarterly external scan results

Key Vault audit

Access and rotation logs

IaC encryption flags

Terraform/Bicep showing encryption enabled

Certificate inventory

Expiry monitoring dashboard

Risk acceptances

Legacy crypto exceptions with dates

Escalation

Weak crypto on production endpoint: emergency change within 24 hours per Change Management Policy.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Legacy integration crypto requires Security risk acceptance and documented sunset.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
