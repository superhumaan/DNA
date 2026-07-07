# Information Security Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Information Security Policy.docx`

---

Information Security Policy

## Uk Gdpr

Purpose

Sets organisation-wide information security requirements for [Product Name] and supporting [Company Name] systems.

Satisfies Article 32 UK GDPR security of processing through defence-in-depth across identity, network, application, and data layers.

### The objective of this document is to ensure that

protect confidentiality, integrity, and availability of [Product Name] and personal data,

coordinate technical policies under a single security governance model,

enable measurable control effectiveness and incident readiness.

### This document establishes

security programme structure

risk register and control matrix linkage

### This document supports

Access Control Policy

Encryption Standard

Logging & Monitoring Policy

Secure SDLC Policy

Incident Response Plan

Scope

This document governs information security for [Product Name] production, staging with customer-like data, and corporate systems accessing customer metadata for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Excludes customer-controlled endpoint security except as contractual expectation

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Protect confidentiality, integrity, and availability of [Product Name] and personal data.

Coordinate technical policies under a single security governance model.

Enable measurable control effectiveness and incident readiness.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Security Lead (CISO function)

Security programme owner, risk acceptance, incident command

Security Operations

Monitoring, vulnerability management, access reviews, SIEM tuning

Engineering Lead

Secure architecture, patching, tenant isolation implementation

Operations Lead

Availability, backup, DR execution

Data Protection Officer

Privacy alignment, breach assessment, regulatory notification coordination

Architecture and Isolation

Mandatory controls

Security controls MUST align with Access Control Policy, Encryption Standard, Logging & Monitoring Policy, and Secure SDLC Policy.

Production MUST reside in Azure UK South with network segmentation between App Service, SQL, Blob, Key Vault, and Service Bus.

Tenant isolation MUST enforce logical separation in SQL and Blob with tenant-scoped RBAC at API layer per Tenant Isolation Design.

Administrative access to production MUST use individual accounts, MFA, and just-in-time elevation; shared passwords prohibited.

Human access to customer workspace content MUST be denied by default; exceptions require ticket, approval, and immutable audit log.

Vulnerability and Incident Management

Mandatory controls

Vulnerabilities MUST be managed per Vulnerability Management Policy with defined SLAs.

Security incidents MUST follow Incident Response Plan; personal data breaches parallel Data Breach Response Procedure.

Annual penetration test MUST be performed with critical findings remediated or risk-accepted by Security Lead.

Security metrics MUST be reported monthly to Executive: open critical vulns, incidents, access review status.

Secrets, Suppliers, and Environments

Mandatory controls

Secrets MUST be stored in Azure Key Vault UK South; application configuration MUST NOT contain plaintext secrets.

Security architecture review MUST occur for major releases and new Azure services.

Supplier security MUST be assessed before processing personal data per Vendor Management Policy.

Staging environments MUST NOT use production customer data without DPO approval and masking.

Personnel and Cryptography

Mandatory controls

Security awareness training MUST be completed annually by all personnel with system access.

Cryptographic standards MUST prohibit TLS 1.0/1.1 and weak algorithms per Encryption Standard.

Backup encryption and access restrictions MUST match Backup & Recovery Policy.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Security maintains risk register linked to control matrix and treatment plans.

2. Engineering submits major changes for security architecture review before build complete.

3. Security Operations runs continuous vulnerability scanning and daily alert triage.

4. Monthly security committee reviews metrics, incidents, and open risks.

5. Annual penetration test scoped with Engineering; remediation tracked in tickets.

6. Quarterly access reviews executed per Access Control Policy with HR attestation.

7. Policy exceptions documented with compensating controls and expiry.

8. Post-incident lessons learned update standards within 20 working days for Sev-1/2.

9. New Azure services require security architecture review before production.

10. Control matrix updated when policies change materially.

11. Executive briefing on top risks semi-annually.

12. Annual policy review incorporates pen test and incident findings.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Risk register

Current version with treatment owners

Penetration test

Annual report and remediation closure

Vulnerability SLA

Dashboard of open critical/high items

Architecture reviews

Tickets for major releases

Security committee minutes

Monthly with actions

Escalation

Active exploitation or Sev-1: Security Lead declares incident within 30 minutes; DPO engaged if personal data at risk.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Compensating controls require Security Lead and DPO approval with risk register entry.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
