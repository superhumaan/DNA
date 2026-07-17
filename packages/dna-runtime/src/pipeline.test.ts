import { describe, it, expect, beforeEach } from "vitest";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { processRuntimeEvent } from "../src/pipeline.js";
import { readFingerprintRecords, readRuntimeRecords } from "../src/storage.js";
import { resetSampleStateForTests } from "../src/sample.js";
import type { RuntimeEvent } from "@superhumaan/dna-config";

async function setupProject(): Promise<string> {
  const root = join(tmpdir(), `dna-pipeline-${randomUUID()}`);
  await mkdir(join(root, ".DNA", "runtime"), { recursive: true });
  await mkdir(join(root, ".DNA", "data"), { recursive: true });
  await mkdir(join(root, ".DNA", "immuneSystem"), { recursive: true });
  await mkdir(join(root, ".DNA", "behaviour"), { recursive: true });
  await mkdir(join(root, ".DNA", "CellularMemory", "amygdala"), { recursive: true });
  await mkdir(join(root, ".DNA", "CellularMemory", "temporalLobe"), { recursive: true });

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
      platformFeatures: [],
      github: { enabled: false },
      runtime: { enabled: true, storage: "json" },
      ai: {
        enabled: true,
        provider: "mock",
        repair: { enabled: true, aggressive: true, minRepeatForBlocker: 3 },
      },
    }),
  );

  await writeFile(join(root, ".DNA", "immuneSystem", "rules.json"), '{"rules":[]}');
  await writeFile(
    join(root, ".DNA", "immuneSystem", "issue-classifier.json"),
    '{"classifiers":[{"pattern":"HTTP 502","category":"deployment","discipline":"devops"}]}',
  );
  await writeFile(
    join(root, ".DNA", "immuneSystem", "severity-model.json"),
    '{"levels":{"critical":{"autoIssue":true},"high":{"autoIssue":true}}}',
  );
  await writeFile(
    join(root, ".DNA", "behaviour", "runtime.behaviour.md"),
    "# Runtime\nAll production errors must be captured.",
  );
  await writeFile(join(root, ".DNA", "CellularMemory", "amygdala", "repeated-failures.md"), "# Failures\n");
  await writeFile(join(root, ".DNA", "CellularMemory", "amygdala", "blockers.md"), "# Blockers\n");
  await writeFile(
    join(root, ".DNA", "CellularMemory", "temporalLobe", "previous-solutions.md"),
    "# Solutions\n",
  );

  return root;
}

describe("runtime pipeline", () => {
  beforeEach(() => resetSampleStateForTests());

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
    expect(result.issue.latestEvent?.frames?.length).toBeGreaterThan(0);

    const events = await readRuntimeRecords<RuntimeEvent>(root, "events");
    const issues = await readRuntimeRecords(root, "issues");
    expect(events.length).toBe(1);
    expect(issues.length).toBe(1);

    await rm(root, { recursive: true, force: true });
  });

  it("escalates repeated 502 errors to blocker with fingerprint upsert", async () => {
    const root = await setupProject();
    const tracker = new (await import("@superhumaan/dna-immune")).EventTracker();

    for (let i = 0; i < 3; i++) {
      const event: RuntimeEvent = {
        id: `e${i}`,
        timestamp: new Date().toISOString(),
        type: "request_error",
        message: "HTTP 502",
        endpoint: "/",
        statusCode: 502,
      };

      const result = await processRuntimeEvent(event, {
        projectRoot: root,
        dnaRoot: join(root, ".DNA"),
        tracker,
      });

      if (i === 2) {
        expect(result.fingerprint).toBeTruthy();
        expect(result.issue.category).toBe("deployment");
        expect(result.isBlocker).toBe(true);
        expect(result.issue.repeatCount).toBe(3);
      }
    }

    const fingerprints = await readFingerprintRecords(root);
    expect(fingerprints.length).toBe(1);
    expect(fingerprints[0]?.repeatCount).toBe(3);
    expect(fingerprints[0]?.isBlocker).toBe(true);

    const issues = await readRuntimeRecords(root, "issues");
    const events = await readRuntimeRecords(root, "events");
    expect(issues.length).toBe(1);
    expect(events.length).toBe(1);

    const blockers = await readFile(
      join(root, ".DNA", "CellularMemory", "amygdala", "blockers.md"),
      "utf-8",
    );
    expect(blockers).toContain("BLOCKER");

    await rm(root, { recursive: true, force: true });
  });
});
