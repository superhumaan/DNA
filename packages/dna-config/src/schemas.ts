import { z } from "zod";
import {
  AI_PROVIDERS,
  AI_TOOLS,
  COMPLIANCE_OPTIONS,
  ISSUE_CATEGORIES,
  PROJECT_STAGES,
  SEVERITY_LEVELS,
} from "./constants.js";

export const DnaConfigSchema = z.object({
  version: z.string().default("0.1.0"),
  projectId: z.string(),
  projectName: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  stack: z.object({
    archetype: z.string().optional(),
    frontend: z.string().optional(),
    bundler: z.string().optional(),
    backend: z.string().optional(),
    database: z.string().optional(),
    platform: z.string().optional(),
    hosting: z.string().optional(),
    testing: z.string().optional(),
    packageManager: z.string().optional(),
  }),
  compliance: z.enum(COMPLIANCE_OPTIONS).default("none"),
  stage: z.enum(PROJECT_STAGES).default("new"),
  aiTools: z.array(z.enum(AI_TOOLS)).default([]),
  autoUpdate: z.boolean().default(true),
  channel: z.enum(["stable", "beta", "nightly"]).default("stable"),
  knowledgePacks: z.array(z.string()).default([]),
  github: z
    .object({
      enabled: z.boolean().default(true),
      owner: z.string().optional(),
      repo: z.string().optional(),
      /** Set after web-flow login — never stores the token */
      authenticated: z.boolean().optional(),
    })
    .optional(),
  ai: z
    .object({
      enabled: z.boolean().default(true),
      provider: z.enum(AI_PROVIDERS).default("mock"),
      model: z.string().optional(),
      endpoint: z.string().optional(),
      repair: z
        .object({
          enabled: z.boolean().default(true),
          autoPr: z.boolean().default(true),
          requireReview: z.boolean().default(true),
        })
        .optional(),
    })
    .optional(),
  runtime: z
    .object({
      enabled: z.boolean().default(true),
      environment: z.string().optional(),
      storage: z.enum(["sqlite", "jsonl"]).default("sqlite"),
      watchBackend: z.boolean().default(true),
      watchFrontend: z.boolean().default(true),
    })
    .optional(),
  ci: z
    .object({
      enabled: z.boolean().default(true),
      /** When false (default), DNA CI workflows report issues without failing the run — safe for public repos. */
      strict: z.boolean().default(false),
      coverageThreshold: z.number().min(0).max(100).default(80),
      perFileCoverage: z.boolean().default(true),
      owasp: z.boolean().default(true),
      pushToPreview: z.boolean().default(true),
    })
    .optional(),
  featureFactory: z
    .object({
      enabled: z.boolean().default(true),
    })
    .optional(),
  platformFeatures: z.array(z.string()).default([]),
});

export type DnaConfig = z.infer<typeof DnaConfigSchema>;

export const WizardAnswersSchema = z.object({
  projectName: z.string().optional(),
  projectDescription: z.string(),
  appPlatform: z.enum(["web", "mobile", "desktop", "cms"]).optional(),
  platformFeatures: z.array(z.string()).default([]),
  acceptRecommendation: z.boolean(),
  customStack: z
    .object({
      frontend: z.string().optional(),
      backend: z.string().optional(),
      database: z.string().optional(),
      platform: z.string().optional(),
      hosting: z.string().optional(),
      testing: z.string().optional(),
    })
    .optional(),
  aiTools: z.array(z.enum(AI_TOOLS)),
  compliance: z.enum(COMPLIANCE_OPTIONS),
  stage: z.enum(PROJECT_STAGES),
  installRuntime: z.boolean().default(true),
  installFeatureFactory: z.boolean().default(true),
  installCi: z.boolean().default(true),
  configureGithub: z.boolean().default(true),
  configureAi: z.boolean().default(true),
});

export type WizardAnswers = z.infer<typeof WizardAnswersSchema>;

export const ScanResultSchema = z.object({
  packageManager: z.string().optional(),
  frontend: z.string().optional(),
  backend: z.string().optional(),
  database: z.string().optional(),
  testFramework: z.string().optional(),
  ciCd: z.array(z.string()),
  docker: z.boolean(),
  envFiles: z.array(z.string()),
  docs: z.array(z.string()),
  aiRules: z.array(z.string()),
  securityRisks: z.array(z.string()),
  missingDocs: z.array(z.string()),
  missingTests: z.boolean(),
  dependencies: z.array(z.string()),
  scripts: z.record(z.string()),
  hasDna: z.boolean(),
});

export type ScanResult = z.infer<typeof ScanResultSchema>;

export const RecommendationSchema = z.object({
  solution: z.array(z.string()),
  stack: z.object({
    archetype: z.string().optional(),
    frontend: z.string().optional(),
    bundler: z.string().optional(),
    backend: z.string().optional(),
    database: z.string().optional(),
    platform: z.string().optional(),
    hosting: z.string().optional(),
    testing: z.string().optional(),
  }),
  testing: z.array(z.string()),
  security: z.array(z.string()),
  documentation: z.array(z.string()),
  runtime: z.array(z.string()),
  aiDevelopment: z.array(z.string()),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

export const NeuralNetworkIntentSchema = z.object({
  intent: z.string(),
  description: z.string(),
  requiredKnowledge: z.array(z.string()),
  requiredBehaviour: z.array(z.string()),
  cellularMemory: z.array(z.string()),
  impressions: z.array(z.string()),
  validationChecks: z.array(z.string()),
});

export type NeuralNetworkIntent = z.infer<typeof NeuralNetworkIntentSchema>;

export const NeuralNetworkSchema = z.object({
  version: z.string(),
  intents: z.record(z.string(), NeuralNetworkIntentSchema),
});

export type NeuralNetwork = z.infer<typeof NeuralNetworkSchema>;

export const RuntimeEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum([
    "uncaught_exception",
    "unhandled_rejection",
    "request_error",
    "slow_request",
    "repeated_error",
    "memory_spike",
  ]),
  message: z.string(),
  stack: z.string().optional(),
  endpoint: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().optional(),
  durationMs: z.number().optional(),
  environment: z.string().optional(),
  release: z.string().optional(),
});

export type RuntimeEvent = z.infer<typeof RuntimeEventSchema>;

export const ClassifiedIssueSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  severity: z.enum(SEVERITY_LEVELS),
  category: z.enum(ISSUE_CATEGORIES),
  discipline: z.string(),
  behaviourViolation: z.boolean(),
  repeated: z.boolean(),
  projectRisk: z.string(),
  confidence: z.number().min(0).max(1),
  title: z.string(),
  summary: z.string(),
  suspectedCause: z.string().optional(),
  relevantBehaviour: z.array(z.string()),
  relevantMemory: z.array(z.string()),
  suggestedFix: z.string().optional(),
  testRecommendation: z.string().optional(),
  reproductionNotes: z.string().optional(),
  endpoint: z.string().optional(),
  stackTraceSummary: z.string().optional(),
});

export type ClassifiedIssue = z.infer<typeof ClassifiedIssueSchema>;

export const GitHubIssuePayloadSchema = z.object({
  title: z.string(),
  body: z.string(),
  labels: z.array(z.string()),
});

export type GitHubIssuePayload = z.infer<typeof GitHubIssuePayloadSchema>;

export const AiRepairPlanSchema = z.object({
  diagnosis: z.string(),
  confidence: z.number().min(0).max(1),
  proposedChanges: z.array(
    z.object({
      file: z.string(),
      description: z.string(),
      patch: z.string().optional(),
    }),
  ),
  branchName: z.string(),
  prTitle: z.string(),
  prBody: z.string(),
  testPlan: z.string(),
});

export type AiRepairPlan = z.infer<typeof AiRepairPlanSchema>;

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(
    z.object({
      code: z.string(),
      message: z.string(),
      severity: z.enum(["error", "warning", "info"]),
    }),
  ),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

export const KnowledgePackFileSchema = z.object({
  path: z.string(),
  url: z.string().optional(),
  content: z.string().optional(),
});

export const KnowledgePackSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  category: z.enum(["languages", "frameworks", "platforms", "disciplines", "compliance"]),
  channel: z.enum(["stable", "beta", "nightly"]).default("stable"),
  tags: z.array(z.string()).default([]),
  files: z.array(KnowledgePackFileSchema),
  minDnaVersion: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type KnowledgePack = z.infer<typeof KnowledgePackSchema>;

export const MarketplaceCatalogSchema = z.object({
  version: z.string(),
  channel: z.enum(["stable", "beta", "nightly"]),
  updatedAt: z.string(),
  source: z.enum(["remote", "bundled"]).optional(),
  marketplaceUrl: z.string().optional(),
  packs: z.array(KnowledgePackSchema),
});

export type MarketplaceCatalog = z.infer<typeof MarketplaceCatalogSchema>;

export const MarketplaceUpdateResultSchema = z.object({
  cliVersion: z.string(),
  channel: z.string(),
  catalogSource: z.enum(["remote", "bundled"]),
  installed: z.array(z.string()),
  updatesAvailable: z.array(
    z.object({
      id: z.string(),
      installedVersion: z.string().optional(),
      latestVersion: z.string(),
    }),
  ),
  newPacks: z.array(z.string()),
});

export type MarketplaceUpdateResult = z.infer<typeof MarketplaceUpdateResultSchema>;
