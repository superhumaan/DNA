# CI-CD Security Controls

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/CI-CD Security Controls.docx`

---

CI/CD Security Controls

## Uk Gdpr

Purpose

This document defines security controls in [Product Name] build and deployment pipelines.

Implements Secure SDLC Policy technically.

### The objective of this document is to ensure that

every production deploy is reviewed, scanned, and attributable,

pipeline secrets are protected and unsigned artefacts blocked,

audit trail records who deployed what.

### This document establishes

branch protection, SAST/SCA gates, OIDC federation, and deploy logging.

### This document supports

OWASP/SAST/DAST Evidence and Environment Segregation Standard.

Scope

This document governs source control, CI pipelines, artefact registries, and deployment to App Service and Static Web Apps for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Production customer personal data SHALL remain in Microsoft Azure UK South only; no multi-region tenancy or data residency selection is offered.

[Product Name] is a non-medical, non-clinical workspace platform (notes, work boards, teams, search, optional AI and STT). It does not provide diagnosis, treatment, or clinical decision support.

Approved production stack: Internet → Azure Application Gateway (WAF) → Azure App Service (Node.js API) + Azure Static Web Apps (React); private endpoints to Azure SQL, Blob Storage, Azure OpenAI, and Azure Key Vault (UK South); Azure AD B2C (OIDC) for customer identity; Azure Monitor / Application Insights / Microsoft Defender for Cloud.

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Aligns with ICO Data Protection Audit Framework — Information & cyber security and Records management toolkits.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Engineering Lead

Architecture accuracy, diagram updates, control implementation

Security Lead

Security review, evidence acceptance, access and pentest governance

DPO

Privacy alignment, retention, DPIA and ROPA linkage

Operations Lead

Backup, restore, availability evidence

Compliance

Audit pack curation and control matrix alignment

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Pipeline Architecture

Source in Git — pipeline definitions as code with CODEOWNERS on workflows.

PR → SAST + SCA → review → merge → deploy staging → smoke → production via OIDC federation (no long-lived cloud passwords).

Tenant isolation integration tests required check before deploy approval.

Supply Chain

npm lockfile committed; Dependabot/Snyk alerts with SLA.

Fork PRs from untrusted contributors MUST NOT receive secrets in CI.

IaC security scan (e.g. Checkov) before production apply.

Source and Review

Branch protection

Main branch MUST require pull request review minimum one approver — Enforcement: branch protection settings export monthly

Pipeline definitions MUST be stored as code with PR review for workflow changes — Enforcement: CODEOWNERS on .github/workflows or azure-pipelines

Manual production deploy without pipeline is prohibited except documented break-glass with Security approval — Enforcement: Azure Activity Log alerts on manual deploy

Security Scanning

SAST and SCA

SAST and dependency scanning MUST run on every merge to main and block on configured critical thresholds — Enforcement: pipeline gate; OWASP/SAST evidence archived

Tenant isolation integration tests MUST run in CI before deploy approval — Enforcement: required check on PR

Infrastructure changes MUST pass IaC security scan before production apply — Enforcement: terraform/plan gate

Secrets and Identity

CI credentials

Production deploy MUST use workload identity / OIDC federation — no long-lived cloud passwords in CI secrets — Enforcement: secret scan; pipeline template standard

Secrets in CI MUST reference Key Vault or encrypted secrets — never plaintext in workflow files — Enforcement: gitleaks on workflow changes

Fork PRs from untrusted contributors MUST NOT receive secrets in CI — Enforcement: GitHub org setting; workflow if conditions

Deploy Audit

Traceability

Deploy audit log MUST record actor, commit, environment, timestamp — Enforcement: deployment history retained 3 years

Container images if used MUST be scanned and tagged with git SHA; deploy only approved SHA — Enforcement: registry retention; deploy logs

Hotfix pipeline MAY expedite review but MUST run retrospective SAST within 24 hours — Enforcement: hotfix ticket tag; Security weekly review

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. PR → CI scans → review → merge → deploy staging → smoke tests → promote production → post-deploy monitor.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Pipeline config in Git

Tagged releases

Scan results per release

Archived

Branch protection export

Monthly

Escalation

Malicious commit or compromised pipeline: revoke credentials, rotate secrets, Incident Response.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Hotfix bypass of non-critical scan requires Security manager approval ticket.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
