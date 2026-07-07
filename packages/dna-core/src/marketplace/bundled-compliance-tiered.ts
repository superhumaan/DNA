import type { KnowledgePack } from "@superhumaan/dna-config";
import { pack } from "./bundled-catalog-helpers.js";

const TIER_STARTUP = `# Organisation Tier — Startup

**Team:** 1–25 | **Goal:** ship safely without bureaucracy

## Mindset
Compliance is **risk reduction**, not checkbox theatre. Implement controls that prevent real harm and unblock enterprise sales later.

## Must-have (all frameworks)
- [ ] TLS on all endpoints; HSTS in production
- [ ] Secrets in env / cloud vault — never in git
- [ ] Authentication on all non-public routes; MFA for admin
- [ ] RBAC default deny (\`dna plan rbac\`)
- [ ] Privacy policy + subprocessors list published
- [ ] Data inventory (spreadsheet OK): what, why, where, how long
- [ ] Backup + one successful restore test documented
- [ ] Dependency scanning in CI (npm audit / Snyk)
- [ ] Incident contact list + breach awareness timeline

## GDPR at startup
- Lawful basis per feature (contract, consent, legitimate interest)
- Cookie consent if non-essential cookies
- DPA signed with cloud provider (AWS, Vercel, Supabase, etc.)
- Erasure/export process (manual ticket OK)

## HIPAA at startup
- **Avoid PHI** unless the product is healthcare-specific
- If PHI: BAA with every vendor; encrypt ePHI; no PHI in logs/AI

## ISO 27001 at startup
- Not certifiable yet — use Annex A as a **checklist**, not a project
- Document security owner and top 10 risks

## SOC 2 at startup
- Use trust criteria as engineering north star
- Git PR reviews = change management evidence

## When to level up to SME
Enterprise prospects send security questionnaires; team >25; processing special-category data at scale.
`;

const TIER_SME = `# Organisation Tier — SME

**Team:** 25–250 | **Goal:** repeatable controls + customer assurance

## Must-have additions
- [ ] Written information security policy (1–2 pages)
- [ ] Written privacy policy aligned with processing activities
- [ ] Quarterly access review (export from IdP)
- [ ] Vendor tiering: critical vendors get annual review
- [ ] Incident response plan + tabletop exercise yearly
- [ ] Employee security onboarding checklist
- [ ] SAR/erasure SLA (e.g. 30 days) with ticket template
- [ ] DPIA template for new features processing personal data
- [ ] SAST or dependency gate in CI
- [ ] 90-day minimum log retention; admin audit trail

## GDPR at SME
- Records of processing activities (ROPA)
- DPIA for high-risk processing
- DPO contact (internal or external)
- International transfer documentation (SCCs + TIA if US cloud)

## HIPAA at SME
- Documented risk analysis (Security Rule)
- Workforce training records
- Audit controls on systems with ePHI

## ISO 27001 at SME
- Define ISMS scope
- Statement of Applicability (SoA) draft
- Internal audit before engaging certification body

## SOC 2 at SME
- Target SOC 2 Type I, then Type II observation period
- Control owners assigned per domain

## When to level up to corporate
SOC 2 / ISO required in RFPs; dedicated security hire; regulated sector customers.
`;

const TIER_CORPORATE = `# Organisation Tier — Large Corporate

**Team:** 250–5,000 | **Goal:** audit-ready, enterprise procurement

## Must-have additions
- [ ] GRC tool or structured control library
- [ ] Annual penetration test + remediation SLA
- [ ] Segregation of duties for production deploys
- [ ] Formal change management with emergency break-glass
- [ ] BCP/DR tested annually with documented RTO/RPO
- [ ] Privacy training for engineering, support, sales
- [ ] Automated DSAR workflow where volume warrants
- [ ] Subprocessor register with transfer impact assessments
- [ ] 24/7 on-call for security incidents
- [ ] Supplier security assessments for critical vendors

## GDPR at corporate
- DPIA programme with legal sign-off
- Privacy by design gate in SDLC
- ICO/regulator cooperation playbook

## HIPAA at corporate
- Annual risk assessment update
- Business associate agreement programme
- Physical safeguards if any on-prem ePHI

## ISO 27001 at corporate
- Stage 1 + Stage 2 certification
- Corrective action tracking (CAPA)
- Surveillance audit schedule

## SOC 2 at corporate
- Type II report (6–12 months observation)
- Bridge letters for customers between audits

## When to level up to enterprise
Multi-region operations; mandatory certifications; board-level cyber risk reporting.
`;

const TIER_ENTERPRISE = `# Organisation Tier — Enterprise

**Team:** 5,000+ or highly regulated global | **Goal:** certified, continuous assurance

## Must-have additions
- [ ] CISO + DPO + GRC reporting to board risk committee
- [ ] Continuous control monitoring (CCM)
- [ ] 24/7 SOC or MSSP with playbooks
- [ ] Global data residency and sovereignty strategy
- [ ] IGA / privileged access management platform
- [ ] Red team or bug bounty programme
- [ ] Supply chain security (SBOM, vendor ISO/SOC cascade)
- [ ] Multi-framework control mapping (ISO ↔ SOC ↔ HIPAA)
- [ ] Crisis communications and legal counsel on retainer
- [ ] Cyber insurance aligned to control maturity

## GDPR at enterprise
- EU/UK representatives if no local establishment
- Binding corporate rules or multi-entity privacy programme
- Privacy engineering guild; PETs where appropriate

## HIPAA at enterprise
- HITRUST or equivalent attestation optional
- OCR audit readiness; de-identification standards documented

## ISO 27001 at enterprise
- Multi-site ISMS; ISO 27017/27018 for cloud services
- Integrated audits across group entities

## SOC 2 at enterprise
- Continuous observation; customer-specific control addenda
`;

export const TIERED_STANDARDS_PACK: KnowledgePack = pack(
  "compliance/tiered-standards",
  "Tiered Compliance Standards",
  "compliance",
  "ISO 27001, GDPR, HIPAA, SOC 2, PCI — best practices by org tier: startup, SME, corporate, enterprise",
  [
    {
      path: "compliance/tiers/overview.dna.md",
      content: `# Tiered Compliance Overview

DNA bands compliance maturity across **four organisation tiers**. The same framework (e.g. GDPR) has different **depth** at each tier — not different rules, but proportionate implementation.

| Tier | Typical org | Compliance posture |
|------|-------------|-------------------|
| **startup** | 1–25 people | Baselines: encrypt, auth, privacy notice, data inventory |
| **sme** | 25–250 | Policies, access reviews, DPIA template, SOC 2 Type I prep |
| **corporate** | 250–5K | GRC, pen tests, ISO/SOC certification, formal privacy programme |
| **enterprise** | 5K+ / regulated | CISO, continuous monitoring, multi-framework mapping, global programme |

## Commands
\`\`\`bash
dna compliance list
dna plan compliance --frameworks gdpr,iso27001 --tier sme --quote "B2B SaaS in EU"
dna context compliance
\`\`\`

## Tier inference
If \`--tier\` is omitted, DNA infers from \`config.dna.json\` stage:
- new/mvp → startup
- scaling → sme
- enterprise → enterprise
- legacy_modernisation / audit_remediation → corporate

## Golden rule
**Never claim certification you do not hold.** Implement controls; let auditors attest.
`,
    },
    { path: "compliance/tiers/startup.dna.md", content: TIER_STARTUP },
    { path: "compliance/tiers/sme.dna.md", content: TIER_SME },
    { path: "compliance/tiers/corporate.dna.md", content: TIER_CORPORATE },
    { path: "compliance/tiers/enterprise.dna.md", content: TIER_ENTERPRISE },
    {
      path: "compliance/matrices/control-by-tier.dna.md",
      content: `# Control Matrix by Tier

Use with \`.DNA/CellularMemory/prefrontalCortex/compliance-control-matrix.md\` (generated by \`dna plan compliance\`).

## Domains (all frameworks)
1. Governance & policies
2. Identity & access
3. Data protection
4. Application security
5. Logging & monitoring
6. Vendor & subprocessors
7. Incident response
8. Privacy rights & consent
9. Availability & DR
10. AI & automated processing

## Implementation order (startup → enterprise)
1. Secrets + TLS + auth (week 1)
2. Data inventory + privacy notice (week 2)
3. RBAC + audit log (week 3–4)
4. Vendor DPAs/BAAs (before prod launch)
5. IR runbook + backup test (before scale)
6. Framework-specific depth per tier doc

## AI building software
When AI implements features:
- Run \`dna plan compliance\` **before** storing new personal/health/payment data
- Load tier doc + framework doc into context
- Update control matrix with evidence (PR link, config screenshot, policy URL)
`,
    },
    {
      path: "compliance/frameworks/gdpr.dna.md",
      content: `# GDPR — Engineering & Organisational Controls

## Lawful bases (pick one per purpose)
- Consent (withdrawable)
- Contract
- Legal obligation
- Vital interests
- Public task
- Legitimate interests (document LIA)

## Data subject rights
| Right | Engineering response |
|-------|---------------------|
| Access | Export API or manual JSON export |
| Erasure | Soft-delete + purge job; cascade subprocessors |
| Rectification | Profile edit + audit |
| Portability | Machine-readable export |
| Object / restrict | Flag on account; stop processing |

## Technical measures (Art. 32)
- Pseudonymisation where possible
- Encryption in transit and at rest
- Confidentiality, integrity, availability
- Regular testing of security measures

## Breach notification
- **72 hours** to supervisory authority if risk to rights
- Document: what, when, impact, remediation, DPO decision

## DPIA triggers
- Systematic profiling with legal effect
- Large-scale special category data
- Systematic monitoring of public areas
- New technology with high risk

## Subprocessors
Maintain list in Impressions; DPA with each; customer notification if required by contract.
`,
    },
    {
      path: "compliance/frameworks/uk_gdpr.dna.md",
      content: `# UK GDPR

Aligned with EU GDPR with UK ICO guidance. Key UK-specific items:
- ICO registration fee where applicable
- PECR for marketing cookies and electronic communications
- UK international transfer rules post-Brexit (adequacy, IDTA, SCCs)
- UK representative if no UK establishment but UK users
`,
    },
    {
      path: "compliance/frameworks/hipaa.dna.md",
      content: `# HIPAA — Privacy & Security Rules

## Scope
Applies to **PHI** (Protected Health Information) held by covered entities and business associates in the US.

## PHI in software — engineering rules
- Encrypt ePHI at rest and in transit (addressable → implement unless documented reason not to)
- Unique user IDs; emergency access procedure
- Automatic logoff; audit controls on ePHI access
- **Minimum necessary** — API fields and exports scoped to role
- **Never** log PHI, put PHI in AI prompts, or send PHI to non-BAA vendors

## Business Associate Agreements
Required before any vendor processes PHI (hosting, email, support tools, analytics).

## Breach notification
- **60 days** to HHS if 500+ individuals affected
- Notify individuals without unreasonable delay

## De-identification
Safe Harbor (remove 18 identifiers) or Expert Determination — document method if using de-identified datasets for analytics.
`,
    },
    {
      path: "compliance/frameworks/iso27001.dna.md",
      content: `# ISO/IEC 27001

## ISMS components
- Scope statement
- Risk assessment methodology
- Statement of Applicability (SoA) — Annex A controls in/out with justification
- Risk treatment plan
- Management review
- Internal audit
- Continual improvement

## Certification path
1. Gap assessment
2. ISMS documentation
3. Stage 1 audit (documentation)
4. Stage 2 audit (evidence)
5. Surveillance audits years 1–2
6. Recertification year 3

## Annex A themes (2022)
Organisational, people, physical, technological controls — map to DNA control domains.

## Engineering evidence auditors expect
- Access reviews (tickets/exports)
- Change records (PRs, deploy logs)
- Vulnerability management
- Backup restore tests
- Incident records
`,
    },
    {
      path: "compliance/frameworks/soc2.dna.md",
      content: `# SOC 2 Trust Services Criteria

## Common Criteria (CC) — always in scope for Security
CC1 Control environment through CC9 Risk mitigation — map to policies + technical controls.

## Optional categories
- **Availability** — uptime, DR, monitoring
- **Confidentiality** — encryption, data classification
- **Processing integrity** — accurate, complete, timely processing
- **Privacy** — notice, choice, retention (overlaps GDPR)

## Type I vs Type II
- **Type I:** design of controls at a point in time
- **Type II:** operating effectiveness over 6–12 months

## Evidence collection
- Screenshots of IAM MFA settings
- PR templates showing review
- Ticketing for access provisioning/deprovisioning
- Pen test report
`,
    },
    {
      path: "compliance/frameworks/pci_dss.dna.md",
      content: `# PCI DSS

## Scope reduction (preferred)
Use Stripe, Adyen, or similar — **SAQ A** if card data never touches your servers.

## If card data on your systems
- Never store CVV/CVC after authorisation
- Tokenise PAN; encrypt if stored
- Segment cardholder data environment (CDE)
- Quarterly ASV scans; annual assessment per merchant level
`,
    },
    {
      path: "compliance/gdpr/engineering-checklist.dna.md",
      content: `# GDPR — Engineering Checklist

## Data inventory
- [ ] Every table/field classified (personal, special category, none)
- [ ] Retention period per category
- [ ] Lawful basis documented in Impressions

## Consent & notices
- [ ] Privacy policy linked at signup
- [ ] Cookie banner for non-essential cookies
- [ ] Granular consent where required (marketing separate from service)

## Rights implementation
- [ ] Export endpoint or documented manual process
- [ ] Erasure with subprocessors notified
- [ ] Consent withdrawal stops processing

## Security
- [ ] Encryption TLS + at rest for personal data
- [ ] RBAC; audit admin access to personal data
- [ ] DPIA filed for high-risk features

## Processors
- [ ] DPA with cloud, email, analytics, AI vendors
- [ ] Subprocessor list published
`,
    },
    {
      path: "compliance/hipaa/safeguards.dna.md",
      content: `# HIPAA — Technical Safeguards Checklist

## Access control (§164.312(a))
- [ ] Unique user identification
- [ ] Emergency access procedure documented
- [ ] Automatic logoff / session timeout
- [ ] Encryption and decryption (ePHI)

## Audit controls (§164.312(b))
- [ ] Log ePHI access (who, what, when)
- [ ] Immutable or tamper-evident audit store

## Integrity (§164.312(c))
- [ ] Mechanism to authenticate ePHI not improperly altered

## Transmission security (§164.312(e))
- [ ] TLS for ePHI in transit
- [ ] No ePHI in email without encryption unless exception documented
`,
    },
    {
      path: "compliance/iso27001/annex-a.dna.md",
      content: `# ISO 27001 Annex A — Engineering Mapping

| Annex theme | Engineering artefacts |
|-------------|----------------------|
| A.5 Organisational | Policies in Impressions; roles in RBAC matrix |
| A.6 People | Onboarding checklist; training records |
| A.7 Physical | Cloud shared responsibility; office access if applicable |
| A.8 Technological | This codebase: auth, crypto, logging, SDLC, backups |

Prioritise A.8.2, A.8.3, A.8.5, A.8.8, A.8.15, A.8.24 for SaaS.
`,
    },
    {
      path: "compliance/soc2/trust-criteria.dna.md",
      content: `# SOC 2 — Control Mapping for SaaS

| TSC area | Typical SaaS evidence |
|----------|----------------------|
| CC6 Logical access | SSO, MFA, RBAC matrix, access reviews |
| CC7 System operations | Monitoring, alerting, capacity |
| CC8 Change management | Git PRs, CI/CD, staging gates |
| CC9 Risk mitigation | Vendor reviews, pen test |
| A1 Availability | SLA, DR test, status page |
| C1 Confidentiality | Encryption, key management |
| P1 Privacy | Privacy notice, retention, DSAR process |
`,
    },
    {
      path: "compliance/pci-dss/overview.dna.md",
      content: `# PCI DSS Overview

Merchant levels 1–4 based on transaction volume. **Prefer SAQ A** via payment processor tokenisation.

If handling card data: network segmentation, ASV scans, secure coding, no default passwords, MFA for CDE access.
`,
    },
    {
      path: "compliance/gdpr/document-pack-catalog.dna.md",
      content: `# GDPR Document Pack — UK Required Documents

DNA ships **85+ scrubbed UK GDPR templates** with placeholders:

- \`[Company Name]\` — data controller / processor
- \`[Product Name]\` — your service or platform
- \`[Affiliate Entity]\` — group companies (intra-group transfers)
- \`[UK Hosting Region]\` — e.g. Azure UK South

**Never publish templates verbatim** — replace all placeholders and have legal/DPO review.

## Four folders

1. **Governance & Compliance** — policies, ROPA, DPIA, incident, retention
2. **External - Customer-Facing** — privacy policy, DPA, cookies, subprocessors
3. **Technical - Operational Evidence** — data inventory, architecture, control matrix
4. **AI-Specific Documentation** — if your product uses AI (optional by tier)

Plus **Documents/** — Excel registers (DSR log, breach register, RBAC matrix, etc.)

## DNA commands

\`\`\`bash
dna compliance documents
dna compliance documents --tier sme
dna compliance install-examples
dna plan compliance --frameworks gdpr,uk_gdpr --tier sme --quote "B2B SaaS UK"
\`\`\`

Templates install to \`.DNA/knowledge/compliance/gdpr/examples/\`.

## Re-ingest from source .docx

\`\`\`bash
pnpm gdpr:ingest path/to/GDPR\\ Documents
pnpm gdpr:scrub
\`\`\`

Scrubbing removes vendor-specific names automatically.

## Tier guidance

| Tier | Document focus |
|------|----------------|
| startup | Privacy/cookie/terms, data inventory, breach procedure |
| sme | + ROPA, DPIA template, DPA, subprocessors, DSR procedure |
| corporate | + full governance, pen test, control matrix, BCP/DRP |
| enterprise | + intra-group transfers, full AI pack, all evidence artefacts |
`,
    },
    {
      path: "compliance/gdpr/ux-design.dna.md",
      content: `# GDPR UX Design (Humaan)

From Humaan production — pair with legal/DPO for policy text.

## Data subjects
- **Employees** — people records, allocations, admin views
- **Survey respondents** — external CSS/NPS via token + passcode only

## Transparency UX
- Login: link to privacy notice where personal data is processed
- Person profile: show only fields appropriate to viewer role
- Surveys: purpose statement before optional PII fields
- Admin export: confirm scope ("You are exporting N people")

## Data minimisation
- Hide admin-only fields from contributors
- Survey field builder: default to minimum questions
- Search/lists: no sensitive attributes in columns unless required
- View-as admin: banner that session simulates another role

## Rights request UX hooks
| Right | Pattern |
|-------|---------|
| Access/export | Export with confirmation |
| Rectification | Edit profile + admin audit |
| Erasure | Admin workflow + destructive confirmation modal |

## Security UX
- Session expiry → login redirect; no sensitive IDs in errors
- JWT never shown in UI
- 403 explains "no permission" without leaking resource existence
`,
    },
  ],
);
