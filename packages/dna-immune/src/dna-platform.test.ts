import { describe, it, expect } from "vitest";
import { isDnaPlatformIssue, shouldReportUpstream } from "./dna-platform.js";

describe("isDnaPlatformIssue", () => {
  it("detects DNA stack frames", () => {
    expect(
      isDnaPlatformIssue({
        message: "Something failed",
        stack: "at foo (/node_modules/@superhumaan/dna-by-humaan/dist/index.js:12:3)",
      }),
    ).toBe(true);
  });

  it("detects DNA config messages", () => {
    expect(
      isDnaPlatformIssue({
        message: "Invalid .DNA/config.dna.json: missing projectId",
      }),
    ).toBe(true);
  });

  it("detects CLI source", () => {
    expect(
      isDnaPlatformIssue({
        message: "any error",
        source: "cli",
      }),
    ).toBe(true);
  });

  it("rejects generic app errors", () => {
    expect(
      isDnaPlatformIssue({
        message: "User not found",
        stack: "at getUser (/src/api/users.ts:42:11)",
      }),
    ).toBe(false);
  });
});

describe("shouldReportUpstream", () => {
  it("respects dna-only mode", () => {
    const input = {
      message: "User not found",
      stack: "at getUser (/src/api/users.ts:42:11)",
    };
    expect(shouldReportUpstream(input, "dna-only")).toBe(false);
    expect(shouldReportUpstream(input, "all")).toBe(true);
    expect(shouldReportUpstream(input, "off")).toBe(false);
  });
});
