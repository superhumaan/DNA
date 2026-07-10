import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import {
  AI_WORKBENCH_PATHS,
  generateAiWorkbenchFiles,
  installAiWorkbench,
  uninstallAiWorkbench,
  isAiWorkbenchEnabled,
} from "./ai-workbench.js";

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
  it("generates prompt-first cursor and claude packages", () => {
    const files = generateAiWorkbenchFiles(testConfig());
    expect(Object.keys(files).length).toBeGreaterThanOrEqual(AI_WORKBENCH_PATHS.length);

    expect(files[".cursor/rules/dna-workbench.mdc"]).toContain("engineering co-pilot");
    expect(files[".cursor/commands/ship-feature.md"]).toContain("feature factory");
    expect(files[".cursor/commands/work-with-dna.md"]).toContain("speak normally");
    expect(files[".cursor/skills/dna-workbench/prompt-patterns.md"]).toContain("Plan-then-act");

    const shipClaude = files[".claude/commands/ship-feature.md"];
    expect(shipClaude).toContain("---");
    expect(shipClaude).not.toContain("npx dna generate feature");
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
