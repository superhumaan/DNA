import { createHash } from "node:crypto";
import { runDoctorLite, type DoctorReport } from "../doctor.js";
import { readRuntimeRecords, repairRuntimeDatabase } from "../storage/runtime-db.js";
import { listLabReleases, listSourceMapMeta } from "./storage.js";
import {
  buildEventTimeline,
  eventsForIssue,
  groupIssues,
  thirdPartyEvents,
  topSlowEndpoints,
  type LabEventTimelineBucket,
  type LabIssueSummary,
  type LabSlowEndpoint,
} from "./collect-aggregates.js";
import {
  listCiRuns,
  listQualityReports,
  readCoverageSummary,
  summarizeCiBillingBlocker,
  type LabCiBillingBlocker,
  type LabCiRun,
  type LabCoverageSummary,
  type LabQualityReportRow,
} from "./collect-quality.js";

export type { LabIssueSummary, LabEventTimelineBucket, LabSlowEndpoint } from "./collect-aggregates.js";
export type {
  LabQualityReportRow,
  LabCoverageSummary,
  LabCiRun,
  LabCiBillingBlocker,
} from "./collect-quality.js";

export interface LabDashboardData {
  doctor: DoctorReport;
  runtimeIssues: unknown[];
  runtimeEvents: unknown[];
  qualityReports: LabQualityReportRow[];
  coverage: LabCoverageSummary | null;
  ciRuns: LabCiRun[];
  /** Present when recent CI failures are GitHub billing / spending-limit blocks. */
  ciBillingBlocker: LabCiBillingBlocker | null;
  thirdPartyApis: unknown[];
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
    thirdPartyCount: number;
    coverageLines?: number;
  };
}

const DOCTOR_TTL_MS = 60_000;
const doctorCache = new Map<string, { at: number; report: DoctorReport }>();

function computeStats(
  events: unknown[],
  issueGroups: LabIssueSummary[],
  coverage: LabCoverageSummary | null,
): LabDashboardData["stats"] {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recentEvents = events.filter((e) => {
    const ts = (e as { timestamp?: string }).timestamp;
    return ts ? new Date(ts).getTime() >= since : false;
  });

  const errors = recentEvents.filter((e) => {
    const type = (e as { type?: string }).type ?? "";
    return (
      type.includes("exception") ||
      type.includes("rejection") ||
      type === "request_error" ||
      type === "third_party_response"
    );
  });

  const slow = recentEvents.filter((e) => (e as { type?: string }).type === "slow_request");
  const memory = recentEvents.filter((e) => (e as { type?: string }).type === "memory_spike");
  const thirdParty = recentEvents.filter(
    (e) => (e as { type?: string }).type === "third_party_response",
  );

  const errorRate24h = recentEvents.length ? errors.length / recentEvents.length : 0;
  const unresolvedCritical = issueGroups.filter((i) => {
    return i.severity === "critical" || i.severity === "high";
  }).length;

  return {
    issueCount: issueGroups.length,
    eventCount: events.length,
    errorRate24h: Math.round(errorRate24h * 1000) / 10,
    slowRequestCount: slow.length,
    memorySpikeCount: memory.length,
    unresolvedCritical,
    events24h: recentEvents.length,
    errors24h: errors.length,
    thirdPartyCount: thirdParty.length,
    coverageLines: coverage?.lines,
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
    labInstalls: {
      count: 0,
      versions: [],
      multiVersion: false,
      staleCount: 0,
      ok: true,
      warnings: [],
    },
    sourceMaps: { count: 0, scanned: 0 },
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

  // Hot path: only gather what the Lab poll UI needs. Impressions /
  // CellularMemory file trees are unused by the client and are skipped so a
  // live-event poll storm does not thrash the filesystem.
  const settled = await Promise.allSettled([
    cachedDoctorLite(root),
    readRuntimeRecords(root, "issues"),
    readRuntimeRecords(root, "events"),
    listQualityReports(root),
    listLabReleases(root),
    listSourceMapMeta(root),
    readCoverageSummary(root),
    listCiRuns(root),
  ]);

  const value = <T>(index: number, fallback: T): T => {
    const result = settled[index];
    return result?.status === "fulfilled" ? (result.value as T) : fallback;
  };

  const doctor = value(0, emptyDoctor());
  const runtimeIssues = value(1, [] as unknown[]);
  const runtimeEvents = value(2, [] as unknown[]);
  const qualityReports = value(3, [] as LabDashboardData["qualityReports"]);
  const releases = value(4, [] as LabDashboardData["releases"]);
  const sourceMaps = value(5, [] as LabDashboardData["sourceMaps"]);
  const coverage = value(6, null as LabCoverageSummary | null);
  const ciRuns = value(7, [] as LabCiRun[]);
  const issueGroups = groupIssues(runtimeIssues, runtimeEvents);

  // Aggregates use the full in-memory set; the wire payload is capped so a
  // 200-viewer poll storm does not ship megabytes of raw events per request.
  return trimLabPayload({
    doctor,
    runtimeIssues,
    runtimeEvents,
    qualityReports,
    coverage,
    ciRuns,
    ciBillingBlocker: summarizeCiBillingBlocker(ciRuns),
    thirdPartyApis: thirdPartyEvents(runtimeEvents),
    impressions: [],
    cellularMemory: [],
    releases,
    sourceMaps,
    issueGroups,
    eventTimeline: buildEventTimeline(runtimeEvents),
    slowEndpoints: topSlowEndpoints(runtimeEvents),
    stats: computeStats(runtimeEvents, issueGroups, coverage),
  });
}

/**
 * Fetch full event detail only when an operator opens an issue. The polling
 * payload intentionally carries slim/capped rows; this endpoint preserves
 * older stacks, breadcrumbs and contexts without making every viewer pay for
 * them every five seconds.
 */
export async function collectLabIssueEvents(root: string, issueId: string): Promise<unknown[]> {
  const [issues, events] = await Promise.all([
    readRuntimeRecords(root, "issues"),
    readRuntimeRecords(root, "events"),
  ]);
  return eventsForIssue(issueId, issues, events);
}

/** Max raw events shipped on the polling `/data` path. UI shows ≤100. */
export const LAB_DATA_EVENT_CAP = 200;
/** Max quality report rows on the wire. */
export const LAB_DATA_QUALITY_CAP = 50;
/** Max release rows on the wire. */
export const LAB_DATA_RELEASE_CAP = 50;

const LIST_EVENT_KEYS = [
  "id",
  "timestamp",
  "type",
  "message",
  "endpoint",
  "method",
  "statusCode",
  "durationMs",
  "fingerprint",
  "environment",
  "release",
  "source",
  "provider",
] as const;

function slimListEvent(raw: unknown): Record<string, unknown> {
  const event = (raw ?? {}) as Record<string, unknown>;
  const slim: Record<string, unknown> = {};
  for (const key of LIST_EVENT_KEYS) {
    if (event[key] !== undefined) slim[key] = event[key];
  }
  return slim;
}

function parseEventTime(raw: unknown): number {
  const ts = (raw as { timestamp?: string } | null)?.timestamp;
  if (!ts) return 0;
  const ms = new Date(ts).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

/**
 * Shape the dashboard payload for the poll path:
 *  - keep pre-aggregated views (issueGroups, timeline, slowEndpoints, stats)
 *  - ship only the newest N slim events (list/detail filtering)
 *  - drop unused/raw blobs the Lab UI never renders (full issues, file trees)
 */
export function trimLabPayload(data: LabDashboardData): LabDashboardData {
  const recentEvents = [...data.runtimeEvents]
    .sort((a, b) => parseEventTime(b) - parseEventTime(a))
    .slice(0, LAB_DATA_EVENT_CAP)
    .map(slimListEvent);

  return {
    ...data,
    // Aggregates already carry the detail the UI needs (latestEvent, counts).
    runtimeIssues: [],
    runtimeEvents: recentEvents,
    // File trees are unused by the Lab client and are expensive to serialise.
    impressions: [],
    cellularMemory: [],
    qualityReports: data.qualityReports.slice(0, LAB_DATA_QUALITY_CAP),
    releases: data.releases.slice(0, LAB_DATA_RELEASE_CAP),
    sourceMaps: data.sourceMaps.slice(0, LAB_DATA_RELEASE_CAP),
    ciRuns: data.ciRuns.slice(0, LAB_DATA_QUALITY_CAP),
  };
}

/**
 * Micro-cache for the dashboard payload.
 *
 * The Lab dashboard is poll-based (no sockets): every open tab requests
 * `GET {apiPrefix}/data` on an interval. During a live incident 100s of
 * viewers can poll near-simultaneously. Without coalescing, each request
 * runs `collectLabData` — which reads/parses the runtime DB (up to 2000
 * events + 2000 issues) under a global lock and re-aggregates everything.
 * That serialises on the store mutex and latency grows unbounded.
 *
 * `getLabData` collapses all reads inside a short TTL window into a single
 * computation (single-flight) and hands every concurrent caller the same
 * result plus a weak ETag so unchanged polls can be answered with 304.
 */
export const LAB_DATA_CACHE_TTL_MS = 2000;

interface CacheEntry {
  at: number;
  etag: string;
  data: LabDashboardData;
}

const dataCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

function weakEtag(data: LabDashboardData): string {
  const hash = createHash("sha1").update(JSON.stringify(data)).digest("hex").slice(0, 27);
  return `W/"${hash}"`;
}

async function computeAndCache(root: string): Promise<CacheEntry> {
  const data = await collectLabData(root);
  const entry: CacheEntry = { at: Date.now(), etag: weakEtag(data), data };
  dataCache.set(root, entry);
  return entry;
}

export interface CachedLabData {
  data: LabDashboardData;
  etag: string;
  /** true when served from the micro-cache or a coalesced in-flight computation. */
  cached: boolean;
}

/**
 * Cached, request-coalesced accessor for {@link collectLabData}. Prefer this
 * on the hot polling path; use `collectLabData` directly only when a fully
 * fresh, uncached snapshot is required.
 */
export async function getLabData(
  root: string,
  opts?: { maxAgeMs?: number },
): Promise<CachedLabData> {
  const ttl = opts?.maxAgeMs ?? LAB_DATA_CACHE_TTL_MS;
  const hit = dataCache.get(root);
  if (hit && Date.now() - hit.at < ttl) {
    return { data: hit.data, etag: hit.etag, cached: true };
  }

  let flight = inflight.get(root);
  const isLeader = !flight;
  if (!flight) {
    flight = computeAndCache(root).finally(() => {
      inflight.delete(root);
    });
    inflight.set(root, flight);
  }

  const entry = await flight;
  return { data: entry.data, etag: entry.etag, cached: !isLeader };
}

/** Test/utility hook — drop cached payloads (e.g. between test cases). */
export function clearLabDataCache(root?: string): void {
  if (root) {
    dataCache.delete(root);
    inflight.delete(root);
  } else {
    dataCache.clear();
    inflight.clear();
  }
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
