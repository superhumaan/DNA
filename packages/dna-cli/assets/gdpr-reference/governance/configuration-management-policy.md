# Configuration Management Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Configuration Management Policy.docx`

---

Configuration Management Policy

## Uk Gdpr

Purpose

Ensures consistent, documented, and secure configuration of [Product Name] infrastructure and applications.

Detects and remediates configuration drift from approved baselines.

### The objective of this document is to ensure that

support secure baselines and auditability,

enable reliable disaster recovery from known configuration,

prevent manual untracked changes.

### This document establishes

IaC-first configuration

drift detection and remediation

### This document supports

Environment Segregation Standard

Encryption Standard

Scope

This document governs Azure resources, App Service settings, network security groups, B2C policies, and application feature flags in production and staging for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes IaC repositories and pipeline variables

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Support secure baselines and auditability.

Enable reliable disaster recovery from known configuration.

Prevent manual untracked changes.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

DevOps Lead

IaC standards, drift detection, baseline maintenance

Security Lead

Hardening baselines and exceptions

Engineering Lead

Application configuration and feature flags

Operations Lead

Production configuration change execution

Data Protection Officer

Reviews configuration affecting privacy (logging, retention flags)

Infrastructure as Code

Mandatory controls

Production configuration MUST be defined in version-controlled IaC (Bicep/Terraform) with peer review.

Manual production configuration changes in Azure portal are prohibited except documented break-glass.

Configuration drift MUST be detected monthly and remediated via change ticket within 10 working days.

Baselines MUST align with Environment Segregation Standard and Encryption Standard.

Break-glass manual changes MUST be retrofitted into IaC within 48 hours.

Security Baselines

Mandatory controls

Secrets MUST NOT be stored in App Service configuration plaintext; Key Vault references required.

Network security groups MUST deny inbound management ports from internet.

Azure Policy assignments MUST enforce tagging and region constraints for UK South.

Service Bus and SQL firewall rules MUST default deny with explicit allow lists.

Unauthorized drift with security impact MUST trigger Sev-2 incident.

Application and Identity

Mandatory controls

Feature flags affecting personal data or AI MUST require DPO and AI governance approval before enablement.

B2C policy changes MUST be tested in staging tenant before production promotion.

Staging configuration MUST NOT point to production databases.

Configuration snapshots MUST be taken before major changes per Backup policy.

Review

Mandatory controls

Quarterly review of all production settings against baseline document.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Engineer proposes IaC change via pull request with Security review for security-related resources.

2. Pipeline applies to staging; validation tests executed.

3. Change ticket links PR; Operations applies to production after approval.

4. Monthly drift scan compares live Azure to IaC state; tickets opened for deltas.

5. Remediate drift by IaC update or approved exception with expiry.

6. Break-glass: manual fix, incident ticket, IaC backfill within 48 hours.

7. Quarterly baseline review workshop with Security and Engineering.

8. Archive configuration export after major releases for DR purposes.

9. Feature flag changes with privacy impact require DPO ticket.

10. B2C policy promoted from staging with test evidence.

11. Azure Policy compliance report reviewed monthly.

12. Sev-2 opened for security-impacting drift not remediated within 24 hours.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

IaC repository

Commit history for production configs

Drift reports

Monthly comparison results

Break-glass log

Manual changes with IaC follow-up

Azure Policy compliance

Tag and region compliance export

Quarterly review

Signed baseline review memo

Escalation

Security-impacting drift: Sev-2 incident and remediation within 24 hours.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Break-glass requires Security approval and IaC backfill within 48 hours.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
