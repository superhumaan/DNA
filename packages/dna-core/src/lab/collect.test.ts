import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  LAB_DATA_EVENT_CAP,
  clearLabDataCache,
  collectLabIssueEvents,
  getLabData,
  trimLabPayload,
  type LabDashboardData,
} from "./collect.js";
import { appendRuntimeRecord } from "../storage/runtime-db.js";

describe("getLabData (poll micro-cache)", () => {
  let root = "";

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-collect-"));
    clearLabDataCache();
  });

  afterEach(async () => {
    clearLabDataCache();
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("coalesces concurrent pollers into a single computation", async () => {
    const results = await Promise.all(
      Array.from({ length: 25 }, () => getLabData(root)),
    );

    // Exactly one caller performs the real computation; the rest ride along.
    const computed = results.filter((r) => !r.cached);
    expect(computed).toHaveLength(1);

    // Everyone gets an identical payload + ETag.
    const etags = new Set(results.map((r) => r.etag));
    expect(etags.size).toBe(1);
    expect(results[0].etag).toMatch(/^W\/"/);
  });

  it("serves from cache within the TTL window", async () => {
    const first = await getLabData(root);
    const second = await getLabData(root);
    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(second.etag).toBe(first.etag);
  });

  it("recomputes after the cache is cleared", async () => {
    const first = await getLabData(root);
    clearLabDataCache(root);
    const second = await getLabData(root);
    expect(first.cached).toBe(false);
    expect(second.cached).toBe(false);
  });

  it("honours a zero max-age (always fresh)", async () => {
    await getLabData(root);
    const fresh = await getLabData(root, { maxAgeMs: 0 });
    expect(fresh.cached).toBe(false);
  });

  it("trims the wire payload to capped slim events", () => {
    const now = Date.now();
    const events = Array.from({ length: LAB_DATA_EVENT_CAP + 50 }, (_, i) => ({
      id: `e${i}`,
      timestamp: new Date(now - i * 1000).toISOString(),
      type: "request",
      message: `m${i}`,
      stack: "Error: heavy\n  at x",
      breadcrumbs: [{ message: "nav" }],
      contexts: { os: { name: "mac" } },
      fingerprint: `fp${i % 3}`,
    }));
    const trimmed = trimLabPayload({
      doctor: {} as LabDashboardData["doctor"],
      runtimeIssues: [{ id: "i1" }],
      runtimeEvents: events,
      qualityReports: [],
      coverage: null,
      ciRuns: [],
      ciBillingBlocker: null,
      thirdPartyApis: [],
      impressions: ["DNA/Impressions/a.md"],
      cellularMemory: [".DNA/CellularMemory/x.md"],
      releases: [],
      sourceMaps: [],
      issueGroups: [],
      eventTimeline: [],
      slowEndpoints: [],
      stats: {
        issueCount: 0,
        eventCount: events.length,
        errorRate24h: 0,
        slowRequestCount: 0,
        memorySpikeCount: 0,
        unresolvedCritical: 0,
        events24h: 0,
        errors24h: 0,
        thirdPartyCount: 0,
      },
    });

    expect(trimmed.runtimeEvents).toHaveLength(LAB_DATA_EVENT_CAP);
    expect(trimmed.runtimeIssues).toEqual([]);
    expect(trimmed.impressions).toEqual([]);
    expect(trimmed.cellularMemory).toEqual([]);
    const first = trimmed.runtimeEvents[0] as Record<string, unknown>;
    expect(first.stack).toBeUndefined();
    expect(first.breadcrumbs).toBeUndefined();
    expect(first.contexts).toBeUndefined();
    expect(first.id).toBe("e0");
  });

  it("loads full issue event detail only on demand", async () => {
    await appendRuntimeRecord(root, "events", {
      id: "event-1",
      timestamp: new Date().toISOString(),
      fingerprint: "fp-detail",
      message: "Detailed failure",
      stack: "Error: detailed",
      breadcrumbs: [{ message: "clicked save" }],
      contexts: { runtime: { name: "node" } },
    });
    await appendRuntimeRecord(root, "issues", {
      id: "issue-1",
      eventId: "event-1",
      fingerprint: "fp-detail",
      title: "Detailed failure",
    });

    const events = await collectLabIssueEvents(root, "issue-1");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: "event-1",
      stack: "Error: detailed",
      breadcrumbs: [{ message: "clicked save" }],
    });
  });
});
