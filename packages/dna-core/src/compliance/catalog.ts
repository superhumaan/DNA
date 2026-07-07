export type OrgTier = "startup" | "sme" | "corporate" | "enterprise";

export type ComplianceFramework =
  | "gdpr"
  | "uk_gdpr"
  | "hipaa"
  | "soc2"
  | "iso27001"
  | "pci_dss";

export interface ComplianceFrameworkMeta {
  id: ComplianceFramework;
  name: string;
  description: string;
  /** Regions / industries where most relevant */
  scope: string;
  certification: string;
}

export const COMPLIANCE_FRAMEWORK_CATALOG: ComplianceFrameworkMeta[] = [
  {
    id: "gdpr",
    name: "GDPR (EU)",
    description: "EU General Data Protection Regulation — lawful basis, rights, DPIA, breach notification",
    scope: "EU/EEA data subjects; extraterritorial if offering services in EU",
    certification: "No certification — compliance demonstrated via documentation and DPA",
  },
  {
    id: "uk_gdpr",
    name: "UK GDPR",
    description: "UK post-Brexit data protection — aligned with EU GDPR with UK-specific ICO guidance",
    scope: "UK data subjects and UK establishment",
    certification: "ICO registration where required",
  },
  {
    id: "hipaa",
    name: "HIPAA",
    description: "US health data — Privacy, Security, and Breach Notification Rules for PHI",
    scope: "Covered entities and business associates handling PHI in the US",
    certification: "No HIPAA seal — OCR enforcement; HITRUST optional third-party attestation",
  },
  {
    id: "soc2",
    name: "SOC 2 Type II",
    description: "AICPA trust services — security plus optional availability, confidentiality, privacy, processing integrity",
    scope: "B2B SaaS selling to US enterprises",
    certification: "Independent CPA audit report",
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001",
    description: "Information security management system (ISMS) with Annex A controls",
    scope: "Global; preferred by enterprise and government procurement",
    certification: "Accredited certification body audit (3-year cycle)",
  },
  {
    id: "pci_dss",
    name: "PCI DSS",
    description: "Payment card data protection if you store, process, or transmit cardholder data",
    scope: "Any organisation touching payment cards — prefer Stripe/etc. to reduce scope",
    certification: "SAQ or QSA assessment depending on volume",
  },
];

/** Framework-specific controls emphasised at each org tier */
export const FRAMEWORK_TIER_FOCUS: Record<
  ComplianceFramework,
  Record<OrgTier, string[]>
> = {
  gdpr: {
    startup: [
      "Lawful basis documented per processing purpose",
      "Privacy policy + cookie notice",
      "Processor DPAs (cloud, email, analytics)",
      "Erasure/export on request within 30 days",
      "72-hour breach awareness process",
    ],
    sme: [
      "Records of processing activities (ROPA)",
      "DPIA for high-risk processing (profiling, large-scale special category)",
      "Data Protection Officer contact (required or voluntary)",
      "Privacy by design in new features",
      "International transfer mechanism (SCCs) if US cloud",
    ],
    corporate: [
      "Formal DPIA programme with legal sign-off",
      "Automated DSAR workflow with SLA tracking",
      "Privacy training for engineering and support",
      "Vendor subprocessors register with transfer impact assessments",
      "ICO/DPA cooperation procedure",
    ],
    enterprise: [
      "Binding corporate rules or multi-region privacy programme",
      "Privacy engineering guild; PETs where appropriate",
      "Cross-border incident coordination",
      "Regular external privacy audits",
      "EU representative appointed if no EU establishment",
    ],
  },
  uk_gdpr: {
    startup: [
      "ICO fee paid if required",
      "UK privacy notice distinct from EU if dual market",
      "UK processor agreements",
      "PECR compliance for marketing cookies",
    ],
    sme: [
      "UK ROPA aligned with EU where shared systems",
      "UK DPIA template",
      "International transfer to EU/adequate countries documented",
    ],
    corporate: [
      "ICO breach reporting workflow",
      "UK DPO or representative",
      "Age-appropriate design code if children's data",
    ],
    enterprise: [
      "Dual EU/UK representative structure",
      "Schrems II UK addendum documentation",
      "Board privacy metrics",
    ],
  },
  hipaa: {
    startup: [
      "Avoid collecting PHI unless product requires it",
      "If PHI: BAA with every vendor touching PHI",
      "Encryption in transit and at rest for PHI",
      "Minimum necessary access; no PHI in logs or AI prompts",
    ],
    sme: [
      "Risk analysis documented (Security Rule)",
      "Workforce HIPAA training",
      "Access controls + audit logs for ePHI systems",
      "Breach notification procedure (60 days to HHS if 500+)",
    ],
    corporate: [
      "Annual risk assessment review",
      "Physical safeguards if on-prem PHI",
      "Disaster recovery for ePHI",
      "Business associate management programme",
    ],
    enterprise: [
      "HITRUST or SOC 2 + HIPAA mapping",
      "Continuous compliance monitoring",
      "De-identification standards (Safe Harbor / Expert Determination)",
      "OCR audit readiness",
    ],
  },
  soc2: {
    startup: [
      "Security CC6/CC7 foundations (access, logging)",
      "Change management via git + PR review",
      "Env separation dev/staging/prod",
    ],
    sme: [
      "SOC 2 Type I readiness assessment",
      "Vendor management evidence",
      "Incident response tested",
      "Employee security onboarding checklist",
    ],
    corporate: [
      "SOC 2 Type II 6–12 month observation",
      "All five TSC if privacy/availability in scope",
      "Pen test report for auditor",
    ],
    enterprise: [
      "Continuous control monitoring",
      "Multiple entity SOC reports",
      "Customer bridge letters",
    ],
  },
  iso27001: {
    startup: [
      "Statement of Applicability draft",
      "Asset inventory (systems, data types)",
      "Adopt Annex A controls as checklist — implement critical first",
    ],
    sme: [
      "Formal ISMS scope",
      "Internal audit once before certification",
      "Corrective action process",
    ],
    corporate: [
      "Stage 1 + Stage 2 certification audit",
      "Annual surveillance audits",
      "Integrated with SOC 2 control mapping",
    ],
    enterprise: [
      "Multi-site ISMS",
      "ISO 27017/27018 for cloud if applicable",
      "Supply chain ISO requirements cascaded to vendors",
    ],
  },
  pci_dss: {
    startup: [
      "Never store CVV; tokenise via Stripe/Adyen — SAQ A",
      "No card data in logs",
    ],
    sme: [
      "SAQ A-EP or D if custom checkout",
      "Quarterly ASV scans if applicable",
    ],
    corporate: [
      "Segmented CDE network",
      "QSA assessment if high volume",
    ],
    enterprise: [
      "Level 1 merchant/service provider programme",
      "HSM key management",
    ],
  },
};

export function getFramework(id: string): ComplianceFrameworkMeta | undefined {
  return COMPLIANCE_FRAMEWORK_CATALOG.find((f) => f.id === id);
}

export function parseFrameworksInput(input: string): ComplianceFramework[] {
  const valid = new Set(COMPLIANCE_FRAMEWORK_CATALOG.map((f) => f.id));
  return input
    .split(/[,;]+/)
    .map((s) => s.trim().toLowerCase().replace(/-/g, "_"))
    .filter((s): s is ComplianceFramework => valid.has(s as ComplianceFramework));
}

export function parseOrgTier(input: string): OrgTier | undefined {
  const normalized = input.trim().toLowerCase() as OrgTier;
  const valid: OrgTier[] = ["startup", "sme", "corporate", "enterprise"];
  return valid.includes(normalized) ? normalized : undefined;
}
