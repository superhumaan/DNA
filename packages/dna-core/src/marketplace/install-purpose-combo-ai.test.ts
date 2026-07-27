import { describe, expect, it } from "vitest";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeJsonFile } from "../fs.js";
import type { DnaConfig } from "@superhumaan/dna-config";
import { installPurposeComboAiContext } from "./install-purpose-combo-ai.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "test",
    projectName: "Test App",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: ["cursor", "claude_code"],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

describe("installPurposeComboAiContext", () => {
  it("returns null for non-combo ids", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-bundle-"));
    expect(await installPurposeComboAiContext(root, "frameworks/nextjs")).toBeNull();
  });

  it("injects stems and always-on bundle rule when DNA is configured", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-bundle-"));
    await writeJsonFile(join(root, ".DNA", "config.dna.json"), testConfig());

    const result = await installPurposeComboAiContext(root, "combo/pmf-check");
    expect(result).not.toBeNull();
    expect(result!.stems).toContain("pmf-check");
    expect(result!.stems).toContain("work-with-dna");
    expect(result!.rulePaths.some((p) => p.includes("dna-bundle-pmf-check"))).toBe(true);

    const rule = await readFile(join(root, ".cursor/rules/dna-bundle-pmf-check.mdc"), "utf8");
    expect(rule).toContain("alwaysApply: true");
    expect(rule).toContain("combo/pmf-check");

    const stem = await readFile(join(root, ".DNA/stems/pmf-check/prompt.md"), "utf8");
    expect(stem.length).toBeGreaterThan(20);
  });
});
