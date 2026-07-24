import { describe, expect, it } from "vitest";
import {
  buildEventTimeline,
  buildIssueTrend,
  groupIssues,
  topSlowEndpoints,
} from "./collect-aggregates.js";

describe("collect-aggregates", () => {
  it("groups issues by fingerprint with counts", () => {
    const issues = [
      {
        id: "1",
        title: "CRITICAL: boom",
        severity: "high",
        category: "runtime",
        fingerprint: "fp1",
        repeatCount: 1,
        firstSeen: "2026-07-12T10:00:00.000Z",
        lastSeen: "2026-07-12T10:00:00.000Z",
        eventId: "e1",
      },
      {
        id: "2",
        title: "CRITICAL: boom",
        severity: "critical",
        category: "runtime",
        fingerprint: "fp1",
        repeatCount: 5,
        firstSeen: "2026-07-12T10:00:00.000Z",
        lastSeen: "2026-07-13T10:00:00.000Z",
        eventId: "e2",
      },
    ];
    const events = [
      { id: "e1", timestamp: "2026-07-12T10:00:00.000Z", message: "boom", fingerprint: "fp1" },
      { id: "e2", timestamp: "2026-07-13T10:00:00.000Z", message: "boom", fingerprint: "fp1" },
    ];
    const grouped = groupIssues(issues, events);
    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.count).toBeGreaterThanOrEqual(5);
    expect(grouped[0]?.severity).toBe("critical");
    expect(grouped[0]?.firstSeen).toBe("2026-07-12T10:00:00.000Z");
    expect(grouped[0]?.lastSeen).toBe("2026-07-13T10:00:00.000Z");
  });

  it("groups issues by title when fingerprint missing", () => {
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

  it("enriches issues with shortId, trend, users, culprit, and age", () => {
    const now = Date.now();
    const issues = [
      {
        id: "1",
        title: "TypeError: boom",
        severity: "high",
        category: "exception",
        fingerprint: "fp-user",
        repeatCount: 2,
        firstSeen: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date(now).toISOString(),
        eventId: "e1",
      },
    ];
    const events = [
      {
        id: "e1",
        timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
        message: "TypeError: boom",
        fingerprint: "fp-user",
        endpoint: "/api/checkout",
        method: "POST",
        user: { id: "u1" },
        frames: [{ filename: "checkout.ts", function: "pay", lineno: 42, inApp: true }],
        tags: { browser: "Chrome", env: "production" },
      },
      {
        id: "e2",
        timestamp: new Date(now).toISOString(),
        message: "TypeError: boom",
        fingerprint: "fp-user",
        user: { id: "u2" },
        tags: { browser: "Chrome" },
      },
    ];
    const grouped = groupIssues(issues, events);
    expect(grouped).toHaveLength(1);
    const row = grouped[0]!;
    expect(row.shortId).toMatch(/^DNA-[0-9A-F]{4}$/);
    expect(row.userCount).toBe(2);
    expect(row.trend24h).toHaveLength(24);
    expect(row.trend24h.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(2);
    expect(row.culprit).toContain("pay");
    expect(row.ageMs).toBeGreaterThan(0);
    expect(row.topTags?.[0]?.key).toBe("browser");
  });

  it("builds issue trend buckets", () => {
    const now = Date.now();
    const trend = buildIssueTrend(
      [
        { timestamp: new Date(now).toISOString() },
        { timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString() },
      ],
      24,
      now,
    );
    expect(trend).toHaveLength(24);
    expect(trend[23]).toBe(1);
    expect(trend[21]).toBe(1);
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
