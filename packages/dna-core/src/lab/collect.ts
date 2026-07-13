import { glob } from "../glob.js";
import { join } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { runDoctor, type DoctorReport } from "../doctor.js";
import { readRuntimeRecords } from "../storage/runtime-db.js";
import { fileExists } from "../fs.js";
import { listLabReleases, listSourceMapMeta } from "./storage.js";

export interface LabDashboardData {
  doctor: DoctorReport;
  runtimeIssues: unknown[];
  runtimeEvents: unknown[];
  qualityReports: { name: string; mtime: string; score?: number }[];
  impressions: string[];
  cellularMemory: string[];
  releases: Awaited<ReturnType<typeof listLabReleases>>;
  sourceMaps: Awaited<ReturnType<typeof listSourceMapMeta>>;
  stats: {
    issueCount: number;
    eventCount: number;
    errorRate24h: number;
    slowRequestCount: number;
    memorySpikeCount: number;
  };
}

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

  return {
    issueCount: issues.length,
    eventCount: events.length,
    errorRate24h: Math.round(errorRate24h * 1000) / 10,
    slowRequestCount: slow.length,
    memorySpikeCount: memory.length,
  };
}

export async function collectLabData(root: string): Promise<LabDashboardData> {
  const [doctor, runtimeIssues, runtimeEvents, qualityReports, impressions, cellularMemory, releases, sourceMaps] =
    await Promise.all([
      runDoctor(root),
      readRuntimeRecords(root, "issues"),
      readRuntimeRecords(root, "events"),
      listQualityReports(root),
      listMarkdownFiles(join(root, "DNA", "Impressions"), "DNA/Impressions"),
      listMarkdownFiles(join(root, ".DNA", "CellularMemory"), ".DNA/CellularMemory"),
      listLabReleases(root),
      listSourceMapMeta(root),
    ]);

  return {
    doctor,
    runtimeIssues,
    runtimeEvents,
    qualityReports,
    impressions,
    cellularMemory,
    releases,
    sourceMaps,
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
