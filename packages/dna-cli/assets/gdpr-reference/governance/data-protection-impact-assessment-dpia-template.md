# Data Protection Impact Assessment (DPIA) Template

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Data Protection Impact Assessment (DPIA) Template.docx`

---

Data Protection Impact Assessment (DPIA) Template

## Uk Gdpr

When to complete

Triggers for [Product Name]

New AI feature or change to model deployment

New data category (e.g. biometrics, children's data)

Large-scale systematic monitoring

Material change to subprocessors or UK-only stance

[Product Name] is a workspace and productivity platform. It is not a medical device, clinical system, or regulated health record. Users must not rely on [Product Name] for diagnosis, treatment, or clinical decision-making. AI outputs are assistive drafts only.

DPIA template

1. Description of processing

Project name: _______________  |  Owner: _______________  |  Date: _______________

Describe the feature, data flows (browser → API UK South → Azure SQL/OpenAI), and whether processing is controller or processor.

2. Necessity and proportionality

Purpose limitation and data minimisation measures

UK South residency confirmation — no multi-region

AI: in-memory only? human oversight? opt-out?

3. Risks and mitigations

Risk

Likelihood

Severity

Mitigation

Residual

Unauthorised cross-tenant access

Low

High

tenantId filters, RLS, testing

AI hallucination relied upon

Medium

Medium

disclaimers, validation, human review

Breach of confidentiality

Low

High

encryption, access control, IR plan

Excessive retention

Low

Medium

retention schedule, deletion jobs

4. Consultation and sign-off

DPO advice: _______________  |  Security review: _______________  |  Approved by: _______________

_Template — customize confidentiality and ownership statements for your organisation before distribution._
