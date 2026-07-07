# AI Data Usage Statement

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI Data Usage Statement.docx`

---

AI Data Usage Statement

## Uk Gdpr

Purpose

This statement describes what personal data [Product Name] AI processes, for what purposes, how long it is retained, and what is explicitly excluded from processing.

### The objective of this document is to ensure that

transparency obligations under Articles 13–14 are met for AI processing,

data minimisation is operationalised,

customers and users understand inference vs persistence,

and ROPA entries remain accurate.

### This document establishes

categories of data used in AI,

lawful bases at [Company Name] controller layer,

retention and deletion rules,

prohibited data uses.

### This document supports

AI Auditability Standard,

AI Transparency Notice,

Retention & Deletion Policy,

Data Protection Impact Assessment (DPIA) Template,

Records of Processing Activities (ROPA).

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

Product and Processing Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace and productivity platform providing:

notes, work boards, teams, search,

AI-assisted productivity tooling,

and administrative workflow support.

### [Product Name] does not

provide diagnosis,

provide treatment recommendations,

provide clinical decision support,

operate as a medical device,

or function as an electronic health record system.

AI functionality within [Product Name] is restricted to approved productivity uses documented in the AI Auditability Standard.

### Human users remain responsible for

all persisted outputs,

operational decisions,

regulatory interpretation,

and downstream usage of AI-generated content.

Regulatory Alignment

This document supports compliance with UK GDPR, the Data Protection Act 2018, and ICO accountability expectations for AI processing.

Relevant obligations include Articles 5(2), 24, 25, 28, 30, 32, 33, 35, and 22 (no solely automated decisions with legal or similarly significant effects).

[Product Name] SHALL NOT deploy solely automated decision-making producing legal or similarly significant effects without explicit lawful basis and safeguards.

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

remain contractually governed under the Data Processing Agreement,

remain tenant-isolated,

remain access-controlled,

and remain subject to audit logging.

Data Categories Processed for AI

Account and Session Data

user identifier, tenant identifier,

authentication tokens (not sent to model),

feature flags, RBAC roles.

Used for: access control and audit only; minimised in prompts.

Workspace Content

note text user selects for AI actions,

board item text in scope,

cleaned STT transcript when user saves,

search queries for augmentation.

Controller: customer for workspace content; [Company Name] processor.

Technical Metadata

correlation ID, model ID, timestamps,

token counts, outcome status,

IP address at API layer (standard logging, not in model prompt).

Explicitly Excluded from Model Prompts

passwords and secrets,

full payment card numbers,

authentication secrets,

other tenants' data,

raw audio after transcription job (unless future approved feature).

Purposes of Processing

Purpose

Data used

Lawful basis ([Company Name] controller activities)

Provide AI productivity features

Workspace content as processor; account data as controller

Contract / legitimate interests assessment

Security and abuse prevention

Metadata, abuse signals

Legitimate interests / legal obligation

Audit and accountability

Audit logs

Legal obligation / legitimate interests

Service improvement (aggregated)

Anonymised metrics only

Legitimate interests — no content in aggregates

Inference vs Persistence

During inference: prompts and completions exist in memory only per AI Auditability Standard.

### Persisted only when

user saves AI-edited note or board content,

user saves cleaned STT transcript,

audit and security logs per retention schedule (metadata, not full prompts).

Data Minimisation Rules

Context Limits

Per-feature token caps (documented internally): summarisation 8k, search augmentation 4k, commands 2k — subject to engineering change control.

Retrieval limited to tenant partition.

No Training

Customer workspace content MUST NOT be used to train foundation models without board and DPO approved exception.

Fine-tuning on tenant data is prohibited in production.

Retention and Deletion

User Content

Follows customer-controlled workspace retention and Retention & Deletion Policy.

Deletion requests via Data Subject Rights Procedure propagate to backups per schedule.

Audit Logs

Operational AI audit logs: minimum 12 months.

Governance-evidence logs: up to 6 years where required.

Transient Data

Memory buffers cleared on request end; crash dumps MUST NOT contain prompt text in production.

Subprocessors and Transfers

Microsoft Azure OpenAI UK South — see Model Vendor Assessment and Subprocessor List.

No intentional transfer outside UK for production inference.

Customer Obligations

Customers MUST NOT submit special category data for clinical processing via [Product Name].

Customers define internal rules for workforce use of AI on personal data.

Customers remain responsible for lawful basis when instructing processing as controller.

Individual Rights

Access, rectification, erasure requests handled via Data Subject Rights Procedure.

AI-specific: users may delete saved AI content; transient inference data not retrievable post-request.

Transparency provided via AI Transparency Notice and Privacy Policy.

Monitoring Compliance

Quarterly sampling verifies logs exclude full prompts.

Annual ROPA reconciliation against this statement.

DPIA update when new data category introduced to AI.

Evidence and Audit Artefacts

Control area

Expected evidence

ROPA

Records of Processing Activities entries

Caps

Engineering configuration exports for token limits

Logs

Log schema proving metadata-only

Retention

Retention schedule cross-walk

Vendor

Model Vendor Assessment

Transparency

AI Transparency Notice, Privacy Policy versions

Audits

Quarterly sampling reports

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
