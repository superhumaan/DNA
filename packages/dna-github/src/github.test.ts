import { describe, it, expect } from "vitest";
import { buildIssuePayload } from "../src/index.js";
import type { ClassifiedIssue } from "@humaan/dna-config";

const sampleIssue: ClassifiedIssue = {
  id: "issue-1",
  eventId: "evt-1",
  severity: "high",
  category: "runtime_error",
  discipline: "backend",
  behaviourViolation: false,
  repeated: true,
  projectRisk: "elevated",
  confidence: 0.85,
  title: "HIGH: request_error on GET /api/users",
  summary: "Cannot read property of undefined",
  suspectedCause: "Null reference in user handler",
  relevantBehaviour: ["runtime.behaviour.md"],
  relevantMemory: ["amygdala/repeated-failures.md"],
  suggestedFix: "Add null check before accessing user properties",
  testRecommendation: "Add unit test for null user case",
  endpoint: "/api/users",
  stackTraceSummary: "at getUser (src/users.ts:42)",
};

describe("GitHub issue payload", () => {
  it("builds structured issue body with labels", () => {
    const payload = buildIssuePayload(sampleIssue);

    expect(payload.title).toContain("HIGH");
    expect(payload.labels).toContain("dna");
    expect(payload.labels).toContain("severity:high");
    expect(payload.labels).toContain("category:runtime_error");
    expect(payload.body).toContain("Cannot read property");
    expect(payload.body).toContain("runtime.behaviour.md");
    expect(payload.body).toContain("/api/users");
    expect(payload.body).not.toContain("password");
  });
});
