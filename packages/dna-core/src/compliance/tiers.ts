import type { OrgTier, ComplianceFramework } from "./catalog.js";

export interface TierProfile {
  id: OrgTier;
  name: string;
  teamSize: string;
  securityStaff: string;
  auditCadence: string;
  summary: string;
}

export const ORG_TIER_PROFILES: TierProfile[] = [
  {
    id: "startup",
    name: "Startup",
    teamSize: "1–25 people",
    securityStaff: "Founders / lead engineer (part-time security)",
    auditCadence: "Informal quarterly review",
    summary:
      "Ship fast with non-negotiable baselines: secrets hygiene, auth, encryption in transit, privacy-by-design. Document decisions; avoid scope creep into regulated data without intent.",
  },
  {
    id: "sme",
    name: "SME",
    teamSize: "25–250 people",
    securityStaff: "IT lead + external advisor or fractional CISO",
    auditCadence: "Semi-annual risk review; annual policy refresh",
    summary:
      "Formalise policies, vendor due diligence, access reviews, incident runbooks. Prepare for customer security questionnaires and first SOC 2 / ISO gap assessment.",
  },
  {
    id: "corporate",
    name: "Large corporate",
    teamSize: "250–5,000 people",
    securityStaff: "Dedicated security & compliance team",
    auditCadence: "Annual external audit; quarterly control testing",
    summary:
      "Full GRC program, penetration testing, segregation of duties, change management, BCP/DR tested. Framework alignment (ISO 27001, SOC 2 Type II) is expected by enterprise buyers.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    teamSize: "5,000+ or highly regulated",
    securityStaff: "CISO, DPO, GRC, SOC; board-level reporting",
    auditCadence: "Continuous monitoring; annual certification cycles",
    summary:
      "Certified ISMS, 24/7 monitoring, global data residency, supplier assurance at scale. HIPAA/PCI where in scope; privacy programme across jurisdictions.",
  },
];

export function inferOrgTierFromStage(
  stage: string | undefined,
): OrgTier {
  const map: Record<string, OrgTier> = {
    new: "startup",
    mvp: "startup",
    scaling: "sme",
    enterprise: "enterprise",
    legacy_modernisation: "corporate",
    audit_remediation: "corporate",
  };
  return map[stage ?? "mvp"] ?? "startup";
}

export function getTierProfile(tier: OrgTier): TierProfile {
  return ORG_TIER_PROFILES.find((t) => t.id === tier) ?? ORG_TIER_PROFILES[0];
}

/** Cross-framework control domains with per-tier expectations */
export const CONTROL_DOMAINS: Array<{
  id: string;
  name: string;
  tiers: Record<OrgTier, string>;
}> = [
  {
    id: "governance",
    name: "Governance & policies",
    tiers: {
      startup: "Security README + acceptable use; name an owner",
      sme: "Written infosec & privacy policies; risk register started",
      corporate: "Policy library, annual attestation, management review",
      enterprise: "Board reporting, integrated GRC tool, policy exception workflow",
    },
  },
  {
    id: "identity",
    name: "Identity & access",
    tiers: {
      startup: "SSO/OAuth where possible; MFA for admin; no shared accounts",
      sme: "MFA enforced org-wide; quarterly access review; RBAC default deny",
      corporate: "IAM lifecycle, SoD, privileged access management, joiner-mover-leaver",
      enterprise: "IGA platform, continuous access certification, break-glass audited",
    },
  },
  {
    id: "data",
    name: "Data protection",
    tiers: {
      startup: "Encrypt in transit (TLS); classify PII/PHI; minimal retention",
      sme: "Encryption at rest; data inventory; retention schedules; backups tested",
      corporate: "DLP, field-level encryption for sensitive data, residency controls",
      enterprise: "Global classification taxonomy, tokenisation, key management HSM",
    },
  },
  {
    id: "application",
    name: "Application security",
    tiers: {
      startup: "Input validation, dependency scanning, secrets in vault/env only",
      sme: "SAST in CI, OWASP ASVS L1, security in SDLC checklist",
      corporate: "DAST, pen test annually, threat modelling per major feature",
      enterprise: "Red team, bug bounty, secure SDLC gates, supply chain SBOM",
    },
  },
  {
    id: "logging",
    name: "Logging & monitoring",
    tiers: {
      startup: "Centralised app logs; alert on auth failures; no secrets in logs",
      sme: "SIEM-lite or aggregated logs; incident runbook; 90-day retention min",
      corporate: "SOC monitoring, audit trail immutability, correlation rules",
      enterprise: "24/7 SOC, UEBA, log integrity, cross-region retention policy",
    },
  },
  {
    id: "vendor",
    name: "Vendor & subprocessors",
    tiers: {
      startup: "List processors; DPAs for EU/UK; no PHI without BAA",
      sme: "Vendor risk tiering; annual review of critical vendors",
      corporate: "Due diligence questionnaires; on-site reviews for critical",
      enterprise: "Continuous vendor monitoring; fourth-party risk programme",
    },
  },
  {
    id: "incident",
    name: "Incident response",
    tiers: {
      startup: "Contact list; 72h breach awareness (GDPR); postmortem template",
      sme: "Written IR plan; tabletop annually; breach notification workflow",
      corporate: "Dedicated IR team; forensics retainer; regulator notification playbooks",
      enterprise: "Global IR coordination; crisis comms; cyber insurance aligned",
    },
  },
  {
    id: "privacy",
    name: "Privacy rights & consent",
    tiers: {
      startup: "Privacy notice; consent where required; erasure on request (manual OK)",
      sme: "SAR/erasure SLA; cookie consent; DPIA template for new processing",
      corporate: "Privacy impact assessments; ROPA; DPO function; LIA documentation",
      enterprise: "Multi-jurisdiction privacy office; automated DSAR; privacy engineering",
    },
  },
  {
    id: "availability",
    name: "Availability & DR",
    tiers: {
      startup: "Managed cloud; backups; documented restore test once",
      sme: "RTO/RPO defined; backup encryption; failover runbook",
      corporate: "Multi-AZ; DR tested annually; status page",
      enterprise: "Active-active or hot standby; BCP tested; contractual SLAs",
    },
  },
  {
    id: "ai",
    name: "AI & automated processing",
    tiers: {
      startup: "No PII/PHI in prompts; human review for high-risk; disclose AI use",
      sme: "AI risk assessment; data processing agreements with model vendors",
      corporate: "AI governance committee; model inventory; bias/fairness review",
      enterprise: "EU AI Act alignment; on-prem or private endpoints for regulated data",
    },
  },
];

export function frameworkKnowledgeFiles(framework: ComplianceFramework): string[] {
  const common = [
    `compliance/tiers/overview.dna.md`,
    `compliance/frameworks/${framework}.dna.md`,
    `compliance/matrices/control-by-tier.dna.md`,
  ];
  const extra: Partial<Record<ComplianceFramework, string[]>> = {
    gdpr: ["compliance/gdpr/engineering-checklist.dna.md"],
    uk_gdpr: ["compliance/gdpr/engineering-checklist.dna.md"],
    hipaa: ["compliance/hipaa/safeguards.dna.md"],
    iso27001: ["compliance/iso27001/annex-a.dna.md"],
    soc2: ["compliance/soc2/trust-criteria.dna.md"],
    pci_dss: ["compliance/pci-dss/overview.dna.md"],
  };
  return [...common, ...(extra[framework] ?? [])];
}
