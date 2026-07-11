import type { ScanResult, WizardAnswers } from "@superhumaan/dna-config";

/** Minimal valid ScanResult for unit tests */
export function mockScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    packageManager: "npm",
    ciCd: [],
    docker: false,
    envFiles: [],
    docs: [],
    aiRules: [],
    securityRisks: [],
    missingDocs: [],
    missingTests: false,
    dependencies: [],
    scripts: { test: "vitest run" },
    hasDna: false,
    fileCount: 0,
    hasPackageJson: true,
    hasSourceCode: false,
    ...overrides,
  };
}

/** Wizard answers for non-interactive init tests */
export function mockWizardAnswers(overrides: Partial<WizardAnswers> = {}): WizardAnswers {
  return {
    projectDescription: "Test project",
    acceptRecommendation: true,
    platformFeatures: [],
    aiTools: ["cursor"],
    compliance: "none",
    stage: "mvp",
    installRuntime: false,
    installFeatureFactory: false,
    installCi: false,
    configureGithub: false,
    configureAi: false,
    ...overrides,
  };
}
