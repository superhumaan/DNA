import { def, type CatalogPlatformDef } from "./bundled-catalog-pack-factory.js";

const PHI_BASE = `## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions`;

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
    `${name} healthcare software — regulation, health system, FHIR, and integration strategy`,
    `# Healthcare Technology — ${name}

Country-specific stem pack. Pair with \`healthcare/overview\` (router) and \`healthcare/fhir-r4\`.

${regulatory}

## Health system
${healthSystem}

## Standards & profiles
${standards}

${PHI_BASE}`,
    `${integration}

## Compliance actions
${compliance}`,
    ["healthcare", "overview", "country", "stem", iso, ...extraTags],
    "disciplines",
  );
}

/** Per-country healthcare overview stem packs — install one matching your deployment market. */
export const HEALTHCARE_OVERVIEW_COUNTRY_DEFS: CatalogPlatformDef[] = [
  countryOverview(
    "us",
    "United States",
    `## Regulation
- **HIPAA** — Privacy, Security, Breach Notification Rules; BAA with every vendor touching ePHI
- **HITECH** — breach notification, enforcement
- **42 CFR Part 2** — substance use disorder records (stricter consent)
- **FDA SaMD** — if software diagnoses, treats, or drives clinical decisions
- **ONC/CMS** — interoperability and information blocking (patient access API)`,
    `- Mixed public/private: Medicare, Medicaid, commercial payers
- Dominant hospital EHRs: Epic, Cerner/Oracle Health, MEDITECH
- Ambulatory: athenahealth, eClinicalWorks, Veradigm
- Clearinghouses and payers for claims (X12 837/835)`,
    `- **FHIR R4** with **US Core** Implementation Guide
- **SMART on FHIR** + **CDS Hooks** for EHR-embedded apps
- **Da Vinci IGs** for payer workflows (PDex, PAS, CDex)
- **HL7 v2** still dominant in hospitals (ADT, ORM, ORU)
- Terminology: SNOMED CT US Edition, LOINC, RxNorm, ICD-10-CM`,
    `1. **Direct EHR FHIR** — Epic App Orchard, Cerner CODE (per health system base URL)
2. **Health data networks** — Redox, Health Gorilla, Particle, Zus, Metriport
3. **TEFCA/QHIN** — nationwide HIE with purpose-of-use documentation
4. **Payer APIs** — Flexpa, Availity, X12 EDI via clearinghouse`,
    `- Run \`dna plan compliance --frameworks hipaa\`
- Document TPO (treatment, payment, operations) vs marketing use
- State telehealth licensure for clinicians
- Pair with: \`healthcare/epic\`, \`healthcare/cms-interop\`, \`healthcare/tefca-qhin\`, \`healthcare/phi-engineering\``,
    ["us", "hipaa"],
  ),
  countryOverview(
    "uk",
    "United Kingdom",
    `## Regulation
- **UK GDPR** + **Data Protection Act 2018** — special category health data
- **NHS DSPT** (Data Security and Protection Toolkit) — annual assurance for NHS-facing suppliers
- **DTAC** / **CQC** — digital health assessments for NHS procurement
- **Common Law Duty of Confidentiality** — additional to GDPR
- **UKCA / MHRA** — medical device regulation post-Brexit (EU MDR alignment)`,
    `- **NHS** — publicly funded; integrated care systems (ICS)
- **GP Connect** — primary care record access
- **NHS Spine** — national services (PDS, SDS, GP2GP)
- **NHS Login** — citizen identity for patient-facing apps
- Private providers (Bupa, Nuffield) alongside NHS`,
    `- **UK Core FHIR** profiles mandatory for NHS-facing APIs
- **CIS2** authentication for clinician access
- **SNOMED CT UK Edition** — problems and procedures
- **dm+d** — medications; **LOINC** for labs`,
    `1. **NHS API platform** — GP Connect, e-RS, PDS FHIR
2. **Integration engines** — Mirth, InterSystems for legacy
3. **Private hospital** — Cerner, Epic UK instances, System C
4. Data **residency UK** — document subprocessors and transfers`,
    `- Run \`dna plan compliance --frameworks uk_gdpr\`
- Complete DSPT if processing NHS patient data
- Pair with: \`healthcare/nhs-fhir\`, \`healthcare/mdr-eu\`, \`healthcare/fhir-r4\``,
    ["uk", "nhs"],
  ),
  countryOverview(
    "ca",
    "Canada",
    `## Regulation
- **PIPEDA** — federal private-sector privacy
- **Provincial health laws** — PHIPA (ON), HIA (AB), FIPPA, etc. — often stricter than PIPEDA
- **Health Canada** — medical device classification (MDR-like)
- **Pan-Canadian standards** — Infoway interoperability framework`,
    `- **Provincial single-payer** — OHIP, MSP, RAMQ, etc.
- **Canada Health Infoway** — national digital health strategy
- **Provincial EHRs** — ConnectCare (AB), ClinicalConnect, regional HIEs
- Epic and Cerner in large academic centres`,
    `- **FHIR R4** with **Canadian Baseline** profiles (CIHI, Infoway)
- **HL7 v2** in hospitals
- **SNOMED CT CA Edition**; ICD-10-CA for billing`,
    `1. **Provincial integration** — confirm target province APIs (often per health authority)
2. **Infoway-certified** interfaces where required for public funding
3. **Telus Health, Epic Canada** — vendor-specific FHIR where exposed
4. Bilingual (EN/FR) for federal and Quebec-facing products`,
    `- Run \`dna plan compliance --frameworks pipeda\` + document province
- Data residency: prefer Canadian regions (AWS ca-central-1, Azure Canada)
- Pair with: \`healthcare/fhir-r4\`, \`healthcare/phi-engineering\``,
    ["ca", "pipeda"],
  ),
  countryOverview(
    "au",
    "Australia",
    `## Regulation
- **Privacy Act 1988** — APPs; health data is sensitive
- **My Health Records Act 2012** — national shared record
- **TGA** — Therapeutic Goods Administration for SaMD
- **State health records acts** — e.g. HRIP Act (NSW)`,
    `- **Medicare** — universal coverage via PBS
- **My Health Record (MHR)** — opt-out national record
- **State health systems** — NSW Health, Queensland Health, etc.
- Major EHRs: Cerner, Epic, Best Practice (GP), MedicalDirector`,
    `- **FHIR R4** with **AU Base** Implementation Guide
- **ADHA** specifications for MHR integration
- **SNOMED CT AU Edition**; **LOINC**; **ICD-10-AM**`,
    `1. **My Health Record** — NASH PKI, conformance testing for upload/view
2. **State clinical portals** — per-jurisdiction APIs
3. **GP software** — Best Practice, MedicalDirector via accredited integration
4. Host in **ap-southeast-2** (Sydney) where residency required`,
    `- Run \`dna plan compliance --frameworks privacy_act_au\`
- TGA classification if clinical decision support
- Pair with: \`healthcare/fhir-r4\`, \`healthcare/phi-engineering\``,
    ["au"],
  ),
  countryOverview(
    "eu",
    "European Union",
    `## Regulation
- **GDPR** — Art. 9 special category (health); DPIA often mandatory
- **EU MDR 2017/745** — medical devices including SaMD; CE marking
- **EHDS** (European Health Data Space) — emerging cross-border framework
- **NIS2** — critical healthcare infrastructure cybersecurity`,
    `- **National health systems** vary: Bismarck (DE/FR), Beveridge (ES/IT), mixed (NL)
- **Cross-border care** — EHIC, emerging EHDS
- **eHDSI** — patient summary exchange (MyHealth@EU)
- No single EHR — national programmes (Gematik DE, DMP FR, etc.)`,
    `- **FHIR R4** with national IG overlays (DE Basisprofil, FR CI-SIS, etc.)
- **HL7 CDA** legacy in some countries
- **SNOMED CT** (national editions); **LOINC**; **ICD-10**`,
    `1. **Country-specific pack** — prefer \`healthcare/overview-de\`, \`-fr\`, etc. over this generic EU pack when known
2. **National health APIs** — Gematik (DE), INS/DMP (FR), Nictiz (NL)
3. **iPaas** — Redox, MuleSoft for multi-country rollouts
4. **Data residency** — EU region; SCCs for transfers outside EEA`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- CE marking path via \`healthcare/mdr-eu\` if SaMD
- Pair with: \`healthcare/mdr-eu\`, \`healthcare/fhir-r4\``,
    ["eu", "gdpr", "mdr"],
  ),
  countryOverview(
    "de",
    "Germany",
    `## Regulation
- **GDPR** + **BDSG** — strict health data rules
- **SGB V** — statutory health insurance law
- **DiGA** — digital health apps on prescription (BfArM directory)
- **MDR** — CE marking via notified bodies`,
    `- **GKV** — ~90% statutory insurance via ~100 Krankenkassen
- **Gematik** — national agency for telematics infrastructure (TI)
- **ePA** — electronic patient record (rolling national)
- **KV-Connect, KIM** — secure messaging in ambulatory care`,
    `- **KBV / Gematik FHIR** profiles (MIO, ePA)
- **TI connector** — certified middleware for practice systems
- **ICD-10-GM**; **SNOMED CT DE**`,
    `1. **Gematik FHIR APIs** — ePA, eRezept, eAU (sick note)
2. **Practice systems (PVS)** — via certified TI gateway — not direct scraping
3. **Hospital IS** — ORBIS, i.s.h.med, Epic/Cerner DE instances
4. **DiGA** pathway if qualifying as prescribed app`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- DiGA/BfArM if reimbursable digital health app
- Pair with: \`healthcare/overview-eu\`, \`healthcare/mdr-eu\``,
    ["de", "gematik"],
  ),
  countryOverview(
    "fr",
    "France",
    `## Regulation
- **GDPR** + **Loi Informatique et Libertés**
- **HDS** (Hébergeur de Données de Santé) — mandatory certification for health hosting
- **CNIL** — health data guidance and DPIA templates
- **MDR** — ANSM national competent authority`,
    `- **Assurance Maladie** — national health insurance
- **DMP** — shared medical record (Mon Espace Santé)
- **INS** — national health identity (NIR)
- Hospital systems: DxCare, Epic France, regional platforms`,
    `- **CI-SIS** FHIR profiles (ANS)
- **HL7 CDA** legacy in hospitals
- **CCAM** procedures; **CIM-10** diagnoses`,
    `1. **Mon Espace Santé / DMP** — ANS interoperability specs
2. **HDS-certified** cloud — required for health data hosting
3. **MSSanté** — secure health messaging
4. **Pro Santé Connect** — clinician authentication`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- HDS certification for infrastructure provider
- Pair with: \`healthcare/overview-eu\`, \`healthcare/mdr-eu\``,
    ["fr", "hds"],
  ),
  countryOverview(
    "ie",
    "Ireland",
    `## Regulation
- **GDPR** + **Data Protection Act 2018**
- **HSE** governance for public health data
- **HIQA** — quality and safety standards
- **MDR** via HPRA`,
    `- **HSE** — Health Service Executive (public)
- **eHealth Ireland** — national digital health programme
- **GP systems** — widely used for primary care records
- Private hospitals: Bon Secours, Mater Private`,
    `- **FHIR R4** — Irish eHealth adoption growing
- **IHE** profiles in hospital integrations
- **ICD-10**; **SNOMED CT**`,
    `1. **eHealth Ireland** APIs where available
2. **Hospital PAS** — per-site integration (often HL7 v2)
3. EU data residency — AWS/Azure Ireland regions`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\`, \`healthcare/nhs-fhir\` (UK-adjacent patterns)`,
    ["ie"],
  ),
  countryOverview(
    "nl",
    "Netherlands",
    `## Regulation
- **GDPR** + **WGBO** (medical treatment agreement)
- **NEN 7510** — healthcare information security standard
- **AGREEMENT ON MEDICAL TREATMENT** — patient rights
- **MDR** via IGJ`,
    `- **Zorgverzekeringswet** — mandatory insurance
- **EPD** — electronic patient dossier (national push)
- **Nictiz** — national eHealth standards body
- **Chipsoft HiX**, **Epic NL** in hospitals`,
    `- **Nictiz FHIR** profiles (MedMij for citizen access)
- **HL7 v3/CDA** legacy
- **SNOMED CT NL**; **ICD-10**`,
    `1. **MedMij** — citizen-controlled health data exchange
2. **Zorg-AB** — healthcare provider directory
3. **NEN 7510** controls in security architecture`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- NEN 7510 alignment for enterprise healthcare sales
- Pair with: \`healthcare/overview-eu\``,
    ["nl", "nictiz"],
  ),
  countryOverview(
    "ch",
    "Switzerland",
    `## Regulation
- **nFADP** (rev. 2023) — new Federal Act on Data Protection
- **HFG** — Federal Health Insurance Act
- **Swissmedic** — medical device regulation (MDR-aligned)
- **E-ID** — electronic identity rollout`,
    `- **LAMal/KVG** — mandatory basic insurance (26 cantons)
- **eHealth Suisse** — national coordination
- **EPD** — electronic patient dossier (cantonal rollout)
- Hospital systems: KISIM, Cerner CH`,
    `- **CH Core FHIR** profiles (eHealth Suisse)
- **HL7 v2** in acute care
- **ICD-10-GM** (German influence); **SNOMED CT**`,
    `1. **EPD** — canton-specific endpoints
2. **eHealth Suisse** interoperability specs
3. Data residency Switzerland preferred`,
    `- Run \`dna plan compliance --frameworks swiss_nFADP\`
- Swissmedic if SaMD
- Pair with: \`healthcare/overview-eu\`, \`healthcare/overview-de\``,
    ["ch"],
  ),
  countryOverview(
    "jp",
    "Japan",
    `## Regulation
- **APPI** — Act on Protection of Personal Information; health is sensitive
- **Next Generation Medical Infrastructure Act** — anonymized medical data use
- **PMDA** — pharmaceuticals and medical devices (SaMD guidance)
- **MHLW** — Ministry of Health, Labour and Welfare oversight`,
    `- **Universal NHI** — statutory insurance societies (協会けんぽ, 組合, etc.)
- **Medical Information Network (医療情報ネット)** — national connectivity push
- **EMR adoption** — vendor landscape: IBM Japan, Fujitsu, Cerner JP
- **Online medical care** guidelines post-COVID`,
    `- **HL7 FHIR JP Core** Implementation Guide
- **SS-MIX2** — standardized storage format (legacy transition)
- **JLAC10** labs; **ICD-10** Japanese`,
    `1. **FHIR JP Core** for new integrations
2. **Hospital EMR** — vendor-specific; often per-facility VPN
3. Host in **ap-northeast-1** (Tokyo) for residency`,
    `- Run \`dna plan compliance --frameworks appi\`
- PMDA consultation if diagnostic/treatment claims
- Pair with: \`healthcare/fhir-r4\``,
    ["jp"],
  ),
  countryOverview(
    "kr",
    "South Korea",
    `## Regulation
- **PIPA** — Personal Information Protection Act; strict consent for sensitive data
- **Medical Device Act** — MFDS (식약처) for SaMD
- **National Bioethics Act** — research use of health data
- **MyData** — health data portability initiatives`,
    `- **NHIS** — National Health Insurance (single payer)
- **HIRA** — claims and review agency
- **EMR** — high adoption; major vendors: EZCaretech, U2Bio, Samsung SDS
- **KONAS** — medical institution codes`,
    `- **FHIR KR Core** (KHIS profiles emerging)
- **HL7 v2** widespread
- **KCD** diagnoses; **EDI** claims formats`,
    `1. **Public health APIs** — NHIS/HIRA where partner access granted
2. **Hospital EMR** — site-specific integration common
3. **AWS ap-northeast-2** (Seoul) for residency`,
    `- Run \`dna plan compliance --frameworks pipa\`
- MFDS if medical device software
- Pair with: \`healthcare/fhir-r4\``,
    ["kr"],
  ),
  countryOverview(
    "sg",
    "Singapore",
    `## Regulation
- **PDPA** — Personal Data Protection Act; healthcare sector guidance
- **HCSA** — Healthcare Services Act licensing
- **MOH** — Ministry of Health policy
- **HSA** — Health Sciences Authority (devices)`,
    `- **MOH** — public hospitals (SingHealth, NHG, NUHS clusters)
- **NEHR** — National Electronic Health Record
- **Healthier SG** — preventive care programme
- Private: Raffles, Parkway Pantai`,
    `- **FHIR R4** — NEHR integration specs
- **HL7 v2** in hospitals
- **SNOMED CT**; **ICD-10-AM**`,
    `1. **NEHR** — accredited system integration via IHiS
2. **SingPass** — national digital identity for citizens
3. **AWS ap-southeast-1** (Singapore) hosting`,
    `- Run \`dna plan compliance --frameworks pdpa\`
- HCSA licence if providing clinical services
- Pair with: \`healthcare/fhir-r4\``,
    ["sg", "nehr"],
  ),
  countryOverview(
    "nz",
    "New Zealand",
    `## Regulation
- **Privacy Act 2020** — health information is sensitive
- **HIPC** — Health Information Privacy Code 2020
- **Medsafe** — medical device regulation
- **Te Whatu Ora** — Health New Zealand (national health entity)`,
    `- **Te Whatu Ora** — consolidated national health service
- **NHI** — National Health Index number
- **GP systems** — Medtech, Indici dominate primary care
- Regional DHB legacy systems consolidating`,
    `- **FHIR R4** — NZ adoption growing via Te Whatu Ora
- **HL7 v2** in hospitals
- **ICD-10-AM**; **SNOMED CT NZ**`,
    `1. **Te Whatu Ora** interoperability programme
2. **GP integration** — via accredited practice management vendors
3. **AWS ap-southeast-2** (Sydney) or local NZ cloud`,
    `- Run \`dna plan compliance --frameworks privacy_act_nz\`
- HIPC compliance for all health apps
- Pair with: \`healthcare/fhir-r4\`, \`healthcare/overview-au\``,
    ["nz"],
  ),
  countryOverview(
    "in",
    "India",
    `## Regulation
- **DPDP Act 2023** — Digital Personal Data Protection
- **DISHA** (proposed) — digital health authority framework
- **ABDM** — Ayushman Bharat Digital Mission (active programme)
- **CDSCO** — medical device rules (including software)`,
    `- **ABDM** — national health stack (ABHA ID, HIE-CM, HFR, HPR)
- **Mixed public/private** — Ayushman Bharat insurance, private chains (Apollo, Fortis)
- **EMR fragmentation** — hospital-specific; ABDM aims to unify
- **Telemedicine guidelines** — MoHFW 2020`,
    `- **FHIR R4** — ABDM recommended standard
- **ABHA** — 14-digit health ID
- **SNOMED CT** (India extension); **LOINC**`,
    `1. **ABDM APIs** — ABHA creation, HIP/HIU registration, consent manager
2. **Health Information Provider (HIP)** / **User (HIU)** roles
3. **India region** cloud (AWS ap-south-1, Azure Central India)`,
    `- Run \`dna plan compliance --frameworks dpdp\`
- Register on ABDM sandbox before production HIP/HIU
- Pair with: \`healthcare/fhir-r4\``,
    ["in", "abdm"],
  ),
  countryOverview(
    "br",
    "Brazil",
    `## Regulation
- **LGPD** — Lei Geral de Proteção de Dados; health is sensitive
- **ANVISA** — medical device regulation (RDC 657/2022 software)
- **CFM/COFEN** — professional council rules for telemedicine
- **SUS** — public system governance`,
    `- **SUS** — Unified Health System (public, universal)
- **ANS** — private health insurance regulator
- **RNDS** — Rede Nacional de Dados em Saúde (national FHIR network)
- Major EHRs: Tasy (Philips), MV, Epic Brazil`,
    `- **FHIR R4** — RNDS national profiles
- **HL7 v2** in hospitals
- **CID-10** diagnoses; **TUSS** procedures`,
    `1. **RNDS** — integrate as authorized system for citizen data exchange
2. **ANS TISS** — private insurance transactions
3. **AWS sa-east-1** (São Paulo) for residency`,
    `- Run \`dna plan compliance --frameworks lgpd\`
- ANVISA if SaMD claims
- Pair with: \`healthcare/fhir-r4\``,
    ["br", "rnds"],
  ),
  countryOverview(
    "mx",
    "Mexico",
    `## Regulation
- **LFPDPPP** — federal personal data law; ARCO rights
- **NOM-024-SSA3** — electronic health record standard
- **COFEPRIS** — medical device regulation
- **IMSS/ISSSTE** — public insurer governance`,
    `- **IMSS** — social security health (largest public)
- **ISSSTE** — state workers' health
- **INSABI** legacy transition; mixed private (Hospital Ángeles, etc.)
- **SINBA** — national health information system push`,
    `- **HL7 v3/CDA** — NOM-024 historically
- **FHIR R4** — emerging in private sector
- **CIE-10** diagnoses`,
    `1. **NOM-024** compliance for EHR certification
2. **Private hospital** — vendor-specific APIs
3. **AWS/Azure** US regions often used; document cross-border if so`,
    `- Run \`dna plan compliance --frameworks lfpdppp\`
- COFEPRIS if medical device
- Pair with: \`healthcare/fhir-r4\``,
    ["mx"],
  ),
  countryOverview(
    "za",
    "South Africa",
    `## Regulation
- **POPIA** — Protection of Personal Information Act
- **National Health Act** — health record confidentiality
- **SAHPRA** — medical device regulator
- **HPCSA** — telemedicine guidelines`,
    `- **Public/private mix** — NHI bill progressing
- **District health** — provincial delivery
- **Discovery Health**, **Netcare**, **Mediclinic** private
- **EMR** — fragmented; Health Information System (HIS) upgrades`,
    `- **FHIR R4** — adoption early stage
- **HL7 v2** common
- **ICD-10**; **SNOMED CT** (growing)`,
    `1. **Provincial DOH** systems where applicable
2. **Medical aid schemes** — HL7/FHIR payer integration emerging
3. **AWS af-south-1** (Cape Town) for residency`,
    `- Run \`dna plan compliance --frameworks popia\`
- SAHPRA if SaMD
- Pair with: \`healthcare/fhir-r4\``,
    ["za"],
  ),
  countryOverview(
    "sa",
    "Saudi Arabia",
    `## Regulation
- **PDPL** — Personal Data Protection Law (2023)
- **NCA** — cybersecurity controls for critical sectors
- **SFDA** — medical device regulation
- **MOH** — Ministry of Health licensing`,
    `- **MOH** — public healthcare delivery
- **Seha Virtual Hospital** — national telehealth
- **NPHIES** — National Platform for Health Insurance Exchange Services
- **Private sector** — growing (Saudi German, Dr. Sulaiman Al Habib)`,
    `- **FHIR R4** — NPHIES mandated for insurance
- **HL7 v2** in hospitals
- **ICD-10-AM**; **SNOMED CT**`,
    `1. **NPHIES** — FHIR-based claims and eligibility
2. **MOH platforms** — integration per programme requirements
3. **AWS me-south-1** (Bahrain) or Azure UAE — document data location`,
    `- Run \`dna plan compliance --frameworks pdpl\`
- SFDA if medical device software
- Pair with: \`healthcare/fhir-r4\``,
    ["sa", "nphies"],
  ),
  countryOverview(
    "ae",
    "United Arab Emirates",
    `## Regulation
- **UAE PDPL** — federal data protection (2021)
- **DHA/DOH/SHCC** — Dubai, Abu Dhabi, Sharjah health authorities
- **MOHAP** — federal Ministry of Health
- **UAE.SFDA** — medical device regulation`,
    `- **Emirate-level** health systems — DHA (Dubai), DOH (Abu Dhabi)
- **Malaffi** — Abu Dhabi HIE
- **NABIDH** — Dubai health information exchange
- **Mandatory insurance** — in Dubai and Abu Dhabi`,
    `- **FHIR R4** — Malaffi and NABIDH specs
- **HL7 v2** legacy
- **ICD-10**; **SNOMED CT**`,
    `1. **Malaffi** (Abu Dhabi) — accredited EMR integration
2. **NABIDH** (Dubai) — facility connection programme
3. **UAE cloud regions** — AWS me-central-1, Azure UAE`,
    `- Run \`dna plan compliance --frameworks uae_pdpl\`
- Emirate-specific health data policies (DHA Circulars)
- Pair with: \`healthcare/fhir-r4\``,
    ["ae", "malaffi"],
  ),
  countryOverview(
    "il",
    "Israel",
    `## Regulation
- **Privacy Protection Law** — health data is sensitive
- **Digital Health Law** — national health database framework
- **MOH** — Ministry of Health regulation
- **AMAR** — medical device registration`,
    `- **Kupot Holim** — four sick funds (Clalit largest)
- **National health insurance** — universal
- **Chameleon, Meditech** — common hospital EMRs
- **Tehila** — government digital health initiatives`,
    `- **HL7 v2** dominant
- **FHIR R4** — growing adoption
- **ICD-10**; local drug coding`,
    `1. **Sick fund APIs** — partner agreements required
2. **Hospital EMR** — per-facility integration
3. **AWS/Azure** — EU or local hosting; document transfers`,
    `- Run \`dna plan compliance --frameworks israel_privacy\`
- AMAR if medical device
- Pair with: \`healthcare/fhir-r4\``,
    ["il"],
  ),
  countryOverview(
    "it",
    "Italy",
    `## Regulation
- **GDPR** + **Codice Privacy**
- **FSE** — Fascicolo Sanitario Elettronico (electronic health record)
- **AGENAS** — national agency for health services
- **MDR** via Ministero della Salute`,
    `- **SSN** — Servizio Sanitario Nazionale (regional delivery)
- **20 regional health systems** — integration varies by region
- **TS** — Tessera Sanitaria (national health card)
- Hospital systems: Dedalus, Engineering, Epic Italy`,
    `- **FHIR** — FSE 2.0 interoperability specs emerging
- **HL7 CDA** legacy
- **ICD-9-CM** procedures (transitioning); **ICD-10**`,
    `1. **Regional FSE** — Lombardia, Toscana, etc. have distinct APIs
2. **PagoPA** — not clinical but common in public sector apps
3. EU data residency`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Regional compliance checks for FSE integration
- Pair with: \`healthcare/overview-eu\``,
    ["it"],
  ),
  countryOverview(
    "es",
    "Spain",
    `## Regulation
- **GDPR** + **LOPDGDD**
- **Ley 41/2002** — patient autonomy and clinical history
- **AES** — Agencia Española de Medicamentos (devices)
- **Ministry of Health** — national strategy`,
    `- **NHS** — National Health System (regional autonomous communities)
- **Historia Clínica Digital** — national EHR push
- **Sistema Nacional de Salud** — 17 regional systems
- Hospital vendors: Cerner ES, SAP for hospitals`,
    `- **FHIR R4** — HCIS interoperability roadmap
- **HL7 CDA** legacy
- **CIE-10** diagnoses`,
    `1. **Regional health service** — Catalunya, Madrid, Andalucía APIs differ
2. **National interoperability platform** — confirm current spec with Ministry
3. EU hosting`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["es"],
  ),
  countryOverview(
    "se",
    "Sweden",
    `## Regulation
- **GDPR** + **Patient Data Act (PDL)**
- **IVO** — Health and Social Care Inspectorate
- **IMY** — data protection authority
- **MDR** via Läkemedelsverket`,
    `- **Regions** — 21 regional healthcare providers
- **1177** — national healthcare guide and e-services
- **NPÖ** — National Patient Overview
- **Cambio, Cosmic** — common EMRs`,
    `- **FHIR** — HL7 Sweden profiles
- **HL7 v2** in hospitals
- **ICD-10-SE**; **KVÅ** procedures`,
    `1. **NPÖ/Inera** — national integration platform
2. **Regional COS** — clinical operating systems vary
3. **Nordic data residency** — AWS Stockholm (eu-north-1)`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["se"],
  ),
  countryOverview(
    "no",
    "Norway",
    `## Regulation
- **GDPR** + **Personal Data Act**
- **Helsepersonelloven** — health personnel law (confidentiality)
- **Helsedirektoratet** — Directorate of Health
- **MDR** via Statens legemiddelverk`,
    `- **Helse-Norge** — national health portal
- **4 regional health authorities**
- **Kjernejournal** — core patient record
- **DIPS** — dominant hospital EMR`,
    `- **FHIR** — Norwegian eHealth standards
- **HL7 v2** legacy
- **ICD-10**; **ICPC-2** primary care`,
    `1. **Kjernejournal** — national record access APIs
2. **Helsenorge** — citizen services integration
3. **AWS eu-north-1** or Azure Norway`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["no"],
  ),
  countryOverview(
    "dk",
    "Denmark",
    `## Regulation
- **GDPR** + **Data Protection Act**
- **Sundhedsloven** — health act
- **Datatilsynet** — DPA health guidance
- **MDR** via Lægemiddelstyrelsen`,
    `- **Regions** — 5 regional health authorities
- **Sundhed.dk** — national health portal
- **EPJ** — electronic patient journal (national)
- **Systematic Columna** — common EMR`,
    `- **FHIR** — MedCom standards (Danish profiles)
- **HL7 v2** legacy
- **ICD-10**; **SKS** procedure codes`,
    `1. **MedCom** — national interoperability standards body
2. **Sundhed.dk** — citizen health data access
3. **AWS eu-north-1** / Azure Denmark`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["dk"],
  ),
  countryOverview(
    "fi",
    "Finland",
    `## Regulation
- **GDPR** + **Data Protection Act**
- **Act on Electronic Prescriptions** — national e-prescription
- **Valvira** — social/health care regulator
- **MDR** via Fimea`,
    `- **Kela** — social insurance (reimbursements)
- **Wellbeing services counties** — 21 regions (2023 reform)
- **Kanta** — national digital health services (PHR, prescriptions)
- **Apotti, Epic** — hospital systems`,
    `- **FHIR** — THL (Institute for Health and Welfare) profiles
- **HL7 v2** in hospitals
- **ICD-10**; **Finnish national codes**`,
    `1. **Kanta services** — prescription, PHR, archive APIs
2. **Regional EMR** — Apotti in Helsinki Uusimaa
3. **AWS eu-north-1** (Helsinki)`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["fi"],
  ),
  countryOverview(
    "at",
    "Austria",
    `## Regulation
- **GDPR** + **DSG** (Datenschutzgesetz)
- **GDG-KH** — hospital governance law
- **BASG** — medical device authority
- **ELGA** — electronic health record law`,
    `- **ELGA** — Elektronische Gesundheitsakte (national EHR)
- **ÖGK** — Austrian Health Insurance Fund
- **Regional hospitals** — mixed public/private
- **CGM, Dedalus** — practice and hospital systems`,
    `- **ELGA FHIR** profiles
- **HL7 v2** in acute care
- **ICD-10**; **ICD-10-GM** influence`,
    `1. **ELGA** — national health record integration
2. **e-card** — insurance card system linkage
3. EU hosting (AWS/Azure Frankfurt/Vienna)`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\`, \`healthcare/overview-de\``,
    ["at", "elga"],
  ),
  countryOverview(
    "be",
    "Belgium",
    `## Regulation
- **GDPR** + **Data Protection Act**
- **eHealth Platform** — federal health data agency
- **FAMHP** — medical device authority
- **Regional competence** — Flanders, Wallonia, Brussels`,
    `- **eHealth** — national hub (summer of patients, eHealthBox)
- **Mutualités** — sickness funds
- **AZ Maria Middelares, Epic BE** — hospital systems
- **RSW / Riziv** — reimbursement agency`,
    `- **eHealth FHIR** profiles
- **HL7 v2** legacy
- **ICD-10**; **ICPC-2**`,
    `1. **eHealth Platform** — authenticated clinical data exchange
2. **eHealthBox / Hub** — messaging and document exchange
3. EU data residency`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["be"],
  ),
  countryOverview(
    "pl",
    "Poland",
    `## Regulation
- **GDPR** + **UODO** guidance on health data
- **Patient Rights Act** — access to medical records
- **URPL** — medical device office
- **CEZ** — Centre for eHealth`,
    `- **NFZ** — National Health Fund
- **e-Zdrowie** — national eHealth programme
- **IKP** — Internetowe Konto Pacjenta (patient account)
- **Asseco, Comarch** — hospital information systems`,
    `- **FHIR** — P1 platform interoperability specs
- **HL7 CDA** legacy
- **ICD-10**; **ICF**`,
    `1. **P1 / e-Zdrowie** — national eHealth platform APIs
2. **IKP** — patient-facing integration
3. EU hosting (AWS/Azure Warsaw)`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["pl"],
  ),
  countryOverview(
    "pt",
    "Portugal",
    `## Regulation
- **GDPR** + **Lei de Proteção de Dados**
- **SNS** — Serviço Nacional de Saúde governance
- **INFARMED** — medical devices
- **SPMS** — health IT agency`,
    `- **SNS** — national health service (5 regional ARS)
- **SNS 24** — telehealth line
- **RNPI** — national patient index
- **Glintt, Philips Tasy** — hospital EMRs`,
    `- **FHIR** — SPMS interoperability roadmap
- **HL7 v2** in hospitals
- **ICD-10-CM** adapted`,
    `1. **SPMS** — national health IT integration
2. **RNPI** — patient identification
3. EU hosting`,
    `- Run \`dna plan compliance --frameworks gdpr\`
- Pair with: \`healthcare/overview-eu\``,
    ["pt"],
  ),
  countryOverview(
    "tw",
    "Taiwan",
    `## Regulation
- **PDPA** — Personal Data Protection Act
- **Medical Care Act** — health record management
- **TFDA** — medical device regulation
- **NHI** — National Health Insurance Administration`,
    `- **NHI** — single-payer (99% coverage)
- **Smart Healthcare** — national digital health plan
- **Hospital EMRs** — vendor landscape: HTC, Chang Gung, etc.
- **Telemedicine** — regulated during and post-pandemic`,
    `- **HL7 v2** dominant
- **FHIR R4** — emerging in Smart Healthcare programme
- **ICD-10**; **NHI drug codes**`,
    `1. **NHI MediCloud** — cloud and data initiatives
2. **Hospital integration** — per-facility; VPN common
3. **AWS ap-east-1** (Hong Kong) or local — document cross-strait data rules`,
    `- Run \`dna plan compliance --frameworks tw_pdpa\`
- TFDA if SaMD
- Pair with: \`healthcare/fhir-r4\``,
    ["tw"],
  ),
  countryOverview(
    "hk",
    "Hong Kong",
    `## Regulation
- **PDPO** — Personal Data (Privacy) Ordinance
- **Electronic Health Record Sharing System Ordinance**
- **MDACS** — medical device administrative control system
- **DH** — Department of Health`,
    `- **eHRSS** — electronic Health Record Sharing System
- **Hospital Authority** — public hospitals (majority)
- **Private hospitals** — Matilda, Hong Kong Sanatorium
- **HA EMR** — enterprise-wide clinical system`,
    `- **HL7 v2** in HA
- **FHIR** — eHRSS interoperability specs
- **ICD-10**; **Read codes** legacy in primary care`,
    `1. **eHRSS** — opt-in sharing; HCP registration required
2. **HA API** — partner programmes for public hospital data
3. **AWS ap-east-1** (Hong Kong)`,
    `- Run \`dna plan compliance --frameworks pdpo\`
- eHRSS participation agreement for data sharing
- Pair with: \`healthcare/fhir-r4\``,
    ["hk", "ehrss"],
  ),
  countryOverview(
    "my",
    "Malaysia",
    `## Regulation
- **PDPA 2010** — Personal Data Protection Act
- **Private Healthcare Facilities Act** — licensing
- **MDA** — Medical Device Authority
- **MOH** — Ministry of Health`,
    `- **MOH** — public hospitals and clinics
- **MyHDW** — Malaysian Health Data Warehouse (emerging)
- **Private** — IHH (Pantai), KPJ Healthcare
- **1Care** — primary care reform (historical)`,
    `- **HL7 v2** common
- **FHIR R4** — MOH digital health roadmap
- **ICD-10**; **Malaysian drug codes**`,
    `1. **MOH HIE** — confirm current national integration programme
2. **Hospital EMR** — vendor-specific
3. **AWS ap-southeast-1** / Azure Singapore`,
    `- Run \`dna plan compliance --frameworks pdpa_my\`
- MDA if medical device
- Pair with: \`healthcare/fhir-r4\`, \`healthcare/overview-sg\``,
    ["my"],
  ),
  countryOverview(
    "th",
    "Thailand",
    `## Regulation
- **PDPA** — Personal Data Protection Act (2022)
- **Medical Facility Act** — licensing
- **Thai FDA** — medical device regulation
- **NHSO** — National Health Security Office`,
    `- **UC** — Universal Coverage scheme
- **NHSO** — single payer for UC
- **Ministry of Public Health** — hospital network
- **Private** — BDMS, Bangkok Hospital Group`,
    `- **HL7 v2** in hospitals
- **FHIR** — emerging in HDC (Health Data Center) initiatives
- **ICD-10**; **TMT** drug codes`,
    `1. **HDC / MOPH** — national health data programmes
2. **Hospital EMR** — per-facility integration
3. **AWS ap-southeast-1** (Singapore) or Bangkok DC`,
    `- Run \`dna plan compliance --frameworks pdpa_th\`
- Thai FDA if SaMD
- Pair with: \`healthcare/fhir-r4\``,
    ["th"],
  ),
  countryOverview(
    "ph",
    "Philippines",
    `## Regulation
- **DPA 2012** — Data Privacy Act; health is sensitive
- **Universal Health Care Act** — national policy
- **FDA Philippines** — medical device rules
- **PhilHealth** — national health insurance`,
    `- **PhilHealth** — claims and provider accreditation
- **DOH** — Department of Health hospitals
- **Private** — Ayala Healthcare, Metro Pacific
- **eHealth** — national electronic health programme`,
    `- **HL7 v2** common
- **FHIR** — PhilHealth digital transformation
- **ICD-10**; **PhilHealth case rates**`,
    `1. **PhilHealth E-Claims** — accreditation and API access
2. **DOH** — facility reporting integrations
3. **AWS ap-southeast-1**`,
    `- Run \`dna plan compliance --frameworks dpa_ph\`
- Pair with: \`healthcare/fhir-r4\``,
    ["ph"],
  ),
  countryOverview(
    "id",
    "Indonesia",
    `## Regulation
- **PDP Law 2022** — Personal Data Protection
- **Ministry of Health Regulation** — SATUSEHAT mandate
- **BPOM** — medical device registration
- **BPJS Kesehatan** — national health insurer`,
    `- **SATUSEHAT** — national health platform (FHIR-native)
- **BPJS** — covers ~80% of population
- **Private** — Siloam, Mayapada hospitals
- **Telemedicine** — Permenkes 20/2019`,
    `- **FHIR R4** — SATUSEHAT mandated standard
- **KFA** — national drug and medical device coding
- **ICD-10**`,
    `1. **SATUSEHAT** — register as system; OAuth + FHIR APIs
2. **BPJS** — claims integration via accredited pathways
3. **AWS ap-southeast-3** (Jakarta)`,
    `- Run \`dna plan compliance --frameworks pdp_id\`
- SATUSEHAT certification for clinical data exchange
- Pair with: \`healthcare/fhir-r4\``,
    ["id", "satusehat"],
  ),
  countryOverview(
    "vn",
    "Vietnam",
    `## Regulation
- **PDPD 2023** — Personal Data Protection Decree
- **Law on Medical Examination and Treatment** — health records
- **DAV** — drug administration (devices)
- **VSS** — Vietnam Social Security (health insurance)`,
    `- **MOH** — Ministry of Health
- **National PHR** — electronic health record programme
- **Social health insurance** — ~90% coverage
- **Private** — Vinmec, FV Hospital growing`,
    `- **HL7 v2** dominant
- **FHIR R4** — national roadmap
- **ICD-10**; **Vietnamese drug codes**`,
    `1. **MOH digital health** — confirm current integration specs
2. **Hospital EMR** — vendor-specific (VNPT, Viettel health IT)
3. **AWS ap-southeast-1** or local VN cloud`,
    `- Run \`dna plan compliance --frameworks pdpd_vn\`
- Pair with: \`healthcare/fhir-r4\``,
    ["vn"],
  ),
  countryOverview(
    "cn",
    "China",
    `## Regulation
- **PIPL** — Personal Information Protection Law
- **DSL** — Data Security Law; health = important data
- **Cybersecurity Law** — localisation and security assessment
- **NMPA** — medical device regulation (including AI diagnostic)`,
    `- **NHSA** — National Healthcare Security Administration
- **Hospital tiers** — 三级甲等 (Grade A tertiary) classification
- **EMR vendors** — Neusoft, Winning, iFlytek health, etc.
- **Internet hospital** — regulated online care licences`,
    `- **HL7 v2** common domestically
- **FHIR** — limited; national interoperability standards differ
- **ICD-10** Chinese; **national drug codes**`,
    `1. **Regulatory complexity** — often require local entity and ICP licence
2. **Hospital integration** — per-facility; rarely public cloud FHIR
3. **Data localisation** — health data must stay in China; no default AWS US`,
    `- Run \`dna plan compliance --frameworks pipl\`
- Security assessment for cross-border data
- Engage local legal counsel before PHI processing
- Pair with: \`healthcare/fhir-r4\` (reference only — adapt to national specs)`,
    ["cn", "pipl"],
  ),
];

export const HEALTHCARE_OVERVIEW_COUNTRY_IDS = HEALTHCARE_OVERVIEW_COUNTRY_DEFS.map((d) => d.id);
