# Change Management Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Change Management Policy.docx`

---

Change Management Policy

## Uk Gdpr

Purpose

Governs controlled changes to [Product Name] production environments, AI models, and customer-visible behaviour.

Balances agility with risk management and privacy/security review.

### The objective of this document is to ensure that

prevent unauthorised or untested production changes,

ensure rollback capability and audit trail,

integrate AI and privacy gates.

### This document establishes

change categories and CAB

emergency change retrospective

### This document supports

AI Change Management Procedure

Secure SDLC Policy

Scope

This document governs production changes to App Service, Azure SQL, Blob, Service Bus, Key Vault, B2C policies, AI configuration, and DNS for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes emergency and standard changes

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Prevent unauthorised or untested production changes.

Ensure rollback capability and audit trail.

Integrate AI and privacy gates.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Engineering Lead

Change approval authority for standard changes, CAB chair

Security Lead

Security-impacting change review

Data Protection Officer

Privacy-impacting change gate

Operations Lead

Deployment execution and rollback coordination

Product Manager

Customer communication for visible changes

Change Control

Mandatory controls

Production changes MUST have ticket, risk classification (standard/normal/emergency), and rollback plan.

Emergency changes MUST be documented within 24 hours post-implementation with retrospective review.

Deployments MUST use CI/CD pipelines with approval gates; manual portal changes prohibited except break-glass.

Separation of duties: deployer MUST NOT be sole approver for same production change.

Change log MUST be retained linking commit, ticket, and deployment ID.

Review Gates

Mandatory controls

Security-impacting changes MUST include Security review before deploy.

Privacy-impacting changes MUST include DPO sign-off before deploy.

AI model, prompt template, or pipeline changes MUST follow AI Change Management Procedure.

Database schema changes MUST include migration rollback scripts tested in staging.

Configuration changes MUST be applied via IaC where possible with drift remediation.

Customer Impact

Mandatory controls

Customer-visible downtime MUST be communicated per status page playbook at least 30 minutes before planned maintenance when duration exceeds 15 minutes, unless emergency change — emergency notice within 15 minutes of start.

Change windows MUST be defined for high-risk periods; blackouts during customer peak if agreed.

Failed changes MUST trigger rollback or forward fix decision within 60 minutes for Sev-1 impact.

Post-implementation review required for emergency changes within 5 working days.

Standard low-risk changes MAY use pre-approved pipeline path without CAB if documented in change catalogue.

Metrics

Mandatory controls

Monthly metrics review: failed changes, rollbacks, emergency rate.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Author creates change ticket with description, risk, test evidence, and rollback steps.

2. Peer and Security review as required by risk classification.

3. DPO privacy gate for applicable changes; AI governance for AI changes.

4. CAB reviews normal/high-risk changes in scheduled meeting or async approval.

5. Operations deploys during window; monitors dashboards during and after.

6. Verify health checks and tenant isolation smoke tests post-deploy.

7. Close ticket with outcome; emergency changes get retrospective within 24 hours.

8. Monthly metrics review: failed changes, rollbacks, emergency rate.

9. Pre-approved catalogue reviewed annually.

10. Break-glass manual change backfilled to IaC within 48 hours.

11. Customer status page updated for visible downtime.

12. Rollback executed within 60 minutes for Sev-1 customer impact.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Change tickets

Production changes with approvals

Emergency retrospectives

Within 24h documentation

CAB minutes

Normal/high-risk decisions

Deployment logs

Pipeline IDs linked to tickets

Privacy gate

DPO sign-offs where required

Escalation

Failed change with customer impact: incident commander and rollback within 60 minutes.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Pre-approved standard changes documented in catalogue with annual review.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
