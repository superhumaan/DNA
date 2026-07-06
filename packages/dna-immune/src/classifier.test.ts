import { describe, it, expect, beforeEach } from "vitest";
import {
  classifyIssueSync,
  resetImmuneCache,
  shouldAutoCreateIssue,
  getImmuneConfig,
} from "../src/classifier.js";
import type { RuntimeEvent } from "@humaan/dna-config";

function makeEvent(overrides: Partial<RuntimeEvent> = {}): RuntimeEvent {
  return {
    id: "evt-1",
    timestamp: new Date().toISOString(),
    type: "request_error",
    message: "Internal Server Error",
    ...overrides,
  };
}

describe("issue classifier", () => {
  beforeEach(() => {
    resetImmuneCache();
  });

  it("classifies uncaught exceptions as critical", () => {
    const issue = classifyIssueSync(
      makeEvent({ type: "uncaught_exception", message: "Something broke" }),
    );
    expect(issue.severity).toBe("critical");
  });

  it("classifies database connection errors", () => {
    const issue = classifyIssueSync(
      makeEvent({ message: "ECONNREFUSED: connection to database failed" }),
    );
    expect(issue.category).toBe("database");
    expect(issue.discipline).toBe("backend");
  });

  it("classifies auth errors", () => {
    const issue = classifyIssueSync(
      makeEvent({ message: "JWT token expired", statusCode: 401, endpoint: "/api/users" }),
    );
    expect(issue.category).toBe("auth");
    expect(issue.endpoint).toBe("/api/users");
  });

  it("classifies slow requests as performance", () => {
    const issue = classifyIssueSync(
      makeEvent({ type: "slow_request", message: "Slow request", durationMs: 4000 }),
    );
    expect(issue.category).toBe("performance");
    expect(issue.severity).toBe("medium");
  });

  it("auto-issues for high/critical severity", async () => {
    const config = await getImmuneConfig();
    const issue = classifyIssueSync(
      makeEvent({ type: "uncaught_exception", message: "fatal" }),
    );
    expect(shouldAutoCreateIssue(issue, config)).toBe(true);
  });
});
