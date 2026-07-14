export const DNA_DIR = ".DNA";
export const DNA_DOCS_DIR = "DNA";
export const IMPRESSIONS_DIR = "DNA/Impressions";
export const DNA_CONFIG_FILE = ".DNA/config.dna.json";
export const DNA_DATA_DIR = ".DNA/data";
export const DNA_RUNTIME_DB = ".DNA/data/runtime.db";
export const DNA_LAB_DIR = ".DNA/lab";
export const DNA_LAB_STORE = ".DNA/data/lab-store.json";
export const DNA_LAB_PAIRING_FILE = ".DNA/lab/pairing.json";
export const DNA_LAB_DEFAULT_PATH = "/labs";
export const DNA_LAB_API_PREFIX = "/api/dna/labs";
export const DNA_LAB_PAIRING_CODE_LENGTH = 148;
/** Paths auth gateways (Connect, oauth2-proxy) must allow unauthenticated so CLI can register pairings. */
export const DNA_LAB_GATEWAY_PUBLIC_PATHS = [
  "POST /api/dna/labs/pairing/init",
  "GET /api/dna/labs/pairing/status/*",
] as const;
export const DNA_LAB_GATEWAY_ALLOWLIST_FILE = ".DNA/lab/gateway-public-paths.md";
export const DNA_FEEDBACK_QUEUE = ".DNA/data/feedback-queue.jsonl";

/** Upstream DNA monorepo for community feedback issues */
export const DNA_UPSTREAM_REPO = { owner: "superhumaan", repo: "DNA" } as const;

export const FEEDBACK_BASE_URL =
  process.env.DNA_FEEDBACK_URL ?? "https://dna.humaan.app/api/v1/feedback";

export const FEEDBACK_AUTO_MODES = ["off", "dna-only", "all"] as const;
export const DNA_GITIGNORE_ENTRIES = [
  ".DNA/data/",
  ".DNA/runtime/*.jsonl",
  ".DNA/data/feedback-queue.jsonl",
  ".DNA/data/lab-store.json",
  ".DNA/lab/pairing.json",
  ".DNA/reports/",
  ".DNA/credentials/",
] as const;
export const NEURAL_NETWORK_FILE = ".DNA/neuralNetwork.json";
export const NEURAL_NETWORK_ALT = ".DNA/neuralNetwork";

export const PRODUCT_NAME = "DNA by Humaan";
export const COMPANY_NAME = "Humaan by Superlite";
/** Published npm package for the DNA CLI (`dna` / `npx dna`). */
export const DNA_CLI_PACKAGE = "@superhumaan/dna-by-humaan";

export const BEHAVIOUR_FILES = [
  "reasoning.behaviour.md",
  "ai.behaviour.md",
  "coding.behaviour.md",
  "testing.behaviour.md",
  "documentation.behaviour.md",
  "delivery.behaviour.md",
  "discovery.behaviour.md",
  "security.behaviour.md",
  "runtime.behaviour.md",
] as const;

/** Delivery methodology — how the org plans, documents, and tickets work */
export const DELIVERY_METHODOLOGIES = [
  "dna-default",
  "scrum",
  "kanban",
  "less",
  "safe",
  "spotify-model",
  "shape-up",
] as const;

/** Company operating patterns — shapes doc and ticket conventions */
export const COMPANY_ARCHETYPES = [
  "none",
  "travel-scale-up",
  "big-tech",
  "research-lab",
  "agency",
  "startup",
] as const;

export const TICKET_SYSTEMS = ["none", "github", "jira", "linear", "azure-devops"] as const;

export const DOC_SYSTEMS = [
  "impressions",
  "confluence",
  "notion",
  "google-docs",
  "github-wiki",
] as const;

export const WORK_HIERARCHY_LEVELS = [
  "initiative",
  "theme",
  "bet",
  "pitch",
  "epic",
  "feature",
  "scope",
  "story",
  "task",
  "subtask",
  "bug",
  "spike",
] as const;

export const DEFAULT_DELIVERY_PROFILE = {
  methodology: "dna-default",
  companyArchetype: "none",
  ticketSystem: "github",
  docSystem: "impressions",
  hierarchy: ["feature", "story", "task"],
  ceremonies: [],
  customProfile: ".DNA/delivery/profile.md",
} as const;

/** Product lifecycle stage — upstream of engineering delivery */
export const DISCOVERY_LIFECYCLE_STAGES = [
  "ideation",
  "problem-validation",
  "solution-validation",
  "pmf",
  "growth",
  "scale",
] as const;

/** How product discovery is organised */
export const DISCOVERY_TEAM_MODELS = [
  "none",
  "innovation-lab",
  "discovery-squad",
  "embedded-triad",
  "dual-track",
  "design-ops",
] as const;

export const DISCOVERY_PROCESSES = [
  "continuous-discovery",
  "double-diamond",
  "lean-startup",
  "design-thinking",
  "jtbd-framework",
  "value-proposition-canvas",
  "lean-ux",
  "outcome-driven-innovation",
] as const;

export const DISCOVERY_METHODS = [
  "user-interviews",
  "contextual-inquiry",
  "usability-testing",
  "surveys",
  "card-sorting",
  "tree-testing",
  "diary-studies",
  "prototype-testing",
  "concept-testing",
  "jobs-to-be-done",
  "ethnography",
  "analytics-review",
  "competitive-analysis",
  "pricing-research",
  "a-b-testing",
  "heatmap-session-replay",
] as const;

export const DISCOVERY_EVENTS = [
  "design-sprint",
  "discovery-sprint",
  "kickoff-workshop",
  "story-mapping",
  "assumption-mapping",
  "opportunity-mapping",
  "synthesis-session",
  "prioritization-workshop",
  "pivot-review",
  "research-readout",
] as const;

/** Installed on every dna init / doctor */
export const DISCOVERY_FOUNDATION_PACK_IDS = [
  "discovery/overview",
  "discovery/continuous-discovery",
  "discovery/opportunity-solution-tree",
  "discovery/product-market-fit",
  "discovery/ux-research-foundations",
  "discovery/handoff-to-delivery",
] as const;

export const DEFAULT_DISCOVERY_PROFILE = {
  lifecycleStage: "ideation",
  teamModel: "none",
  activeProcesses: ["continuous-discovery"],
  activeMethods: [] as string[],
  activeEvents: [] as string[],
  customProfile: ".DNA/discovery/profile.md",
} as const;

/** Industry sectors for agency and vertical product teams */
export const INDUSTRY_SECTORS = [
  "healthcare",
  "fintech",
  "ecommerce-retail",
  "edtech",
  "gov-public-sector",
  "travel-hospitality",
  "saas-b2b",
  "logistics-supply-chain",
  "media-entertainment",
  "real-estate-proptech",
  "energy-utilities",
  "legal-tech",
] as const;

export const DEFAULT_INDUSTRY_PROFILE = {
  active: undefined,
  secondary: [] as string[],
  clientName: undefined,
} as const;

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

/** Public intelligence / prompt stem catalog (DNA-Web). */
export const INTELLIGENCE_BASE_URL =
  process.env.DNA_INTELLIGENCE_URL ?? "https://dna.humaan.app/intelligence";

export function intelligenceCatalogUrl(): string {
  return `${INTELLIGENCE_BASE_URL.replace(/\/$/, "")}/api/v1/catalog`;
}
