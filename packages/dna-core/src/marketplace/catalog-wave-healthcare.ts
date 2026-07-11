import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";
import { HEALTHCARE_OVERVIEW_COUNTRY_DEFS } from "./catalog-wave-healthcare-overview-countries.js";
import { ALL_HEALTHCARE_COUNTRY_SUPPORT_PACKS } from "./catalog-wave-healthcare-country-support.js";
import {
  HEALTHCARE_APAC_OVERVIEW_DEFS,
  HEALTHCARE_APAC_SUPPORT_PACK,
  HEALTHCARE_APAC_DEEP_SUPPORT_PACKS,
} from "./catalog-wave-healthcare-apac.js";

const HIPAA_BASE = `## HIPAA baseline (all healthcare packs)
- BAA with every vendor touching PHI
- Minimum necessary — field-level scoping in APIs
- Never log PHI, prompts, or raw clinical documents
- Encrypt ePHI in transit (TLS 1.2+) and at rest
- Audit every PHI access; run \`dna plan compliance --frameworks hipaa\``;

export const HEALTHCARE_PACK_DEFS = [
  def(
    "healthcare/overview",
    "Healthcare Technology Overview",
    "Country router — FHIR-first strategy; install one country overview stem pack",
    `# Healthcare Tech — Overview (Country Router)

DNA default for clinical and health-adjacent products: **FHIR-first**, compliance-aware, integration-platform aware.

## Install your country stem pack

Always pair this router with **one** country overview (\`healthcare/overview-{iso}\`):

| Region | Pack | Regulation highlight |
|--------|------|----------------------|
| United States | \`healthcare/overview-us\` | HIPAA, CMS interoperability |
| United Kingdom | \`healthcare/overview-uk\` | UK GDPR, NHS DSPT, UK Core |
| Canada | \`healthcare/overview-ca\` | PIPEDA, provincial health laws |
| Australia | \`healthcare/overview-au\` | Privacy Act, My Health Record |
| European Union | \`healthcare/overview-eu\` | GDPR, EU MDR, EHDS |
| Germany | \`healthcare/overview-de\` | Gematik, DiGA, ePA |
| France | \`healthcare/overview-fr\` | HDS hosting, DMP |
| Japan | \`healthcare/overview-jp\` | APPI, FHIR JP Core |
| India | \`healthcare/overview-in\` | ABDM, DPDP |
| Brazil | \`healthcare/overview-br\` | LGPD, RNDS |
| Singapore | \`healthcare/overview-sg\` | PDPA, NEHR |
| Saudi Arabia | \`healthcare/overview-sa\` | PDPL, NPHIES |
| UAE | \`healthcare/overview-ae\` | Malaffi, NABIDH |
| + 26 more | \`healthcare/overview-*\` | See marketplace catalog |

\`\`\`bash
dna marketplace install healthcare/overview
dna marketplace install healthcare/overview-us   # example
dna marketplace install healthcare/fhir-r4
\`\`\`

## Universal stack recommendation
- API: FastAPI/NestJS/Next route handlers with strict auth
- Clinical data: FHIR R4 server (Medplum, HAPI, Firely) or EHR integration via Redox/Health Gorilla
- Never build custom clinical record storage without compliance sign-off

## Integration strategy tiers
1. **Direct EHR FHIR** (Epic, Cerner, NHS) — app approval, sandbox, production keys
2. **Health data networks** (Redox, Zus, Health Gorilla, Particle) — faster time-to-market
3. **Standards-only** (HL7 v2, X12) — legacy hospital interfaces

${HIPAA_BASE}`,
    `Document in Impressions: deployment country, data categories (PHI vs de-identified), lawful basis, and subprocessors. Load the matching \`healthcare/overview-{iso}\` pack before implementing clinical features.`,
    ["healthcare", "overview", "stem"],
    "disciplines",
  ),
  def(
    "healthcare/fhir-r4",
    "HL7 FHIR R4",
    "Fast Healthcare Interoperability Resources — modern clinical API standard",
    `# FHIR R4 — Positioning

**Default clinical API model.** Resources: Patient, Observation, Condition, MedicationRequest, Encounter, DiagnosticReport, Bundle, etc.

## Why FHIR
- Mandated trajectory (US CMS interoperability, NHS, AU My Health Record)
- REST + JSON + OAuth — fits DNA web stacks
- Implementation Guides (IGs) constrain profiles per use case`,
    `- Base URL: \`/fhir/R4/\`
- SMART App Launch for user-facing apps
- Validate with FHIR validator; profile must cite IG (e.g. US Core, UK Core)
- Pagination: \`_count\`, \`_since\` for delta sync
- Provenance resource for audit trail`,
    ["healthcare", "fhir", "standards"],
  ),
  def(
    "healthcare/hl7-v2",
    "HL7 v2.x",
    "Legacy hospital messaging — ADT, ORM, ORU over MLLP",
    `# HL7 v2 — Positioning

Still dominant in hospitals for ADT (admit/discharge/transfer), orders, results. **Not REST** — pipe-delimited messages over MLLP/TCP.

## When
- Hospital interface engine projects
- LIS/RIS/PACS integrations
- Redox/Mirth often translate v2 ↔ FHIR`,
    `- Use interface engine (Mirth Connect) — do not parse v2 in app server ad hoc
- ACK/NACK handling mandatory
- Message versioning per receiving facility
- Never expose MLLP to public internet — VPN/private link`,
    ["healthcare", "hl7", "legacy"],
  ),
  def(
    "healthcare/smart-on-fhir",
    "SMART on FHIR",
    "OAuth2 + FHIR launch context for EHR-embedded and standalone apps",
    `# SMART on FHIR

Launch clinical apps from Epic/Cerner sandbox with patient context in token.

## Flow
EHR → authorize → your app receives \`patient\`, \`encounter\`, \`fhirUser\` scopes`,
    `- Register app in EHR developer portal (Epic App Orchard, Cerner CODE)
- PKCE for public clients
- Scope minimization: \`patient/Observation.read\` not blanket \`patient/*.read\`
- Test with open sandbox patients before production review`,
    ["healthcare", "fhir", "smart"],
  ),
  def(
    "healthcare/cds-hooks",
    "CDS Hooks",
    "Clinical decision support cards invoked from EHR workflow",
    `# CDS Hooks

EHR calls your \`POST /cds-services\` with \`hook\` + \`context\` (patientId, userId).

## Hooks
\`patient-view\`, \`order-select\`, \`order-sign\`, medication-prescribe, etc.`,
    `- Return cards with suggestions — no auto-order without explicit clinician action
- Latency SLA < 2s or EHR disables service
- No PHI in logs; correlate by opaque session id`,
    ["healthcare", "cds", "fhir"],
  ),
  def(
    "healthcare/bulk-fhir",
    "Bulk FHIR Export",
    "Population-level NDJSON export for analytics and payer apps",
    `# Bulk FHIR

\`GET [base]/$export\` with _type filters. Async: Content-Location polling.

## Use
Payer, population health, de-identified analytics pipelines`,
    `- Requires system/*.read scopes — highest scrutiny
- Store exports encrypted; short TTL
- Prefer synthetic data in dev`,
    ["healthcare", "fhir", "bulk"],
  ),
  def(
    "healthcare/da-vinci",
    "Da Vinci Implementation Guides",
    "HL7 US IG for payer, provider, PDex, coverage",
    `# Da Vinci IGs

US-specific FHIR profiles: PDex, CDex, PAS, Drug Formulary, etc.

Reference when integrating with US payers or prior auth workflows.`,
    `Validate resources against correct IG package in CI (Firely NET SDK, HAPI validator).`,
    ["healthcare", "fhir", "us"],
  ),
  def(
    "healthcare/epic",
    "Epic Systems",
    "Largest US EHR — App Orchard, FHIR, Hyperdrive, Cosmos",
    `# Epic — Positioning

Dominant US hospital EHR. Integration via **Epic on FHIR** + App Orchard approval.

## Products
- Hyperspace (clinician UI)
- MyChart (patient portal)
- Cosmos (research)`,
    `- Register at open.epic.com / App Orchard
- OAuth2 backend + SMART launch
- Customer-specific FHIR base URLs (each health system)
- Rate limits and bulk export policies per organization
- Never scrape MyChart — use sanctioned APIs only`,
    ["healthcare", "ehr", "epic"],
  ),
  def(
    "healthcare/cerner-oracle-health",
    "Oracle Health (Cerner)",
    "Millennium EHR — CODE sandbox, FHIR R4, Oracle migration path",
    `# Cerner / Oracle Health

Major US EHR. **Cerner Open Developer Experience (CODE)** for FHIR apps.

## Notes
- Oracle Health rebrand — APIs migrating; verify docs per release
- Millennium domains per health system`,
    `- SMART on FHIR launch
- System accounts for backend services vs user-delegated
- Test in CODE sandbox before client-specific endpoints`,
    ["healthcare", "ehr", "cerner"],
  ),
  def(
    "healthcare/athenahealth",
    "athenahealth",
    "Ambulatory EHR — athenaOne API, More Disruption Please program",
    `# athenahealth

Ambulatory/outpatient focus. REST APIs for scheduling, charts, orders.

## When
- Outpatient clinic integrations
- Practice management + clinical combined`,
    `- API keys per practice ID
- Webhook subscriptions for appointment changes
- HIPAA BAA with athena`,
    ["healthcare", "ehr", "athena"],
  ),
  def(
    "healthcare/meditech",
    "MEDITECH",
    "Acute and ambulatory EHR — Greenfield, Expanse, FHIR expansion",
    `# MEDITECH

Common in community hospitals. Integration mix of FHIR and legacy interfaces.

## Approach
- Confirm Expanse FHIR availability per customer
- Often partner with integration engine for v2`,
    `Use Redox or Mirth when direct FHIR not exposed.`,
    ["healthcare", "ehr", "meditech"],
  ),
  def(
    "healthcare/eclinicalworks",
    "eClinicalWorks",
    "Ambulatory EHR — healow, practice management APIs",
    `# eClinicalWorks

Large ambulatory footprint. healow patient engagement.

Integration typically partner-mediated or certified interfaces.`,
    `Document per-practice endpoints; BAA required.`,
    ["healthcare", "ehr", "ecw"],
  ),
  def(
    "healthcare/veradigm",
    "Veradigm (Allscripts)",
    "Ambulatory EHR and payer data — FollowMyHealth, API programs",
    `# Veradigm

Successor brand to Allscripts. Patient portal FollowMyHealth.

## Integration
- Veradigm Partner Program
- FHIR where enabled per deployment`,
    `Legacy SOAP APIs may exist — prefer FHIR for new builds.`,
    ["healthcare", "ehr", "veradigm"],
  ),
  def(
    "healthcare/redox",
    "Redox",
    "Healthcare integration platform — one API to many EHRs",
    `# Redox — Integration Platform ★

**Most common DNA shortcut** to Epic/Cerner/athena without per-EHR certification hell.

## Model
Normalized JSON over HTTPS; Redox translates to EHR-specific protocols.

## Use when
- Need ADT, orders, results, scheduling across heterogeneous hospitals`,
    `- Redox dev portal: environments (Development, Staging, Production)
- Webhook verification + idempotent processing
- Map \`Meta.Source.ID\` to your tenant/customer
- Data models: PatientAdmin, Clinical Summary, Orders, Results
- BAA with Redox; they maintain EHR-side BAAs where applicable`,
    ["healthcare", "integration", "redox"],
  ),
  def(
    "healthcare/health-gorilla",
    "Health Gorilla",
    "Clinical data network — patient record aggregation, FHIR API",
    `# Health Gorilla

Query-based network for **aggregated clinical records** (HIE-style).

## Use
- Patient-mediated record retrieval
- Payer / life sciences with consent`,
    `- OAuth + FHIR R4 endpoints
- Consent artifacts required per patient
- Rate limits and purpose-of-use documentation`,
    ["healthcare", "integration", "hie"],
  ),
  def(
    "healthcare/particle-health",
    "Particle Health",
    "Patient health record API — FHIR, TEFCA-aligned access",
    `# Particle Health

API-first clinical data platform for apps needing consolidated records.

## Use
- Digital health startups
- Care navigation, prior auth support`,
    `- Patient consent flows built-in patterns
- FHIR resources normalized
- BAA + purpose limitation in contract`,
    ["healthcare", "integration", "particle"],
  ),
  def(
    "healthcare/zus-health",
    "Zus Health",
    "Shared health record composable data layer — ZAP Pro",
    `# Zus Health

Composable patient record for digital health builders.

## Use
- Embeddable clinical timeline
- Reduced EHR one-off integrations`,
    `- Zus Aggregated Profile (ZAP)
- FHIR + proprietary resources — read Zus docs for mapping
- Per-patient consent management`,
    ["healthcare", "integration", "zus"],
  ),
  def(
    "healthcare/metriport",
    "Metriport",
    "Open-source-friendly medical API — FHIR gateway to HIEs and EHRs",
    `# Metriport

Developer-centric medical data API (similar category to Particle/Redox).

## Use
- Quick production clinical data access with SDK`,
    `- API key + facility/patient identifiers
- Webhook for async document retrieval
- Medplum pairing for full stack`,
    ["healthcare", "integration", "metriport"],
  ),
  def(
    "healthcare/flexpa",
    "Flexpa",
    "Consumer-directed health data — payer FHIR API access with member consent",
    `# Flexpa

Members connect payer portals; your app receives FHIR via Flexpa token.

## Use
- Benefits apps, clinical trials recruitment, personal health records`,
    `- OAuth-style member linking
- Payer-specific coverage; document supported payers
- Minimum necessary data fields`,
    ["healthcare", "integration", "payer"],
  ),
  def(
    "healthcare/1uphealth",
    "1upHealth",
    "Patient-mediated FHIR connectivity to health systems and payers",
    `# 1upHealth

Patient connects accounts; app gets FHIR API access.

## Use
- Consumer health apps
- Research with consent`,
    `- SMART-style patient auth flows
- Monitor connection health per data source`,
    ["healthcare", "integration", "consumer"],
  ),
  def(
    "healthcare/innovaccer",
    "Innovaccer",
    "Health cloud data activation — integration + analytics for providers and payers",
    `# Innovaccer

Enterprise data platform ingesting EHR, claims, labs for population health.

## Use
- Large health system data lakes
- Value-based care analytics`,
    `Typically enterprise sales-led integration — not self-serve API like Redox.`,
    ["healthcare", "integration", "enterprise"],
  ),
  def(
    "healthcare/intersystems",
    "InterSystems HealthShare / IRIS",
    "Enterprise integration engine + FHIR repository for health systems",
    `# InterSystems

IRIS for HL7/FHIR messaging at hospital scale. HealthShare for HIE.

## Use
- On-prem or hosted integration hub
- National HIE projects`,
    `- HL7 v2 + FHIR namespaces
- Production messaging requires certified interface analysts`,
    ["healthcare", "integration", "intersystems"],
  ),
  def(
    "healthcare/mirth-connect",
    "Mirth Connect (NextGen)",
    "Open-source HL7 interface engine — channels, transformers",
    `# Mirth / NextGen Connect

Self-hosted integration engine for HL7 v2, FHIR, DICOM routing.

## When
- Hospital wants on-prem interfaces
- You operate managed Mirth for clients`,
    `- Channel per message type; deploy with HA active-passive
- PHI in queues encrypted at rest
- Version control exports of channel XML`,
    ["healthcare", "integration", "mirth"],
  ),
  def(
    "healthcare/medplum",
    "Medplum",
    "Open-source FHIR server + React components — developer-first clinical apps",
    `# Medplum ★

Code-first FHIR backend (TypeScript). Good for greenfield clinical apps **with compliance program**.

## Stack
Medplum server + @medplum/react + Bots (lambda-style FHIR triggers)`,
    `- Self-host or Medplum cloud
- Access policies as FHIR resources
- Use for SMART apps without building HAPI from scratch`,
    ["healthcare", "fhir", "medplum", "opensource"],
  ),
  def(
    "healthcare/hapi-fhir",
    "HAPI FHIR",
    "Java FHIR server — JPA, validation, global scale deployments",
    `# HAPI FHIR

Reference-grade OSS FHIR server in Java.

## When
- Enterprise needs self-hosted FHIR repo
- Custom IG enforcement`,
    `- Spring Boot deployment
- Partition strategies for multi-tenant
- Subscription and bulk export modules`,
    ["healthcare", "fhir", "hapi"],
  ),
  def(
    "healthcare/firely",
    "Firely Server",
    ".NET FHIR server — Firely NET SDK, validation, Turbo",
    `# Firely

Commercial FHIR server + excellent .NET SDK.

## When
- .NET health stack
- Strict profile validation`,
    `- Firely Server licensing for production
- Artifact feeds for IGs in validator`,
    ["healthcare", "fhir", "firely"],
  ),
  def(
    "healthcare/canvas-medical",
    "Canvas Medical",
    "EHR platform for startups — SDK, plugins, FHIR",
    `# Canvas Medical

API-first EHR for digital health companies building on shared clinical stack.

## Use
- Primary care / specialty startups wanting EHR backbone`,
    `- Canvas SDK plugins in Python
- FHIR endpoints for app integration`,
    ["healthcare", "ehr", "canvas"],
  ),
  def(
    "healthcare/openemr",
    "OpenEMR",
    "Open-source ambulatory EHR — PHP, ONC certified deployments",
    `# OpenEMR

Self-hosted clinic EHR. Common in resource-limited settings.

## Use
- Brownfield clinic IT
- Not greenfield SaaS default`,
    `- Secure PHP deployment; segregate from public web
- FHIR module where enabled`,
    ["healthcare", "ehr", "opensource"],
  ),
  def(
    "healthcare/dicom",
    "DICOM & Imaging",
    "Medical imaging — PACS, DICOMweb, OHIF viewer",
    `# DICOM

Imaging standard for radiology/pathology. **Large binaries** — separate archive from OLTP DB.

## Stack
Orthanc, DCM4CHEE, or cloud PACS; OHIF viewer; DICOMweb WADO-RS`,
    `- Never put DICOM in Postgres BYTEA at scale — object storage
- De-identification pipelines for AI training
- HIPAA audit on image access`,
    ["healthcare", "imaging", "dicom"],
  ),
  def(
    "healthcare/surescripts",
    "Surescripts",
    "US e-prescribing network — EPCS, medication history",
    `# Surescripts

National e-prescribing backbone. **EPCS** requires identity proofing and two-factor for prescribers.

## Use
- Medication ordering from your app`,
    `- Certified pharmacy routing — certification process
- Medication History requests with patient consent
- DEA EPCS compliance for controlled substances`,
    ["healthcare", "pharmacy", "surescripts"],
  ),
  def(
    "healthcare/covermymeds",
    "CoverMyMeds",
    "Prior authorization — API and EHR embeddable workflows",
    `# CoverMyMeds (McKesson)

Prior auth automation between providers and payers.

## Use
- Specialty pharma workflows
- Medication access programs`,
    `Integrate via EHR channel or direct API per partnership.`,
    ["healthcare", "pharmacy", "prior-auth"],
  ),
  def(
    "healthcare/change-healthcare",
    "Change Healthcare (Optum)",
    "Claims, clearinghouse, eligibility — X12 837/835/270/271",
    `# Change Healthcare / Optum

Massive US healthcare clearinghouse. X12 EDI for claims and remittance.

## Use
- Revenue cycle, eligibility checks
- Not for clinical FHIR-first apps unless hybrid`,
    `- EDI envelopes over HTTPS or AS2
- Map to internal claim model; idempotent claim submission
- Partner onboarding heavy`,
    ["healthcare", "rcm", "edi"],
  ),
  def(
    "healthcare/waystar",
    "Waystar",
    "Revenue cycle — claims, denials, patient payments",
    `# Waystar

RCM platform for hospitals and practices.

## Use
- Claims scrubbing and denial management integrations`,
    `Typically HL7/X12 + vendor APIs — enterprise integration.`,
    ["healthcare", "rcm"],
  ),
  def(
    "healthcare/availity",
    "Availity",
    "Payer-provider connectivity — eligibility, auth, claims",
    `# Availity

Multi-payer portal and APIs for administrative transactions.

## Use
- Real-time eligibility (270/271)
- Prior auth status`,
    `- Payer-specific endpoints behind Availity
- Store authorization numbers with claim linkage`,
    ["healthcare", "rcm", "payer"],
  ),
  def(
    "healthcare/x12-edi",
    "X12 EDI (Healthcare)",
    "ASC X12 transactions — 837 claims, 835 remittance, 270/271 eligibility",
    `# X12 EDI

Legacy but mandatory for US billing. Often via clearinghouse not direct payer.

## Common sets
- 837P professional / 837I institutional
- 835 ERA
- 270/271 eligibility`,
    `- Parse with certified library; never hand-roll segments
- HIPAA 5010 compliance
- Secure transmission (AS2, SFTP)`,
    ["healthcare", "edi", "rcm"],
  ),
  def(
    "healthcare/tefca-qhin",
    "TEFCA & QHIN",
    "US Trusted Exchange Framework — nationwide health information exchange",
    `# TEFCA / QHIN

Federal framework for nationwide HIE via Qualified Health Information Networks.

## Use
- Apps needing broad record access with TEFCA legal footing`,
    `- Participate via QHIN or onboarded facilitator (e.g. Health Gorilla, Epic Nexus)
- Purpose of use documentation
- Follow ONC requirements`,
    ["healthcare", "hie", "us", "policy"],
  ),
  def(
    "healthcare/nhs-fhir",
    "NHS FHIR (UK)",
    "UK health system APIs — Spine, GP Connect, UK Core profiles",
    `# NHS FHIR UK

## Programs
- **GP Connect** — primary care data access
- **NHS Login** — citizen identity
- **UK Core FHIR** profiles mandatory`,
    `- CIS2 authentication for clinicians
- Data residency UK; IG UK GDPR
- SDS/PDs role-based access`,
    ["healthcare", "uk", "nhs", "fhir"],
  ),
  def(
    "healthcare/terminology",
    "Clinical Terminology",
    "SNOMED CT, LOINC, RxNorm, ICD-10 — coding in FHIR resources",
    `# Clinical Terminology

## Systems
| System | Use |
|--------|-----|
| SNOMED CT | Problems, procedures |
| LOINC | Labs, vitals |
| RxNorm | Medications |
| ICD-10-CM | Billing diagnoses |

FHIR: CodeSystem, ValueSet, \`coding\` arrays with system URI`,
    `- License SNOMED in UK/US as required
- Cache ValueSet expansions; version pins for reproducibility`,
    ["healthcare", "terminology", "fhir"],
  ),
  def(
    "healthcare/phi-engineering",
    "PHI Engineering Patterns",
    "Build systems that handle protected health information safely",
    `# PHI Engineering

## Data model
- Separate \`phi\` schema or column-level classification
- Tokenized patient IDs in logs
- Break-glass access audited

## AI
- **No PHI in LLM prompts** unless BAA-covered deployment (Azure OpenAI with HIPAA, etc.)
- De-identify for analytics (expert determination or safe harbor)

${HIPAA_BASE}`,
    `Run \`dna plan compliance --frameworks hipaa\` before first PHI field.`,
    ["healthcare", "hipaa", "security"],
    "disciplines",
  ),
  def(
    "healthcare/telehealth",
    "Telehealth Platforms",
    "Video visits, scheduling, consent — Doxy.me, Twilio Video, Zoom Healthcare",
    `# Telehealth

## Platforms
- **Twilio Video** / **LiveKit** — embed in your app (BAA required)
- **Doxy.me** — standalone provider links
- **Zoom for Healthcare** — HIPAA tier

## Requirements
- Informed consent documented
- State licensure for clinicians (varies US)
- Waiting room and access control`,
    `- WebRTC TURN servers in compliant regions
- No session recording without explicit consent
- Integrate scheduling with EHR via FHIR Appointment`,
    ["healthcare", "telehealth"],
  ),
  def(
    "healthcare/wearables",
    "Wearables & Device Data",
    "Apple HealthKit, Google Health Connect, Fitbit, Validic, device ingestion",
    `# Wearables & RPM

## Consumer
- **Apple HealthKit** — iOS on-device, user permission per type
- **Google Health Connect** — Android hub

## Clinical RPM
- **Validic**, **Human API** — FDA-regulated device data pipelines`,
    `- Distinguish wellness vs clinical use (FDA SaMD)
- Time-series Observation resources in FHIR
- User revocation halts ingestion immediately`,
    ["healthcare", "devices", "rpm"],
  ),
  def(
    "healthcare/validic",
    "Validic",
    "Digital health data network — devices, apps, EHR normalization",
    `# Validic

Ingests patient-generated health data from hundreds of devices/apps.

## Use
- Remote patient monitoring programs
- Clinical trials digital endpoints`,
    `- Validic Inform API streaming
- Map to FHIR Observation
- BAA + FDA context if used for clinical decisions`,
    ["healthcare", "integration", "devices"],
  ),
  def(
    "healthcare/human-api",
    "Human API",
    "Consumer health data aggregation — labs, pharmacies, providers",
    `# Human API

Patient-linked health data for apps and research.

Similar category to Flexpa/1up — evaluate vendor BAAs and payer coverage.`,
    `OAuth patient linking; webhook data sync.`,
    ["healthcare", "integration", "consumer"],
  ),
  def(
    "healthcare/fda-samd",
    "FDA SaMD",
    "Software as a Medical Device — US regulatory considerations for clinical software",
    `# FDA SaMD

If software **diagnoses, treats, or drives clinical decisions**, may be SaMD — not just HIPAA.

## Tiers
IEC 62304 software lifecycle, ISO 14971 risk, clinical validation evidence`,
    `Engage regulatory affairs before marketing clinical AI. Document intended use statement.`,
    ["healthcare", "regulatory", "fda"],
    "disciplines",
  ),
  def(
    "healthcare/cms-interop",
    "CMS Interoperability Rules",
    "US CMS patient access, payer-provider APIs, information blocking",
    `# CMS Interoperability (US)

Rules pushing FHIR APIs for Medicare Advantage, ACA plans, hospitals.

## Impact
- Patient access API
- Provider access API
- Payer-to-payer exchange`,
    `Architecture should default FHIR R4 + US Core. Document information blocking policies.`,
    ["healthcare", "policy", "us"],
    "disciplines",
  ),
  ...HEALTHCARE_OVERVIEW_COUNTRY_DEFS,
  ...HEALTHCARE_APAC_OVERVIEW_DEFS,
];

export const HEALTHCARE_PACKS = [
  ...packsFromDefs(HEALTHCARE_PACK_DEFS),
  ...ALL_HEALTHCARE_COUNTRY_SUPPORT_PACKS,
  HEALTHCARE_APAC_SUPPORT_PACK,
  ...HEALTHCARE_APAC_DEEP_SUPPORT_PACKS,
];
