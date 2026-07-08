import { describe, it, expect } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { processRuntimeEvent } from "../src/pipeline.js";
import { readRuntimeRecords } from "../src/storage.js";
import type { RuntimeEvent } from "@superhumaan/dna-config";

async function setupProject(): Promise<string> {
  const root = join(tmpdir(), `dna-pipeline-${randomUUID()}`);
  await mkdir(join(root, ".DNA", "runtime"), { recursive: true });
  await mkdir(join(root, ".DNA", "data"), { recursive: true });
  await mkdir(join(root, ".DNA", "immuneSystem"), { recursive: true });
  await mkdir(join(root, ".DNA", "behaviour"), { recursive: true });
  await mkdir(join(root, ".DNA", "CellularMemory", "amygdala"), { recursive: true });

  await writeFile(
    join(root, ".DNA", "config.dna.json"),
    JSON.stringify({
      version: "0.1.0",
      projectId: "test",
      projectName: "test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stack: {},
      compliance: "none",
      stage: "new",
      aiTools: [],
      autoUpdate: true,
      channel: "stable",
      knowledgePacks: [],
      github: { enabled: false },
      runtime: { enabled: true, storage: "sqlite" },
    }),
  );

  await writeFile(join(root, ".DNA", "immuneSystem", "rules.json"), '{"rules":[]}');
  await writeFile(
    join(root, ".DNA", "immuneSystem", "issue-classifier.json"),
    '{"classifiers":[{"pattern":"JWT","category":"auth","discipline":"security"}]}',
  );
  await writeFile(
    join(root, ".DNA", "immuneSystem", "severity-model.json"),
    '{"levels":{"critical":{"autoIssue":true}}}',
  );
  await writeFile(
    join(root, ".DNA", "behaviour", "runtime.behaviour.md"),
    "# Runtime\nAll production errors must be captured.",
  );
  await writeFile(join(root, ".DNA", "CellularMemory", "amygdala", "repeated-failures.md"), "# Failures\n");

  return root;
}

describe("runtime pipeline", () => {
  it("persists events and issues to runtime database", async () => {
    const root = await setupProject();
    const event: RuntimeEvent = {
      id: "e1",
      timestamp: new Date().toISOString(),
      type: "uncaught_exception",
      message: "Test pipeline error",
      stack: "Error: Test\n    at handler (src/index.ts:1:1)",
    };

    const result = await processRuntimeEvent(event, {
      projectRoot: root,
      dnaRoot: join(root, ".DNA"),
    });

    expect(result.issue.severity).toBe("critical");

    const events = await readRuntimeRecords<RuntimeEvent>(root, "events");
    const issues = await readRuntimeRecords(root, "issues");
    expect(events.length).toBe(1);
    expect(issues.length).toBe(1);

    await rm(root, { recursive: true, force: true });
  });
});
