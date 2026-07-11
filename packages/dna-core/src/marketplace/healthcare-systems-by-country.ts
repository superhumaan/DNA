/**
 * Per-country healthcare IT systems catalog — vendors, national platforms,
 * and integration playbooks. Powers `systems-integrations.dna.md` in every
 * country support pack and enriches install bundles with vendor DNA packs.
 */

export interface HealthcareSystemEntry {
  name: string;
  type: "national" | "hospital-ehr" | "ambulatory" | "payer" | "hie" | "integration" | "pharmacy" | "imaging";
  segment: string;
  integration: string;
  /** DNA marketplace pack to auto-install with country bundle */
  dnaPack?: string;
}

export interface CountrySystemsProfile {
  iso: string;
  countryName: string;
  systems: HealthcareSystemEntry[];
  playbook: string;
}

function entry(
  name: string,
  type: HealthcareSystemEntry["type"],
  segment: string,
  integration: string,
  dnaPack?: string,
): HealthcareSystemEntry {
  return { name, type, segment, integration, dnaPack };
}

export const HEALTHCARE_COUNTRY_SYSTEMS: Record<string, CountrySystemsProfile> = {
  us: {
    iso: "us",
    countryName: "United States",
    systems: [
      entry("Epic (Hyperspace / MyChart)", "hospital-ehr", "Acute + ambulatory enterprise", "Epic on FHIR + App Orchard; per-customer FHIR base URL; SMART launch", "healthcare/epic"),
      entry("Oracle Health (Cerner Millennium)", "hospital-ehr", "Acute care", "Cerner CODE sandbox → SMART on FHIR; OAuth2 backend services", "healthcare/cerner-oracle-health"),
      entry("MEDITECH Expanse", "hospital-ehr", "Community hospitals", "FHIR where enabled; often Redox/Mirth for v2", "healthcare/meditech"),
      entry("athenahealth athenaOne", "ambulatory", "Outpatient", "REST API + webhooks; practice ID scoped", "healthcare/athenahealth"),
      entry("eClinicalWorks / healow", "ambulatory", "Outpatient", "healow patient engagement APIs", "healthcare/eclinicalworks"),
      entry("Veradigm (Allscripts)", "ambulatory", "Ambulatory", "Veradigm API programmes", "healthcare/veradigm"),
      entry("Canvas Medical", "ambulatory", "Open API EMR", "REST-first open EMR for startups", "healthcare/canvas-medical"),
      entry("Redox", "integration", "Multi-EHR network", "Single API → 100+ EHRs; webhooks; normalization", "healthcare/redox"),
      entry("Health Gorilla / Particle / Zus", "hie", "Clinical data networks", "OAuth patient/clinician linking; FHIR aggregation", "healthcare/health-gorilla"),
      entry("Change Healthcare / Availity", "payer", "Claims + eligibility", "X12 270/271, 837/835 via clearinghouse", "healthcare/availity"),
      entry("CMS Interop (Patient Access API)", "national", "Regulated FHIR", "US Core FHIR for MA/ACA/hospitals", "healthcare/cms-interop"),
      entry("TEFCA / QHIN", "national", "Nationwide HIE", "Purpose-of-use via QHIN or facilitator", "healthcare/tefca-qhin"),
      entry("Da Vinci IGs", "payer", "Payer FHIR", "PDex, PAS, CDex for prior auth and claims", "healthcare/da-vinci"),
    ],
    playbook: `1. **Pick tier** — direct EHR FHIR (long certification) vs Redox/Health Gorilla (faster)
2. **Register** — Epic App Orchard or Cerner CODE before writing integration code
3. **SMART on FHIR** for clinician-facing; standalone OAuth for patient apps
4. **Claims** — never hand-roll X12; use clearinghouse + \`healthcare/x12-edi\`
5. **Per-org URLs** — every health system has its own FHIR base URL`,
  },
  uk: {
    iso: "uk",
    countryName: "United Kingdom",
    systems: [
      entry("NHS Spine (PDS / SDS)", "national", "Identity + demographics", "PDS FHIR API; SDS role lookup; CIS2 auth", "healthcare/nhs-fhir"),
      entry("GP Connect", "national", "Primary care access", "Structured record + appointments; accredited systems only", "healthcare/nhs-fhir"),
      entry("NHS Login", "national", "Citizen identity", "OAuth for patient-facing apps", "healthcare/nhs-fhir"),
      entry("e-RS (e-Referral Service)", "national", "Referrals", "FHIR APIs for secondary care referrals", "healthcare/nhs-fhir"),
      entry("Epic (UK instances)", "hospital-ehr", "Acute (select trusts)", "Epic on FHIR UK Core profiles", "healthcare/epic"),
      entry("Cerner / Oracle Health UK", "hospital-ehr", "Acute", "Millennium FHIR + UK Core", "healthcare/cerner-oracle-health"),
      entry("System C Medway", "hospital-ehr", "Acute PAS/EPR", "HL7 v2 + FHIR emerging; trust-specific", undefined),
      entry("EMIS / TPP SystmOne", "ambulatory", "GP systems", "GP Connect accreditation path — do not scrape", undefined),
      entry("Mirth / Rhapsody", "integration", "Interface engine", "v2 ↔ FHIR translation for legacy trusts", "healthcare/mirth"),
    ],
    playbook: `1. **UK Core FHIR** mandatory for NHS-facing APIs
2. **GP Connect accreditation** for primary care data — months-long programme
3. **CIS2** for clinician auth; **NHS Login** for patients
4. **DSPT** annual assurance required for NHS suppliers`,
  },
  fr: {
    iso: "fr",
    countryName: "France",
    systems: [
      entry("Mon Espace Santé / DMP", "national", "Shared health record", "ANS CI-SIS FHIR; patient consent", undefined),
      entry("Pro Santé Connect", "national", "Clinician identity", "OAuth2 OIDC for health professionals", undefined),
      entry("MSSanté", "national", "Secure messaging", "Health professional secure email", undefined),
      entry("INS (NIR)", "national", "National health ID", "Identity matching for records", undefined),
      entry("DxCare (Dedalus)", "hospital-ehr", "Acute", "HL7 CDA + FHIR ANS profiles; hospital-specific", undefined),
      entry("Orbis (Dedalus)", "hospital-ehr", "Acute", "Common in public hospitals", undefined),
      entry("Epic France", "hospital-ehr", "Acute (select)", "Epic on FHIR + CI-SIS overlays", "healthcare/epic"),
      entry("Maincare / Mediboard", "ambulatory", "Practice", "Ambulatory APIs vary by vendor", undefined),
      entry("Redox / Enovacom", "integration", "Integration", "When hospital lacks public FHIR", "healthcare/redox"),
    ],
    playbook: `1. **HDS-certified hosting** before production PHI
2. **ANS IG packages** — validate every resource in CI
3. **DMP** integration requires ANS conformance + legal agreements
4. **CCAM / CIM-10** coding for procedures and diagnoses`,
  },
  de: {
    iso: "de",
    countryName: "Germany",
    systems: [
      entry("Gematik TI (ePA / eRezept / eAU)", "national", "Telematics infrastructure", "FHIR via certified TI-Konnektor — not direct to PVS", undefined),
      entry("KBV MIO", "national", "Medical documents", "Structured outpatient documents", undefined),
      entry("ORBIS / i.s.h.med", "hospital-ehr", "Acute", "Hospital IS; FHIR via TI or interface engine", undefined),
      entry("Epic / Cerner DE", "hospital-ehr", "Acute (select)", "FHIR + Gematik where deployed", "healthcare/epic"),
      entry("CGM / Medistar / Turbomed", "ambulatory", "PVS practice systems", "TI gateway required — no ad hoc scraping", undefined),
      entry("DiGA Directory (BfArM)", "national", "Prescribed apps", "Separate from general wellness apps", undefined),
    ],
    playbook: `1. **TI-Konnektor** certification for practice-facing integrations
2. **ePA** FHIR APIs for patient record access with consent
3. **DiGA** path if app is reimbursable digital health`,
  },
  ca: {
    iso: "ca",
    countryName: "Canada",
    systems: [
      entry("Canada Health Infoway", "national", "Interop standards", "Canadian Baseline FHIR profiles", undefined),
      entry("Ontario Health / ConnectCare (AB)", "national", "Provincial EHR", "Province-specific FHIR/API endpoints", undefined),
      entry("Epic Canada", "hospital-ehr", "Acute (academic)", "Epic on FHIR Canadian Baseline", "healthcare/epic"),
      entry("Cerner Canada", "hospital-ehr", "Acute", "Millennium FHIR", "healthcare/cerner-oracle-health"),
      entry("Telus Health / TELUS PS Suite", "ambulatory", "Practice + community", "Vendor APIs; provincial programmes", undefined),
      entry("Meditech Canada", "hospital-ehr", "Community hospitals", "FHIR/v2 mix", "healthcare/meditech"),
      entry("Redox", "integration", "Multi-province", "When provincial API unavailable", "healthcare/redox"),
    ],
    playbook: `1. **Target province first** — OHIP/MSP/RAMQ rules differ
2. **Canadian Baseline FHIR** for new integrations
3. **Bilingual** EN/FR for federal and Quebec
4. **ca-central-1** data residency`,
  },
  au: {
    iso: "au",
    countryName: "Australia",
    systems: [
      entry("My Health Record (ADHA)", "national", "National shared record", "NASH PKI; HI Service APIs; conformance testing", undefined),
      entry("Medicare / PBS (Services Australia)", "national", "Claims + benefits", "PRODA authentication; Medicare Online", undefined),
      entry("Best Practice / MedicalDirector", "ambulatory", "GP software", "Accredited software path to MHR", undefined),
      entry("Cerner AU / Epic AU", "hospital-ehr", "Acute", "FHIR AU Base profiles", "healthcare/cerner-oracle-health"),
      entry("NSW Health Cerner", "hospital-ehr", "State health", "State-specific integration programmes", undefined),
      entry("Telstra Health / Fred IT", "pharmacy", "Pharmacy + eRx", "ePrescribing networks", undefined),
      entry("HealthLink / Medical Objects", "integration", "Messaging", "Secure clinical messaging between practices", undefined),
      entry("Redox", "integration", "Multi-EHR", "When hospital lacks public FHIR API", "healthcare/redox"),
    ],
    playbook: `1. **MHR conformance** before upload/view of clinical documents
2. **AU Base FHIR** for all new APIs
3. **State health** systems are separate from national — confirm jurisdiction
4. **ap-southeast-2** (Sydney) hosting`,
  },
  nz: {
    iso: "nz",
    countryName: "New Zealand",
    systems: [
      entry("Te Whatu Ora / NHI", "national", "National health entity + ID", "NHI number; national interoperability programme", undefined),
      entry("Hira (Health NZ)", "national", "Digital services", "National digital health infrastructure", undefined),
      entry("Medtech Evolution / Indici", "ambulatory", "GP PMS", "Dominant GP systems; FHIR adoption via programmes", undefined),
      entry("Orion Health Concerto", "integration", "HIE / portal", "Common integration hub in hospitals", undefined),
      entry("Epic (select DHBs)", "hospital-ehr", "Acute", "FHIR where deployed", "healthcare/epic"),
    ],
    playbook: `1. **HIPC 2020** compliance for all health agencies
2. **NHI** as patient identifier — lawful use only
3. **Te Whatu Ora** specs for national programmes`,
  },
  in: {
    iso: "in",
    countryName: "India",
    systems: [
      entry("ABDM (Ayushman Bharat Digital Mission)", "national", "National health stack", "ABHA ID; HIP/HIU; HIE-CM consent; FHIR R4 APIs", undefined),
      entry("ABHA / Health ID", "national", "Patient identity", "Create/link ABHA via ABDM gateway", undefined),
      entry("UHI (Unified Health Interface)", "national", "Service discovery", "Open protocol for health service booking", undefined),
      entry("Apollo / Fortis / Max hospital EMRs", "hospital-ehr", "Private chains", "Hospital-specific; ABDM HIP registration", undefined),
      entry("eHospital / Practo (private)", "ambulatory", "Clinic", "Varies; ABDM alignment increasing", undefined),
      entry("Redox / Innovaccer IN", "integration", "Enterprise", "Multi-hospital normalization", "healthcare/redox"),
    ],
    playbook: `1. **Register on ABDM sandbox** as HIP and/or HIU
2. **Consent Manager** — every data flow needs artefact
3. **FHIR R4** mandated; validate against ABDM profiles
4. **ap-south-1** (Mumbai) hosting`,
  },
  sg: {
    iso: "sg",
    countryName: "Singapore",
    systems: [
      entry("NEHR (National EHR)", "national", "National record", "IHiS-accredited systems programme; FHIR specs", undefined),
      entry("SingPass / Corppass", "national", "Identity", "Citizen and corporate identity", undefined),
      entry("IHiS", "national", "Health IT agency", "Accreditation + integration specs for EMRs", undefined),
      entry("SingHealth / NHG / NUHS clusters", "hospital-ehr", "Public acute", "Cluster EMRs — integration via IHiS", undefined),
      entry("Raffles / Parkway Pantai", "hospital-ehr", "Private", "Vendor-specific FHIR/HL7", undefined),
      entry("GPITM / clinic systems", "ambulatory", "Primary care", "Accredited clinic EMRs for NEHR", undefined),
    ],
    playbook: `1. **NEHR accreditation** for EMR vendors — confirm vendor status
2. **IHiS** publishes integration specs — do not guess endpoints
3. **ap-southeast-1** hosting`,
  },
  jp: {
    iso: "jp",
    countryName: "Japan",
    systems: [
      entry("Medical Information Network (医療情報ネット)", "national", "National connectivity", "MHLW-led interoperability", undefined),
      entry("FHIR JP Core", "national", "FHIR standard", "HL7 Japan profiles", undefined),
      entry("Fujitsu / IBM Japan / Cerner JP", "hospital-ehr", "Hospital EMR", "Site-specific VPN + HL7 v2/FHIR", "healthcare/cerner-oracle-health"),
      entry("SS-MIX2", "national", "Storage standard", "Legacy standardized storage — transition to FHIR", undefined),
      entry("M3 / Medley", "ambulatory", "Clinic", "Clinic management systems", undefined),
    ],
    playbook: `1. **FHIR JP Core** for greenfield
2. **Hospital-by-hospital** negotiation common
3. **ap-northeast-1** (Tokyo); APPI consent for data use`,
  },
  kr: {
    iso: "kr",
    countryName: "South Korea",
    systems: [
      entry("NHIS (National Health Insurance)", "payer", "Single payer", "Claims and provider registration", undefined),
      entry("HIRA", "payer", "Review + assessment", "Quality and claims review APIs (partner access)", undefined),
      entry("EZCaretech / U2Bio / Samsung SDS EMR", "hospital-ehr", "Hospital EMR", "High penetration; site-specific integration", undefined),
      entry("FHIR KR Core", "national", "FHIR profiles", "KHIS-led profiles", undefined),
    ],
    playbook: `1. **PIPA explicit consent** for health data
2. **Hospital EMR** direct integration most common path
3. **ap-northeast-2** (Seoul)`,
  },
  cn: {
    iso: "cn",
    countryName: "China",
    systems: [
      entry("NHSA (National Healthcare Security Admin)", "national", "Insurance + DRG", "Payment reform; hospital connectivity", undefined),
      entry("Neusoft / Winning / iFlytek Health", "hospital-ehr", "Hospital EMR", "Dominant domestic vendors; per-hospital", undefined),
      entry("Internet Hospital platforms", "national", "Regulated telehealth", "Platform licence required", undefined),
      entry("WeChat / Alipay health mini-programs", "ambulatory", "Patient engagement", "Not clinical systems of record", undefined),
    ],
    playbook: `1. **In-country data only** — PIPL/DSL
2. **Local entity** often required
3. **National standards** differ from FHIR — engage local SI`,
  },
  hk: {
    iso: "hk",
    countryName: "Hong Kong",
    systems: [
      entry("eHRSS", "national", "Record sharing", "Opt-in sharing; HCP registration", undefined),
      entry("Hospital Authority HA EMR", "hospital-ehr", "Public hospitals", "Majority of acute care; HA partner APIs", undefined),
      entry("Private hospitals (Matilda, HKSH)", "hospital-ehr", "Private", "Vendor-specific", undefined),
    ],
    playbook: `1. **eHRSS participation agreement** for sharing
2. **HA** partner programme for public hospital data`,
  },
  id: {
    iso: "id",
    countryName: "Indonesia",
    systems: [
      entry("SATUSEHAT", "national", "National FHIR platform", "Mandatory FHIR R4; OAuth; HIP registration", undefined),
      entry("BPJS Kesehatan", "payer", "National insurer", "~80% population; claims via accredited path", undefined),
      entry("Siloam / Mayapada EMRs", "hospital-ehr", "Private chains", "SATUSEHAT integration required", undefined),
    ],
    playbook: `1. **SATUSEHAT certification** for clinical exchange
2. **ap-southeast-3** (Jakarta)`,
  },
  th: {
    iso: "th",
    countryName: "Thailand",
    systems: [
      entry("NHSO", "payer", "Universal coverage", "UC scheme claims", undefined),
      entry("MOPH / HDC", "national", "Health data centre", "National health data programmes", undefined),
      entry("BDMS / Bumrungrad EMRs", "hospital-ehr", "Private hospital groups", "Hospital-specific APIs", undefined),
    ],
    playbook: `1. **PDPA 2022** for health data
2. Confirm MOH/HDC current FHIR specs`,
  },
  ph: {
    iso: "ph",
    countryName: "Philippines",
    systems: [
      entry("PhilHealth", "payer", "National insurance", "E-Claims accreditation; case rate billing", undefined),
      entry("DOH eHealth", "national", "Public health IT", "Facility reporting and programmes", undefined),
      entry("MWell / Maxicare networks", "ambulatory", "HMO + telehealth", "Private payer integration", undefined),
    ],
    playbook: `1. **PhilHealth accreditation** for claims APIs
2. **DPA 2012** sensitive personal information rules`,
  },
  my: {
    iso: "my",
    countryName: "Malaysia",
    systems: [
      entry("MOH MyHDW", "national", "Health data warehouse", "National analytics and HIE direction", undefined),
      entry("IHH / KPJ hospital EMRs", "hospital-ehr", "Private groups", "Vendor-specific", undefined),
      entry("ProtectHealth (PEKA)", "payer", "Scheme administrator", "Public scheme integrations", undefined),
    ],
    playbook: `1. **PDPA 2010** + MOH facility licensing
2. Confirm MOH HIE programme status`,
  },
  vn: {
    iso: "vn",
    countryName: "Vietnam",
    systems: [
      entry("MOH National PHR", "national", "Electronic health record", "National PHR programme", undefined),
      entry("VSS Social Health Insurance", "payer", "Insurance", "~90% coverage", undefined),
      entry("Vinmec / FV Hospital EMRs", "hospital-ehr", "Private", "Hospital-specific", undefined),
      entry("VNPT / Viettel Health IT", "integration", "Health IT vendors", "Common hospital IT providers", undefined),
    ],
    playbook: `1. **PDPD 2023** compliance
2. MOH specs per programme`,
  },
  tw: {
    iso: "tw",
    countryName: "Taiwan",
    systems: [
      entry("NHI MediCloud", "national", "Cloud + data", "NHI digital health initiatives", undefined),
      entry("NHI insurer systems", "payer", "Single payer", "99% coverage; NHI billing codes", undefined),
      entry("Hospital EMRs (HTC, Chang Gung)", "hospital-ehr", "Hospital", "Per-facility VPN integration common", undefined),
    ],
    playbook: `1. **NHI codes** for billing integration
2. Smart Healthcare FHIR roadmap — verify current IG`,
  },
  sa: {
    iso: "sa",
    countryName: "Saudi Arabia",
    systems: [
      entry("NPHIES", "national", "Insurance exchange", "FHIR R4 mandated for claims/eligibility", undefined),
      entry("Seha Virtual Hospital", "national", "Telehealth", "National virtual hospital platform", undefined),
      entry("MOH platforms", "national", "Public health", "Programme-specific APIs", undefined),
      entry("Dr. Sulaiman Al Habib / Saudi German", "hospital-ehr", "Private", "Hospital EMR programmes", undefined),
    ],
    playbook: `1. **NPHIES FHIR** for payer-facing workflows
2. **PDPL** + NCA cybersecurity`,
  },
  ae: {
    iso: "ae",
    countryName: "United Arab Emirates",
    systems: [
      entry("Malaffi (Abu Dhabi)", "hie", "Emirate HIE", "FHIR specs; accredited EMR connection", undefined),
      entry("NABIDH (Dubai)", "hie", "Emirate HIE", "Facility connection programme", undefined),
      entry("DHA / DOH / SHCC", "national", "Regulators", "Emirate-specific health data policies", undefined),
      entry("Cerner / Epic UAE", "hospital-ehr", "Acute", "FHIR where deployed", "healthcare/epic"),
    ],
    playbook: `1. **Emirate-first** — Abu Dhabi vs Dubai specs differ
2. **Malaffi/NABIDH accreditation** for HIE`,
  },
  br: {
    iso: "br",
    countryName: "Brazil",
    systems: [
      entry("RNDS", "national", "National FHIR network", "FHIR R4 national exchange", undefined),
      entry("ANS / TISS", "payer", "Private insurance", "TISS transactions for private plans", undefined),
      entry("Tasy (Philips) / MV", "hospital-ehr", "Hospital", "Common hospital systems", undefined),
    ],
    playbook: `1. **RNDS** authorization for national exchange
2. **LGPD** sensitive data`,
  },
  mx: {
    iso: "mx",
    countryName: "Mexico",
    systems: [
      entry("SINBA / NOM-024", "national", "EHR certification", "NOM-024 compliant systems", undefined),
      entry("IMSS / ISSSTE", "payer", "Public insurers", "Public sector hospital systems", undefined),
      entry("Hospital Ángeles / FEMSA", "hospital-ehr", "Private", "Hospital-specific", undefined),
    ],
    playbook: `1. **NOM-024** for certified EHR
2. **LFPDPPP** privacy`,
  },
  eu: {
    iso: "eu",
    countryName: "European Union",
    systems: [
      entry("eHDSI / MyHealth@EU", "national", "Cross-border", "Patient summary exchange EU-wide", undefined),
      entry("EHDS", "national", "Health data space", "Emerging primary/secondary use framework", undefined),
      entry("Epic / Cerner EU instances", "hospital-ehr", "Acute", "US Core + national IG overlays", "healthcare/epic"),
      entry("Dedalus / CompuGroup / CGM", "hospital-ehr", "Acute + ambulatory", "Dominant EU vendors", undefined),
      entry("openEHR", "integration", "Data layer", "Used in several national programmes", undefined),
    ],
    playbook: `1. Install **country pack** (DE/FR/NL…) — EU pack is cross-border only
2. **GDPR Art. 9** + **MDR** for SaMD
3. **National IG** always overrides generic FHIR`,
  },
};

/** Fallback systems profile for countries without hand-authored catalog entry. */
function fallbackProfile(iso: string, countryName: string): CountrySystemsProfile {
  return {
    iso,
    countryName,
    systems: [
      entry(`${countryName} MOH / national health programme`, "national", "Public health", "Confirm current FHIR/API specs with ministry"),
      entry("Regional hospital EMRs", "hospital-ehr", "Acute", "HL7 v2 common; FHIR emerging — per-facility contracts"),
      entry("Redox / Mirth", "integration", "Integration", "When direct FHIR unavailable", "healthcare/redox"),
    ],
    playbook: `1. Load \`healthcare/overview-${iso}\` for regulation
2. **National programme first** — highest leverage
3. **Interface engine** for legacy HL7 v2
4. Pair with \`healthcare/fhir-r4\` and \`healthcare/redox\``,
  };
}

export function getCountrySystemsProfile(iso: string, countryName?: string): CountrySystemsProfile {
  return HEALTHCARE_COUNTRY_SYSTEMS[iso] ?? fallbackProfile(iso, countryName ?? iso.toUpperCase());
}

const TYPE_LABELS: Record<HealthcareSystemEntry["type"], string> = {
  national: "National platform",
  "hospital-ehr": "Hospital / acute EHR",
  ambulatory: "Ambulatory / GP",
  payer: "Payer / insurer",
  hie: "HIE / data network",
  integration: "Integration platform",
  pharmacy: "Pharmacy / eRx",
  imaging: "Imaging / PACS",
};

export function buildSystemsIntegrationsMarkdown(profile: CountrySystemsProfile): string {
  const rows = profile.systems
    .map(
      (s) =>
        `| ${s.name} | ${TYPE_LABELS[s.type]} | ${s.segment} | ${s.integration} | ${s.dnaPack ? `\`${s.dnaPack}\`` : "—"} |`,
    )
    .join("\n");

  return `# ${profile.countryName} — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems ${profile.countryName} healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
${rows}

## Integration playbook

${profile.playbook}

## DNA vendor packs (auto-installed with country bundle when applicable)

Run \`dna marketplace install healthcare/overview-${profile.iso}\` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (\`healthcare/mirth\`) when hospital only speaks HL7 v2
- **Redox** (\`healthcare/redox\`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions`;
}

export function getCountrySystemsTopic(
  iso: string,
  countryName?: string,
): { slug: string; title: string; body: string } {
  const profile = getCountrySystemsProfile(iso, countryName);
  return {
    slug: "systems-integrations",
    title: "Healthcare Systems & Integration",
    body: buildSystemsIntegrationsMarkdown(profile),
  };
}

/** DNA marketplace packs referenced by a country's systems catalog — for bundle enrichment. */
export function getCountrySystemsDnaPackIds(iso: string): string[] {
  const profile = HEALTHCARE_COUNTRY_SYSTEMS[iso];
  if (!profile) return ["healthcare/redox"];
  const packs = profile.systems.map((s) => s.dnaPack).filter((p): p is string => Boolean(p));
  return [...new Set(packs)];
}

/** Merge explicit bundle packs with systems-catalog DNA packs. */
export function enrichCountryBundlePacks(iso: string, packs: readonly string[]): string[] {
  return [...new Set([...packs, ...getCountrySystemsDnaPackIds(iso)])];
}
