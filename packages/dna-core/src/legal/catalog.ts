export type LegalDomain =
  | "privacy"
  | "banking"
  | "healthcare"
  | "ip"
  | "consumer"
  | "employment"
  | "ai_governance";

export type LegalJurisdiction =
  | "eu"
  | "uk"
  | "us"
  | "sg"
  | "th"
  | "my"
  | "au"
  | "ca"
  | "in"
  | "br"
  | "jp"
  | "kr"
  | "id"
  | "ph"
  | "vn"
  | "hk"
  | "tw"
  | "cn";

export interface LegalDomainMeta {
  id: LegalDomain;
  name: string;
  description: string;
  triggers: string[];
  packPaths: string[];
}

export interface LegalJurisdictionMeta {
  id: LegalJurisdiction;
  name: string;
  primaryLaws: string[];
  packId: string;
  scope: string;
}

export const LEGAL_DOMAIN_CATALOG: LegalDomainMeta[] = [
  {
    id: "privacy",
    name: "Privacy & Data Protection",
    description: "Personal data collection, consent, rights, transfers, breach notification",
    triggers: ["personal data", "privacy", "pii", "gdpr", "pdpa", "cookie", "tracking", "analytics"],
    packPaths: ["legal/domains/privacy.dna.md"],
  },
  {
    id: "banking",
    name: "Banking & Financial Services",
    description: "Licensing, AML/KYC, open banking, payment services, consumer credit",
    triggers: ["bank", "fintech", "payment", "lending", "kyc", "aml", "plaid", "open banking", "pci"],
    packPaths: ["legal/domains/banking-finance.dna.md", "legal/sectors/banking-aml-kyc.dna.md"],
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    description: "PHI/ePHI, clinical trials, medical device software, telehealth",
    triggers: ["healthcare", "hipaa", "phi", "ehr", "clinical", "patient", "telehealth", "medical device"],
    packPaths: ["legal/domains/healthcare.dna.md"],
  },
  {
    id: "ip",
    name: "Intellectual Property",
    description: "Copyright, trademarks, patents, trade secrets, OSS licensing, AI training data",
    triggers: ["copyright", "trademark", "patent", "license", "open source", "ip", "trade secret", "dmca"],
    packPaths: ["legal/domains/intellectual-property.dna.md"],
  },
  {
    id: "consumer",
    name: "Consumer Protection",
    description: "Terms of service, refunds, unfair terms, marketing, accessibility",
    triggers: ["consumer", "refund", "terms of service", "subscription", "marketing", "accessibility", "wcag"],
    packPaths: ["legal/domains/consumer-protection.dna.md"],
  },
  {
    id: "employment",
    name: "Employment & HR Tech",
    description: "Employee data, monitoring, cross-border workforce, contractor classification",
    triggers: ["employee", "hr", "payroll", "workforce", "contractor", "monitoring"],
    packPaths: ["legal/domains/employment.dna.md"],
  },
  {
    id: "ai_governance",
    name: "AI Governance",
    description: "EU AI Act, automated decision-making, bias, transparency, model governance",
    triggers: ["ai", "llm", "machine learning", "automated decision", "chatbot", "generative"],
    packPaths: ["legal/domains/ai-governance.dna.md"],
  },
];

export const LEGAL_JURISDICTION_CATALOG: LegalJurisdictionMeta[] = [
  {
    id: "eu",
    name: "European Union",
    primaryLaws: ["GDPR", "ePrivacy", "EU AI Act", "PSD2", "MDR (medical devices)"],
    packId: "legal/regions/eu-gdpr",
    scope: "EU/EEA establishment or offering services to EU data subjects",
  },
  {
    id: "uk",
    name: "United Kingdom",
    primaryLaws: ["UK GDPR", "PECR", "Data Protection Act 2018", "FCA rules (financial)"],
    packId: "legal/regions/uk-gdpr",
    scope: "UK establishment or UK data subjects",
  },
  {
    id: "us",
    name: "United States",
    primaryLaws: ["CCPA/CPRA", "HIPAA", "GLBA", "COPPA", "state privacy laws"],
    packId: "legal/regions/us-privacy",
    scope: "US residents; sector-specific federal and state law",
  },
  {
    id: "sg",
    name: "Singapore",
    primaryLaws: ["PDPA", "MAS TRM (financial)", "HCSA (health)"],
    packId: "legal/regions/sg-pdpa",
    scope: "Singapore organisation or collecting data in Singapore",
  },
  {
    id: "th",
    name: "Thailand",
    primaryLaws: ["PDPA (Thailand)", "Cybersecurity Act"],
    packId: "legal/regions/th-pdpa",
    scope: "Thailand operations or Thai data subjects",
  },
  {
    id: "my",
    name: "Malaysia",
    primaryLaws: ["PDPA (Malaysia)", "BNM guidelines (financial)"],
    packId: "legal/regions/my-pdpa",
    scope: "Malaysia commercial transactions involving personal data",
  },
  {
    id: "au",
    name: "Australia",
    primaryLaws: ["Privacy Act 1988", "APPs", "My Health Records Act"],
    packId: "legal/regions/au-privacy",
    scope: "Australian organisations with turnover > AUD 3M or health sector",
  },
  {
    id: "ca",
    name: "Canada",
    primaryLaws: ["PIPEDA", "provincial laws (Quebec Law 25)", "PHIPA (Ontario health)"],
    packId: "legal/regions/ca-pipeda",
    scope: "Canadian commercial activities",
  },
  {
    id: "in",
    name: "India",
    primaryLaws: ["DPDP Act 2023", "RBI guidelines (financial)", "IT Rules"],
    packId: "legal/regions/in-dpdp",
    scope: "Processing digital personal data in India",
  },
  {
    id: "br",
    name: "Brazil",
    primaryLaws: ["LGPD", "Marco Civil", "BACEN (financial)"],
    packId: "legal/regions/br-lgpd",
    scope: "Processing in Brazil or of Brazilian data subjects",
  },
  {
    id: "jp",
    name: "Japan",
    primaryLaws: ["APPI", "FISC guidelines (financial)"],
    packId: "legal/regions/jp-appi",
    scope: "Business handling personal information in Japan",
  },
  {
    id: "kr",
    name: "South Korea",
    primaryLaws: ["PIPA", "Credit Information Act"],
    packId: "legal/regions/kr-pipa",
    scope: "Korean data subjects or Korean establishment",
  },
  {
    id: "id",
    name: "Indonesia",
    primaryLaws: ["PDP Law", "OJK (financial)"],
    packId: "legal/regions/id-pdp",
    scope: "Indonesian electronic system operators",
  },
  {
    id: "ph",
    name: "Philippines",
    primaryLaws: ["Data Privacy Act 2012", "NPC circulars"],
    packId: "legal/regions/ph-dpa",
    scope: "Personal information controllers/processors in the Philippines",
  },
  {
    id: "vn",
    name: "Vietnam",
    primaryLaws: ["PDPD (Decree 13/2023)", "Cybersecurity Law"],
    packId: "legal/regions/vn-pdpd",
    scope: "Processing personal data of Vietnamese citizens",
  },
  {
    id: "hk",
    name: "Hong Kong",
    primaryLaws: ["PDPO", "PCPD guidance"],
    packId: "legal/regions/hk-pdpo",
    scope: "Hong Kong data users",
  },
  {
    id: "tw",
    name: "Taiwan",
    primaryLaws: ["PDPA (Taiwan)", "FSC (financial)"],
    packId: "legal/regions/tw-pdpa",
    scope: "Taiwan personal data processing",
  },
  {
    id: "cn",
    name: "China",
    primaryLaws: ["PIPL", "CSL", "DSL", "CAC regulations"],
    packId: "legal/regions/cn-pipl",
    scope: "Processing in China or of Chinese citizens — localisation often required",
  },
];

export function getLegalDomain(id: string): LegalDomainMeta | undefined {
  return LEGAL_DOMAIN_CATALOG.find((d) => d.id === id);
}

export function getLegalJurisdiction(id: string): LegalJurisdictionMeta | undefined {
  return LEGAL_JURISDICTION_CATALOG.find((j) => j.id === id);
}

export function parseDomainsInput(input: string): LegalDomain[] {
  const valid = new Set(LEGAL_DOMAIN_CATALOG.map((d) => d.id));
  return input
    .split(/[,;]+/)
    .map((s) => s.trim().toLowerCase().replace(/-/g, "_"))
    .filter((s): s is LegalDomain => valid.has(s as LegalDomain));
}

export function parseJurisdictionsInput(input: string): LegalJurisdiction[] {
  const valid = new Set(LEGAL_JURISDICTION_CATALOG.map((j) => j.id));
  return input
    .split(/[,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is LegalJurisdiction => valid.has(s as LegalJurisdiction));
}

export function formatLegalCatalog(): string {
  const lines = [
    "## Legal domains",
    "",
    "| Domain | Focus |",
    "| --- | --- |",
    ...LEGAL_DOMAIN_CATALOG.map((d) => `| ${d.name} | ${d.description} |`),
    "",
    "## Jurisdictions",
    "",
    "| Region | Primary laws | Scope |",
    "| --- | --- | --- |",
    ...LEGAL_JURISDICTION_CATALOG.map(
      (j) => `| ${j.name} | ${j.primaryLaws.join(", ")} | ${j.scope} |`,
    ),
    "",
  ];
  return lines.join("\n");
}
