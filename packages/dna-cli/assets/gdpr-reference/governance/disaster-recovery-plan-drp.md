# Disaster Recovery Plan (DRP)

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Disaster Recovery Plan (DRP).docx`

---

Disaster Recovery Plan (DRP)

## Uk Gdpr

Purpose

Defines technical recovery procedures for [Product Name] platform failure in Azure UK South.

Restores App Service, SQL, Blob, Service Bus, Key Vault dependencies, and optional Azure OpenAI connectivity within RTO/RPO.

### The objective of this document is to ensure that

restore production service within documented RTO with data loss within RPO,

prevent unauthorised data movement outside UK during failover,

validate recoverability through annual tests.

### This document establishes

DR runbooks and validation scripts

UK-only failover constraints

### This document supports

Backup & Recovery Policy

Business Continuity Plan (BCP)

Scope

This document governs disaster recovery for production [Product Name] workloads hosted in Azure UK South for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Excludes non-production unless explicitly approved for DR test

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Restore production service within documented RTO with data loss within RPO.

Prevent unauthorised data movement outside UK during failover.

Validate recoverability through annual tests.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Operations Lead

DR activation, runbook execution, validation sign-off

Engineering Lead

Application redeploy, schema validation, tenant isolation tests

DevOps Lead

Infrastructure restore, DNS, certificates, Key Vault secrets

Security Lead

Security control verification post-recovery

Data Protection Officer

Assesses breach notification if data integrity or confidentiality affected

Runbooks and Testing

Mandatory controls

DR runbooks MUST cover SQL point-in-time restore, App Service redeploy, Blob consistency checks, and Service Bus namespace recovery.

DR MUST be tested at least annually with written results including actual RTO/RPO achieved.

Runbooks MUST be version-controlled and reviewed quarterly for accuracy against live architecture.

Failed DR test MUST escalate to Engineering and Executive within 24 hours with remediation plan.

DR test in production requires change window approval and customer notification if visible.

UK Residency and Data Integrity

Mandatory controls

Failover MUST NOT move production customer personal data outside UK South without DPO, Legal, and customer approval.

Data integrity checks MUST compare record counts and checksums on sample tenants after restore.

Personal data breach assessment MUST be completed if restore involved exposure to unauthorised environments.

Immutable or geo-redundant backups MUST be used for ransomware resilience.

Post-Recovery Security

Mandatory controls

Configuration and secrets MUST be recoverable from IaC repository and Key Vault backups.

Post-recovery validation MUST include authentication via Azure AD B2C, sample tenant API tests, and RBAC isolation checks.

Security logging MUST be restored before traffic is re-admitted to production.

Third-party dependencies (Azure OpenAI private endpoint) MUST be included in test scope when AI enabled.

Roles and Communications

Mandatory controls

DR roles MUST have on-call trained personnel at all times.

DR communications MUST coordinate with BCP customer messaging templates.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Operations declares disaster when Azure impairment or data centre loss exceeds RTO trigger.

2. Incident commander opens bridge; Engineering freezes changes except DR tickets.

3. DevOps executes SQL restore to target timestamp within RPO window.

4. Engineering redeploys App Service from last known good release artifact.

5. DevOps restores DNS and TLS certificates; validates Key Vault secret availability.

6. Engineering runs automated tenant isolation and authentication smoke tests.

7. Security confirms logging and monitoring active before reopening traffic.

8. Customer Success sends resolution notice; Operations documents actual RTO/RPO.

9. Post-incident review within 10 working days updates runbooks and risk register.

10. DR roles confirmed on on-call roster weekly.

11. Runbook accuracy reviewed quarterly against live architecture.

12. Breach assessment completed if confidentiality or integrity at risk.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

DR test report

Annual results with RTO/RPO metrics

Runbooks

Version-controlled documents matching architecture

Validation scripts

Post-restore test output

Change approvals

Production DR test tickets

PIR

Post-disaster review for real activations

Escalation

Failed DR test: Engineering Lead and Executive notified within 24 hours.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Production DR test requires change approval and customer notice if user-visible.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
