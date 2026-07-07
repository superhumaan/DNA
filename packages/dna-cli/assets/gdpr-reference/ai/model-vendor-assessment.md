# Model Vendor Assessment

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/Model Vendor Assessment.docx`

---

Model Vendor Assessment

## Uk Gdpr

Purpose

This assessment documents due diligence for Microsoft Azure OpenAI as the foundation model subprocessor for [Product Name] AI features.

### The objective of this document is to ensure that

subprocessor use is lawful and contractually governed,

UK data residency and security expectations are met,

vendor risk is reviewed on a defined cadence,

and changes to vendor services trigger reassessment.

### This document establishes

vendor profile and service scope,

data processing and transfer analysis,

security and compliance attestations,

ongoing monitoring obligations.

### This document supports

Data Processing Agreement (DPA),

Subprocessor List,

Vendor Management Policy,

AI Auditability Standard,

AI Data Usage Statement.

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

Assessment covers Azure OpenAI in UK South only unless board-approved exception.

Regulatory Alignment

This document supports compliance with UK GDPR, the Data Protection Act 2018, and ICO accountability expectations for AI processing.

Relevant obligations include Articles 5(2), 24, 25, 28, 30, 32, 33, 35, and 22 (no solely automated decisions with legal or similarly significant effects).

[Product Name] SHALL NOT deploy solely automated decision-making producing legal or similarly significant effects without explicit lawful basis and safeguards.

Article 28 processor obligations via Microsoft DPA and Customer DPA chain.

International transfer: UK South processing; transfers outside UK require assessment.

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

Vendor Identification

Legal Entity

Microsoft Corporation / Microsoft Ireland Operations Limited (contracting entity per enterprise agreement).

Service: Azure OpenAI Service, region UK South.

Service Description

managed foundation model inference API,

no customer model training on [Product Name] production content under configured enterprise terms,

content filtering and abuse monitoring by provider,

integration via private endpoints and Managed Identity where deployed.

Processing Activities

[Company Name] sends prompts and context to Azure OpenAI; receives completions.

Categories of data: user-generated workspace text, cleaned STT transcripts, metadata in prompts (tenant/user IDs MUST be minimised — use opaque correlation IDs only).

No special category data intentionally processed; customers must not submit health data for clinical use.

Data Location and Transfers

Residency

Production inference MUST use UK South deployments only.

Configuration audits quarterly verify region identifiers.

Transfers

If Microsoft subprocessors process outside UK, International Transfer Assessment and appropriate safeguards apply.

Material change in subprocessor geography triggers 30-day customer notice per DPA.

Security Assessment

Controls Relied Upon

ISO/IEC 27001 and SOC reports (reviewed annually),

encryption in transit (TLS),

Microsoft enterprise access controls,

[Company Name] Managed Identity and Key Vault segregation,

no browser-direct API keys.

Gaps and Compensating Controls

Provider may log abuse signals — compensating: metadata-only internal logs, DPA limitations on use.

Prompt injection risk — compensating: Prompt Handling Standard, AI Abuse Prevention Controls.

Privacy and Data Use

Align with AI Data Usage Statement: no training on customer content without explicit approval.

Retention at vendor: per Microsoft documentation; [Company Name] configures minimum necessary.

DPIA references this assessment for high-risk feature changes.

Contractual Measures

Microsoft DPA and Data Processing Agreement (DPA) with customers define processor/subprocessor chain.

Subprocessor notification process per Subprocessor Management Procedure.

Audit rights: rely on certifications plus targeted questionnaires annually.

Risk Rating Summary

Risk area

Inherent

Treatment

Residual

Subprocessor breach

Medium

DPA, monitoring, incident coordination

Low

Unauthorised training use

Medium

Enterprise config, contractual terms

Low

Region misconfiguration

High

Pipeline checks, quarterly audit

Low

Service discontinuation

Low

Architecture abstraction, vendor alternates in roadmap

Low

Filter failure

Medium

Output validation, provider + internal filters

Medium

Ongoing Monitoring

Cadence

Annual full reassessment.

Ad hoc within 10 working days of Microsoft material service change notice.

Monthly review of Azure security advisories affecting OpenAI.

Triggers for Reassessment

new model family deployment,

region change,

DPA amendment,

regulatory guidance change,

significant incident attributed to vendor.

Approval and Sign-Off

Compliance and Security recommend; Leadership accepts residual vendor risk annually.

DPO consulted on transfer and DPIA impacts.

Evidence and Audit Artefacts

Control area

Expected evidence

Contracts

Microsoft DPA, enterprise agreement schedules

Certifications

SOC/ISO summary reviews

Configuration

UK South deployment exports, audit scripts

Assessments

This document version history

Incidents

Vendor-related incident records

Customer

Subprocessor List publication

DPIA

Cross-reference in DPIA Template completions

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
