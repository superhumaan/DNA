import { glob } from "../glob.js";
import { join } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { runDoctorLite, type DoctorReport } from "../doctor.js";
import { readRuntimeRecords, repairRuntimeDatabase } from "../storage/runtime-db.js";
import { fileExists } from "../fs.js";
import { listLabReleases, listSourceMapMeta } from "./storage.js";
import {
  buildEventTimeline,
  groupIssues,
  topSlowEndpoints,
  type LabEventTimelineBucket,
  type LabIssueSummary,
  type LabSlowEndpoint,
} from "./collect-aggregates.js";

export type { LabIssueSummary, LabEventTimelineBucket, LabSlowEndpoint } from "./collect-aggregates.js";

export interface LabDashboardData {
  doctor: DoctorReport;
  runtimeIssues: unknown[];
  runtimeEvents: unknown[];
  qualityReports: { name: string; mtime: string; score?: number }[];
  impressions: string[];
  cellularMemory: string[];
  releases: Awaited<ReturnType<typeof listLabReleases>>;
  sourceMaps: Awaited<ReturnType<typeof listSourceMapMeta>>;
  issueGroups: LabIssueSummary[];
  eventTimeline: LabEventTimelineBucket[];
  slowEndpoints: LabSlowEndpoint[];
  stats: {
    issueCount: number;
    eventCount: number;
    errorRate24h: number;
    slowRequestCount: number;
    memorySpikeCount: number;
    unresolvedCritical: number;
    events24h: number;
    errors24h: number;
  };
}

const DOCTOR_TTL_MS = 60_000;
const doctorCache = new Map<string, { at: number; report: DoctorReport }>();

async function listMarkdownFiles(dir: string, prefix: string): Promise<string[]> {
  if (!(await fileExists(dir))) return [];
  const files = await glob("**/*.md", { cwd: dir, onlyFiles: true });
  return files.map((f) => `${prefix}/${f}`);
}

async function listQualityReports(root: string): Promise<{ name: string; mtime: string; score?: number }[]> {
  const dir = join(root, ".DNA", "reports", "quality");
  if (!(await fileExists(dir))) return [];
  const files = await glob("*.md", { cwd: dir, onlyFiles: true });
  const reports = await Promise.all(
    files.map(async (name) => {
      const full = join(dir, name);
      const st = await stat(full);
      const raw = await readFile(full, "utf-8").catch(() => "");
      const scoreMatch = raw.match(/Overall coverage:\s*([\d.]+)%/i) ?? raw.match(/Gate:\s*(\w+)/i);
      const score = scoreMatch?.[1] && !Number.isNaN(Number(scoreMatch[1])) ? Number(scoreMatch[1]) : undefined;
      return { name, mtime: st.mtime.toISOString(), score };
    }),
  );
  return reports.sort((a, b) => a.mtime.localeCompare(b.mtime));
}

function computeStats(events: unknown[], issues: unknown[]): LabDashboardData["stats"] {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recentEvents = events.filter((e) => {
    const ts = (e as { timestamp?: string }).timestamp;
    return ts ? new Date(ts).getTime() >= since : false;
  });

  const errors = recentEvents.filter((e) => {
    const type = (e as { type?: string }).type ?? "";
    return type.includes("exception") || type.includes("rejection") || type === "request_error";
  });

  const slow = recentEvents.filter((e) => (e as { type?: string }).type === "slow_request");
  const memory = recentEvents.filter((e) => (e as { type?: string }).type === "memory_spike");

  const errorRate24h = recentEvents.length ? errors.length / recentEvents.length : 0;
  const unresolvedCritical = issues.filter((raw) => {
    const severity = (raw as { severity?: string }).severity;
    return severity === "critical" || severity === "high";
  }).length;

  return {
    issueCount: issues.length,
    eventCount: events.length,
    errorRate24h: Math.round(errorRate24h * 1000) / 10,
    slowRequestCount: slow.length,
    memorySpikeCount: memory.length,
    unresolvedCritical,
    events24h: recentEvents.length,
    errors24h: errors.length,
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function emptyDoctor(): DoctorReport {
  return {
    dna: { installed: false },
    documentation: { impressionsCount: 0, missing: 0 },
    behaviour: { files: 0, missing: [] },
    immuneSystem: { configured: false },
    cellularMemory: { configured: false },
    github: { enabled: false, configured: false, signedIn: false },
    ai: { enabled: false, connected: false },
    runtime: { enabled: false, configured: false },
    ci: { enabled: false, workflowInstalled: false },
    docker: { dockerfileInstalled: false },
    hooks: { prePushInstalled: false, hooksPathConfigured: false },
    preview: { enabled: false, workflowInstalled: false, provider: "vercel" },
    injection: { expected: false, complete: true, missing: [], stale: [] },
    validation: { valid: false, issueCount: 1 },
  };
}

async function cachedDoctorLite(root: string): Promise<DoctorReport> {
  const hit = doctorCache.get(root);
  if (hit && Date.now() - hit.at < DOCTOR_TTL_MS) return hit.report;

  const report = await withTimeout(runDoctorLite(root), 2500, hit?.report ?? emptyDoctor());
  doctorCache.set(root, { at: Date.now(), report });
  return report;
}

export async function collectLabData(root: string): Promise<LabDashboardData> {
  // Repair corrupt runtime.db before reads (quarantines + recreates empty store)
  await repairRuntimeDatabase(root).catch(() => undefined);

  const settled = await Promise.allSettled([
    cachedDoctorLite(root),
    readRuntimeRecords(root, "issues"),
    readRuntimeRecords(root, "events"),
    listQualityReports(root),
    listMarkdownFiles(join(root, "DNA", "Impressions"), "DNA/Impressions"),
    listMarkdownFiles(join(root, ".DNA", "CellularMemory"), ".DNA/CellularMemory"),
    listLabReleases(root),
    listSourceMapMeta(root),
  ]);

  const value = <T>(index: number, fallback: T): T => {
    const result = settled[index];
    return result?.status === "fulfilled" ? (result.value as T) : fallback;
  };

  const doctor = value(0, emptyDoctor());
  const runtimeIssues = value(1, [] as unknown[]);
  const runtimeEvents = value(2, [] as unknown[]);
  const qualityReports = value(3, [] as LabDashboardData["qualityReports"]);
  const impressions = value(4, [] as string[]);
  const cellularMemory = value(5, [] as string[]);
  const releases = value(6, [] as LabDashboardData["releases"]);
  const sourceMaps = value(7, [] as LabDashboardData["sourceMaps"]);

  return {
    doctor,
    runtimeIssues,
    runtimeEvents,
    qualityReports,
    impressions,
    cellularMemory,
    releases,
    sourceMaps,
    issueGroups: groupIssues(runtimeIssues, runtimeEvents),
    eventTimeline: buildEventTimeline(runtimeEvents),
    slowEndpoints: topSlowEndpoints(runtimeEvents),
    stats: computeStats(runtimeEvents, runtimeIssues),
  };
}

export async function recordRelease(
  root: string,
  input: { version: string; gitSha?: string; environment?: string; notes?: string },
): Promise<void> {
  const { upsertLabRelease } = await import("./storage.js");
  const { newId } = await import("./crypto.js");
  await upsertLabRelease(root, {
    id: newId(),
    version: input.version,
    gitSha: input.gitSha,
    environment: input.environment ?? process.env.NODE_ENV ?? "production",
    deployedAt: new Date().toISOString(),
    notes: input.notes,
  });
}
