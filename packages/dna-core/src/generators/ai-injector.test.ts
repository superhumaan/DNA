import { describe, it, expect, afterEach } from "vitest";
import { join } from "node:path";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import {
  getRequiredInjectionPaths,
  syncAiInjection,
  verifyAiInjection,
  formatAiInjectionReport,
} from "./ai-injector.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "injector-test",
    projectName: "Injector Test",
    description: "Test",
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
    featureFactory: { enabled: true },
    aiWorkbench: { enabled: true },
  };
}

async function scaffoldRoot(): Promise<string> {
  const root = join(tmpdir(), `dna-injector-${randomUUID()}`);
  await mkdir(join(root, ".DNA"), { recursive: true });
  await writeFile(join(root, ".DNA", "config.dna.json"), JSON.stringify(testConfig()));
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "injector-test" }));
  return root;
}

describe("ai-injector", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("lists required injection paths for cursor + claude", () => {
    const paths = getRequiredInjectionPaths(testConfig());
    expect(paths).toContain(".DNA/behaviour/reasoning.behaviour.md");
    expect(paths).toContain("AGENTS.md");
    expect(paths).toContain(".cursor/rules/dna-workbench.mdc");
    expect(paths).toContain(".cursor/rules/product-process.mdc");
    expect(paths).toContain("CLAUDE.md");
  });

  it("syncs and verifies full injection", async () => {
    root = await scaffoldRoot();
    const config = testConfig();

    const before = await verifyAiInjection(root, config);
    expect(before.complete).toBe(false);
    expect(before.missing.length).toBeGreaterThan(0);

    const result = await syncAiInjection(root, config, { preferRemoteStems: false });
    expect(result.written.length).toBeGreaterThan(10);
    expect(result.written).toContain(".DNA/behaviour/reasoning.behaviour.md");
    expect(result.report.complete).toBe(true);
    expect(formatAiInjectionReport(result.report)).toContain("always-on");
  });

  it("detects stale rules missing always-on markers", async () => {
    root = await scaffoldRoot();
    const config = testConfig();

    await mkdir(join(root, ".cursor", "rules"), { recursive: true });
    await writeFile(
      join(root, ".cursor/rules/dna-workbench.mdc"),
      `---
description: old
alwaysApply: true
---

# Old workbench
`,
    );

    const report = await verifyAiInjection(root, config);
    expect(report.stale).toContain(".cursor/rules/dna-workbench.mdc");

    const fixed = await syncAiInjection(root, config, { preferRemoteStems: false });
    expect(fixed.report.complete).toBe(true);
  });

  it("force re-injection restores wiped always-on rules and re-enables workbench", async () => {
    root = await scaffoldRoot();
    const config = testConfig();
    config.aiWorkbench = { enabled: false };
    config.aiTools = ["cursor"];

    await syncAiInjection(root, config, { preferRemoteStems: false, workbench: false });

    await writeFile(
      join(root, ".cursor/rules/dna.mdc"),
      `---
description: wiped
---

# empty
`,
    );

    const before = await verifyAiInjection(root, config);
    expect(before.complete).toBe(false);

    const forced = await syncAiInjection(root, config, {
      force: true,
      preferRemoteStems: false,
    });
    expect(forced.report.complete).toBe(true);
    expect(forced.written).toContain(".cursor/rules/dna.mdc");
    expect(forced.written).toContain(".cursor/rules/dna-workbench.mdc");
    expect(forced.written).toContain("AGENTS.md");

    const agents = await readFile(join(root, "AGENTS.md"), "utf-8");
    expect(agents).toContain("DNA is always on");
    expect(agents).toContain("load `.DNA/` context");

    const persisted = JSON.parse(
      await readFile(join(root, ".DNA", "config.dna.json"), "utf-8"),
    ) as { aiWorkbench?: { enabled?: boolean }; aiTools?: string[] };
    expect(persisted.aiWorkbench?.enabled).toBe(true);
    expect(persisted.aiTools).toContain("claude_code");
  });
});
