import { describe, expect, it, beforeEach } from "vitest";
import { decideEventSample, resetSampleStateForTests } from "../src/sample.js";
import { parseStackFrames, enrichRuntimeEvent } from "../src/enrich.js";
import type { RuntimeEvent } from "@superhumaan/dna-config";

describe("event sampling", () => {
  beforeEach(() => resetSampleStateForTests());

  it("always persists the first occurrence", () => {
    const first = decideEventSample("abc", { now: 1000 });
    expect(first.persistEvent).toBe(true);
    expect(first.upsertIssue).toBe(true);
  });

  it("suppresses full event writes inside cooldown", () => {
    decideEventSample("abc", { now: 1000 });
    const second = decideEventSample("abc", { now: 2000 });
    expect(second.persistEvent).toBe(false);
    expect(second.upsertIssue).toBe(true);
  });

  it("allows another full write after cooldown", () => {
    decideEventSample("abc", { now: 1000 });
    const later = decideEventSample("abc", { now: 1000 + 60_000 });
    expect(later.persistEvent).toBe(true);
  });
});

describe("enrich", () => {
  it("parses stack frames", () => {
    const frames = parseStackFrames(
      "Error: boom\n    at handler (/app/src/index.ts:12:5)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
    );
    expect(frames[0]?.filename).toContain("index.ts");
    expect(frames[0]?.lineno).toBe(12);
    expect(frames[0]?.inApp).toBe(true);
  });

  it("redacts secrets in messages", () => {
    const event = enrichRuntimeEvent({
      id: "1",
      timestamp: new Date().toISOString(),
      type: "uncaught_exception",
      message: "failed with Bearer abc.def.ghi",
    } as RuntimeEvent);
    expect(event.message).toContain("[REDACTED]");
    expect(event.message).not.toContain("abc.def.ghi");
  });
});
