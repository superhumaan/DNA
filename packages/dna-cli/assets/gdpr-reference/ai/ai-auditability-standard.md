# AI Auditability Standard

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI Auditability Standard.docx`

---

AI Auditability Standard

## Uk Gdpr

Purpose

This standard defines the mandatory governance, accountability, operational, technical, and evidential controls governing artificial intelligence functionality within the [Product Name] platform.

### The objective of this standard is to ensure that

AI processing remains lawful, controlled, transparent, and auditable,

AI systems operate within approved business scope,

AI functionality supports UK GDPR accountability obligations,

AI actions are reconstructable through evidential records,

AI risks are operationally governed,

and AI-enabled processing remains subject to human oversight and organisational control.

### This document establishes

mandatory AI governance controls,

AI operational security requirements,

AI auditability obligations,

AI traceability requirements,

AI logging standards,

AI deployment governance,

AI oversight controls,

AI monitoring requirements,

AI incident response obligations,

and AI accountability structures.

### This standard supports

UK GDPR accountability obligations under Article 5(2),

Article 24 controller obligations,

Article 25 privacy by design,

Article 30 recordkeeping obligations,

Article 32 security requirements,

Article 35 DPIA obligations,

and processor accountability obligations under Article 28.

Scope

This standard applies to all [Product Name] AI-enabled services (Azure OpenAI UK South, STT, summarisation, search augmentation, command assistance, orchestration) and supporting infrastructure in production and staging where AI is enabled.

In scope personnel: employees, contractors, subprocessors, engineering, support, administrators, product, and compliance staff with access to AI systems or operational AI metadata (not customer workspace content except break-glass).

Product and Processing Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace and productivity platform providing:

notes,

work boards,

teams,

search,

AI-assisted productivity tooling,

### [Product Name] does not

and administrative workflow support.

provide diagnosis,

provide treatment recommendations,

provide clinical decision support,

operate as a medical device,

### AI functionality is restricted to

or function as an electronic health record system.

Speech-to-text / Transcription,

### Human users remain responsible for

and search augmentation.

all persisted outputs,

operational decisions,

regulatory interpretation,

and downstream usage of AI-generated content.

Regulatory Alignment

### This standard supports compliance with

UK GDPR,

Data Protection Act 2018,

PECR where applicable,

ICO accountability expectations,

contractual processor obligations,

and internal governance requirements.

### Relevant UK GDPR articles include

Article 5 — Principles,

Article 24 — Responsibility of the Controller,

Article 25 — Privacy by Design and Default,

Article 28 — Processor Obligations,

Article 30 — Records of Processing,

Article 32 — Security of Processing,

Article 33 — Breach Notification,

Article 34 — Communication of Breaches,

Article 35 — DPIA,

Article 44 onwards — International Transfers,

Article 22 — Automated Decision-Making.

[Product Name] SHALL NOT use AI systems for solely automated decision-making producing legal or similarly significant effects.

Governance Structure

Governance Authority

### AI governance authority resides with

[Company Name] Executive Governance,

Compliance,

Security,

and Engineering leadership.

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

### Material AI changes MUST be reviewed through

Engineering,

Security,

Compliance,

and Product governance review.

Approval SHALL be documented prior to production deployment.

AI Architecture Governance

AI processing within [Product Name] SHALL align with the approved [Product Name] architecture.

### Approved AI architecture components include

Azure OpenAI,

Azure Functions,

Azure Service Bus,

Azure App Services,

Azure Key Vault,

Azure SQL Database,

Azure Blob Storage,

Azure Application Gateway WAF,

Azure AD B2C,

Managed Identity,

Application Insights,

Azure Monitor.

Approved AI Invocation Path

### AI requests MUST

originate from authenticated [Product Name] sessions,

pass through the [Product Name] API tier,

undergo tenant resolution,

undergo RBAC enforcement,

undergo rate-limit validation,

undergo logging instrumentation,

and execute only through approved Azure OpenAI integrations.

Direct browser-to-AI-provider communication is prohibited.

In-Memory Processing Controls

AI processing SHALL operate in-memory wherever technically feasible.

The following SHALL NOT be persistently stored during inference operations:

transient prompts,

transient completions,

temporary embeddings,

intermediate inference buffers.

### Persistence SHALL occur only when

explicitly committed by the authenticated user,

or operationally required under approved workflows.

AI Trust Boundary Controls

### The following boundaries SHALL be enforced

tenant isolation,

authentication isolation,

RBAC isolation,

API-tier enforcement,

environment segregation,

privileged access segregation,

logging segregation,

operational monitoring segregation.

Controller and Processor Responsibilities

[Company Name] as Controller

### [Company Name] acts as controller for

account data,

billing data,

support operations,

security monitoring,

operational telemetry,

and platform governance records.

Customer as Controller

### Customers remain controller for

workspace content,

uploaded operational data,

user-generated records,

and tenant-specific processing activities.

[Company Name] as Processor

[Company Name] acts as processor when handling customer workspace content under customer instruction.

### Processor activities SHALL

remain contractually governed,

remain tenant-isolated,

remain access-controlled,

and remain subject to audit logging.

AI Operational Controls

Approved AI Use Cases

### AI functionality SHALL be restricted to

summarisation,

administrative assistance,

speech transcription,

content restructuring,

tabularisation,

AI-assisted search,

command-driven productivity support.

Prohibited AI Processing

### The following are prohibited

clinical diagnosis,

medical advice,

patient triage,

autonomous decision-making,

legal decision-making,

automated employment decisions,

automated eligibility decisions,

AI training on customer content without approval,

unrestricted cross-tenant context aggregation.

Human Oversight Requirement

AI-generated outputs MUST remain subject to human review before:

operational reliance,

export,

distribution,

or persistence where material decisions may be affected.

AI Logging and Auditability Controls

Mandatory Logging Events

### The platform MUST log

AI request initiation,

AI processing invocation,

AI administrative actions,

AI export actions,

failed AI requests,

AI rate-limit violations,

privilege escalation attempts,

AI configuration changes,

model deployment changes,

moderation events,

tenant access failures,

AI-related security events.

Minimum Audit Fields

### Audit records MUST contain

UTC timestamp,

request identifier,

tenant identifier,

user identifier,

originating service,

AI model identifier,

processing outcome,

invoking feature,

administrative actor where applicable,

correlation identifier.

Audit Log Protection

### AI audit logs MUST

be immutable where technically feasible,

be access-controlled,

be segregated from application logs,

be retained in approved monitoring environments,

and be protected against unauthorised deletion.

Audit Log Retention

### AI governance logs SHALL be retained for

minimum 12 months operational retention,

minimum 6 years evidential retention where governance-relevant.

Access Control Requirements

Administrative Access Restrictions

### Administrative access to production AI systems MUST

require documented approval,

require MFA,

require named-user accounts,

prohibit shared credentials,

and be logged.

Support Access Restrictions

Support personnel SHALL NOT access customer AI content unless:

operationally necessary,

authorised through documented workflow,

customer-authorised where applicable,

and logged through support audit systems.

Quarterly Access Review

### Privileged access SHALL undergo

quarterly review,

documented validation,

and access revocation where no longer required.

Evidence SHALL be retained.

AI Change Management Controls

Approved Change Workflow

### AI-related production changes MUST

undergo peer review,

undergo security review,

undergo testing validation,

undergo deployment approval,

and maintain rollback capability.

AI Deployment Evidence

### Deployment evidence MUST include

deployment identifiers,

change approval records,

testing evidence,

rollback verification,

release records,

model version identifiers.

Emergency Changes

### Emergency AI changes SHALL

require retrospective review,

require documented justification,

and undergo post-implementation validation.

AI Security Monitoring

### Security monitoring SHALL include

prompt abuse detection,

anomalous AI usage,

token misuse,

rate abuse,

excessive export activity,

cross-tenant access attempts,

suspicious administrator behaviour.

### Monitoring SHALL integrate with

Azure Monitor,

Application Insights,

SIEM tooling where deployed,

incident response workflows.

Incident Management

### AI-related incidents SHALL include

cross-tenant exposure,

unauthorised AI access,

logging failures,

AI-generated harmful outputs,

inference leakage,

privilege misuse,

moderation failures,

retention failures.

### Incidents involving personal data SHALL follow

UK GDPR breach assessment procedures,

ICO reporting obligations,

and internal breach escalation workflows.

Evidence and Audit Artefacts

Control Area

Expected Evidence

Access Governance

Access review records, approval tickets

Deployment Governance

Release approvals, CI/CD logs

AI Logging

Audit log extracts

Retention Governance

Retention reports, deletion records

Monitoring

Monitoring dashboards, alerts

Security

Security event registers

Incident Management

Incident reports, remediation actions

Processor Governance

DPAs, supplier reviews

Training

Security and privacy training records

Change Governance

Change tickets, rollback validation

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

### This standard SHALL be reviewed

annually,

after material architecture changes,

after major AI feature releases,

after regulatory changes,

after security incidents,

after DPIA updates.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
