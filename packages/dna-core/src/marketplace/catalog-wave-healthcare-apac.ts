import { def, type CatalogPlatformDef } from "./bundled-catalog-pack-factory.js";
import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";
import { getCountrySystemsTopic } from "./healthcare-systems-by-country.js";

const PHI = `## PHI engineering
- Encrypt in transit and at rest; audit PHI access
- Never log clinical documents or identifiers in app logs
- Document subprocessors and data residency in Impressions`;

function countryOverview(
  iso: string,
  name: string,
  regulatory: string,
  healthSystem: string,
  standards: string,
  integration: string,
  compliance: string,
  extraTags: string[] = [],
): CatalogPlatformDef {
  return def(
    `healthcare/overview-${iso}`,
    `Healthcare Overview — ${name}`,
    `${name} healthcare — regulation, FHIR, integration (APAC)`,
    `# Healthcare Technology — ${name}

APAC country pack. Pair with \`healthcare/overview-apac\` and \`healthcare/overview-${iso}\`.

${regulatory}

## Health system
${healthSystem}

## Standards
${standards}`,
    `${integration}

## Compliance
${compliance}`,
    ["healthcare", "overview", "country", "stem", "apac", iso, ...extraTags],
    "disciplines",
  );
}

export const HEALTHCARE_APAC_OVERVIEW_DEF: CatalogPlatformDef = def(
  "healthcare/overview-apac",
  "Healthcare Overview — Asia-Pacific",
  "APAC regional healthcare — FHIR adoption, data residency, cross-border patterns",
  `# Healthcare Technology — Asia-Pacific (Regional)

Regional stem pack for **Asia-Pacific and Oceania**. Install before or with a country pack (\`healthcare/overview-au\`, \`healthcare/overview-sg\`, etc.).

## Regional themes
- **FHIR R4** adoption accelerating — AU Base, JP Core, KR Core, SATUSEHAT (ID), NEHR (SG)
- **Data residency** — most markets require in-region hosting (ap-southeast-*, ap-northeast-*, ap-south-1)
- **National health IDs** — ABHA (IN), NHI (NZ), MyNumber linkage (JP), SingPass (SG)
- **Public + private mix** — rarely single national EHR; integrate per programme or hospital group
- **English clinical models** — AU, NZ, SG, IN, PH use ICD-10-AM or ICD-10 variants; SNOMED CT national editions

## Country packs (install one+)
| Market | Pack |
|--------|------|
| Australia | \`healthcare/overview-au\` |
| New Zealand | \`healthcare/overview-nz\` |
| Canada *(Americas)* | \`healthcare/overview-ca\` |
| Japan | \`healthcare/overview-jp\` |
| South Korea | \`healthcare/overview-kr\` |
| Singapore | \`healthcare/overview-sg\` |
| India | \`healthcare/overview-in\` |
| Indonesia | \`healthcare/overview-id\` |
| Thailand | \`healthcare/overview-th\` |
| Vietnam | \`healthcare/overview-vn\` |
| Philippines | \`healthcare/overview-ph\` |
| Malaysia | \`healthcare/overview-my\` |
| Hong Kong | \`healthcare/overview-hk\` |
| Taiwan | \`healthcare/overview-tw\` |
| China | \`healthcare/overview-cn\` |
| Bangladesh | \`healthcare/overview-bd\` |
| Pakistan | \`healthcare/overview-pk\` |
| Sri Lanka | \`healthcare/overview-lk\` |
| Nepal | \`healthcare/overview-np\` |
| Cambodia | \`healthcare/overview-kh\` |
| Myanmar | \`healthcare/overview-mm\` |

\`\`\`bash
dna marketplace install healthcare/overview-apac
dna marketplace install healthcare/overview-au   # example
\`\`\``,
  `Load \`healthcare/apac-support\` for cross-border residency, terminology, and integration patterns.

Canada is geographically Americas — use \`healthcare/overview-ca\` for PIPEDA and provincial programmes.`,
  ["healthcare", "overview", "stem", "apac", "region"],
  "disciplines",
);

export const HEALTHCARE_APAC_EXTRA_OVERVIEW_DEFS: CatalogPlatformDef[] = [
  countryOverview(
    "bd",
    "Bangladesh",
    `## Regulation
- **Digital Security Act** / **Cyber Security Act** — data protection evolving
- **MOHFW** — Ministry of Health and Family Welfare
- **DGDA** — drug and device regulation`,
    `- **DGHS** — Directorate General of Health Services
- **Community clinics + district hospitals** — public tier
- **Private** — Apollo, Square, United growing in Dhaka`,
    `- **HL7 v2** common in hospitals
- **FHIR** — early adoption; follow MOHFW digital health roadmap
- **ICD-10**`,
    `1. MOHFW health information system programmes
2. Hospital EMR per facility — VPN integrations common
3. **AWS ap-south-1** (Mumbai) — document cross-border if used`,
    `- Run \`dna plan compliance\` with Bangladesh market in quote
- Pair with: \`healthcare/overview-apac\`, \`healthcare/fhir-r4\``,
    ["bd"],
  ),
  countryOverview(
    "pk",
    "Pakistan",
    `## Regulation
- **PEMRA / MOH** oversight
- **Personal Data Protection Bill** — monitor enactment status
- **DRAP** — drug regulatory authority`,
    `- **Federal + provincial** health delivery (Punjab, Sindh, KP, Balochistan)
- **Sehat Sahulat** — public health insurance programme
- **Private** — Shaukat Khanum, Aga Khan network`,
    `- **HL7 v2** dominant
- **FHIR** — emerging in tertiary hospitals
- **ICD-10**`,
    `1. Provincial health department integrations vary
2. NADRA identity linkage for insurance schemes
3. Data residency — prefer Middle East or APAC region with legal review`,
    `- Document cross-border hosting carefully
- Pair with: \`healthcare/overview-apac\`, \`healthcare/fhir-r4\``,
    ["pk"],
  ),
  countryOverview(
    "lk",
    "Sri Lanka",
    `## Regulation
- **PDPA Sri Lanka** (2022)
- **NMRA** — National Medicines Regulatory Authority
- **Ministry of Health** — national policy`,
    `- **Free public healthcare** — MOH hospitals nationwide
- **Private** — Asiri, Nawaloka, Durdans
- **IMIS** — health management information system push`,
    `- **HL7 v2** in hospitals
- **FHIR** — pilot stages in digital health strategy
- **ICD-10**`,
    `1. MOH digital health unit specifications
2. Hospital group EMR integrations
3. **AWS ap-south-1** common hosting choice`,
    `- Run \`dna plan compliance\` with Sri Lanka PDPA context
- Pair with: \`healthcare/overview-apac\`, \`healthcare/fhir-r4\``,
    ["lk"],
  ),
  countryOverview(
    "np",
    "Nepal",
    `## Regulation
- **Privacy Act 2075** (2018)
- **Department of Drug Administration**
- **MOHP** — Ministry of Health and Population`,
    `- **Public health posts and hospitals** — federal structure
- **NHSP** — Nepal Health Sector Programme
- **Private** — growing in Kathmandu valley`,
    `- **DHIS2** used for public health reporting
- **HL7 v2** in tertiary hospitals
- **ICD-10**`,
    `1. MOHP health information system
2. NGO and hospital EMR often standalone
3. Low-bandwidth considerations for rural telehealth`,
    `- Pair with: \`healthcare/overview-apac\`, \`healthcare/fhir-r4\``,
    ["np"],
  ),
  countryOverview(
    "kh",
    "Cambodia",
    `## Regulation
- **Cambodia Data Protection Law** (2023)
- **MOH** — Ministry of Health
- **DAU** — Department of Drugs and Food`,
    `- **Public health centres** — MOH network
- **Private** — Royal Phnom Penh, Raffles growing
- **HMIS** — health management information system`,
    `- **DHIS2** for public reporting
- **HL7 v2** limited to major hospitals
- **ICD-10**`,
    `1. MOH HMIS integration for public facilities
2. **AWS ap-southeast-1** (Singapore) hosting common`,
    `- Pair with: \`healthcare/overview-apac\`, \`healthcare/fhir-r4\``,
    ["kh"],
  ),
  countryOverview(
    "mm",
    "Myanmar",
    `## Regulation
- **Electronic Transactions Law** — privacy provisions evolving
- **MOH** — Ministry of Health
- **FDA Myanmar** — food and drug`,
    `- **Public hospital system** under MOH
- **Private** — limited; Yangon-focused
- **Humanitarian** — NGO health systems significant`,
    `- **HL7 v2** rare outside tertiary centres
- **Paper + EMR hybrid** common
- **ICD-10**`,
    `1. Verify current regulatory environment before PHI processing
2. NGO integration patterns (OpenMRS, DHIS2)
3. Sanctions and operational risk — legal review mandatory`,
    `- Engage local counsel; high operational risk market
- Pair with: \`healthcare/overview-apac\`, \`healthcare/fhir-r4\``,
    ["mm"],
  ),
];

export const HEALTHCARE_APAC_SUPPORT_PACK: KnowledgePack = catalogPack(
  "healthcare/apac-support",
  "Healthcare Support — Asia-Pacific",
  "disciplines",
  "APAC cross-cutting healthcare — residency, terminology, telehealth, integration tiers",
  [
    {
      path: "healthcare/apac-support/positioning.dna.md",
      content: `# APAC Healthcare Support

Auto-installed with \`healthcare/overview-apac\` and every APAC country bundle.

## When to use
- Multi-country APAC rollout
- Choosing AWS/Azure regions
- Mapping FHIR profiles across AU/JP/KR/SEA markets`,
    },
    {
      path: "healthcare/apac-support/data-residency.dna.md",
      content: `# APAC — Data Residency

| Region | Common cloud | Notes |
|--------|--------------|-------|
| Australia | ap-southeast-2 (Sydney) | My Health Record data rules |
| New Zealand | ap-southeast-2 or NZ Azure | Te Whatu Ora guidance |
| Singapore | ap-southeast-1 | NEHR accredited hosting |
| Japan | ap-northeast-1 (Tokyo) | APPI cross-border consent |
| Korea | ap-northeast-2 (Seoul) | PIPA strict transfer rules |
| India | ap-south-1 (Mumbai) | ABDM data policies |
| Indonesia | ap-southeast-3 (Jakarta) | SATUSEHAT local processing |
| China | in-country only | PIPL — no default AWS US |

${PHI}`,
    },
    {
      path: "healthcare/apac-support/terminology.dna.md",
      content: `# APAC — Clinical Terminology

| Country | Diagnoses | Labs | Meds |
|---------|-----------|------|------|
| AU/NZ | ICD-10-AM | LOINC | AMT/MIMS |
| JP | ICD-10 JP | JLAC10 | YJ codes |
| KR | KCD | LOINC | HIRA drug codes |
| IN | ICD-10 | LOINC | National drug codes |
| SG/MY/TH/PH | ICD-10 variants | LOINC | National formularies |

License **SNOMED CT** national edition where required.`,
    },
    {
      path: "healthcare/apac-support/integration-tiers.dna.md",
      content: `# APAC — Integration Strategy

1. **National platform** — ABDM (IN), SATUSEHAT (ID), NEHR (SG), MHR (AU) — highest leverage
2. **Hospital group EMR** — Epic/Cerner instances, local vendors — per-contract FHIR/HL7 v2
3. **Integration engine** — Mirth, Rhapsody, Redox when many legacy endpoints
4. **Wellness vs clinical** — consumer wearables are not clinical records without regulatory clarity

${PHI}`,
    },
  ],
  ["healthcare", "apac", "stem", "support", "region"],
);

interface SupportTopic {
  slug: string;
  title: string;
  body: string;
}

function apacCountrySupport(
  iso: string,
  countryName: string,
  summary: string,
  topics: SupportTopic[],
  extraTags: string[] = [],
): KnowledgePack {
  const systemsTopic = getCountrySystemsTopic(iso, countryName);
  const otherTopics = topics.filter((t) => t.slug !== "systems-integrations");
  const allTopics = [systemsTopic, ...otherTopics];

  return catalogPack(
    `healthcare/${iso}-support`,
    `Healthcare Support — ${countryName}`,
    "disciplines",
    summary,
    [
      {
        path: `healthcare/${iso}-support/positioning.dna.md`,
        content: `# Healthcare Support — ${countryName}\n\n${summary}\n\nPair with \`healthcare/overview-apac\` and \`healthcare/overview-${iso}\`.\n\n## Topics\n${allTopics.map((t) => `- ${t.slug}.dna.md — ${t.title}`).join("\n")}`,
      },
      ...allTopics.map((t) => ({
        path: `healthcare/${iso}-support/${t.slug}.dna.md`,
        content: `# ${countryName} — ${t.title}\n\n${t.body}`,
      })),
    ],
    ["healthcare", "country", "stem", "support", "apac", iso, ...extraTags],
  );
}

/** Deep APAC + Canada support packs (replaces generated stubs). */
export const HEALTHCARE_APAC_DEEP_SUPPORT_PACKS: KnowledgePack[] = [
  apacCountrySupport(
    "ca",
    "Canada",
    "PIPEDA, provincial privacy laws (PHIPA, HIA), Canada Health Infoway, and Canadian Baseline FHIR.",
    [
      {
        slug: "pipeda",
        title: "PIPEDA & Provincial Privacy",
        body: `**PIPEDA** federally; provinces may have substantially similar laws.

## Key provincial acts
- **PHIPA** (Ontario) — health-specific
- **HIA** (Alberta)
- **FIPPA** / regional equivalents

Health data is almost always **sensitive** — document purpose and safeguards.`,
      },
      {
        slug: "infoway",
        title: "Canada Health Infoway & Baseline FHIR",
        body: `**Infoway** publishes **Canadian Baseline** FHIR profiles (with CIHI).

## Integration
- Provincial EHR/HIE endpoints differ (ConnectCare AB, ClinicalConnect, etc.)
- Bilingual EN/FR for federal and Quebec-facing products`,
      },
      {
        slug: "provincial",
        title: "Provincial Health Systems",
        body: `| Province | Insurer | Notes |
|----------|---------|-------|
| ON | OHIP | Largest population |
| BC | MSP | |
| QC | RAMQ | French-first |
| AB | AHCIP | ConnectCare EHR |

Confirm **target province** before architecture sign-off.`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks pipeda --quote "Canadian provincial FHIR integration"
\`\`\`

Host in **ca-central-1** (AWS) or Azure Canada.`,
      },
    ],
    ["ca", "pipeda"],
  ),
  apacCountrySupport(
    "au",
    "Australia",
    "Privacy Act, My Health Record (MHR), ADHA AU Base FHIR, TGA SaMD, Medicare/PBS.",
    [
      {
        slug: "mhr",
        title: "My Health Record (MHR)",
        body: `National opt-out shared record via **ADHA**.

## Integration
- **NASH PKI** certificates for production
- Conformance testing before upload/view
- **HI Service** APIs for registered software`,
      },
      {
        slug: "au-base",
        title: "AU Base FHIR & ADHA",
        body: `Use **AU Base** Implementation Guide for clinical FHIR.

## State systems
- NSW Health, Queensland Health, etc. — separate integration programmes
- GP software: Best Practice, MedicalDirector via accredited pathways`,
      },
      {
        slug: "tga",
        title: "TGA & SaMD",
        body: `**TGA** regulates medical devices including software with diagnostic/therapeutic claims.

Distinguish **wellness** apps from **SaMD** — different evidence and registration burden.`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks privacy_act_au --quote "Australian MHR-integrated app"
\`\`\`

Data residency: **ap-southeast-2** (Sydney).`,
      },
    ],
    ["au", "mhr"],
  ),
  apacCountrySupport(
    "nz",
    "New Zealand",
    "HIPC 2020, Te Whatu Ora, NHI identifiers, and NZ FHIR adoption.",
    [
      {
        slug: "hipc",
        title: "HIPC 2020 (Health Information Privacy Code)",
        body: `Mandatory rules for health agencies — stricter than general Privacy Act.

## Key rules
- Collection limitation, security safeguards, access rights
- Unique identifiers (NHI) — lawful use only`,
      },
      {
        slug: "te-whatu-ora",
        title: "Te Whatu Ora & NHI",
        body: `**Te Whatu Ora** — Health New Zealand (national entity).

**NHI** — National Health Index number for patients.

GP systems: **Medtech**, **Indici** dominate primary care.`,
      },
      {
        slug: "interoperability",
        title: "NZ Interoperability",
        body: `FHIR adoption via Te Whatu Ora programmes. HL7 v2 still common in hospitals.

**ICD-10-AM** diagnoses; **SNOMED CT NZ** edition.`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks privacy_act_nz --quote "NZ primary care FHIR API"
\`\`\`

Often hosted ap-southeast-2 (Sydney) or Azure NZ.`,
      },
    ],
    ["nz", "hipc"],
  ),
  apacCountrySupport(
    "jp",
    "Japan",
    "APPI sensitive health data, FHIR JP Core, MHLW, and online care guidelines.",
    [
      { slug: "appi", title: "APPI Health Data", body: `Health data is **sensitive personal information** — require consent or statutory basis.\n\nAnonymization standards for secondary use under Next Gen Medical Infrastructure Act.` },
      { slug: "jp-core", title: "FHIR JP Core", body: `Use **HL7 FHIR JP Core** IG for new integrations.\n\nLegacy **SS-MIX2** storage still encountered — plan migration or interface engine translation.` },
      { slug: "mhlw", title: "MHLW & PMDA", body: `**MHLW** policy; **PMDA** for SaMD and devices.\n\nOnline medical care guidelines — verify platform licensing.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks appi --quote "Japan hospital FHIR integration"\n\`\`\`\n\nHost **ap-northeast-1** (Tokyo).` },
    ],
    ["jp"],
  ),
  apacCountrySupport(
    "in",
    "India",
    "ABDM national health stack, ABHA, HIP/HIU, DPDP Act 2023.",
    [
      { slug: "abdm", title: "ABDM Health Stack", body: `**Ayushman Bharat Digital Mission** — national digital health infrastructure.\n\nComponents: ABHA ID, Health Facility Registry, Health Professional Registry, HIE-CM consent manager.` },
      { slug: "hip-hiu", title: "HIP & HIU Registration", body: `Register as **Health Information Provider (HIP)** and/or **Health Information User (HIU)**.\n\nConsent artefacts via consent manager — never bypass.` },
      { slug: "fhir", title: "ABDM FHIR APIs", body: `ABDM mandates **FHIR R4**. Sandbox testing mandatory before production.\n\n**SNOMED CT** India extension; **LOINC** for labs.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks dpdp --quote "India ABDM HIP registration"\n\`\`\`\n\n**ap-south-1** (Mumbai) hosting.` },
    ],
    ["in", "abdm"],
  ),
  apacCountrySupport(
    "sg",
    "Singapore",
    "PDPA, NEHR, IHiS accreditation, SingPass.",
    [
      { slug: "nehr", title: "NEHR Integration", body: `**National Electronic Health Record** — integrate via **IHiS** accredited systems programme.\n\nNot all EMRs expose public APIs — accreditation path required.` },
      { slug: "pdpa", title: "PDPA Healthcare", body: `MOH sector guidance on PDPA for clinical data.\n\n**HCSA** licensing if providing healthcare services.` },
      { slug: "identity", title: "SingPass & Corppass", body: `Citizen apps may use **SingPass** for identity.\n\nClinician access via institution identity systems.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pdpa --quote "Singapore NEHR-accredited EMR"\n\`\`\`\n\n**ap-southeast-1** hosting.` },
    ],
    ["sg", "nehr"],
  ),
  apacCountrySupport(
    "id",
    "Indonesia",
    "SATUSEHAT mandated FHIR, BPJS, PDP Law 2022.",
    [
      { slug: "satusehat", title: "SATUSEHAT Platform", body: `National health platform — **FHIR R4 mandatory**.\n\nRegister systems; OAuth2 + FHIR APIs for clinical exchange.` },
      { slug: "bpjs", title: "BPJS Kesehatan", body: `~80% population coverage — claims and accreditation pathways.\n\nIntegrate via SATUSEHAT where required.` },
      { slug: "coding", title: "KFA & ICD-10", body: `**KFA** — drug and medical device coding.\n\nMap clinical codes to national catalogues.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pdp_id --quote "Indonesia SATUSEHAT certified HIP"\n\`\`\`\n\n**ap-southeast-3** (Jakarta).` },
    ],
    ["id", "satusehat"],
  ),
  apacCountrySupport(
    "kr",
    "South Korea",
    "PIPA consent, NHIS, HIRA, FHIR KR Core.",
    [
      { slug: "pipa", title: "PIPA Sensitive Data", body: `Health data needs **explicit consent** or legal exemption.\n\nStrict rules on overseas transfer.` },
      { slug: "nhis", title: "NHIS & HIRA", body: `**NHIS** — insurance; **HIRA** — review and claims.\n\nHigh EMR penetration — site-specific integration common.` },
      { slug: "fhir", title: "FHIR KR Core", body: `KHIS profiles emerging — validate against published IGs.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pipa --quote "Korea hospital EMR integration"\n\`\`\`\n\n**ap-northeast-2** (Seoul).` },
    ],
    ["kr"],
  ),
  apacCountrySupport(
    "hk",
    "Hong Kong",
    "PDPO, eHRSS sharing, Hospital Authority.",
    [
      { slug: "ehrss", title: "eHRSS Sharing", body: `**Electronic Health Record Sharing System** — opt-in sharing.\n\nHCP registration and patient consent required.` },
      { slug: "ha", title: "Hospital Authority", body: `Public hospitals majority share — **HA EMR** enterprise system.\n\nPartner programmes for API access.` },
      { slug: "pdpo", title: "PDPO Health Data", body: `Data Protection Principles apply to health data.\n\n**MDACS** for medical devices.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pdpo --quote "Hong Kong eHRSS participant"\n\`\`\`\n\n**ap-east-1** (Hong Kong).` },
    ],
    ["hk", "ehrss"],
  ),
  apacCountrySupport(
    "th",
    "Thailand",
    "PDPA 2022, NHSO universal coverage, HDC programmes.",
    [
      { slug: "nhso", title: "NHSO Universal Coverage", body: `**National Health Security Office** — UC scheme covers most citizens.\n\nClaims and provider accreditation via NHSO systems.` },
      { slug: "pdpa", title: "PDPA 2022", body: `Sensitive data includes health — document lawful basis and DPIA where needed.` },
      { slug: "hdc", title: "Health Data Center", body: `MOPH **HDC** initiatives — confirm current FHIR/API specs with MOH.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pdpa_th --quote "Thailand MOH-integrated app"\n\`\`\`` },
    ],
    ["th"],
  ),
  apacCountrySupport(
    "ph",
    "Philippines",
    "DPA 2012, PhilHealth, UHC Act digital programmes.",
    [
      { slug: "philhealth", title: "PhilHealth E-Claims", body: `Accreditation and **E-Claims** API access for providers.\n\nCase rates and benefit packages drive billing logic.` },
      { slug: "dpa", title: "Data Privacy Act 2012", body: `Health data is sensitive — NPC registration and safeguards required.` },
      { slug: "ehealth", title: "National eHealth", body: `DOH electronic health programmes — FHIR adoption in digital transformation roadmap.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks dpa_ph --quote "Philippines PhilHealth-accredited provider app"\n\`\`\`` },
    ],
    ["ph"],
  ),
  apacCountrySupport(
    "my",
    "Malaysia",
    "PDPA 2010, MOH MyHDW, public/private mix.",
    [
      { slug: "moh", title: "MOH Digital Health", body: `**MyHDW** (Malaysian Health Data Warehouse) and national HIE programmes.\n\nConfirm current integration specs with MOH.` },
      { slug: "pdpa", title: "PDPA 2010", body: `Private healthcare facilities licensing + PDPA for personal data.` },
      { slug: "systems", title: "Public & Private", body: `MOH hospitals; **IHH/Pantai**, **KPJ** private groups — vendor-specific EMRs.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pdpa_my --quote "Malaysia clinical data platform"\n\`\`\`` },
    ],
    ["my"],
  ),
  apacCountrySupport(
    "vn",
    "Vietnam",
    "PDPD 2023, MOH national PHR, social health insurance.",
    [
      { slug: "pdpd", title: "PDPD 2023", body: `Personal data protection decree — health is sensitive.\n\nCross-border transfer rules apply.` },
      { slug: "moh", title: "MOH National PHR", body: `Electronic health record national programme — VNPT/Viettel health IT vendors common.` },
      { slug: "vss", title: "Social Health Insurance", body: `**VSS** — ~90% population; provider registration for claims.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pdpd_vn --quote "Vietnam MOH PHR integration"\n\`\`\`` },
    ],
    ["vn"],
  ),
  apacCountrySupport(
    "tw",
    "Taiwan",
    "PDPA, NHI single payer, Smart Healthcare FHIR roadmap.",
    [
      { slug: "nhi", title: "National Health Insurance", body: `**NHI** — 99% coverage; MediCloud and Smart Healthcare initiatives.` },
      { slug: "fhir", title: "FHIR Roadmap", body: `HL7 v2 dominant today; FHIR R4 in Smart Healthcare programme — verify current IG.` },
      { slug: "tfda", title: "TFDA SaMD", body: `Software with medical claims requires TFDA pathway.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks tw_pdpa --quote "Taiwan NHI-connected clinical app"\n\`\`\`` },
    ],
    ["tw"],
  ),
  apacCountrySupport(
    "cn",
    "China",
    "PIPL/DSL localisation, NMPA SaMD, hospital tier system.",
    [
      { slug: "pipl", title: "PIPL & Data Localisation", body: `Health data = **important data** — must stay in China.\n\nSecurity assessment for cross-border transfer.` },
      { slug: "nhsa", title: "NHSA & Insurance", body: `National Healthcare Security Administration — DRG/DIP payment reform.` },
      { slug: "internet-hospital", title: "Internet Hospital Licences", body: `Regulated online care — platform licences required.\n\nLocal entity and ICP commonly required.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --frameworks pipl --quote "China in-country health platform"\n\`\`\`\n\nEngage local counsel before PHI processing.` },
    ],
    ["cn", "pipl"],
  ),
  apacCountrySupport(
    "bd",
    "Bangladesh",
    "MOHFW digital health, DGHS public delivery, growing private sector.",
    [
      { slug: "mohfw", title: "MOHFW Programmes", body: `Directorate General of Health Services — district hospital network.\n\nDigital health strategy — confirm current API specs.` },
      { slug: "integration", title: "Integration", body: `Hospital EMR per facility; HL7 v2 where available.\n\n**ap-south-1** hosting with legal review.` },
      { slug: "compliance", title: "Compliance Actions", body: `Document data flows and subprocessors.\n\nPair with \`healthcare/overview-apac\`.` },
    ],
    ["bd"],
  ),
  apacCountrySupport(
    "pk",
    "Pakistan",
    "Provincial health systems, Sehat Sahulat insurance, DRAP devices.",
    [
      { slug: "provincial", title: "Provincial Systems", body: `Punjab, Sindh, KP, Balochistan — separate health IT programmes.\n\nArchitecture must target deployment province.` },
      { slug: "sehat", title: "Sehat Sahulat", body: `Public health insurance — provider empanelment and claims.` },
      { slug: "compliance", title: "Compliance Actions", body: `Monitor data protection legislation.\n\nLegal review for cross-border hosting.` },
    ],
    ["pk"],
  ),
  apacCountrySupport(
    "lk",
    "Sri Lanka",
    "PDPA 2022, free public healthcare, private hospital groups.",
    [
      { slug: "pdpa", title: "PDPA Sri Lanka", body: `Consent and purpose limitation for health data.\n\nNMRA for devices.` },
      { slug: "imis", title: "IMIS & MOH", body: `Health management information system modernization.\n\nAsiri, Nawaloka private integrations.` },
      { slug: "compliance", title: "Compliance Actions", body: `\`\`\`bash\ndna plan compliance --quote "Sri Lanka clinical portal PDPA"\n\`\`\`` },
    ],
    ["lk"],
  ),
  apacCountrySupport(
    "np",
    "Nepal",
    "Privacy Act 2075, MOHP, DHIS2 public reporting.",
    [
      { slug: "mohp", title: "MOHP Systems", body: `Federal MOHP — public posts and hospitals.\n\nDHIS2 for health reporting.` },
      { slug: "rural", title: "Rural & Low-Bandwidth", body: `Telehealth UX for low connectivity.\n\nOffline-first where possible.` },
      { slug: "compliance", title: "Compliance Actions", body: `Privacy Act compliance for patient data.` },
    ],
    ["np"],
  ),
  apacCountrySupport(
    "kh",
    "Cambodia",
    "Data protection law 2023, MOH HMIS, DHIS2.",
    [
      { slug: "hmis", title: "MOH HMIS", body: `Health management information system for public facilities.` },
      { slug: "pdp", title: "Data Protection Law", body: `Cambodia DPL 2023 — consent and security measures.` },
      { slug: "compliance", title: "Compliance Actions", body: `ap-southeast-1 hosting common.` },
    ],
    ["kh"],
  ),
  apacCountrySupport(
    "mm",
    "Myanmar",
    "MOH public system, NGO health IT, high operational risk.",
    [
      { slug: "context", title: "Operating Context", body: `Verify sanctions, legal environment, and connectivity before deployment.\n\nNGO systems: OpenMRS, DHIS2 common.` },
      { slug: "integration", title: "Integration", body: `Limited FHIR — paper and basic EMR hybrid.\n\nHumanitarian integration patterns.` },
      { slug: "compliance", title: "Compliance Actions", body: `Mandatory legal and operational risk review.` },
    ],
    ["mm"],
  ),
];

export const HEALTHCARE_APAC_OVERVIEW_DEFS: CatalogPlatformDef[] = [
  HEALTHCARE_APAC_OVERVIEW_DEF,
  ...HEALTHCARE_APAC_EXTRA_OVERVIEW_DEFS,
];

export const HEALTHCARE_APAC_ISO_CODES = [
  "au",
  "nz",
  "jp",
  "kr",
  "sg",
  "in",
  "tw",
  "hk",
  "my",
  "th",
  "ph",
  "id",
  "vn",
  "cn",
  "bd",
  "pk",
  "lk",
  "np",
  "kh",
  "mm",
] as const;
