import { describe, expect, it } from "vitest";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { installPromptStemPackIds } from "../generators/prompt-stem-packs/index.js";
import type { DnaConfig } from "@superhumaan/dna-config";

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

describe("installPromptStemPackIds", () => {
  it("writes selected stems and skips unknown ids", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-stems-"));
    const result = await installPromptStemPackIds(root, testConfig(), [
      "work-with-dna",
      "not-a-real-stem",
      "marketplace-install",
    ]);
    expect(result.installed).toEqual(["work-with-dna", "marketplace-install"]);
    expect(result.skipped).toEqual(["not-a-real-stem"]);
    const prompt = await readFile(join(root, ".DNA/stems/work-with-dna/prompt.md"), "utf8");
    expect(prompt.length).toBeGreaterThan(20);
  });
});
