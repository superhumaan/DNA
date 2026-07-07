# [Product Name] Platform DPIA

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/[Product Name] Platform DPIA.docx`

---

[Product Name] Platform DPIA

## Uk Gdpr

DPIA identification

Record details

Field

Value

DPIA ID

DPIA-0001

Project

[Product Name] Platform — production trial and AI-enabled workspace

Owner

Product Owner — [Product Name]

DPO

WorkNest (designated DPO for [Company Name])

Date commenced

April 2026

Date approved

June 2026

Next review

December 2026 or on material AI/subprocessor change

Linked ROPA

ROPA-P-001 through ROPA-P-014 (processor activities)

ICO consultation

Not required — residual risks acceptable with mitigations

Why a DPIA was required

New SaaS platform processing personal data at scale for trial partners

Optional AI inference (LLM and speech-to-text) on user content

Potential for customers (controllers) to upload special category data despite non-clinical product positioning

Systematic storage and search across workspace content

[Product Name] is a workspace and productivity platform. It is not a medical device, clinical system, or regulated health record. Users must not rely on [Product Name] for diagnosis, treatment, or clinical decision-making.

1. Description of processing

Nature, scope, context

[Product Name] is a multi-tenant B2B workspace platform hosted in Azure UK South. [Company Name] acts as processor for customer workspace data and controller for account/billing data.

Data flow: browser (TLS) → API (UK South) → Azure SQL/Blob (tenant-scoped) → optional Azure OpenAI (in-memory, UK South private endpoint).

Users: UK business customers and their authorised users. Trial phase: up to ten partner organisations.

[Product Name] is offered exclusively in the United Kingdom. Customer data is processed and stored in Microsoft Azure UK South. [Company Name] does not offer multi-region tenancy or services outside the UK.

Data categories and subjects

Category

Examples

Controller/processor

Identity

Email, name, B2C ID

Processor (customer users) / Controller (account admins)

Workspace content

Notes, tasks, files, teams

Processor — customer is controller

AI inputs/outputs

Selected text, audio, draft outputs

Processor — in-memory unless user saves

Telemetry

Token counts, latency, tenantId — no content

Controller — platform operations

Special category (possible)

Health-related text if uploaded by customer users

Customer controller determines basis; processor on instructions

2. Necessity and proportionality

Purpose limitation

Workspace hosting is necessary to deliver contracted SaaS service

AI features are optional productivity aids — not required for core platform use

Data minimisation: AI processes only user-selected content per request; no bulk scraping

No automated decision-making with legal or similar effect

No profiling for marketing or employment decisions by [Company Name]

Proportionality measures

UK South residency — no multi-region option reduces transfer risk

Tenant isolation enforced at API, SQL RLS, and Blob prefix levels

AI outputs require explicit user action to persist

Rate limits and abuse controls limit scale of processing

Human review UX — AI outputs presented as drafts with transparency notice

3. Risk assessment

Risk register

Risk ID

Risk description

L

I

Inherent

Mitigation

Residual

R-01

Unauthorised cross-tenant access to workspace content

2

5

High

tenantId filters on all queries; RLS; integration tests; pen test; kill-switch

Low

R-02

AI hallucination relied upon for important decisions

3

3

Medium

Non-clinical positioning; transparency notice; validation; human review; disclaimers

Low-Medium

R-03

Special category data uploaded without customer lawful basis

3

4

High

Customer DPA places basis obligation on controller; APD recommendation in DPA; product not marketed for clinical use

Medium

R-04

Prompt/content leakage to logs or third parties

2

5

High

In-memory AI only; no prompt columns in DB; PR gate blocks diagnostic logging without DPO ticket

Low

R-05

Breach of confidentiality (external attacker)

2

5

High

Encryption, WAF, secure SDLC, IR plan, MFA, monitoring

Low

R-06

Excessive retention after termination

2

3

Medium

90-day deletion SLA; erasure log; backup 35-day window

Low

R-07

International transfer drift outside UK South

2

4

Medium

Azure Policy; quarterly Resource Graph audit; International Transfer Assessment TR-003

Low

R-08

Insider access to tenant content

2

4

Medium

No routine human access; break-glass with DPO approval; immutable audit log

Low

R-09

STT inaccuracy on long audio

3

3

Medium

Confidence thresholds; review-before-save; user guidance; Hallucination Register

Low-Medium

R-10

Subprocessor change without assessment

2

4

Medium

Vendor due diligence; 30-day customer notice; Subprocessor List publication

Low

Risk scoring key

Likelihood (L) and Impact (I) scored 1–5. Inherent = L × I. Residual after mitigations.

Medium residual risks R-02 and R-03 accepted by DPO with ongoing monitoring and customer contractual obligations.

4. Consultation

Stakeholders consulted

Role

Name / function

Input

Data Protection Officer

WorkNest

Lawful basis, transfer, DPIA sign-off

Security Lead

[Company Name] / Engineering

Article 32 controls, pen test plan

Product Owner

[Product Name] Product

Feature scope, AI transparency UX

Engineering Lead

[Product Name] Engineering

Architecture, tenant isolation, AI pipeline

Legal Counsel

[Company Name] Legal

DPA terms, processor obligations

UK trial partners

Designated contacts (anonymised in register)

Trial scope confirmation — non-clinical use

5. Decision and sign-off

Outcome

Processing MAY proceed for [Product Name] production trial subject to:

Executed customer DPAs before production workspace data

Published Privacy Notice and AI Transparency Statement

Quarterly ROPA reconciliation and transfer attestation

Penetration test scheduled Q2 2026 before enterprise scale

Residual risks R-02 and R-03 monitored via Hallucination Register and customer onboarding checklist

Approvals

Role

Name

Date

Signature

Data Protection Officer

WorkNest DPO

June 2026

[Signed]

Security Lead

[Name]

June 2026

[Signed]

Product Owner

[Name]

June 2026

[Signed]

Executive Sponsor

[Name]

June 2026

[Signed]

6. Post-implementation review

90-day review plan

Scheduled: September 2026. Confirm deployed controls match DPIA commitments.

Review inputs: pen test results, incident log, Hallucination Register, access review, Azure UK South attestation.

Update ROPA and DPIA Register if material changes identified.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
