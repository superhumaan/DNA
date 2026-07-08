export const DNA_DIR = ".DNA";
export const DNA_DOCS_DIR = "DNA";
export const IMPRESSIONS_DIR = "DNA/Impressions";
export const DNA_CONFIG_FILE = ".DNA/config.dna.json";
export const NEURAL_NETWORK_FILE = ".DNA/neuralNetwork.json";
export const NEURAL_NETWORK_ALT = ".DNA/neuralNetwork";

export const PRODUCT_NAME = "DNA by Humaan";
export const COMPANY_NAME = "Humaan by Superlite";

export const BEHAVIOUR_FILES = [
  "ai.behaviour.md",
  "coding.behaviour.md",
  "testing.behaviour.md",
  "documentation.behaviour.md",
  "security.behaviour.md",
  "runtime.behaviour.md",
] as const;

export const CELLULAR_MEMORY_REGIONS = [
  "hippocampus",
  "prefrontalCortex",
  "amygdala",
  "cerebellum",
  "temporalLobe",
  "parietalLobe",
  "occipitalLobe",
] as const;

export const IMPRESSIONS_PATHS = [
  "product/product-overview.md",
  "product/user-types.md",
  "product/feature-map.md",
  "architecture/solution-architecture.md",
  "architecture/system-boundaries.md",
  "architecture/data-flow.md",
  "architecture/integration-map.md",
  "security/security-baseline.md",
  "security/threat-model.md",
  "security/data-protection.md",
  "qa/qa-strategy.md",
  "qa/test-plan.md",
  "qa/regression-risks.md",
  "devops/deployment-model.md",
  "devops/environments.md",
  "devops/rollback-plan.md",
  "compliance/compliance-overview.md",
  "srs/software-requirements-specification.md",
  "release-notes/initial-release-notes.md",
  "user-guides/getting-started.md",
] as const;

export const ISSUE_CATEGORIES = [
  "runtime_error",
  "security_risk",
  "performance",
  "dependency",
  "architecture_violation",
  "testing_gap",
  "documentation_gap",
  "ai_bad_behaviour",
  "deployment",
  "database",
  "auth",
  "multi_tenancy",
  "unknown",
] as const;

export const SEVERITY_LEVELS = ["low", "medium", "high", "critical"] as const;

export const AI_PROVIDERS = ["openai", "anthropic", "mock"] as const;

export const COMPLIANCE_OPTIONS = [
  "none",
  "gdpr",
  "uk_gdpr",
  "hipaa",
  "soc2",
  "iso27001",
  "pci_dss",
  "pdpa_thailand",
  "custom",
] as const;

export const PROJECT_STAGES = [
  "new",
  "mvp",
  "scaling",
  "enterprise",
  "legacy_modernisation",
  "audit_remediation",
] as const;

/** Organization size band for compliance maturity — maps to control depth */
export const ORG_TIERS = ["startup", "sme", "corporate", "enterprise"] as const;

/** Default org tier inferred from project stage when not specified */
export const STAGE_TO_ORG_TIER: Record<(typeof PROJECT_STAGES)[number], (typeof ORG_TIERS)[number]> = {
  new: "startup",
  mvp: "startup",
  scaling: "sme",
  enterprise: "enterprise",
  legacy_modernisation: "corporate",
  audit_remediation: "corporate",
};

export const COMPLIANCE_FRAMEWORKS = ["gdpr", "uk_gdpr", "hipaa", "soc2", "iso27001", "pci_dss"] as const;

export const AI_TOOLS = [
  "cursor",
  "claude_code",
  "chatgpt",
  "github_copilot",
  "windsurf",
  "gemini",
  "multiple",
  "none",
] as const;

export const MARKETPLACE_BASE_URL =
  process.env.DNA_MARKETPLACE_URL ?? "https://dna.humaan.app/marketplace";

/** Parent directory containing DNA reference repos (AIStudio, ColorParty, Humaan, Soli). */
export const DNA_REFERENCE_ROOT_ENV = "DNA_REFERENCE_ROOT";

/** Local path to source GDPR .docx pack for `pnpm gdpr:ingest` (optional). */
export const DNA_GDPR_SOURCE_DOCS_ENV = "DNA_GDPR_SOURCE_DOCS";

export const MARKETPLACE_API_VERSION = "v1";
