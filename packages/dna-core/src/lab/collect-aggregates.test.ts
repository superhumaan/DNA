import { describe, expect, it } from "vitest";
import {
  buildEventTimeline,
  groupIssues,
  topSlowEndpoints,
} from "./collect-aggregates.js";

describe("collect-aggregates", () => {
  it("groups issues by title with counts", () => {
    const issues = [
      { id: "1", title: "DB timeout", severity: "high", category: "database", eventId: "e1" },
      { id: "2", title: "DB timeout", severity: "critical", category: "database", eventId: "e2" },
    ];
    const events = [
      { id: "e1", timestamp: "2026-07-12T10:00:00.000Z", message: "DB timeout" },
      { id: "e2", timestamp: "2026-07-13T10:00:00.000Z", message: "DB timeout" },
    ];
    const grouped = groupIssues(issues, events);
    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.count).toBe(2);
    expect(grouped[0]?.severity).toBe("critical");
  });

  it("builds hourly error timeline", () => {
    const now = new Date();
    const events = [
      {
        timestamp: now.toISOString(),
        type: "uncaught_exception",
        message: "boom",
      },
    ];
    const timeline = buildEventTimeline(events, 4);
    expect(timeline).toHaveLength(4);
    expect(timeline.some((b) => b.errors > 0)).toBe(true);
  });

  it("ranks slow endpoints", () => {
    const events = [
      { type: "slow_request", endpoint: "/api/a", method: "GET", durationMs: 4000 },
      { type: "slow_request", endpoint: "/api/a", method: "GET", durationMs: 2000 },
      { type: "slow_request", endpoint: "/api/b", method: "POST", durationMs: 9000 },
    ];
    const slow = topSlowEndpoints(events);
    expect(slow[0]?.endpoint).toBe("/api/b");
    expect(slow[0]?.maxMs).toBe(9000);
  });
});
