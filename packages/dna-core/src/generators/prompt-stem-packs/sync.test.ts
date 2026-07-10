import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists } from "../../fs.js";
import { syncPromptStemPacks } from "./sync.js";
import { getBundledIntelligenceCatalog } from "./remote.js";

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

describe("syncPromptStemPacks", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => getBundledIntelligenceCatalog(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("installs stems to .DNA/stems/ and records sync metadata", async () => {
    const root = join(tmpdir(), `dna-stem-sync-${randomUUID()}`);
    await mkdir(join(root, ".DNA"), { recursive: true });
    await writeFile(join(root, ".DNA", "config.dna.json"), "{}");

    const config = testConfig();
    const result = await syncPromptStemPacks(root, config);

    expect(result.stemCount).toBeGreaterThanOrEqual(40);
    expect(result.source).toBe("remote");
    expect(await fileExists(join(root, ".DNA/stems/analyze-project/prompt.md"))).toBe(true);
    expect(await fileExists(join(root, ".cursor/commands/analyze-project.md"))).toBe(true);

    const index = JSON.parse(await readFile(join(root, ".DNA/stems/index.json"), "utf-8")) as {
      source: string;
      catalogVersion: number;
    };
    expect(index.source).toBe("remote");
    expect(index.catalogVersion).toBeGreaterThanOrEqual(4);

    const saved = JSON.parse(await readFile(join(root, ".DNA", "config.dna.json"), "utf-8")) as {
      aiWorkbench?: { stemSource?: string; lastSyncAt?: string };
    };
    expect(saved.aiWorkbench?.stemSource).toBe("remote");
    expect(saved.aiWorkbench?.lastSyncAt).toBeTruthy();
  });

  it("falls back to bundled catalog when remote fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );

    const root = join(tmpdir(), `dna-stem-bundled-${randomUUID()}`);
    await mkdir(join(root, ".DNA"), { recursive: true });
    await writeFile(join(root, ".DNA", "config.dna.json"), "{}");

    const result = await syncPromptStemPacks(root, testConfig());
    expect(result.source).toBe("bundled");
    expect(result.stemCount).toBeGreaterThanOrEqual(40);
  });
});
