import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import {
  isAdminPortalRequest,
  appendAdminPortalRequirements,
} from "../admin-portal/pattern.js";
import {
  generateFeatureFactoryFiles,
  installFeatureFactory,
  uninstallFeatureFactory,
  FEATURE_FACTORY_PATHS,
  buildFeatureRequestFromQuote,
} from "./feature-factory.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "test-project",
    projectName: "Test Project",
    description: "Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: ["cursor"],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

describe("feature factory", () => {
  it("generates cursor rules and ai templates", () => {
    const files = generateFeatureFactoryFiles(testConfig());

    expect(files[".cursor/rules/product-process.mdc"]).toContain("Product Analyst");
    expect(files[".cursor/rules/architecture.mdc"]).toContain("Solution Architect");
    expect(files[".cursor/rules/backend.mdc"]).toContain("Backend Engineer");
    expect(files[".cursor/rules/frontend.mdc"]).toContain("Frontend Engineer");
    expect(files[".cursor/rules/ux.mdc"]).toContain("UX Reviewer");
    expect(files[".cursor/rules/qa.mdc"]).toContain("QA Engineer");
    expect(files[".cursor/rules/code-quality.mdc"]).toContain("Code Quality Analyst");
    expect(files[".cursor/rules/admin-portal.mdc"]).toContain("new tab");
    expect(files["ai/feature-request.md"]).toContain("Latest request");
    expect(files["ai/agent-loop.md"]).toContain("Code Quality Analyst");
    expect(files["ai/agent-loop.md"]).toContain("Final Release Reviewer");
  });

  it("builds feature request from quote", () => {
    const md = buildFeatureRequestFromQuote(
      "Enable providers to record phone calls",
      testConfig(),
    );
    expect(md).toContain("Enable providers to record phone calls");
  });

  it("appends admin requirements when quote mentions admin", () => {
    const md = appendAdminPortalRequirements(
      buildFeatureRequestFromQuote("Build admin portal", testConfig()),
    );
    expect(isAdminPortalRequest("Build admin portal")).toBe(true);
    expect(md).toContain("/admin");
    expect(md).toContain("requireAdmin");
  });

  it("installs files to project root", async () => {
    const root = join(tmpdir(), `dna-ff-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "test" }));

    const installed = await installFeatureFactory(root, testConfig());

    expect(installed.length).toBeGreaterThanOrEqual(FEATURE_FACTORY_PATHS.length);
    expect(await fileExists(join(root, "ai/feature-request.md"))).toBe(true);
    expect(await fileExists(join(root, ".cursor/rules/qa.mdc"))).toBe(true);
    expect(await fileExists(join(root, ".cursor/rules/code-quality.mdc"))).toBe(true);
    expect(await fileExists(join(root, ".DNA/workflows/feature-factory.workflow.md"))).toBe(
      true,
    );
    expect(await fileExists(join(root, ".DNA/workflows/feature-quality.workflow.md"))).toBe(
      true,
    );
  });

  it("preserves an active feature request during refresh", async () => {
    const root = join(tmpdir(), `dna-ff-preserve-${randomUUID()}`);
    await mkdir(join(root, "ai"), { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "test" }));
    const active = "# Feature Request\n\n> Keep this active brief.\n";
    await writeFile(join(root, "ai", "feature-request.md"), active);

    await installFeatureFactory(root, testConfig());

    expect(await readFile(join(root, "ai", "feature-request.md"), "utf-8")).toBe(active);
  });

  it("uninstalls feature factory files", async () => {
    const root = join(tmpdir(), `dna-ff-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    const config = testConfig();
    await installFeatureFactory(root, config);

    const removed = await uninstallFeatureFactory(root, config);

    expect(removed.length).toBeGreaterThan(0);
    expect(await fileExists(join(root, "ai/feature-request.md"))).toBe(false);
    expect(await fileExists(join(root, ".cursor/rules/product-process.mdc"))).toBe(false);
    expect(await fileExists(join(root, ".DNA/workflows/feature-factory.workflow.md"))).toBe(false);
  });
});
