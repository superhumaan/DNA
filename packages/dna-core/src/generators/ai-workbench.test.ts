import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import {
  generateAiWorkbenchFiles,
  installAiWorkbench,
  uninstallAiWorkbench,
  isAiWorkbenchEnabled,
  getAiWorkbenchPaths,
} from "./ai-workbench.js";
import { getPromptStemPacks } from "./prompt-stem-packs/index.js";

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
    aiTools: ["cursor"],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

describe("ai workbench", () => {
  it("generates prompt-first cursor and claude packages with stem packs", () => {
    const files = generateAiWorkbenchFiles(testConfig());
    expect(Object.keys(files).length).toBeGreaterThan(getAiWorkbenchPaths().length / 2);

    expect(files[".cursor/rules/dna-workbench.mdc"]).toContain("engineering co-pilot");
    expect(files[".cursor/commands/ship-feature.md"]).toContain("feature factory");
    expect(files[".DNA/stems/analyze-project/prompt.md"]).toContain("Analyze project");
    expect(files[".DNA/stems/what-next-after-analyze/guidelines.md"]).toContain("MUST");

    const shipClaude = files[".claude/commands/ship-feature.md"];
    expect(shipClaude).toContain("---");
    expect(getPromptStemPacks().length).toBeGreaterThanOrEqual(40);
  });

  it("respects aiWorkbench.enabled=false", () => {
    expect(isAiWorkbenchEnabled({ ...testConfig(), aiWorkbench: { enabled: false } })).toBe(false);
    expect(isAiWorkbenchEnabled(testConfig())).toBe(true);
  });

  it("installs and uninstalls workbench files", async () => {
    const root = join(tmpdir(), `dna-wb-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), "{}");

    const installed = await installAiWorkbench(root, testConfig());
    expect(installed.length).toBeGreaterThan(0);
    expect(await fileExists(join(root, ".cursor/commands/ship-feature.md"))).toBe(true);

    const removed = await uninstallAiWorkbench(root);
    expect(removed.length).toBeGreaterThan(0);
    expect(await fileExists(join(root, ".cursor/rules/dna-workbench.mdc"))).toBe(false);
  });
});
