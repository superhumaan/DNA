import type { KnowledgePack } from "@superhumaan/dna-config";
import { pack } from "./bundled-catalog-helpers.js";

function regionPack(
  packId: string,
  name: string,
  regionId: string,
  laws: string,
  positioning: string,
  checklist: string,
): KnowledgePack {
  return pack(packId, name, "legal", `${laws} — engineering legal checklist`, [
    { path: `legal/regions/${regionId}/positioning.dna.md`, content: positioning },
    { path: `legal/regions/${regionId}/engineering-checklist.dna.md`, content: checklist },
  ]);
}

const EU_POSITIONING = `# EU — GDPR & Digital Regulation

**Primary laws:** GDPR, ePrivacy Directive, EU AI Act, PSD2 (payments), MDR (medical devices)

**Scope:** Establishment in EU/EEA or offering goods/services to EU data subjects.

**Supervisory authorities:** National DPAs (ICO for UK is separate pack).

**Key engineering implications:**
- Lawful basis per purpose; consent must be freely given and withdrawable
- DPIA for high-risk processing
- SCCs + transfer impact assessment for US cloud
- 72-hour breach notification to DPA
- Data Protection Officer when core activities involve large-scale monitoring or special category data
`;

const EU_CHECKLIST = `# EU GDPR — Engineering Checklist

- [ ] ROPA (records of processing activities)
- [ ] Privacy policy in plain language; layered notice at collection
- [ ] Cookie consent before non-essential cookies (ePrivacy)
- [ ] DSAR workflow ≤ 30 days (extendable to 60)
- [ ] Erasure with backup/analytics propagation
- [ ] SCCs or adequacy for international transfers
- [ ] DPO contact published if required
- [ ] DPIA for profiling, biometrics, large-scale special category
- [ ] Processor DPAs with all subprocessors
- [ ] EU representative if no EU establishment but Art. 3(2) applies
`;

const UK_POSITIONING = `# UK — UK GDPR & Financial Regulation

**Primary laws:** UK GDPR, Data Protection Act 2018, PECR, FCA Handbook (financial)

**Scope:** UK establishment or UK data subjects.

**Regulator:** ICO (privacy), FCA (financial services).
`;

const UK_CHECKLIST = `# UK — Engineering Checklist

- [ ] UK privacy notice (may differ from EU if dual market)
- [ ] ICO registration fee paid if required
- [ ] PECR compliance for marketing cookies and electronic communications
- [ ] UK IDTA/SCCs for transfers post-Brexit
- [ ] Age-appropriate design code if children's data
- [ ] FCA permissions if regulated financial activity
`;

const US_POSITIONING = `# US — Privacy & Sectoral Law

**Primary laws:** CCPA/CPRA (California), VCDPA, CPA, state privacy patchwork; HIPAA (health); GLBA (financial); COPPA (children)

**Scope:** State-specific triggers (revenue, data volume) plus sector rules regardless of state.
`;

const US_CHECKLIST = `# US — Engineering Checklist

- [ ] Determine state privacy law applicability (CA, CO, CT, VA, TX, etc.)
- [ ] "Do Not Sell/Share" and opt-out of targeted advertising where required
- [ ] HIPAA BAA chain if PHI
- [ ] GLBA safeguards if financial institution
- [ ] COPPA verifiable parental consent if under 13
- [ ] CAN-SPAM for commercial email
- [ ] SOC 2 often required by enterprise buyers (pair with compliance plan)
`;

const SG_POSITIONING = `# Singapore — PDPA

**Primary law:** Personal Data Protection Act 2012 (PDPA)

**Regulator:** PDPC

**Scope:** Organisations collecting, using, or disclosing personal data in Singapore.

**Financial:** MAS Technology Risk Management (TRM) for regulated entities.
`;

const SG_CHECKLIST = `# Singapore PDPA — Engineering Checklist

- [ ] Appoint DPO (mandatory for most organisations)
- [ ] Consent, notification, and purpose limitation documented
- [ ] Access and correction request process
- [ ] Retention limitation — delete when purpose fulfilled
- [ ] Transfer limitation — ensure recipient comparable protection
- [ ] Do Not Call Registry if telemarketing
- [ ] MAS TRM if financial institution: incident reporting, access controls
`;

const TH_POSITIONING = `# Thailand — PDPA

**Primary law:** Personal Data Protection Act B.E. 2562 (2019)

**Regulator:** PDPC Thailand

**Scope:** Data controllers and processors in Thailand or targeting Thai data subjects.
`;

const TH_CHECKLIST = `# Thailand PDPA — Engineering Checklist

- [ ] Legal basis documented (consent, contract, legal obligation, etc.)
- [ ] Thai-language privacy notice where appropriate
- [ ] Consent records with withdrawal mechanism
- [ ] Cross-border transfer safeguards
- [ ] DPO appointment when required
- [ ] 72-hour breach notification awareness
`;

const MY_POSITIONING = `# Malaysia — PDPA

**Primary law:** Personal Data Protection Act 2010

**Regulator:** JPDP

**Scope:** Commercial transactions involving personal data in Malaysia.
`;

const MY_CHECKLIST = `# Malaysia PDPA — Engineering Checklist

- [ ] Register with JPDP if required
- [ ] Seven PDPA principles: general, notice/choice, disclosure, security, retention, integrity, access
- [ ] Consent for sensitive data
- [ ] Cross-border transfer consent or comparable protection
`;

const AU_POSITIONING = `# Australia — Privacy Act

**Primary laws:** Privacy Act 1988, Australian Privacy Principles (APPs)

**Regulator:** OAIC

**Scope:** APP entities (generally turnover > AUD 3M or health sector).
`;

const AU_CHECKLIST = `# Australia — Engineering Checklist

- [ ] APP compliance: collection notice, use/disclosure limits
- [ ] Notifiable Data Breaches scheme — assess within 30 days
- [ ] Cross-border disclosure accountability
- [ ] My Health Records Act if connecting to MHR
`;

const CA_POSITIONING = `# Canada — PIPEDA & Provincial Law

**Primary laws:** PIPEDA (federal), Quebec Law 25, provincial health acts

**Regulator:** OPC (federal), CAI (Quebec)
`;

const CA_CHECKLIST = `# Canada — Engineering Checklist

- [ ] Meaningful consent; express for sensitive data
- [ ] Quebec Law 25: privacy impact assessments, data portability
- [ ] Breach reporting to OPC when real risk of significant harm
- [ ] Provincial rules if operating in BC, Alberta, Quebec
`;

const IN_POSITIONING = `# India — DPDP Act 2023

**Primary law:** Digital Personal Data Protection Act, 2023

**Regulator:** Data Protection Board of India

**Scope:** Digital personal data processed in India.
`;

const IN_CHECKLIST = `# India DPDP — Engineering Checklist

- [ ] Notice in English and scheduled languages where required
- [ ] Consent manager integration if offering consent management
- [ ] Data fiduciary obligations: security safeguards, breach notification
- [ ] Children's data: verifiable parental consent
- [ ] Significant data fiduciary extra duties if designated
- [ ] RBI guidelines if payment/banking features
`;

const BR_POSITIONING = `# Brazil — LGPD

**Primary law:** Lei Geral de Proteção de Dados (LGPD)

**Regulator:** ANPD

**Scope:** Processing in Brazil or of data subjects in Brazil.
`;

const BR_CHECKLIST = `# Brazil LGPD — Engineering Checklist

- [ ] Legal bases under Art. 7 documented
- [ ] DPO (encarregado) appointed and published
- [ ] Data subject rights portal
- [ ] ANPD breach notification
- [ ] BACEN requirements if financial institution
`;

const JP_POSITIONING = `# Japan — APPI

**Primary law:** Act on the Protection of Personal Information (APPI)

**Regulator:** PPC
`;

const JP_CHECKLIST = `# Japan APPI — Engineering Checklist

- [ ] Purpose of use specified and communicated
- [ ] Consent for sensitive personal information
- [ ] Cross-border transfer consent or equivalent system
- [ ] Breach reporting to PPC when harm likely
`;

const KR_POSITIONING = `# South Korea — PIPA

**Primary law:** Personal Information Protection Act

**Regulator:** PIPC
`;

const KR_CHECKLIST = `# South Korea PIPA — Engineering Checklist

- [ ] Consent for collection and third-party provision
- [ ] Resident registration numbers — avoid unless legally required
- [ ] Overseas transfer notification/consent
- [ ] Data breach notification within 72 hours
`;

const ID_POSITIONING = `# Indonesia — PDP Law

**Primary law:** Personal Data Protection Law (UU PDP)

**Regulator:** Kominfo
`;

const ID_CHECKLIST = `# Indonesia PDP — Engineering Checklist

- [ ] Explicit consent for processing
- [ ] Data localisation assessment for certain sectors
- [ ] Cross-border transfer mechanisms
- [ ] OJK rules if fintech
`;

const PH_POSITIONING = `# Philippines — Data Privacy Act

**Primary law:** Republic Act No. 10173

**Regulator:** National Privacy Commission (NPC)
`;

const PH_CHECKLIST = `# Philippines DPA — Engineering Checklist

- [ ] Register data processing systems with NPC if required
- [ ] Privacy by design in system architecture
- [ ] Breach notification within 72 hours
- [ ] DPO appointed
`;

const VN_POSITIONING = `# Vietnam — PDPD

**Primary law:** Decree 13/2023/NĐ-CP on Personal Data Protection

**Scope:** Processing personal data of Vietnamese citizens.
`;

const VN_CHECKLIST = `# Vietnam PDPD — Engineering Checklist

- [ ] Impact assessment for sensitive data processing
- [ ] Cross-border transfer impact assessment
- [ ] 72-hour breach notification
- [ ] Local representative if foreign controller
`;

const HK_POSITIONING = `# Hong Kong — PDPO

**Primary law:** Personal Data (Privacy) Ordinance

**Regulator:** PCPD
`;

const HK_CHECKLIST = `# Hong Kong PDPO — Engineering Checklist

- [ ] DPP1–6 compliance (collection, accuracy, retention, security, openness, access)
- [ ] Direct marketing opt-in
- [ ] Cross-border transfer due diligence
`;

const TW_POSITIONING = `# Taiwan — PDPA

**Primary law:** Personal Data Protection Act

**Regulator:** NDC / sector regulators
`;

const TW_CHECKLIST = `# Taiwan PDPA — Engineering Checklist

- [ ] Purpose specification and limitation
- [ ] Sensitive data consent
- [ ] Cross-border transfer restrictions for government data
- [ ] FSC compliance if financial services
`;

const CN_POSITIONING = `# China — PIPL

**Primary laws:** PIPL, Cybersecurity Law, Data Security Law

**Regulators:** CAC, sector regulators

**Critical:** Cross-border transfers often require security assessment or standard contract; localisation may be mandatory.
`;

const CN_CHECKLIST = `# China PIPL — Engineering Checklist

- [ ] Separate consent for sensitive personal information
- [ ] Cross-border transfer security assessment or SCC filing
- [ ] Data localisation for CIIO and certain volumes
- [ ] PIPL-compliant privacy policy in Chinese
- [ ] Engage China counsel before any production deployment
`;

export const REGIONAL_LEGAL_PACKS: KnowledgePack[] = [
  regionPack("legal/regions/eu-gdpr", "EU GDPR & Digital Law", "eu", "GDPR, ePrivacy, AI Act", EU_POSITIONING, EU_CHECKLIST),
  regionPack("legal/regions/uk-gdpr", "UK GDPR", "uk", "UK GDPR, PECR", UK_POSITIONING, UK_CHECKLIST),
  regionPack("legal/regions/us-privacy", "US Privacy & Sectoral", "us", "CCPA, HIPAA, GLBA", US_POSITIONING, US_CHECKLIST),
  regionPack("legal/regions/sg-pdpa", "Singapore PDPA", "sg", "PDPA, MAS TRM", SG_POSITIONING, SG_CHECKLIST),
  regionPack("legal/regions/th-pdpa", "Thailand PDPA", "th", "Thailand PDPA", TH_POSITIONING, TH_CHECKLIST),
  regionPack("legal/regions/my-pdpa", "Malaysia PDPA", "my", "Malaysia PDPA", MY_POSITIONING, MY_CHECKLIST),
  regionPack("legal/regions/au-privacy", "Australia Privacy", "au", "Privacy Act, APPs", AU_POSITIONING, AU_CHECKLIST),
  regionPack("legal/regions/ca-pipeda", "Canada PIPEDA", "ca", "PIPEDA, Law 25", CA_POSITIONING, CA_CHECKLIST),
  regionPack("legal/regions/in-dpdp", "India DPDP", "in", "DPDP Act 2023", IN_POSITIONING, IN_CHECKLIST),
  regionPack("legal/regions/br-lgpd", "Brazil LGPD", "br", "LGPD", BR_POSITIONING, BR_CHECKLIST),
  regionPack("legal/regions/jp-appi", "Japan APPI", "jp", "APPI", JP_POSITIONING, JP_CHECKLIST),
  regionPack("legal/regions/kr-pipa", "South Korea PIPA", "kr", "PIPA", KR_POSITIONING, KR_CHECKLIST),
  regionPack("legal/regions/id-pdp", "Indonesia PDP", "id", "PDP Law", ID_POSITIONING, ID_CHECKLIST),
  regionPack("legal/regions/ph-dpa", "Philippines DPA", "ph", "Data Privacy Act", PH_POSITIONING, PH_CHECKLIST),
  regionPack("legal/regions/vn-pdpd", "Vietnam PDPD", "vn", "Decree 13/2023", VN_POSITIONING, VN_CHECKLIST),
  regionPack("legal/regions/hk-pdpo", "Hong Kong PDPO", "hk", "PDPO", HK_POSITIONING, HK_CHECKLIST),
  regionPack("legal/regions/tw-pdpa", "Taiwan PDPA", "tw", "Taiwan PDPA", TW_POSITIONING, TW_CHECKLIST),
  regionPack("legal/regions/cn-pipl", "China PIPL", "cn", "PIPL, CSL, DSL", CN_POSITIONING, CN_CHECKLIST),
];
