import { describe, it, expect } from "vitest";
import { executeRepairWorkflow } from "../src/orchestrator.js";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { ClassifiedIssue } from "@superhumaan/dna-config";

const sampleIssue: ClassifiedIssue = {
  id: "issue-abc12345",
  eventId: "evt-1",
  severity: "high",
  category: "runtime_error",
  discipline: "backend",
  behaviourViolation: false,
  repeated: false,
  projectRisk: "elevated",
  confidence: 0.8,
  title: "Runtime error in API",
  summary: "TypeError: Cannot read properties of undefined",
  suggestedFix: "Add null guard",
  testRecommendation: "Add regression test",
  relevantBehaviour: ["runtime.behaviour.md"],
  relevantMemory: ["hippocampus/recent-changes.md"],
};

async function setup(root: string): Promise<void> {
  await mkdir(join(root, ".DNA", "behaviour"), { recursive: true });
  await mkdir(join(root, ".DNA", "CellularMemory", "hippocampus"), { recursive: true });
  await writeFile(join(root, ".DNA", "behaviour", "runtime.behaviour.md"), "# Runtime rules");
  await writeFile(
    join(root, ".DNA", "CellularMemory", "hippocampus", "recent-changes.md"),
    "# Changes",
  );
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "repair-test" }));
}

describe("executeRepairWorkflow", () => {
  it("runs dry-run repair plan", async () => {
    const root = join(tmpdir(), `dna-repair-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await setup(root);

    const result = await executeRepairWorkflow({
      projectRoot: root,
      dnaRoot: join(root, ".DNA"),
      issue: sampleIssue,
      config: {
        version: "0.1.0",
        projectId: "repair-test",
        projectName: "repair-test",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stack: {},
        compliance: "none",
        stage: "new",
        aiTools: [],
        autoUpdate: true,
        channel: "stable",
        knowledgePacks: [],
        ai: { enabled: true, provider: "mock" },
      },
      dryRun: true,
    });

    expect(result.plan.branchName).toMatch(/^dna\/fix\//);
    expect(result.plan.proposedChanges.length).toBeGreaterThan(0);

    await rm(root, { recursive: true, force: true });
  });
});
