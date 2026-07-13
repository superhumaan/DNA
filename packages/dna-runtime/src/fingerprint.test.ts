import { describe, it, expect } from "vitest";
import { issueFingerprint, fingerprintLabel } from "../src/fingerprint.js";
import type { RuntimeEvent } from "@superhumaan/dna-config";

describe("issueFingerprint", () => {
  it("produces stable fingerprints for same error", () => {
    const event: RuntimeEvent = {
      id: "1",
      timestamp: new Date().toISOString(),
      type: "request_error",
      message: "HTTP 502",
      endpoint: "/api/health",
      statusCode: 502,
    };

    const a = issueFingerprint(event, "deployment");
    const b = issueFingerprint(event, "deployment");
    expect(a).toBe(b);
    expect(fingerprintLabel(a)).toBe(`dna-fp-${a}`);
  });

  it("differs when endpoint changes", () => {
    const base: RuntimeEvent = {
      id: "1",
      timestamp: new Date().toISOString(),
      type: "request_error",
      message: "HTTP 502",
      statusCode: 502,
    };

    const a = issueFingerprint({ ...base, endpoint: "/a" }, "deployment");
    const b = issueFingerprint({ ...base, endpoint: "/b" }, "deployment");
    expect(a).not.toBe(b);
  });
});
