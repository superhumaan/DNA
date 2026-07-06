import type { Recommendation, ScanResult, WizardAnswers } from "@humaan/dna-config";

export function generateRecommendation(
  scan: ScanResult,
  description: string,
): Recommendation {
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

  const stack = {
    frontend: scan.frontend ?? (isSaas ? "react" : "react"),
    backend: scan.backend ?? "express",
    database: scan.database ?? (isSaas ? "postgresql" : "sqlite"),
    platform: isSaas ? "B2B SaaS" : "web app",
    hosting: "vercel-or-railway",
    testing: scan.testFramework ?? "vitest",
  };

  return {
    solution,
    stack,
    testing: [
      "Unit tests with Vitest",
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
    runtime: [
      "Install @humaan/dna-runtime",
      "Enable Express middleware",
      "Configure GitHub issue creation",
      "Set up Immune System classification",
    ],
    aiDevelopment: [
      "Run dna context cursor for AI-ready context",
      "Configure Behaviour files for AI tools",
      "Enable CellularMemory for project learning",
    ],
  };
}

export function formatRecommendation(rec: Recommendation): string {
  const lines: string[] = [
    "DNA Recommendation",
    "==================",
    "",
    "Suggested solution:",
    ...rec.solution.map((s) => `  • ${s}`),
    "",
    "Suggested stack:",
    `  Frontend:  ${rec.stack.frontend ?? "—"}`,
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
  return {
    frontend: answers.customStack?.frontend ?? scan.frontend,
    backend: answers.customStack?.backend ?? scan.backend,
    database: answers.customStack?.database ?? scan.database,
    platform: answers.customStack?.platform ?? recommendation.stack.platform,
    hosting: answers.customStack?.hosting ?? recommendation.stack.hosting,
    testing: answers.customStack?.testing ?? scan.testFramework ?? "vitest",
  };
}
