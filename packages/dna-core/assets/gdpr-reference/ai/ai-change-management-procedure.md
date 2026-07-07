# AI Change Management Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI Change Management Procedure.docx`

---

AI Change Management Procedure

## Uk Gdpr

Purpose

This procedure governs how changes to [Product Name] AI software, models, prompts, and configuration are proposed, reviewed, tested, deployed, and verified.

### The objective of this document is to ensure that

AI changes do not bypass security or compliance review,

deployments are traceable and reversible,

emergency changes receive retrospective governance,

and evidence supports AI Auditability Standard change controls.

### This document establishes

change categories and approval paths,

deployment and rollback requirements,

integration with Secure SDLC and testing.

### This document supports

Change Management Policy,

Secure SDLC Policy,

AI Auditability Standard,

AI Testing & Evaluation Process,

Prompt Handling Standard.

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

Change Categories

Category

Examples

Approval

Standard

Bug fix, UI copy, non-material prompt tweak

Engineering Lead + peer review

Material

New AI feature, model version, validation rules

Forum + Security + Compliance

Emergency

Active SEV-1 mitigation

Security Lead; retrospective forum ≤5 days

Configuration

Token limits, rate limits, feature flags

Engineering + Security

Standard Change Workflow (Numbered)

1. Raise change ticket with description, risk category, rollback plan.

2. Implement in branch; peer code review mandatory.

3. Run CI including AI regression per AI Testing & Evaluation Process.

4. Security review for Material changes or any auth/logging/prompt template change.

5. Deploy to staging; smoke test AI routes.

6. Obtain documented approval in ticket.

7. Deploy to production via approved pipeline (no manual prod edits).

8. Verify: health checks, audit log sample, feature flag state.

9. Close ticket with deployment ID and verifier name.

Material AI Changes

Additional Requirements

DPIA update or confirmation not required,

AI Decision Boundary and Transparency artefacts reviewed,

forum minutes attached,

30-day enhanced monitoring plan.

Model Deployment Changes

Record: model name, version, region (UK South), endpoint URL, deployment date.

Update Model Vendor Assessment if vendor terms affected.

Previous model retained for rollback 30 days minimum.

Prompt Template Changes

Follow Prompt Handling Standard versioning.

Include diff in ticket; Compliance reviews Material boundary wording.

AI Architecture Governance

AI processing within [Product Name] SHALL align with the approved architecture documented in AI System Overview and AI Processing Flow.

### Approved AI architecture components include

Azure OpenAI (UK South, approved deployments only),

Azure App Services ([Product Name] API tier),

Azure Functions (orchestration workers),

Azure Service Bus (async AI jobs),

Azure SQL Database (tenant data),

Azure Blob Storage (attachments and exports),

Azure Key Vault (secrets and model credentials),

Azure Application Gateway WAF,

Azure AD B2C (authentication),

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

or operationally required under approved workflows (e.g. cleaned speech-to-text transcript saved to a note).

AI Trust Boundary Controls

### The following boundaries SHALL be enforced

tenant isolation at API and data layers,

authentication isolation via Azure AD B2C,

RBAC enforcement on every AI route,

environment segregation (production vs non-production),

privileged access segregation for operators,

logging segregation between application and governance audit logs,

operational monitoring segregation per tenant where metrics are emitted.

CI/CD and Deployment Controls

Pipeline Requirements

signed builds,

secrets from Key Vault only,

separate prod/non-prod service principals,

automated tests gate production deploy,

deployment logs retained 12 months.

Infrastructure as Code

Azure OpenAI endpoint and region configuration in IaC; drift detection monthly.

Misconfigured region blocks deploy in pipeline where implemented.

Emergency Change Procedure

1. Security or Engineering Lead authorises emergency deploy.

2. Minimum documentation: incident ID, change description, deployer.

3. Notify Compliance and DPO if personal data risk.

4. Retrospective forum review within five working days.

5. Complete full testing backlog within ten working days if tests skipped.

Rollback

Every Material change MUST have tested rollback (previous version or flag off).

Rollback decision within 30 minutes for SEV-1 AI incidents.

Rollback events logged as changes with incident link.

Environment Promotion

Changes promote dev → staging → production only.

No production data in lower environments except approved anonymised sets.

Feature flags default off in production until verification complete.

Monitoring Post-Change

First 24 Hours

error rate, latency, validation failure rate,

abuse block rate,

user-reported issues.

30-Day Watch

Material changes: weekly metric review to forum.

Deviations >20% from baseline trigger investigation.

Records and Evidence

Retain change tickets, approvals, CI results, deployment logs, rollback tests minimum 3 years (6 years if governance-relevant).

Escalation

Undocumented production AI change discovered: treat as SEV-2 incident; revert if unauthorised.

Repeated emergency changes without remediation: Leadership review.

Evidence and Audit Artefacts

Control area

Expected evidence

Tickets

Change management system exports

CI/CD

Pipeline logs, build artefacts

Approvals

Forum minutes for Material changes

Model

Deployment registry, Model Vendor Assessment updates

Rollback

Rollback test records

Monitoring

Post-change metric reports

Incidents

Emergency change PIR linkage

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
