# AI Incident Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI Incident Procedure.docx`

---

AI Incident Procedure

## Uk Gdpr

Purpose

This procedure defines detection, classification, response, and closure for incidents involving [Product Name] AI systems, including personal data breaches.

### The objective of this document is to ensure that

AI incidents are contained quickly,

personal data breaches integrate with UK GDPR breach rules,

evidence is preserved for investigation,

and corrective actions feed risk and control updates.

### This document establishes

incident categories and severity,

response roles and timelines,

breach assessment integration,

post-incident review requirements.

### This document supports

Data Breach Response Procedure,

Incident Response Plan,

AI Auditability Standard,

AI Risk Assessment,

Data Protection Impact Assessment (DPIA) Template.

Scope

### This document applies to

all [Product Name] AI-enabled services and feature flags,

Azure OpenAI integrations in UK South,

speech-to-text and cleaned transcript persistence,

AI summarisation, restructuring, and productivity commands,

AI-assisted search augmentation,

AI orchestration via Azure Functions and Service Bus,

and supporting monitoring, logging, and governance systems.

### This document applies to

production environments hosting customer data,

staging environments where AI services are enabled and may process test or anonymised data,

CI/CD pipelines deploying AI components,

and administrative tooling affecting AI configuration.

### This document applies to

[Company Name] employees and contractors with AI system access,

authorised subprocessors supporting Azure or model operations,

customer administrators enabling AI for their tenant,

and end users invoking AI features within authenticated [Product Name] sessions.

This document aligns with the ICO Data Protection Audit Framework — Artificial Intelligence toolkit control measures.

Control operation MUST be demonstrable through records listed in Evidence and Audit Artefacts.

Cross-reference: AI Auditability Standard is the master technical and governance standard for [Product Name] AI.

Regulatory Alignment

This document supports compliance with UK GDPR, the Data Protection Act 2018, and ICO accountability expectations for AI processing.

Relevant obligations include Articles 5(2), 24, 25, 28, 30, 32, 33, 35, and 22 (no solely automated decisions with legal or similarly significant effects).

[Product Name] SHALL NOT deploy solely automated decision-making producing legal or similarly significant effects without explicit lawful basis and safeguards.

Articles 33–34: breach notification to ICO and individuals when required.

All AI incidents with personal data MUST be assessed under Data Breach Response Procedure.

Governance Structure

Governance Authority

AI governance authority resides with [Company Name] Executive Governance, Compliance, Security, and Engineering leadership.

The Data Protection Officer retains veto on processing that cannot be lawfully justified or adequately risk-mitigated.

AI Governance Responsibilities

Function

Responsibility

Compliance

GDPR oversight, DPIA governance, accountability review

Security

Security monitoring, incident response, access governance

Engineering

Technical implementation, logging, deployment governance

Product

AI scope governance and feature approval

Operations

Monitoring, alerting, retention, backup operations

Support

Controlled customer support access

Leadership

Risk acceptance and governance approval

Governance Review Board

Material AI changes MUST be reviewed through Engineering, Security, Compliance, and Product governance.

Approval SHALL be recorded with ticket reference, approver identity, and date before production deployment.

Emergency deployments require retrospective board review within five working days.

Incident Categories

Security

cross-tenant data exposure,

unauthorised API access to AI routes,

prompt injection leading to data exfiltration,

compromised Managed Identity or Key Vault secret.

Privacy

personal data in logs beyond policy,

unlawful processing purpose,

failure to honour erasure affecting AI-held copies.

Safety and Integrity

harmful content at scale,

systematic clinical or legal advice outputs,

validation pipeline bypass.

Operational

extended AI outage affecting contractual SLAs,

queue backlog causing data processing delay — not automatically a breach.

Severity and SLAs

Severity

Criteria

Initial response

Lead

SEV-1

Confirmed cross-tenant or breach likely

15 minutes

Security + DPO

SEV-2

Policy violation widespread or harmful content

1 hour

Security

SEV-3

Isolated malfunction, no personal data

4 hours

Engineering

SEV-4

Minor defect, workaround available

2 business days

Engineering

Detection Sources

Azure Monitor / Application Insights alerts,

validation and abuse control alerts,

user and administrator reports,

penetration test findings,

support tickets,

internal staff discovery.

Response Procedure (Numbered)

Phase 1 — Triage (0–1 hour)

1. On-call Security acknowledges alert or report.

2. Assign incident commander and severity.

3. Preserve logs and correlation IDs; suspend log deletion.

4. If SEV-1, notify DPO and Leadership immediately.

5. Assess need for AI kill-switch per Human Oversight Framework.

Phase 2 — Containment (1–4 hours)

1. Execute kill-switch or feature flag disable if required.

2. Block abusive accounts or tenants.

3. Rotate secrets if credential compromise suspected.

4. Document all actions in incident ticket.

Phase 3 — Breach Assessment

1. DPO leads assessment per Data Breach Response Procedure.

2. Determine: personal data affected, categories, approximate subjects, likely consequences.

3. ICO notification within 72 hours if required.

4. Individual notification without undue delay if high risk to rights.

5. Record decision rationale even if notification not required.

Phase 4 — Eradication and Recovery

1. Deploy fix via AI Change Management Procedure.

2. Validate with AI Testing & Evaluation Process regression.

3. Restore AI services with enhanced monitoring for 30 days.

Phase 5 — Post-Incident Review

1. Post-incident review within 10 working days for SEV-1/2.

2. Update AI Risk Assessment register.

3. Update controls in AI Auditability Standard mapping if gap found.

4. Customer communication if processor breach affecting customer data.

Communication

Internal

SEV-1: hourly updates to Leadership until contained.

All severities: single incident channel, no ad-hoc email threads without ticket link.

External

Customer notification via agreed DPA contacts when their data affected.

Regulatory communication only via DPO and Legal.

No public disclosure without Leadership approval.

Evidence Preservation

### Preserve for minimum 12 months

audit logs,

relevant application logs (metadata),

ticket timeline,

breach assessment forms,

remediation PRs and deployment records.

Legal hold overrides standard retention when instructed.

Escalation Contacts

Primary: Security on-call.

Privacy: Data Protection Officer.

Executive: CEO or delegate for SEV-1 external comms.

Vendor: Microsoft support for Azure OpenAI platform incidents.

ICO and Regulatory

ICO notification when breach likely to result in risk to rights and freedoms.

Document UK GDPR Article 33 content requirements in breach record.

Cooperate with ICO inquiries using this procedure's evidence set.

Drills and Testing

Tabletop exercise annually including AI cross-tenant scenario.

Drill results feed AI Risk Assessment and training updates.

Evidence and Audit Artefacts

Control area

Expected evidence

Incidents

Incident tickets, timelines

Breach

Breach assessment forms, ICO submissions

Containment

Kill-switch records, flag changes

Remediation

Change tickets, test reports

PIR

Post-incident review minutes

Drills

Tabletop attendance and findings

Risk

Updated AI Risk Assessment entries

Exceptions and Deviations

### Exceptions MUST

be documented,

include risk assessment,

include compensating controls,

include approval authority,

include review expiry dates.

### Expired exceptions SHALL be

renewed,

remediated,

or formally closed.

Review and Maintenance

### This document SHALL be reviewed

annually,

after material architecture changes,

after major AI feature releases,

after regulatory changes,

after security incidents,

after DPIA updates.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
