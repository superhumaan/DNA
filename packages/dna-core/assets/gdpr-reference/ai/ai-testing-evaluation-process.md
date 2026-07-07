# AI Testing & Evaluation Process

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI Testing & Evaluation Process.docx`

---

AI Testing & Evaluation Process

## Uk Gdpr

Purpose

This process defines how [Product Name] AI features are tested and evaluated before release and on an ongoing basis to assure safety, accuracy, and compliance.

### The objective of this document is to ensure that

releases do not bypass boundary and validation controls,

regression suites cover prohibited domains and abuse cases,

evaluation metrics are measurable and retained,

and failures block production until remediated or risk-accepted.

### This document establishes

test types and environments,

acceptance criteria,

roles and sign-off,

continuous evaluation cadence.

### This document supports

Secure SDLC Policy,

AI Change Management Procedure,

AI Decision Boundary Document,

Hallucination Mitigation Strategy,

AI Output Validation Procedure,

AI Auditability Standard.

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

Article 25 privacy by design: testing demonstrates controls before deployment.

ICO AI toolkit: robustness and performance evidence.

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

Testing Environments

Staging

AI enabled with non-production keys; test data anonymised or synthetic preferred.

No production customer personal data in automated CI without Compliance approval.

Pre-Production

Optional canary with feature flags; smoke tests mandatory before full rollout.

Production Monitoring

Not a test environment — synthetic probes only with Compliance-approved accounts.

Test Categories

Unit and Integration

prompt assembly tenant scoping,

validation pipeline stages,

RBAC on AI routes,

rate limit enforcement,

audit log field presence.

Security

prompt injection corpus,

cross-tenant access attempts,

authentication bypass attempts,

OWASP LLM relevant cases in annual pen-test.

Boundary and Policy

Golden set per AI Decision Boundary Document prohibited domains.

Expected: refusal or safe completion without clinical/legal advice.

Quality and Hallucination

Summarisation overlap metrics on fixed fixtures.

STT word error rate benchmarks on licensed test audio.

Performance

Latency p95 under defined SLO; timeout handling; Service Bus dead-letter behaviour.

Evaluation Procedure (Numbered)

1. Feature owner drafts test plan linked to change ticket.

2. Engineering implements automated tests in CI.

3. QA executes manual exploratory cases for UX and oversight.

4. Security reviews injection and abuse cases.

5. Compliance confirms boundary and transparency artefacts updated.

6. All blocking tests pass in staging.

7. Sign-off: Engineering Lead, Security, Product (Compliance for high-risk).

8. Deploy via AI Change Management Procedure.

9. Post-release: 30-day metric watch per release record.

Acceptance Criteria

Area

Criterion

Blocking?

Tenant isolation

Zero cross-tenant failures in suite

Yes

Policy refusals

100% pass on prohibited-domain set

Yes

Validation pipeline

All stages execute; failures logged

Yes

Hallucination fixtures

≥90% overlap threshold on summarisation set

Yes for release

Performance

p95 within SLO

Yes

Accessibility of AI UI

WCAG critical issues

Yes for UI changes

High-Risk Feature Additional Requirements

Triggers: new data category, new model family, STT changes, search augmentation scope expansion.

Additional: DPIA completion, DPO review, expanded adversarial set (500+ cases), Leadership sign-off.

Continuous Evaluation

Weekly

Automated CI on main branch including AI regression pack.

Review flaky tests within two working days.

Quarterly

Refresh adversarial corpus from incidents and threat intel.

Re-run full evaluation on production configuration snapshot.

Annual

Independent penetration test scope includes AI API tier.

Benchmark comparison year-on-year documented.

Failure Handling

Blocking failure: stop release; root cause in ticket.

Waivers require AI Risk Assessment entry and Leadership + DPO approval with expiry.

Emergency fix releases follow AI Change Management emergency path with retrospective evaluation within five working days.

Documentation and Records

### Retain for minimum 3 years

test plans,

CI build results,

sign-off records,

evaluation metric exports,

waivers.

Escalation

Repeated release-blocking failures on same component: forum review within five working days.

Production incident traced to missing test: mandatory test addition within 48 hours of PIR.

Evidence and Audit Artefacts

Control area

Expected evidence

CI

Build pipelines, test reports

Plans

Test plans linked to change tickets

Sign-off

Approval records in change system

Corpora

Versioned adversarial test data

Pen-test

Annual penetration test reports

Metrics

Post-release monitoring summaries

DPIA

High-risk feature DPIA references

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
