/**
 * UK GDPR required document catalog — structure from production compliance pack.
 * Reference examples are scrubbed templates with [Company Name] / [Product Name] placeholders.
 */

import type { OrgTier } from "./catalog.js";

export type GdprDocFolder = "governance" | "external" | "technical" | "ai";

export interface GdprDocument {
  slug: string;
  folder: GdprDocFolder;
  title: string;
  /** Minimum org tier before this document is expected */
  minimumTier: OrgTier;
  /** Product-specific customization required before publication */
  customize?: boolean;
}

export const GDPR_DOC_FOLDERS: Record<GdprDocFolder, string> = {
  governance: "Governance & Compliance",
  external: "External - Customer-Facing Documents",
  technical: "Technical - Operational Evidence Documents",
  ai: "AI-Specific Documentation",
};

export const GDPR_PLACEHOLDERS = {
  company: "[Company Name]",
  product: "[Product Name]",
  affiliate: "[Affiliate Entity]",
  region: "[UK Hosting Region]",
} as const;

/** Optional path to source .docx pack for re-ingest (local dev only) */
export const GDPR_SOURCE_DOCS_PATH = "/Users/place/Downloads/GDPR Documents";

/** Production document catalog (70+ artefacts) */
export const GDPR_DOCUMENTS: GdprDocument[] = [
  // Governance — core from SME upward
  { slug: "gdpr-compliance-policy", folder: "governance", title: "GDPR Compliance Policy", minimumTier: "sme", customize: true },
  { slug: "data-protection-policy", folder: "governance", title: "Data Protection Policy", minimumTier: "sme", customize: true },
  { slug: "privacy-governance-framework", folder: "governance", title: "Privacy Governance Framework", minimumTier: "corporate" },
  { slug: "ropa", folder: "governance", title: "Records of Processing Activities (ROPA)", minimumTier: "sme", customize: true },
  { slug: "platform-dpia", folder: "governance", title: "Platform DPIA", minimumTier: "sme", customize: true },
  { slug: "dpia-template", folder: "governance", title: "DPIA Template", minimumTier: "sme", customize: true },
  { slug: "lia", folder: "governance", title: "Legitimate Interest Assessments (LIA)", minimumTier: "sme" },
  { slug: "data-subject-rights-procedure", folder: "governance", title: "Data Subject Rights Procedure", minimumTier: "sme" },
  { slug: "retention-deletion-policy", folder: "governance", title: "Retention & Deletion Policy", minimumTier: "sme", customize: true },
  { slug: "incident-response-plan", folder: "governance", title: "Incident Response Plan", minimumTier: "startup", customize: true },
  { slug: "data-breach-response-procedure", folder: "governance", title: "Data Breach Response Procedure", minimumTier: "startup" },
  { slug: "international-transfer-assessment", folder: "governance", title: "International Transfer Assessment", minimumTier: "sme", customize: true },
  { slug: "subprocessor-management-procedure", folder: "governance", title: "Subprocessor Management Procedure", minimumTier: "sme" },
  { slug: "vendor-management-policy", folder: "governance", title: "Vendor Management Policy", minimumTier: "sme" },
  { slug: "information-security-policy", folder: "governance", title: "Information Security Policy", minimumTier: "sme" },
  { slug: "access-control-policy", folder: "governance", title: "Access Control Policy", minimumTier: "sme" },
  { slug: "encryption-standard", folder: "governance", title: "Encryption Standard", minimumTier: "sme" },
  { slug: "logging-monitoring-policy", folder: "governance", title: "Logging & Monitoring Policy", minimumTier: "sme", customize: true },
  { slug: "secure-sdlc-policy", folder: "governance", title: "Secure SDLC Policy", minimumTier: "corporate", customize: true },
  { slug: "ai-governance-policy", folder: "governance", title: "AI Governance Policy", minimumTier: "sme", customize: true },
  { slug: "processing-contracts-evidence", folder: "governance", title: "Processing Contracts Evidence Pack", minimumTier: "corporate", customize: true },
  { slug: "intra-group-transfer-agreement", folder: "governance", title: "Intra-Group Transfer Agreement", minimumTier: "enterprise", customize: true },
  { slug: "bcp", folder: "governance", title: "Business Continuity Plan (BCP)", minimumTier: "corporate" },
  { slug: "drp", folder: "governance", title: "Disaster Recovery Plan (DRP)", minimumTier: "corporate" },
  { slug: "jml-procedure", folder: "governance", title: "Joiner/Mover/Leaver Procedure", minimumTier: "corporate" },
  { slug: "change-management-policy", folder: "governance", title: "Change Management Policy", minimumTier: "corporate" },
  { slug: "training-awareness-policy", folder: "governance", title: "Training & Awareness Policy", minimumTier: "corporate" },

  // External — customer-facing from startup
  { slug: "privacy-policy", folder: "external", title: "Privacy Policy", minimumTier: "startup", customize: true },
  { slug: "cookie-policy", folder: "external", title: "Cookie Policy", minimumTier: "startup", customize: true },
  { slug: "terms-of-service", folder: "external", title: "Terms of Service", minimumTier: "startup", customize: true },
  { slug: "data-processing-agreement", folder: "external", title: "Data Processing Agreement (DPA)", minimumTier: "sme", customize: true },
  { slug: "subprocessor-list", folder: "external", title: "Subprocessor List", minimumTier: "sme", customize: true },
  { slug: "data-retention-schedule", folder: "external", title: "Data Retention Schedule", minimumTier: "startup" },
  { slug: "data-deletion-process", folder: "external", title: "Data Deletion Process", minimumTier: "sme" },
  { slug: "security-whitepaper", folder: "external", title: "Security Overview / Whitepaper", minimumTier: "sme", customize: true },
  { slug: "ai-transparency-statement", folder: "external", title: "AI Transparency Statement", minimumTier: "sme", customize: true },
  { slug: "responsible-ai-statement", folder: "external", title: "Responsible AI Statement", minimumTier: "corporate" },
  { slug: "law-enforcement-request-policy", folder: "external", title: "Law Enforcement Request Policy", minimumTier: "corporate", customize: true },

  // Technical — engineering evidence
  { slug: "data-inventory", folder: "technical", title: "Data Inventory", minimumTier: "startup", customize: true },
  { slug: "data-flow-diagrams", folder: "technical", title: "Data Flow Diagrams", minimumTier: "sme", customize: true },
  { slug: "infrastructure-architecture-diagram", folder: "technical", title: "Infrastructure Architecture Diagram", minimumTier: "sme", customize: true },
  { slug: "authentication-architecture", folder: "technical", title: "Authentication Architecture", minimumTier: "sme" },
  { slug: "audit-logging-design", folder: "technical", title: "Audit Logging Design", minimumTier: "sme" },
  { slug: "tenant-isolation-design", folder: "technical", title: "Tenant Isolation Design", minimumTier: "sme", customize: true },
  { slug: "data-storage-matrix", folder: "technical", title: "Data Storage Matrix", minimumTier: "sme" },
  { slug: "api-security-standards", folder: "technical", title: "API Security Standards", minimumTier: "sme" },
  { slug: "secrets-management-standard", folder: "technical", title: "Secrets Management Standard", minimumTier: "startup" },
  { slug: "cicd-security-controls", folder: "technical", title: "CI/CD Security Controls", minimumTier: "sme" },
  { slug: "control-matrix", folder: "technical", title: "Control Matrix", minimumTier: "corporate", customize: true },
  { slug: "risk-register", folder: "technical", title: "Risk Register", minimumTier: "corporate" },
  { slug: "penetration-test-reports", folder: "technical", title: "Penetration Test Reports", minimumTier: "corporate" },
  { slug: "access-review-records", folder: "technical", title: "Access Review Records", minimumTier: "sme" },
  { slug: "supplier-risk-assessments", folder: "technical", title: "Supplier Risk Assessments", minimumTier: "corporate" },

  // AI-specific — when product uses AI
  { slug: "ai-system-overview", folder: "ai", title: "AI System Overview", minimumTier: "sme", customize: true },
  { slug: "ai-risk-assessment", folder: "ai", title: "AI Risk Assessment", minimumTier: "sme", customize: true },
  { slug: "prompt-handling-standard", folder: "ai", title: "Prompt Handling Standard", minimumTier: "sme", customize: true },
  { slug: "human-oversight-framework", folder: "ai", title: "Human Oversight Framework", minimumTier: "sme", customize: true },
  { slug: "ai-data-usage-statement", folder: "ai", title: "AI Data Usage Statement", minimumTier: "sme" },
  { slug: "hallucination-mitigation-strategy", folder: "ai", title: "Hallucination Mitigation Strategy", minimumTier: "corporate", customize: true },
  { slug: "ai-auditability-standard", folder: "ai", title: "AI Auditability Standard", minimumTier: "corporate" },
  { slug: "model-vendor-assessment", folder: "ai", title: "Model Vendor Assessment", minimumTier: "sme" },
  { slug: "ai-incident-procedure", folder: "ai", title: "AI Incident Procedure", minimumTier: "corporate" },
];

const TIER_RANK: Record<OrgTier, number> = {
  startup: 0,
  sme: 1,
  corporate: 2,
  enterprise: 3,
};

export function gdprDocumentsForTier(tier: OrgTier, options?: { includeAi?: boolean }): GdprDocument[] {
  const rank = TIER_RANK[tier];
  return GDPR_DOCUMENTS.filter((d) => {
    if (!options?.includeAi && d.folder === "ai") return false;
    return TIER_RANK[d.minimumTier] <= rank;
  });
}

export function formatGdprDocumentCatalog(tier?: OrgTier, includeAi = true): string {
  const lines = [
    "UK GDPR Required Document Pack",
    "================================",
    "",
    `Scrubbed templates with placeholders: ${GDPR_PLACEHOLDERS.company}, ${GDPR_PLACEHOLDERS.product}`,
    `Total document types: ${GDPR_DOCUMENTS.length}`,
    "",
    "Folders:",
    ...Object.entries(GDPR_DOC_FOLDERS).map(([k, v]) => `  • ${k}: ${v}`),
    "",
  ];

  if (tier) {
    const docs = gdprDocumentsForTier(tier, { includeAi });
    lines.push(`Documents required at **${tier}** tier (${docs.length}):`, "");
    for (const folder of Object.keys(GDPR_DOC_FOLDERS) as GdprDocFolder[]) {
      const inFolder = docs.filter((d) => d.folder === folder);
      if (!inFolder.length) continue;
      lines.push(`[${GDPR_DOC_FOLDERS[folder]}]`);
      for (const d of inFolder) {
        lines.push(`  ${d.slug.padEnd(32)} ${d.title}${d.customize ? " *" : ""}`);
      }
      lines.push("");
    }
    lines.push("* = customize per product before publication", "");
  } else {
    lines.push(`Total documents in catalog: ${GDPR_DOCUMENTS.length}`, "");
    lines.push("Use: dna compliance documents --tier sme", "");
  }

  return lines.join("\n");
}

export function buildGdprDocumentChecklistMarkdown(tier: OrgTier, includeAi = true): string {
  const docs = gdprDocumentsForTier(tier, { includeAi });
  const lines = [
    `# GDPR Document Checklist — ${tier}`,
    "",
    "_UK GDPR required document templates. Replace [Company Name], [Product Name], and other placeholders before audit._",
    "",
    "| Status | Slug | Title | Folder |",
    "| --- | --- | --- | --- |",
    ...docs.map((d) => `| ☐ | ${d.slug} | ${d.title} | ${GDPR_DOC_FOLDERS[d.folder]} |`),
    "",
    "## Reference",
    "",
    `- Examples: \`.DNA/knowledge/compliance/gdpr/examples/\``,
    `- Re-ingest source .docx: \`pnpm gdpr:ingest\` then \`node scripts/scrub-gdpr-branding.mjs\``,
    "",
  ];
  return lines.join("\n");
}
