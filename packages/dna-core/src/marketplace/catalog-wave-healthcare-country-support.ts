import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";
import { getCountrySystemsTopic } from "./healthcare-systems-by-country.js";

interface SupportTopic {
  slug: string;
  title: string;
  body: string;
}

function countrySupportPack(
  iso: string,
  countryName: string,
  summary: string,
  topics: SupportTopic[],
  extraTags: string[] = [],
): KnowledgePack {
  const base = `Pair with \`healthcare/overview-${iso}\`. Auto-installed when you run \`dna marketplace install healthcare/overview-${iso}\` or \`dna marketplace install healthcare/${countryName.toLowerCase()}\`.`;

  const systemsTopic = getCountrySystemsTopic(iso, countryName);
  const otherTopics = topics.filter((t) => t.slug !== "systems-integrations");
  const allTopics = [systemsTopic, ...otherTopics];

  return catalogPack(
    `healthcare/${iso}-support`,
    `Healthcare Support — ${countryName}`,
    "disciplines",
    `${countryName} healthcare depth — regulation, national systems, integration, and compliance actions`,
    [
      {
        path: `healthcare/${iso}-support/positioning.dna.md`,
        content: `# Healthcare Support — ${countryName}

${summary}

${base}

## Topics in this pack
${allTopics.map((t) => `- \`${t.slug}.dna.md\` — ${t.title}`).join("\n")}

## DNA commands
\`\`\`bash
dna marketplace install healthcare/overview-${iso}
dna plan compliance --frameworks <see compliance topic>
dna context healthcare
\`\`\`
`,
      },
      ...allTopics.map((t) => ({
        path: `healthcare/${iso}-support/${t.slug}.dna.md`,
        content: `# ${countryName} — ${t.title}\n\n${t.body}`,
      })),
    ],
    ["healthcare", "country", "stem", "support", iso, ...extraTags],
  );
}

const PHI_RULES = `## Engineering rules
- Never log PHI or clinical documents
- Field-level minimum necessary in APIs
- Audit all PHI access; document subprocessors in Impressions`;

export const HEALTHCARE_COUNTRY_SUPPORT_PACKS: KnowledgePack[] = [
  countrySupportPack(
    "fr",
    "France",
    "HDS-certified hosting, DMP/Mon Espace Santé, ANS interoperability, and Pro Santé Connect for clinician identity.",
    [
      {
        slug: "hds",
        title: "HDS Hosting (Hébergeur de Données de Santé)",
        body: `Health data **must** be hosted with an **HDS-certified** provider when processing French health data at scale.

## Requirements
- Contract only HDS-certified IaaS/PaaS/SaaS for production PHI
- Document certification scope (IaaS vs PaaS) in Impressions subprocessors
- Segregate health workloads from non-health tenants
- Encryption at rest + transit; access logging

## Common certified options
- OVHcloud Health, Azure France (verify HDS scope), Scaleway, Claranet
- Do not assume generic EU region = HDS — verify certificate

${PHI_RULES}`,
      },
      {
        slug: "dmp",
        title: "DMP & Mon Espace Santé",
        body: `The **Dossier Médical Partagé (DMP)** / **Mon Espace Santé** is the citizen health record hub.

## Integration
- Follow **ANS** CI-SIS FHIR profiles for clinical documents
- Patient consent and access controls are mandatory
- **MSSanté** for secure professional messaging where applicable

## Architecture
- Separate citizen-facing portal auth from clinician auth
- Document consent artefacts and retention
- Test with ANS conformance environments before production`,
      },
      {
        slug: "ans",
        title: "ANS Interoperability (CI-SIS FHIR)",
        body: `**Agence du Numérique en Santé (ANS)** publishes French FHIR Implementation Guides under CI-SIS.

## Use
- Hospital and ambulatory interoperability
- Document exchange to/from DMP
- e-Prescription and lab results profiles

## Checklist
- [ ] Validate resources against correct ANS IG package
- [ ] Pro Santé Connect for clinician OAuth where required
- [ ] French clinical coding (CCAM, CIM-10) mapped correctly`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks gdpr --quote "French healthcare SaaS with HDS hosting"
\`\`\`

- DPIA for health data processing (CNIL templates)
- HDS certification path for your hosting layer
- EU MDR via \`healthcare/mdr-eu\` if SaMD
- Document **finalité** (purpose) and retention per French health law`,
      },
    ],
    ["fr", "hds", "dmp", "ans"],
  ),
  countrySupportPack(
    "us",
    "United States",
    "HIPAA operational controls, CMS interoperability APIs, payer FHIR (Da Vinci), and BAA-covered vendor management.",
    [
      {
        slug: "hipaa-ops",
        title: "HIPAA Operations",
        body: `## BAA chain
Every vendor touching ePHI needs a signed **BAA** — cloud, email, analytics, AI, support tools.

## Minimum necessary
Scope FHIR reads/writes to required resource types and elements. No blanket \`patient/*.read\`.

## Breach
Document incident response; 60-day notification rule for breaches affecting 500+ individuals.

${PHI_RULES}`,
      },
      {
        slug: "cms-apis",
        title: "CMS Patient & Provider Access APIs",
        body: `Medicare Advantage, ACA plans, and certified hospitals must expose **FHIR R4 + US Core** APIs.

## Your app may need
- Patient Access API (consumer apps)
- Provider Access API (clinician apps)
- Payer-to-payer exchange (plans)

Document **information blocking** policies and exceptions.`,
      },
      {
        slug: "payer-fhir",
        title: "Payer & RCM Integration",
        body: `US billing still relies on **X12 EDI** (837/835) via clearinghouses.

## FHIR payer IGs (Da Vinci)
- PDex, PAS (prior auth), CDex
- Pair with \`healthcare/da-vinci\` and \`healthcare/x12-edi\`

Never store raw 837 files unencrypted.`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks hipaa --quote "US clinical SaaS with Epic FHIR"
\`\`\`

- FDA SaMD review via \`healthcare/fda-samd\` if clinical decision support
- State telehealth licensure for treating clinicians`,
      },
    ],
    ["us", "hipaa", "cms"],
  ),
  countrySupportPack(
    "uk",
    "United Kingdom",
    "NHS DSPT assurance, GP Connect, CIS2 clinician auth, and UK Core FHIR conformance.",
    [
      {
        slug: "dspt",
        title: "NHS DSPT & DTAC",
        body: `Suppliers to NHS organisations must complete **Data Security and Protection Toolkit (DSPT)** annually.

## DTAC
Digital Technology Assessment Criteria for NHS procurement — clinical safety, interoperability, security.

## Actions
- Register on DSPT portal; align to NHS England standards
- Clinical safety officer for patient-facing systems`,
      },
      {
        slug: "gp-connect",
        title: "GP Connect & Spine",
        body: `**GP Connect** — structured primary care access (appointments, record views).

**Spine** — PDS (demographics), SDS (role-based access), GP2GP transfers.

## Auth
- **CIS2** smartcard / alternative auth for clinicians
- **NHS Login** for citizens`,
      },
      {
        slug: "uk-core",
        title: "UK Core FHIR",
        body: `Mandatory profiles for NHS-facing APIs. Validate with UK Core IG packages in CI.

## Terminology
- SNOMED CT UK Edition
- dm+d for medications`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks uk_gdpr --quote "NHS-facing FHIR API"
\`\`\`

- UK data residency preferred
- Common Law Duty of Confidentiality in addition to UK GDPR`,
      },
    ],
    ["uk", "nhs"],
  ),
  countrySupportPack(
    "de",
    "Germany",
    "Gematik Telematikinfrastruktur (TI), ePA, eRezept, and DiGA reimbursement pathway.",
    [
      {
        slug: "gematik",
        title: "Gematik TI Gateway",
        body: `Practice systems connect via certified **TI-Konnektor** — do not bypass for production clinical data.

## Services
- ePA (elektronische Patientenakte)
- eRezept, eAU (sick note)
- KIM secure messaging`,
      },
      {
        slug: "epa",
        title: "ePA (Electronic Patient Record)",
        body: `National ePA rollout — FHIR-based access with patient consent controls.

## Architecture
- Integrate via Gematik-specified FHIR APIs
- KBV MIO profiles for documents`,
      },
      {
        slug: "diga",
        title: "DiGA (Digital Health Apps)",
        body: `Reimbursable digital health apps listed in **BfArM DiGA directory**.

## Path
- Clinical evidence, data protection, interoperability proof
- Different from general wellness apps`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks gdpr --quote "German ePA integration"
\`\`\`

- BDSG + GDPR for health data
- EU MDR if SaMD`,
      },
    ],
    ["de", "gematik"],
  ),
  countrySupportPack(
    "eu",
    "European Union",
    "Cross-border EHDS readiness, EU MDR SaMD, GDPR Art. 9 health data, and national IG overlays.",
    [
      {
        slug: "gdpr-health",
        title: "GDPR Health Data (Art. 9)",
        body: `Health data is **special category** — lawful basis usually explicit consent, vital interests, or healthcare provision.

## DPIA
Often mandatory for large-scale health processing.`,
      },
      {
        slug: "mdr",
        title: "EU MDR & SaMD",
        body: `Software diagnosing/treating/monitoring may be **SaMD** — CE marking, clinical evaluation, UDI.

See \`healthcare/mdr-eu\` for full pathway.`,
      },
      {
        slug: "ehds",
        title: "European Health Data Space",
        body: `Emerging cross-border framework for primary use (care) and secondary use (research).

Monitor EHDS implementation timelines per member state.`,
      },
      {
        slug: "compliance",
        title: "Compliance Actions",
        body: `\`\`\`bash
dna plan compliance --frameworks gdpr --quote "EU multi-country health platform"
\`\`\`

Install country-specific pack when deployment market is known.`,
      },
    ],
    ["eu", "gdpr", "mdr"],
  ),
];

/** Generate support packs for countries without hand-authored depth (overview-linked stubs). */
function generatedCountrySupport(iso: string, countryName: string, focus: string, systems: string, complianceCmd: string): KnowledgePack {
  return countrySupportPack(iso, countryName, focus, [
    {
      slug: "systems",
      title: "National Health Systems (summary)",
      body: systems,
    },
    {
      slug: "integration",
      title: "Integration Patterns",
      body: `- Default to **FHIR R4** with national IG where published
- Use integration platform (Redox, Mirth) when hospital APIs unavailable
- Document data residency and subprocessors

${PHI_RULES}`,
    },
    {
      slug: "compliance",
      title: "Compliance Actions",
      body: `\`\`\`bash
${complianceCmd}
\`\`\`

Load \`healthcare/overview-${iso}\` for regulation summary.`,
    },
  ]);
}

const GENERATED_SUPPORTS: KnowledgePack[] = [
  generatedCountrySupport(
    "ie",
    "Ireland",
    "eHealth Ireland, HSE governance, and EU GDPR health data rules.",
    "- HSE public system\n- eHealth Ireland programmes\n- Private hospitals",
    "dna plan compliance --frameworks gdpr --quote \"Irish healthcare SaaS\"",
  ),
  generatedCountrySupport(
    "nl",
    "Netherlands",
    "NEN 7510 security, MedMij citizen access, and Nictiz FHIR profiles.",
    "- Zorgverzekeringswet mandatory insurance\n- MedMij / Zorg-AB\n- Nictiz standards",
    "dna plan compliance --frameworks gdpr --quote \"Dutch healthcare API\"",
  ),
  generatedCountrySupport(
    "ch",
    "Switzerland",
    "nFADP privacy, ELGA electronic patient dossier, and CH Core FHIR.",
    "- ELGA national EHR\n- Cantonal health delivery\n- eHealth Suisse specs",
    "dna plan compliance --frameworks swiss_nFADP --quote \"Swiss EPD integration\"",
  ),
  generatedCountrySupport(
    "br",
    "Brazil",
    "LGPD sensitive data, RNDS FHIR network, and ANS private insurance.",
    "- SUS public system\n- RNDS national exchange\n- ANS/TISS private claims",
    "dna plan compliance --frameworks lgpd --quote \"Brazil RNDS integration\"",
  ),
  generatedCountrySupport(
    "mx",
    "Mexico",
    "LFPDPPP, NOM-024 EHR standard, and IMSS/ISSSTE public insurers.",
    "- IMSS / ISSSTE\n- NOM-024 certification for EHR\n- SINBA national system",
    "dna plan compliance --frameworks lfpdppp --quote \"Mexico NOM-024 EHR\"",
  ),
  generatedCountrySupport(
    "za",
    "South Africa",
    "POPIA health data, provincial DOH systems, and medical aid schemes.",
    "- Public provincial health\n- Discovery/Netcare private\n- NHI reform in progress",
    "dna plan compliance --frameworks popia --quote \"South Africa health app\"",
  ),
  generatedCountrySupport(
    "sa",
    "Saudi Arabia",
    "PDPL, NPHIES FHIR insurance exchange, and MOH programmes.",
    "- NPHIES payer/provider FHIR\n- Seha Virtual Hospital\n- MOH licensing",
    "dna plan compliance --frameworks pdpl --quote \"Saudi NPHIES integration\"",
  ),
  generatedCountrySupport(
    "ae",
    "United Arab Emirates",
    "UAE PDPL, Malaffi (Abu Dhabi) and NABIDH (Dubai) HIE programmes.",
    "- Malaffi Abu Dhabi HIE\n- NABIDH Dubai HIE\n- DHA/DOH emirate policies",
    "dna plan compliance --frameworks uae_pdpl --quote \"UAE HIE accredited EMR\"",
  ),
  generatedCountrySupport(
    "il",
    "Israel",
    "Privacy Protection Law, Kupot Holim sick funds, and digital health initiatives.",
    "- Clalit and other sick funds\n- National insurance\n- Hospital EMRs (Chameleon, Meditech)",
    "dna plan compliance --frameworks israel_privacy --quote \"Israel sick fund integration\"",
  ),
  generatedCountrySupport(
    "it",
    "Italy",
    "FSE regional electronic health records and SSN regional delivery.",
    "- SSN regional systems (Lombardia, Toscana, ...)\n- Tessera Sanitaria\n- FSE 2.0 interoperability",
    "dna plan compliance --frameworks gdpr --quote \"Italy regional FSE\"",
  ),
  generatedCountrySupport(
    "es",
    "Spain",
    "LOPDGDD, autonomous community health systems, and digital clinical history.",
    "- 17 regional health services\n- Historia Clínica Digital\n- Ministry interoperability roadmap",
    "dna plan compliance --frameworks gdpr --quote \"Spain regional health API\"",
  ),
  generatedCountrySupport(
    "se",
    "Sweden",
    "Patient Data Act, NPÖ national patient overview, and Inera integration.",
    "- 21 regions\n- NPÖ / 1177 e-services\n- Inera national platform",
    "dna plan compliance --frameworks gdpr --quote \"Sweden NPÖ integration\"",
  ),
  generatedCountrySupport(
    "no",
    "Norway",
    "Kjernejournal core record, Helsenorge portal, and Norwegian eHealth.",
    "- 4 regional health authorities\n- Kjernejournal\n- Helsenorge citizen services",
    "dna plan compliance --frameworks gdpr --quote \"Norway Kjernejournal API\"",
  ),
  generatedCountrySupport(
    "dk",
    "Denmark",
    "MedCom standards, Sundhed.dk, and national EPJ.",
    "- 5 regions\n- Sundhed.dk portal\n- MedCom interoperability",
    "dna plan compliance --frameworks gdpr --quote \"Denmark MedCom FHIR\"",
  ),
  generatedCountrySupport(
    "fi",
    "Finland",
    "Kanta national services, wellbeing counties, and THL FHIR profiles.",
    "- Kanta (prescriptions, PHR)\n- 21 wellbeing counties\n- Apotti/Epic in Helsinki",
    "dna plan compliance --frameworks gdpr --quote \"Finland Kanta integration\"",
  ),
  generatedCountrySupport(
    "at",
    "Austria",
    "ELGA electronic health record and ÖGK insurance fund.",
    "- ELGA EHR\n- e-card linkage\n- CGM/Dedalus practice systems",
    "dna plan compliance --frameworks gdpr --quote \"Austria ELGA integration\"",
  ),
  generatedCountrySupport(
    "be",
    "Belgium",
    "eHealth Platform, eHealthBox messaging, and regional competence.",
    "- eHealth Platform hub\n- Mutualités sickness funds\n- Riziv reimbursement",
    "dna plan compliance --frameworks gdpr --quote \"Belgium eHealth Platform\"",
  ),
  generatedCountrySupport(
    "pl",
    "Poland",
    "e-Zdrowie P1 platform, IKP patient account, and CEZ standards.",
    "- NFZ National Health Fund\n- P1 / e-Zdrowie\n- IKP patient portal",
    "dna plan compliance --frameworks gdpr --quote \"Poland P1 integration\"",
  ),
  generatedCountrySupport(
    "pt",
    "Portugal",
    "SPMS national health IT, SNS regional ARS, and RNPI patient index.",
    "- SNS / ARS regions\n- SPMS interoperability\n- SNS 24 telehealth",
    "dna plan compliance --frameworks gdpr --quote \"Portugal SPMS integration\"",
  ),
];

export const ALL_HEALTHCARE_COUNTRY_SUPPORT_PACKS: KnowledgePack[] = [
  ...HEALTHCARE_COUNTRY_SUPPORT_PACKS,
  ...GENERATED_SUPPORTS,
];

export const ALL_HEALTHCARE_COUNTRY_SUPPORT_PACK_IDS = ALL_HEALTHCARE_COUNTRY_SUPPORT_PACKS.map((p) => p.id);
