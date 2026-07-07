# Knowledge Pack Marketplace

Curated guidance packs install into `.DNA/knowledge/`.

**Live URL:** [dna.humaan.app](https://dna.humaan.app) · [Marketplace](https://dna.humaan.app/marketplace)  
**Web app:** `apps/web` (Next.js — landing + marketplace UI + API)  
**Legacy API:** `apps/marketplace` (standalone Node server for local dev)

## CLI usage

```bash
dna marketplace list
dna marketplace search --query stem
dna marketplace search --query cms
dna marketplace search --query catalog
dna marketplace search --category compliance
dna marketplace install frameworks/vite
dna marketplace install cms/sanity
dna marketplace install browsers/cross-browser
dna update
```

## Catalog size

**768 packs** in the stable channel:

| Layer | Count | Tag / prefix |
|-------|------:|--------------|
| Core (frameworks, compliance, Humaan stack) | 11 | — |
| Stim / stem delivery surfaces | 21 | `stem` |
| Human language stems (i18n AI) | 18 | `languages/en`, `languages/vi`, … |
| **Catalog expansion (v1)** | **79** | `catalog` |
| **Catalog wave 2** | **283** | `catalog` + domain prefix |
| **Catalog wave 3** | **187** | enterprise, gaming/XR, compliance depth |
| **Catalog wave 4** | **142** | regional cloud, ORMs, verticals, security depth |
| **Catalog wave 5 (final)** | **27** | store distribution, FinOps, data mesh, final long-tail |
| **Total** | **768** | |

### Catalog expansion v1

| Category | Packs | Examples |
|----------|------:|----------|
| Programming languages | 14 | `languages/typescript`, `languages/python`, `languages/rust` |
| CMS | 12 | `cms/sanity`, `cms/payload`, `cms/strapi`, `cms/wordpress` |
| Browsers | 6 | `browsers/chrome`, `browsers/safari`, `browsers/cross-browser` |
| Modern frameworks | 17 | `frameworks/remix`, `frameworks/hono`, `frameworks/nuxt`, `frameworks/trpc` |
| Methodologies & trends | 15 | `disciplines/ai-assisted-development`, … |
| **Payments** | **12** | `payments/stripe`, `payments/adyen`, `payments/overview`, … |
| **Data HQ & DR** | **3** | `data/data-hq`, `data/geo-replication`, `data/disaster-recovery` |

### Catalog wave 2 (databases, cloud, healthcare, integrations, verticals)

| Category | Packs | Examples |
|----------|------:|----------|
| **Healthcare** | **45** | See [Healthcare packs](#healthcare-packs) below |
| Databases & data stores | 47 | `databases/postgresql`, `databases/redis`, `databases/kafka`, vector DBs |
| Cloud & platform | 34 | `cloud/aws`, `cloud/gcp`, `cloud/cloudflare`, IaC, CI/CD, Kubernetes |
| Auth & identity | 14 | `auth/clerk`, `auth/auth0`, `auth/workos`, `auth/passkeys` |
| AI & LLM | 22 | `ai/openai`, `ai/anthropic`, `ai/rag`, `ai/evals`, MCP patterns |
| Integrations & iPaaS | 25 | `integrations/zapier`, `integrations/n8n`, `integrations/temporal` |
| Observability | 12 | `integrations/datadog`, `integrations/sentry`, OpenTelemetry |
| Frontend tooling | 22 | `tools/tailwind`, `tools/shadcn`, `tools/storybook` |
| E-commerce & CRM | 16 | `ecommerce/shopify`, `crm/hubspot`, `crm/salesforce` |
| Fintech extended | 11 | `payments/plaid`, `payments/modern-treasury`, banking rails |
| Realtime & messaging | 11 | `integrations/pusher`, `integrations/ably`, WebRTC |
| Verticals & compliance | 24 | `compliance/hipaa`, maps, web3, edtech, govtech |

### Catalog wave 3 (enterprise, long-tail, depth)

| Category | Packs | Examples |
|----------|------:|----------|
| Backend & frontend depth | 30 | `frameworks/temporal`, `tools/tanstack-start`, `frameworks/kong`, `tools/module-federation` |
| Enterprise ERP/HR/legal | 25 | `erp/sap`, `hr/rippling`, `hr/deel`, `integrations/workato`, `integrations/mulesoft` |
| Cloud DR & devtools | 26 | `cloud/aws-dr-playbook`, `cloud/flux`, `devtools/pnpm`, `testing/pact`, `testing/chaos-engineering` |
| Gaming & XR | 11 | `gaming/steam`, `gaming/playfab`, `xr/visionos`, `xr/webxr` |
| Web3 & IoT | 13 | `web3/walletconnect`, `iot/azure-iot-hub`, `iot/digital-twins` |
| Healthcare extended | 10 | `healthcare/mdr-eu`, `healthcare/patient-portal`, `healthcare/clinical-ai`, `healthcare/hie-networks` |
| Data & warehouses extended | 12 | `databases/fivetran`, `databases/dagster`, `databases/lancedb` |
| Payments & fintech extended | 12 | `payments/onfido`, `payments/zuora`, `payments/mambu` |
| CMS extended | 3 | `cms/datocms`, `cms/builder-io`, `cms/tina` (v1 also has Directus, Hygraph, Keystone, Webflow) |
| Compliance & residency | 12 | `compliance/pipeda`, `compliance/india-dpdp`, `compliance/data-residency-eu` |
| Languages extended | 8 | `languages/clojure`, `languages/zig`, `languages/haskell` |
| Documents & edtech | 10 | `documents/azure-doc-intelligence`, `edtech/google-classroom` |
| AI extended | 15 | `ai/cursor-ide`, `ai/prompt-injection-defense`, `ai/mistral`, `ai/nvidia-nim` |

### Catalog wave 4 (regional cloud, ORMs, verticals, security)

| Category | Packs | Examples |
|----------|------:|----------|
| Regional & advanced cloud | 29 | `cloud/alibaba-cloud`, `cloud/istio`, `cloud/aws-step-functions`, `cloud/fastly` |
| Backend, ORMs & streaming | 22 | `frameworks/tyk`, `frameworks/ember`, `databases/typeorm`, `databases/confluent` |
| Design & media tooling | 12 | `tools/figma-workflow`, `realtime/ffmpeg`, `realtime/cloudflare-stream` |
| E-commerce & logistics | 13 | `ecommerce/shopify-hydrogen`, `ecommerce/shippo`, `crm/zoho` |
| Auth, compliance & security | 16 | `auth/tailscale`, `compliance/sox`, `compliance/il5-il6`, `security/owasp-asvs` |
| Integrations extended | 12 | `integrations/calendly`, `integrations/microsoft-graph`, `integrations/mailchimp` |
| Industry verticals | 20 | `insurance/guidewire`, `travel/amadeus`, `hospitality/mews`, `gov/govuk-one-login` |
| AI & devtools | 18 | `ai/groq`, `observability/gremlin`, `devtools/renovate`, `devtools/sonarcloud` |

### Catalog wave 5 (final long-tail)

| Category | Packs | Examples |
|----------|------:|----------|
| Regional payments | 4 | `payments/mercadopago`, `payments/paytm`, `payments/worldpay` |
| Languages & disciplines | 6 | `languages/fsharp`, `disciplines/finops`, `disciplines/platform-engineering` |
| App distribution | 3 | `platforms/app-store-connect`, `platforms/google-play-console`, `platforms/chrome-web-store` |
| Data architecture | 3 | `data/data-mesh`, `data/data-contracts`, `data/cdc-patterns` |
| Tooling & web3 | 11 | `tools/biome`, `frameworks/electron-depth`, `web3/coinbase-wallet`, `healthcare/oracle-health-research` |

```bash
dna marketplace search --query healthcare
dna marketplace search --query fhir
dna marketplace install healthcare/redox
dna marketplace install healthcare/fhir-r4
dna marketplace install databases/postgresql
dna marketplace install erp/sap
dna marketplace install gaming/unity
```

### Healthcare packs

**55 packs** under `healthcare/*` — standards, EHRs, integration platforms, imaging, claims, PHI engineering, and EU MDR.

**Standards & clinical APIs**

| Pack | Focus |
|------|--------|
| `healthcare/overview` | FHIR-first strategy, HIPAA baseline, integration tiers |
| `healthcare/fhir-r4` | HL7 FHIR R4 REST resources, US Core |
| `healthcare/hl7-v2` | Legacy ADT/ORM/ORU via MLLP |
| `healthcare/smart-on-fhir` | OAuth launch from Epic/Cerner |
| `healthcare/cds-hooks` | Clinical decision support hooks |
| `healthcare/bulk-fhir` | Bulk export/import ($export) |
| `healthcare/da-vinci` | Da Vinci implementation guides (prior auth, PDex) |
| `healthcare/terminology` | SNOMED CT, LOINC, RxNorm, ICD-10 |
| `healthcare/dicom` | Medical imaging interoperability |
| `healthcare/nhs-fhir` | UK NHS FHIR profiles |
| `healthcare/tefca-qhin` | US TEFCA / QHIN nationwide exchange |
| `healthcare/cms-interop` | CMS patient/payer access rules |

**EHR & practice systems**

| Pack | Vendor |
|------|--------|
| `healthcare/epic` | Epic (App Orchard, FHIR) |
| `healthcare/cerner-oracle-health` | Oracle Health / Cerner |
| `healthcare/athenahealth` | athenahealth |
| `healthcare/meditech` | MEDITECH |
| `healthcare/eclinicalworks` | eClinicalWorks |
| `healthcare/veradigm` | Veradigm (Allscripts) |
| `healthcare/canvas-medical` | Canvas Medical (open EMR API) |
| `healthcare/openemr` | OpenEMR (open source) |

**Integration platforms & health data networks**

| Pack | Platform |
|------|----------|
| `healthcare/redox` | **Redox** — unified EHR API, webhooks, normalization |
| `healthcare/health-gorilla` | Health Gorilla — clinical data network |
| `healthcare/particle-health` | Particle Health — patient record aggregation |
| `healthcare/zus-health` | Zus Health — shared patient record |
| `healthcare/metriport` | Metriport — medical API for developers |
| `healthcare/flexpa` | Flexpa — payer/plan data via FHIR |
| `healthcare/1uphealth` | 1upHealth — consumer health data platform |
| `healthcare/innovaccer` | Innovaccer — health cloud / data activation |
| `healthcare/intersystems` | InterSystems HealthShare / IRIS |
| `healthcare/mirth-connect` | Mirth Connect — HL7 interface engine |

**FHIR servers & dev platforms**

| Pack | Platform |
|------|----------|
| `healthcare/medplum` | Medplum — open-source FHIR backend |
| `healthcare/hapi-fhir` | HAPI FHIR (Java reference server) |
| `healthcare/firely` | Firely — .NET FHIR tooling |

**Pharmacy, claims & revenue cycle**

| Pack | Focus |
|------|--------|
| `healthcare/surescripts` | e-prescribing network |
| `healthcare/covermymeds` | Prior authorization |
| `healthcare/change-healthcare` | Claims clearinghouse (Optum) |
| `healthcare/waystar` | Revenue cycle / claims |
| `healthcare/availity` | Payer connectivity portal |
| `healthcare/x12-edi` | X12 837/835/270/271 EDI |

**Consumer health, devices & regulatory**

| Pack | Focus |
|------|--------|
| `healthcare/phi-engineering` | PHI boundaries, audit, de-identification |
| `healthcare/telehealth` | Video visits, scheduling, consent |
| `healthcare/wearables` | Device data ingestion patterns |
| `healthcare/validic` | Validic — device/wellness data |
| `healthcare/human-api` | Human API — consumer health aggregation |
| `healthcare/fda-samd` | FDA Software as a Medical Device |

**Healthcare extended (wave 3)**

| Pack | Focus |
|------|--------|
| `healthcare/mdr-eu` | EU medical device regulation (CE marking) |
| `healthcare/patient-portal` | HIPAA patient-facing UX patterns |
| `healthcare/eprescribing-depth` | EPCS, NCPDP, Surescripts certification |
| `healthcare/clinical-ai` | AI in clinical workflows, human-in-the-loop |
| `healthcare/prior-auth` | Da Vinci PAS, payer prior authorization |
| `healthcare/lab-interfaces` | LIS ORU results, LOINC, critical values |
| `healthcare/imaging-pacs` | PACS workflows, DICOMweb, worklists |
| `healthcare/billing-rcm` | Claims, denials, revenue cycle |
| `healthcare/hie-networks` | Carequality, eHealth Exchange |
| `healthcare/cerner-millennium` | Inpatient Cerner/Oracle Health depth |

Foundation auto-installs `healthcare/overview`, `healthcare/fhir-r4`, `healthcare/phi-engineering`, and `healthcare/redox` when project descriptions mention FHIR, HIPAA, EHR, clinical, or telehealth contexts.

### Payments & data architecture

```bash
dna marketplace install payments/overview
dna marketplace install payments/stripe
dna marketplace install data/data-hq
dna marketplace install data/disaster-recovery
dna plan compliance --frameworks pci_dss,gdpr --tier sme
```

**Data HQ** = primary data region and legal jurisdiction (source of truth for audits and DPAs).  
**Geo-replication** = cross-region copies for reads and DR (not a substitute for backups).  
**DR topologies:** active–active, active–passive (hot/warm), passive–passive (cold) — see `data/disaster-recovery` pack.

> **WordPress:** supported for brownfield (`cms/wordpress`, `wordpress-headless` archetype). Greenfield projects should prefer Sanity, Payload, Strapi, or Contentful — documented in the WordPress pack.

### Human language stem packs

For AI communication in the user's language (not programming languages):

```bash
dna marketplace install languages/stem-bridge
dna marketplace install languages/vi
```

Locales: en, es, fr, de, ja, zh-cn, zh-tw, pt, ko, ar, vi, th, id, hi, it, nl, he.

## Stack archetypes

**43 archetypes** — `dna stack list`

Includes CMS, modern frameworks, delivery surfaces (PWA, desktop, extensions, GPT, MCP), and vertical templates: **`healthcare-fhir`**, **`gaming-unity`**, **`erp-sap-integration`**, **`fintech-plaid`**, **`ecommerce-shopify`**, **`ai-llm-saas`**, **`edtech-lms`**, **`iot-mqtt`**, **`insurance-insurtech`**, **`observability-production`**, **`cloud-aws-saas`**.

## Pack maturity tags

Every pack is tagged **`legacy`**, **`mainstream`**, or **`emerging`** for greenfield guidance:

| Tag | Meaning | Examples |
|-----|---------|----------|
| `mainstream` | Default recommended choice | Postgres, Stripe, Next.js, FHIR R4 |
| `legacy` | Brownfield support — prefer alternatives for greenfield | WordPress, HL7 v2, Heroku, Ember |
| `emerging` | Cutting-edge — evaluate production fit | Convex, ElectricSQL, visionOS, CrewAI |

Search: `dna marketplace search --query emerging`

## Pack file depth

Factory-generated packs include four files: `positioning.dna.md`, `integration.dna.md`, `architecture.dna.md`, `checklist.dna.md`. CMS and language packs include architecture/checklist where applicable.

## Remote vs bundled

The CLI fetches:

```
GET {MARKETPLACE_URL}/api/v1/catalog?channel=stable
GET {MARKETPLACE_URL}/api/v1/packs/{packId}
```

If the remote is unreachable, it **falls back to the bundled catalog** — colleagues can work offline.

Override URL:

```bash
export DNA_MARKETPLACE_URL=http://localhost:3100/marketplace
```

## Installed pack tracking

- `.DNA/config.dna.json` → `knowledgePacks: ["frameworks/vite@1.0.0"]`
- `.DNA/marketplace/installed.json` → version registry

## Knowledge layers (automatic install)

| Layer | When | What |
|-------|------|------|
| **Foundation** | `dna init` | Security, tiered compliance, stack packs, B2B SaaS + RBAC, cross-browser baseline — auto-detects healthcare, fintech, ecommerce, AI, gaming, SAP, IoT, insurance, AWS |
| **On-demand** | `dna context <target>` | Packs for intents linked to that target |
| **Plan prefetch** | `dna plan feature`, `dna plan rbac`, `dna plan compliance` | All knowledge required by the plan |

Optional packs remain available via `dna marketplace install <id>`.

## Run marketplace locally

```bash
pnpm --filter @superhumaan/dna-web dev
# http://localhost:3101/marketplace — filters: Healthcare, Enterprise, Cloud, Databases, AI, Gaming, Payments, CMS
# http://localhost:3101/marketplace/api/v1/catalog
```

## Deploy to dna.humaan.app

Deploy `apps/web` to Vercel (project root: `apps/web`).

## Creating packs (future)

Pack schema (`@superhumaan/dna-config`):

```json
{
  "id": "cms/sanity",
  "name": "Sanity",
  "version": "1.0.0",
  "category": "platforms",
  "channel": "stable",
  "tags": ["catalog", "cms", "sanity"],
  "files": [{ "path": "cms/sanity/positioning.dna.md", "content": "..." }]
}
```
