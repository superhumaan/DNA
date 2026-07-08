import type { Recommendation, ScanResult, WizardAnswers } from "@superhumaan/dna-config";
import { resolveArchetype, stackFromArchetype } from "./stack/resolve.js";
import { getArchetype } from "./stack/catalog.js";

export function generateRecommendation(
  scan: ScanResult,
  description: string,
): Recommendation {
  const resolution = resolveArchetype(scan, description);
  const stack = stackFromArchetype(resolution, scan, description);
  const { archetype } = resolution;

  const isSaas =
    description.toLowerCase().includes("saas") ||
    description.toLowerCase().includes("b2b") ||
    description.toLowerCase().includes("platform");

  const solution = isSaas
    ? [
        "PWA",
        "multi-tenant",
        "multi-region ready",
        "role-based access control",
        "API-first backend",
        "PostgreSQL database",
        "CI/CD ready",
        "automated testing baseline",
        "runtime monitoring baseline",
      ]
    : [
        "web application",
        "API-first backend",
        "automated testing baseline",
        "runtime monitoring baseline",
        "documentation baseline",
      ];

  return {
    solution,
    stack,
    testing: [
      `Unit tests with ${stack.testing ?? "Vitest"}`,
      "Integration tests for API endpoints",
      "E2E tests for critical user flows",
      "Regression test checklist in DNA/Impressions/qa/",
    ],
    security: [
      "Environment variable management with .env.example",
      "Input validation on all API endpoints",
      "Authentication and authorization baseline",
      "Security headers middleware",
      "Dependency vulnerability scanning in CI",
    ],
    documentation: [
      "DNA/Impressions architecture documentation",
      "API documentation",
      "Security baseline documentation",
      "QA strategy and test plan",
      "Deployment and rollback procedures",
    ],
    runtime: archetype.runtimeAdapters?.length
      ? [
          "Install @superhumaan/dna-by-humaan and import from /runtime",
          `Enable ${archetype.runtimeAdapters[0]} adapter`,
          "Configure GitHub issue creation",
          "Set up Immune System classification",
        ]
      : [
          "Install @superhumaan/dna-by-humaan when API server is present",
          "Configure GitHub issue creation",
          "Set up Immune System classification",
        ],
    aiDevelopment: [
      "Describe features in plain language — DNA runs the feature factory automatically",
      "Run dna context cursor for AI-ready context",
      `Stack archetype: ${archetype.id} — do not mix excluded technologies`,
      "Configure Behaviour files for AI tools",
      "Enable CellularMemory for project learning",
    ],
  };
}

export function formatRecommendation(rec: Recommendation): string {
  const arch = rec.stack.archetype ? getArchetype(rec.stack.archetype) : undefined;
  const lines: string[] = [
    "DNA Recommendation",
    "==================",
    "",
    `Stack archetype: ${arch?.name ?? rec.stack.archetype ?? "—"}`,
    arch ? `  ${arch.description}` : "",
    "",
    "Suggested solution:",
    ...rec.solution.map((s) => `  • ${s}`),
    "",
    "Suggested stack:",
    `  Archetype: ${rec.stack.archetype ?? "—"}`,
    `  Frontend:  ${rec.stack.frontend ?? "—"}`,
    `  Bundler:   ${rec.stack.bundler ?? "—"}`,
    `  Backend:   ${rec.stack.backend ?? "—"}`,
    `  Database:  ${rec.stack.database ?? "—"}`,
    `  Platform:  ${rec.stack.platform ?? "—"}`,
    `  Hosting:   ${rec.stack.hosting ?? "—"}`,
    `  Testing:   ${rec.stack.testing ?? "—"}`,
    "",
    "Testing baseline:",
    ...rec.testing.map((t) => `  • ${t}`),
    "",
    "Security baseline:",
    ...rec.security.map((s) => `  • ${s}`),
  ];
  return lines.join("\n");
}

export function resolveStackFromWizard(
  scan: ScanResult,
  answers: WizardAnswers,
  recommendation: Recommendation,
): Recommendation["stack"] {
  if (answers.acceptRecommendation) {
    return recommendation.stack;
  }
  const base = {
    archetype: recommendation.stack.archetype,
    frontend: answers.customStack?.frontend ?? scan.frontend,
    bundler: recommendation.stack.bundler,
    backend: answers.customStack?.backend ?? scan.backend,
    database: answers.customStack?.database ?? scan.database,
    platform: answers.customStack?.platform ?? recommendation.stack.platform,
    hosting: answers.customStack?.hosting ?? recommendation.stack.hosting,
    testing: answers.customStack?.testing ?? scan.testFramework ?? "vitest",
  };
  return base;
}
