import { describe, expect, it } from "vitest";
import {
  buildOverviewBatteries,
  ciSuccessRate,
  countBySeverity,
  errorRateHealth,
  latestQualityScore,
  toneForThreshold,
} from "./overview-metrics.js";

describe("overview-metrics", () => {
  it("counts issues by severity", () => {
    expect(
      countBySeverity([
        { severity: "critical" },
        { severity: "fatal" },
        { severity: "high" },
        { severity: "medium" },
        { severity: "low" },
        { severity: "weird" },
      ]),
    ).toEqual({
      critical: 2,
      high: 1,
      medium: 1,
      low: 1,
      other: 1,
    });
  });

  it("inverts error rate into health", () => {
    expect(errorRateHealth(0)).toBe(100);
    expect(errorRateHealth(12.5)).toBe(88);
    expect(errorRateHealth(200)).toBe(0);
  });

  it("tones thresholds", () => {
    expect(toneForThreshold(95)).toBe("ok");
    expect(toneForThreshold(70)).toBe("warn");
    expect(toneForThreshold(40)).toBe("bad");
    expect(toneForThreshold(null)).toBe("neutral");
  });

  it("computes CI success rate and skips in-progress", () => {
    const result = ciSuccessRate([
      { conclusion: "success" },
      { conclusion: "failure" },
      { status: "in_progress" },
      { failureKind: "billing", conclusion: "failure" },
    ]);
    expect(result.total).toBe(3);
    expect(result.success).toBe(1);
    expect(result.billing).toBe(1);
    expect(result.percent).toBeCloseTo(33.3, 1);
  });

  it("picks latest quality score by mtime", () => {
    expect(
      latestQualityScore([
        { score: 70, gate: "fail", mtime: "2026-01-01T00:00:00.000Z" },
        { score: 92, gate: "pass", mtime: "2026-07-01T00:00:00.000Z" },
      ]),
    ).toEqual({ score: 92, gate: "pass" });
  });

  it("builds five overview batteries", () => {
    const batteries = buildOverviewBatteries({
      doctorValid: true,
      errorRate24h: 2,
      coverageLines: 85,
      qualityScore: 90,
      qualityGate: "pass",
      ciPercent: 100,
    });
    expect(batteries).toHaveLength(5);
    expect(batteries.map((b) => b.id)).toEqual([
      "doctor",
      "errors",
      "coverage",
      "quality",
      "ci",
    ]);
    expect(batteries.find((b) => b.id === "doctor")?.tone).toBe("ok");
    expect(batteries.find((b) => b.id === "coverage")?.display).toContain("%");
  });

  it("marks empty coverage and CI as neutral displays", () => {
    const batteries = buildOverviewBatteries({
      doctorValid: false,
      doctorIssues: 3,
      errorRate24h: 0,
    });
    expect(batteries.find((b) => b.id === "coverage")?.display).toBe("—");
    expect(batteries.find((b) => b.id === "ci")?.percent).toBeNull();
    expect(batteries.find((b) => b.id === "doctor")?.tone).toBe("bad");
  });
});
