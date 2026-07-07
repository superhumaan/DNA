import { describe, it, expect } from "vitest";
import { createAiProvider, runRepairWorkflow } from "../src/index.js";
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

describe("mock AI repair", () => {
  it("generates diagnosis and PR plan", async () => {
    const provider = createAiProvider({ provider: "mock" });
    const plan = await runRepairWorkflow(provider, sampleIssue, {
      behaviour: ["runtime rules"],
      memory: ["recent changes"],
      codeSnippets: [{ file: "src/api.ts", content: "export function handler() {}" }],
    });

    expect(plan.diagnosis).toContain("Mock diagnosis");
    expect(plan.branchName).toMatch(/^dna\/fix\//);
    expect(plan.prTitle).toContain("[DNA] Fix:");
    expect(plan.proposedChanges.length).toBeGreaterThan(0);
    expect(plan.confidence).toBe(0.8);
    expect(plan.prBody).toContain("Not auto-merged");
  });
});
