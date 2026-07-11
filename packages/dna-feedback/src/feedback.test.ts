import { describe, it, expect } from "vitest";
import { sanitizeText, topStackFrame } from "./sanitize.js";
import { fingerprintFeedback, buildFeedbackPayload } from "./payload.js";
import { buildUpstreamIssuePayload, fingerprintLabel } from "./upstream-issue.js";
import type { DnaConfig } from "@superhumaan/dna-config";

const baseConfig: DnaConfig = {
  version: "0.1.0",
  projectId: "test-project",
  projectName: "test",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  stack: {},
  compliance: "none",
  stage: "new",
  aiTools: [],
  autoUpdate: true,
  channel: "stable",
  knowledgePacks: [],
  platformFeatures: [],
  feedback: {
    enabled: true,
    upstream: true,
    autoReport: "dna-only",
    includeSuggestedFix: true,
  },
};

describe("sanitizeText", () => {
  it("redacts bearer tokens", () => {
    const result = sanitizeText("Authorization: Bearer ghp_abcdefghijklmnopqrstuvwxyz123456");
    expect(result).toContain("[REDACTED]");
    expect(result).not.toContain("ghp_");
  });
});

describe("fingerprintFeedback", () => {
  it("is stable for same inputs", () => {
    const a = fingerprintFeedback({
      dnaVersion: "0.4.7",
      command: "dna doctor",
      message: "ENOENT .DNA/config.dna.json",
      topFrame: "at loadConfig (dna-cli/dist/index.js:10:5)",
    });
    const b = fingerprintFeedback({
      dnaVersion: "0.4.7",
      command: "dna doctor",
      message: "ENOENT .DNA/config.dna.json",
      topFrame: "at loadConfig (dna-cli/dist/index.js:10:5)",
    });
    expect(a).toBe(b);
  });
});

describe("buildFeedbackPayload", () => {
  it("builds a sanitized payload", async () => {
    const payload = await buildFeedbackPayload({
      source: "cli",
      message: "DNA doctor failed",
      dnaVersion: "0.4.7",
      config: baseConfig,
      command: "dna doctor",
    });

    expect(payload.projectId).toBe("test-project");
    expect(payload.fingerprint).toHaveLength(16);
    expect(payload.installId).toBeTruthy();
  });
});

describe("buildUpstreamIssuePayload", () => {
  it("includes fingerprint label", () => {
    const payload = buildUpstreamIssuePayload({
      id: "1",
      fingerprint: "abc123def4567890",
      timestamp: "2026-01-01T00:00:00.000Z",
      source: "cli",
      dnaVersion: "0.4.7",
      nodeVersion: "v20.0.0",
      platform: "darwin",
      installId: "install-uuid",
      projectId: "my-app",
      message: "doctor check failed",
      severity: "high",
      category: "unknown",
    });

    expect(payload.labels).toContain(fingerprintLabel("abc123def4567890"));
    expect(payload.title).toContain("doctor check failed");
  });
});

describe("topStackFrame", () => {
  it("extracts first at-frame", () => {
    const frame = topStackFrame("Error: fail\n    at foo (index.js:1:1)\n    at bar (index.js:2:2)");
    expect(frame).toContain("at foo");
  });
});
