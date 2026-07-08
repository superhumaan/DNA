import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import {
  generateCiWorkflow,
  generateDeleteFailedRunJob,
  generatePreviewWorkflow,
  generateSecurityWorkflow,
  installCiPipeline,
  generateVitestCoverageConfig,
} from "./ci.js";
import { fileExists } from "../fs.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "ci-test",
    projectName: "CI Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: { testing: "vitest" },
    compliance: "none",
    stage: "new",
    aiTools: [],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

describe("CI generator", () => {
  it("generates strict workflow when ci.strict is enabled", () => {
    const yaml = generateCiWorkflow(
      { ...testConfig(), ci: { strict: true, enabled: true, perFileCoverage: true, owasp: true, pushToPreview: true, previewProvider: "vercel", coverageThreshold: 80 } },
      {
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
      },
    );

    expect(yaml).toContain("strict (fail on gate violations)");
    expect(yaml).toContain("continue-on-error: false");
    expect(yaml).toContain("quality report --fail");
  });

  it("generates workflow with lint, test, coverage, and audit", () => {
    const yaml = generateCiWorkflow(testConfig(), {
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
      scripts: { test: "vitest run", lint: "eslint .", "test:coverage": "vitest run --coverage" },
      hasDna: false,
    });

    expect(yaml).toContain("name: DNA CI");
    expect(yaml).toContain("advisory");
    expect(yaml).toContain("continue-on-error: true");
    expect(yaml).toContain("npm run lint");
    expect(yaml).toContain("npm run test");
    expect(yaml).toContain("test:coverage");
    expect(yaml).toContain("npm audit --audit-level=high");
    expect(yaml).toContain("quality report");
  });

  it("generates OWASP ZAP security workflow", () => {
    const yaml = generateSecurityWorkflow();
    expect(yaml).toContain("zaproxy/action-baseline");
    expect(yaml).toContain("STAGING_URL");
  });

  it("generates delete-failed-run cleanup job", () => {
    const job = generateDeleteFailedRunJob("build");
    expect(job).toContain("cleanup-on-failure");
    expect(job).toContain("deleteWorkflowRun");
    expect(job).toContain("needs: [build]");
    expect(job).toContain("actions: write");
  });

  it("includes cleanup job in CI workflow", () => {
    const yaml = generateCiWorkflow(testConfig(), {
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
    });

    expect(yaml).toContain("cleanup-on-failure");
    expect(yaml).toContain("deleteWorkflowRun");
  });

  it("generates preview workflow with branch and netlify provider", () => {
    const yaml = generatePreviewWorkflow(
      {
        ...testConfig(),
        ci: {
          enabled: true,
          strict: false,
          perFileCoverage: true,
          owasp: true,
          pushToPreview: true,
          previewProvider: "netlify",
          previewBranch: "main",
          coverageThreshold: 80,
        },
      },
      {
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
      },
    );

    expect(yaml).toContain('branches: ["main"]');
    expect(yaml).toContain("netlify-cli deploy");
    expect(yaml).toContain("NETLIFY_AUTH_TOKEN");
    expect(yaml).toContain("cleanup-on-failure");
  });

  it("generates vitest coverage config with thresholds", () => {
    const config = generateVitestCoverageConfig();
    expect(config).toContain("thresholds");
    expect(config).toContain("lines: 80");
  });

  it("installs CI files on init", async () => {
    const root = join(tmpdir(), `dna-ci-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await mkdir(join(root, ".git"), { recursive: true });

    const { writeFile } = await import("node:fs/promises");
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "ci-test", scripts: {} }, null, 2),
    );

    const result = await installCiPipeline({ root, config: testConfig() });

    expect(result.created).toContain(".github/workflows/dna-ci.yml");
    expect(result.created).toContain(".github/workflows/dna-security.yml");
    expect(await fileExists(join(root, "vitest.config.ts"))).toBe(true);

    const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf-8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts.test).toBe("vitest run");
    expect(pkg.scripts["test:coverage"]).toContain("coverage");

    await rm(root, { recursive: true, force: true });
  });

  it("installs DNA CI alongside existing workflows by default", async () => {
    const root = join(tmpdir(), `dna-ci-skip-${randomUUID()}`);
    await mkdir(join(root, ".github", "workflows"), { recursive: true });
    const { writeFile } = await import("node:fs/promises");
    await writeFile(join(root, ".github/workflows/existing.yml"), "name: Existing\n");
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "ci-test", scripts: {} }));

    const result = await installCiPipeline({
      root,
      config: testConfig(),
      scan: {
        packageManager: "npm",
        ciCd: ["github-actions"],
        docker: false,
        envFiles: [],
        docs: [],
        aiRules: [],
        securityRisks: [],
        missingDocs: [],
        missingTests: true,
        dependencies: [],
        scripts: {},
        hasDna: false,
      },
    });

    expect(result.created.some((f) => f.includes("dna-ci.yml"))).toBe(true);

    await rm(root, { recursive: true, force: true });
  });
});
