import type { KnowledgePack } from "@superhumaan/dna-config";
import { pack } from "./bundled-catalog-helpers.js";

const OVERVIEW = `# Legal Knowledge — Overview

DNA Legal packs help engineering teams **consider law** when designing products — especially in regulated sectors (banking, healthcare, fintech).

## What DNA provides
- **Domain packs** — privacy, banking, healthcare, IP, consumer, employment, AI governance
- **Regional packs** — PDPA (SG/TH/MY), GDPR, CCPA, PIPEDA, LGPD, DPDP, PIPL, and more
- **Legal advisor** — \`dna legal advise\` surfaces jurisdiction and sector risks for your question

## What DNA does NOT provide
- Legal advice — always engage qualified counsel
- Guaranteed compliance — packs are engineering checklists, not certifications

## Workflow

1. \`dna init\` installs \`legal/tiered-standards\` by default
2. Country packs auto-install from project description heuristics
3. Before features: \`dna legal advise --quote "..."\` or slash \`/legal-advise\`
4. For launch: \`dna plan legal\` + \`dna plan compliance\`
5. Load context: \`dna context legal\` or slash \`/legal-engineering\`

## Intelligence prompts (dna.humaan.app/intelligence)

| Slash | Use when |
| --- | --- |
| \`/legal-advise\` | Quick question — banking, healthcare, PDPA, cross-border |
| \`/plan-legal\` | Full legal plan + matrix for launch markets |
| \`/legal-list\` | Browse domains and jurisdictions |
| \`/legal-engineering\` | Sector checklist on a specific feature flow |

CLI: \`/dna-legal-advise\`, \`/dna-plan-legal\`, \`/dna-legal-list\`

Automation: follow \`.DNA/workflows/legal.workflow.md\`

## Pair with compliance
Legal ≠ compliance alone. Use both:
- \`dna plan compliance\` — ISO 27001, SOC 2, control matrices
- \`dna plan legal\` — jurisdiction-specific law, sector regulation, counsel gates
`;

const ADVISOR_PROCESS = `# Legal Advisor Process

Use DNA Legal Advisor when designing features that touch personal data, payments, health, or cross-border operations.

## When to run
- New market launch
- New data category collected
- AI/ML on user data
- Banking or lending features
- Healthcare integrations
- Third-party data sharing

## Steps
1. **Ask** — \`dna legal advise --quote "<your question>"\`
2. **Review** — recommendations, engineering rules, counsel checklist
3. **Install** — regional packs for detected jurisdictions
4. **Plan** — \`dna plan legal\` writes matrix to CellularMemory
5. **Sign-off** — counsel reviews matrix before production
6. **Build** — implement with \`dna context legal\` loaded in AI session

## Feature factory integration
During Solution Architect review, include:
- Applicable jurisdictions
- Domain risks (privacy, banking, healthcare, IP)
- Blockers requiring counsel before implementation
`;

const DISCLAIMERS = `# Legal Disclaimers

## DNA Legal packs
- Informational engineering guidance only
- Not a substitute for licensed legal counsel
- Laws change — verify current statutes and regulator guidance
- Jurisdiction conflicts may require multi-counsel review

## Templates
Never publish policy templates verbatim from DNA without lawyer review.

## AI sessions
When using Cursor/Claude with legal context, remind the model:
> "Consider legal requirements but do not invent legal conclusions. Flag items needing counsel."
`;

const DOMAIN_PRIVACY = `# Privacy & Data Protection — Legal Engineering

## Core obligations (most jurisdictions)
- Lawful basis documented per processing purpose
- Notice at collection; privacy policy accurate to flows
- Data subject rights: access, rectification, erasure, portability
- Breach notification within statutory windows
- Cross-border transfer mechanism where required

## Engineering checklist
- [ ] Data inventory maps fields → purpose → retention → lawful basis
- [ ] Consent records: what, when, version of policy
- [ ] Erasure cascades to backups/analytics within SLA
- [ ] Subprocessor register matches actual vendors
- [ ] DPIA for high-risk processing (profiling, biometrics, children)

## Regional packs
Install country packs: \`dna marketplace install legal/regions/sg-pdpa\`
`;

const DOMAIN_BANKING = `# Banking & Financial Services — Legal Engineering

## Typical regulatory touchpoints
- **Licensing** — payment institution, e-money, lending may need licences
- **AML/KYC** — customer due diligence, transaction monitoring, SAR filing
- **Open banking** — PSD2 (EU), UK Open Banking, local equivalents
- **PCI DSS** — card data scope minimisation
- **Consumer credit** — disclosures, affordability, fair lending

## Engineering checklist
- [ ] Card data never touches your servers if avoidable (Stripe Elements, etc.)
- [ ] KYC vendor contracts include AML data processing terms
- [ ] Audit trail for financial transactions (immutable, time-synced)
- [ ] Segregate financial PII from general user profile where possible
- [ ] Geo-fence features unavailable in unlicensed jurisdictions

## Counsel triggers
- Holding customer funds
- Issuing cards or wallets
- Cross-border remittance
- Crypto/fiat on-ramps
`;

const DOMAIN_HEALTHCARE = `# Healthcare — Legal Engineering

## US (HIPAA)
- PHI minimum necessary
- BAA with all vendors touching ePHI
- Security Rule: access, audit, integrity, transmission security

## EU/UK
- Health data often **special category** under GDPR — stricter lawful basis
- Medical device software may trigger MDR/IVDR

## APAC
- Singapore HCSA, Thailand PDPA health provisions, Malaysia PDPA sensitive data

## Engineering checklist
- [ ] PHI field-level encryption and access logging
- [ ] No PHI in application logs, crash reports, or AI prompts
- [ ] Clinical decision support: human-in-the-loop where regulated
- [ ] Telehealth: jurisdiction of practitioner and patient

## Pair with
\`healthcare/overview\` packs + \`dna plan compliance --frameworks hipaa\`
`;

const DOMAIN_IP = `# Intellectual Property — Legal Engineering

## Software & product
- **Copyright** — code, UI, content ownership (employer vs contractor agreements)
- **Trademarks** — brand, app name clearance before launch
- **Patents** — freedom-to-operate for algorithms in regulated domains
- **Trade secrets** — protect models, datasets, pricing logic

## Open source
- License compatibility audit (GPL, AGPL, MIT, Apache)
- SBOM in CI; block policy-violating dependencies
- Contributor license agreements for external PRs

## User content & AI
- Terms granting licence to host UGC
- DMCA/takedown process
- AI training: rights in input data; output IP ownership in ToS

## Engineering checklist
- [ ] OSS license scan in CI
- [ ] Attribution files for bundled OSS
- [ ] Watermark or metadata on exported creative assets
- [ ] Document provenance of training datasets
`;

const DOMAIN_CONSUMER = `# Consumer Protection — Legal Engineering

## Common requirements
- Clear pricing, renewal, and cancellation terms
- Refund rights per jurisdiction (EU 14-day cooling-off for distance contracts)
- Unfair contract terms review
- Accessibility (WCAG, ADA, EAA)

## Marketing
- Truthful claims; substantiation for health/financial promises
- Email/SMS opt-in (CAN-SPAM, PECR, CASL)
- Dark patterns increasingly regulated — avoid deceptive UX

## Engineering checklist
- [ ] Subscription status visible in account settings
- [ ] Self-service cancellation where law requires
- [ ] Cookie consent before non-essential tracking
- [ ] WCAG 2.2 AA on checkout and account flows
`;

const DOMAIN_EMPLOYMENT = `# Employment & HR Tech — Legal Engineering

## Data categories
- Employee records, payroll, performance, monitoring
- Often stricter than consumer data in EU (works council, purpose limitation)

## Monitoring
- Employee surveillance laws vary (EU, US state laws)
- Transparency required before keystroke/screen monitoring

## Engineering checklist
- [ ] Separate employee data tenant from customer data
- [ ] Role-based access with HR-specific RBAC
- [ ] Retention aligned with employment law minimums
- [ ] Cross-border HR data transfers documented
`;

const DOMAIN_AI = `# AI Governance — Legal Engineering

## EU AI Act (risk-based)
- Prohibited practices (social scoring, real-time biometric ID in public)
- High-risk: hiring, credit, health, law enforcement — conformity assessment
- General-purpose AI: transparency, copyright, systemic risk

## Automated decisions
- GDPR Art. 22 — right not to be subject to solely automated decisions with legal effect
- Explainability and human review pathways

## Engineering checklist
- [ ] Classify each AI feature by risk tier before GA
- [ ] Model cards: training data, limitations, bias testing
- [ ] Human override for high-stakes decisions
- [ ] Log prompts/outputs where audit required (exclude PHI/PCI)
`;

const DOMAIN_MATRIX = `# Legal Domains by Sector

| Sector | Primary domains | Typical jurisdictions |
| --- | --- | --- |
| B2B SaaS | privacy, ip, employment | EU, UK, US |
| Fintech | privacy, banking, consumer | EU (PSD2), UK, US, SG |
| Healthcare | privacy, healthcare | US (HIPAA), EU, AU, SG |
| E-commerce | privacy, consumer, ip | EU, UK, US, APAC |
| AI products | privacy, ai_governance, ip | EU (AI Act), US |
| Marketplace | privacy, consumer, employment | Multi-jurisdiction |

Run \`dna legal advise\` with your sector in the quote for tailored recommendations.
`;

const REGIONS_OVERVIEW = `# Regional Legal Packs

Country-specific packs install automatically when your project description mentions a region, or manually:

\`\`\`bash
dna marketplace install legal/regions/sg-pdpa
dna marketplace search --query pdpa --category legal
\`\`\`

| Pack ID | Laws |
| --- | --- |
| legal/regions/eu-gdpr | GDPR, ePrivacy, AI Act |
| legal/regions/uk-gdpr | UK GDPR, PECR |
| legal/regions/us-privacy | CCPA/CPRA, state laws |
| legal/regions/sg-pdpa | Singapore PDPA |
| legal/regions/th-pdpa | Thailand PDPA |
| legal/regions/my-pdpa | Malaysia PDPA |
| legal/regions/au-privacy | Privacy Act, APPs |
| legal/regions/ca-pipeda | PIPEDA, Law 25 |
| legal/regions/in-dpdp | DPDP Act 2023 |
| legal/regions/br-lgpd | LGPD |
| legal/regions/jp-appi | APPI |
| legal/regions/kr-pipa | PIPA |
| legal/regions/id-pdp | PDP Law |
| legal/regions/ph-dpa | Data Privacy Act |
| legal/regions/vn-pdpd | PDPD Decree 13 |
| legal/regions/hk-pdpo | PDPO |
| legal/regions/tw-pdpa | Taiwan PDPA |
| legal/regions/cn-pipl | PIPL |
`;

const BANKING_AML = `# Banking — AML/KYC Engineering

## Programme elements
- Customer identification and verification (KYC)
- Sanctions screening (OFAC, EU, UN lists)
- Transaction monitoring and suspicious activity reports
- Record retention (typically 5–7 years)

## Vendor integration
- Onfido, Jumio, Plaid Identity Verification — ensure DPAs and audit rights
- Never store raw identity documents longer than necessary

## Engineering checklist
- [ ] KYC status gate before financial features
- [ ] Immutable audit log for compliance reviews
- [ ] Geo-block sanctioned jurisdictions at API layer
`;

export const TIERED_LEGAL_PACK: KnowledgePack = pack(
  "legal/tiered-standards",
  "Legal Standards (Tiered)",
  "legal",
  "Core legal engineering knowledge — privacy, banking, healthcare, IP, and advisor workflow",
  [
    { path: "legal/overview.dna.md", content: OVERVIEW },
    { path: "legal/advisor-process.dna.md", content: ADVISOR_PROCESS },
    { path: "legal/disclaimers.dna.md", content: DISCLAIMERS },
    { path: "legal/domains/privacy.dna.md", content: DOMAIN_PRIVACY },
    { path: "legal/domains/banking-finance.dna.md", content: DOMAIN_BANKING },
    { path: "legal/domains/healthcare.dna.md", content: DOMAIN_HEALTHCARE },
    { path: "legal/domains/intellectual-property.dna.md", content: DOMAIN_IP },
    { path: "legal/domains/consumer-protection.dna.md", content: DOMAIN_CONSUMER },
    { path: "legal/domains/employment.dna.md", content: DOMAIN_EMPLOYMENT },
    { path: "legal/domains/ai-governance.dna.md", content: DOMAIN_AI },
    { path: "legal/matrices/domain-by-sector.dna.md", content: DOMAIN_MATRIX },
    { path: "legal/regions/overview.dna.md", content: REGIONS_OVERVIEW },
    { path: "legal/sectors/banking-aml-kyc.dna.md", content: BANKING_AML },
  ],
);
