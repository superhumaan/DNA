/**
 * Pure aggregations for Lab Overview analytics.
 * Mirrored in lab/ui/dashboard.ts client helpers — keep formulas in sync.
 */

export type SeverityCounts = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  other: number;
};

export type BatteryTone = "ok" | "warn" | "bad" | "neutral";

export interface BatteryMeter {
  id: string;
  label: string;
  /** 0–100 fill; null when unknown */
  percent: number | null;
  display: string;
  tone: BatteryTone;
  hint?: string;
}

export function countBySeverity(
  issues: Array<{ severity?: string }>,
): SeverityCounts {
  const counts: SeverityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    other: 0,
  };
  for (const issue of issues) {
    const s = String(issue.severity || "").toLowerCase();
    if (s === "critical" || s === "fatal") counts.critical += 1;
    else if (s === "high" || s === "error") counts.high += 1;
    else if (s === "medium" || s === "warning") counts.medium += 1;
    else if (s === "low" || s === "info") counts.low += 1;
    else counts.other += 1;
  }
  return counts;
}

/** Invert error rate into a 0–100 “health” score (0% errors → 100). */
export function errorRateHealth(errorRatePercent: number): number {
  const rate = Math.max(0, Number(errorRatePercent) || 0);
  return Math.max(0, Math.min(100, Math.round(100 - rate)));
}

export function toneForThreshold(
  value: number | null | undefined,
  opts: { warnBelow?: number; badBelow?: number; invert?: boolean } = {},
): BatteryTone {
  if (value == null || !Number.isFinite(value)) return "neutral";
  const { warnBelow = 80, badBelow = 50, invert = false } = opts;
  if (invert) {
    if (value >= badBelow) return "bad";
    if (value >= warnBelow) return "warn";
    return "ok";
  }
  if (value < badBelow) return "bad";
  if (value < warnBelow) return "warn";
  return "ok";
}

export function ciSuccessRate(
  runs: Array<{ conclusion?: string; status?: string; failureKind?: string }>,
): { percent: number | null; success: number; total: number; billing: number } {
  let success = 0;
  let total = 0;
  let billing = 0;
  for (const run of runs) {
    if (run.failureKind === "billing") {
      billing += 1;
      total += 1;
      continue;
    }
    const conclusion = String(run.conclusion || "").toLowerCase();
    if (!conclusion && String(run.status || "").toLowerCase() === "in_progress") {
      continue;
    }
    if (!conclusion) continue;
    total += 1;
    if (conclusion === "success") success += 1;
  }
  if (!total) return { percent: null, success: 0, total: 0, billing };
  return {
    percent: Math.round((success / total) * 1000) / 10,
    success,
    total,
    billing,
  };
}

export function latestQualityScore(
  reports: Array<{ score?: number | null; gate?: string | null; mtime?: string }>,
): { score: number | null; gate: string | null } {
  if (!reports.length) return { score: null, gate: null };
  const sorted = [...reports].sort((a, b) => {
    const ta = a.mtime ? new Date(a.mtime).getTime() : 0;
    const tb = b.mtime ? new Date(b.mtime).getTime() : 0;
    return tb - ta;
  });
  const latest = sorted[0];
  const score = latest?.score != null && Number.isFinite(latest.score) ? Number(latest.score) : null;
  return { score, gate: latest?.gate ?? null };
}

export function buildOverviewBatteries(input: {
  doctorValid?: boolean;
  doctorIssues?: number;
  errorRate24h?: number;
  coverageLines?: number | null;
  qualityScore?: number | null;
  qualityGate?: string | null;
  ciPercent?: number | null;
  ciBilling?: number;
}): BatteryMeter[] {
  const errorHealth = errorRateHealth(input.errorRate24h ?? 0);
  const doctorOk = input.doctorValid === true;
  const quality = input.qualityScore;
  const coverage = input.coverageLines ?? null;
  const ci = input.ciPercent;

  return [
    {
      id: "doctor",
      label: "Doctor",
      percent: doctorOk ? 100 : Math.max(10, 100 - (input.doctorIssues ?? 1) * 15),
      display: doctorOk ? "Healthy" : "Issues",
      tone: doctorOk ? "ok" : "bad",
      hint: doctorOk ? "Validation passed" : `${input.doctorIssues ?? "?"} validation issue(s)`,
    },
    {
      id: "errors",
      label: "Error health",
      percent: errorHealth,
      display: `${errorHealth}%`,
      tone: toneForThreshold(errorHealth, { warnBelow: 95, badBelow: 90 }),
      hint: `${input.errorRate24h ?? 0}% error rate (24h)`,
    },
    {
      id: "coverage",
      label: "Coverage",
      percent: coverage != null ? Math.round(coverage) : null,
      display: coverage != null ? `${Math.round(coverage * 10) / 10}%` : "—",
      tone: toneForThreshold(coverage, { warnBelow: 80, badBelow: 60 }),
      hint: coverage != null ? "Line coverage" : "Run test:coverage",
    },
    {
      id: "quality",
      label: "Quality",
      percent: quality != null ? Math.round(quality) : null,
      display:
        quality != null
          ? `${Math.round(quality)}${input.qualityGate ? "" : "%"}`
          : input.qualityGate
            ? String(input.qualityGate).toUpperCase()
            : "—",
      tone:
        input.qualityGate === "pass"
          ? "ok"
          : input.qualityGate === "fail"
            ? "bad"
            : toneForThreshold(quality, { warnBelow: 80, badBelow: 60 }),
      hint: input.qualityGate ? `Gate: ${input.qualityGate}` : "Latest quality report",
    },
    {
      id: "ci",
      label: "CI success",
      percent: ci != null ? Math.round(ci) : null,
      display: ci != null ? `${ci}%` : "—",
      tone:
        (input.ciBilling ?? 0) > 0
          ? "warn"
          : toneForThreshold(ci, { warnBelow: 90, badBelow: 70 }),
      hint:
        (input.ciBilling ?? 0) > 0
          ? `${input.ciBilling} billing-blocked run(s)`
          : "Recent workflow conclusions",
    },
  ];
}
