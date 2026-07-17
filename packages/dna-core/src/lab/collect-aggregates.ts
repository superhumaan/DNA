type RuntimeIssue = {
  id?: string;
  eventId?: string;
  severity?: string;
  category?: string;
  title?: string;
  summary?: string;
  endpoint?: string;
  suggestedFix?: string;
  stackTraceSummary?: string;
  repeated?: boolean;
  confidence?: number;
  fingerprint?: string;
  repeatCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  latestEvent?: RuntimeEvent;
};

type RuntimeEvent = {
  id?: string;
  timestamp?: string;
  type?: string;
  message?: string;
  stack?: string;
  frames?: Array<{ filename?: string; function?: string; lineno?: number; colno?: number; inApp?: boolean }>;
  breadcrumbs?: Array<{ timestamp?: string; category?: string; message?: string; level?: string }>;
  contexts?: Record<string, Record<string, unknown>>;
  tags?: Record<string, string>;
  request?: Record<string, unknown>;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  environment?: string;
  release?: string;
  fingerprint?: string;
  provider?: string;
  source?: string;
  responseBody?: string;
};

export interface LabIssueSummary {
  id: string;
  fingerprint?: string;
  title: string;
  severity: string;
  category: string;
  count: number;
  lastSeen: string;
  firstSeen: string;
  endpoint?: string;
  summary?: string;
  suggestedFix?: string;
  stackTraceSummary?: string;
  repeated?: boolean;
  latestEvent?: RuntimeEvent;
  environment?: string;
  release?: string;
}

export interface LabEventTimelineBucket {
  label: string;
  errors: number;
  total: number;
}

export interface LabSlowEndpoint {
  endpoint: string;
  method: string;
  count: number;
  avgMs: number;
  maxMs: number;
}

const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function parseTime(value?: string): number {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function issueKey(issue: RuntimeIssue): string {
  if (issue.fingerprint) return `fp:${issue.fingerprint}`;
  return String(issue.title || issue.summary || issue.id || "unknown");
}

export function groupIssues(issues: unknown[], events: unknown[]): LabIssueSummary[] {
  const eventById = new Map<string, RuntimeEvent>();
  const eventsByFingerprint = new Map<string, RuntimeEvent[]>();

  for (const raw of events) {
    const event = raw as RuntimeEvent;
    if (event.id) eventById.set(event.id, event);
    if (event.fingerprint) {
      const list = eventsByFingerprint.get(event.fingerprint) ?? [];
      list.push(event);
      eventsByFingerprint.set(event.fingerprint, list);
    }
  }

  const grouped = new Map<string, LabIssueSummary>();

  for (const raw of issues) {
    const issue = raw as RuntimeIssue;
    const key = issueKey(issue);
    const linked = issue.eventId ? eventById.get(issue.eventId) : undefined;
    const latest = issue.latestEvent ?? linked;
    const seenAt =
      issue.lastSeen ||
      latest?.timestamp ||
      linked?.timestamp ||
      "";
    const firstAt = issue.firstSeen || seenAt;
    const existing = grouped.get(key);
    const count = Math.max(1, issue.repeatCount ?? 1);

    if (!existing) {
      grouped.set(key, {
        id: String(issue.id ?? key),
        fingerprint: issue.fingerprint,
        title: String(issue.title || issue.summary || "Untitled issue"),
        severity: String(issue.severity ?? "medium"),
        category: String(issue.category ?? "unknown"),
        count,
        lastSeen: seenAt,
        firstSeen: firstAt,
        endpoint: issue.endpoint ?? latest?.endpoint ?? linked?.endpoint,
        summary: issue.summary,
        suggestedFix: issue.suggestedFix,
        stackTraceSummary:
          issue.stackTraceSummary ??
          latest?.frames?.[0]?.filename ??
          latest?.stack?.split("\n")[0] ??
          linked?.stack?.split("\n")[0],
        repeated: issue.repeated || count > 1,
        latestEvent: latest,
        environment: latest?.environment,
        release: latest?.release,
      });
      continue;
    }

    existing.count = Math.max(existing.count, count, existing.count + 1);
    if (parseTime(seenAt) > parseTime(existing.lastSeen)) {
      existing.lastSeen = seenAt;
      if (latest) existing.latestEvent = latest;
    }
    if (parseTime(firstAt) && (parseTime(firstAt) < parseTime(existing.firstSeen) || !existing.firstSeen)) {
      existing.firstSeen = firstAt;
    }
    if (!existing.endpoint && (issue.endpoint || latest?.endpoint || linked?.endpoint)) {
      existing.endpoint = issue.endpoint ?? latest?.endpoint ?? linked?.endpoint;
    }
    if (!existing.stackTraceSummary) {
      existing.stackTraceSummary =
        issue.stackTraceSummary ??
        latest?.stack?.split("\n")[0] ??
        linked?.stack?.split("\n")[0];
    }
    const rank = SEVERITY_RANK[issue.severity ?? ""] ?? 9;
    const existingRank = SEVERITY_RANK[existing.severity] ?? 9;
    if (rank < existingRank) existing.severity = String(issue.severity);
  }

  // Prefer fingerprint event counts when richer
  for (const row of grouped.values()) {
    if (row.fingerprint) {
      const related = eventsByFingerprint.get(row.fingerprint) ?? [];
      if (related.length > row.count) row.count = related.length;
      if (!row.lastSeen && related[0]?.timestamp) {
        const sorted = [...related].sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp));
        row.lastSeen = sorted[0]?.timestamp ?? row.lastSeen;
        row.firstSeen = sorted[sorted.length - 1]?.timestamp ?? row.firstSeen;
        row.latestEvent = sorted[0] ?? row.latestEvent;
      }
    }
  }

  return [...grouped.values()].sort((a, b) => {
    const sev = (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9);
    if (sev !== 0) return sev;
    return parseTime(b.lastSeen) - parseTime(a.lastSeen);
  });
}

export function buildEventTimeline(events: unknown[], hours = 24): LabEventTimelineBucket[] {
  const now = Date.now();
  const buckets: LabEventTimelineBucket[] = [];

  for (let i = hours - 1; i >= 0; i -= 1) {
    const start = now - (i + 1) * 60 * 60 * 1000;
    // Newest bucket is inclusive of `now` so an event timestamped Date.now() counts.
    const end = i === 0 ? now + 1 : now - i * 60 * 60 * 1000;
    const label = new Date(end - 30 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let errors = 0;
    let total = 0;
    for (const raw of events) {
      const event = raw as RuntimeEvent;
      const ts = parseTime(event.timestamp);
      if (ts < start || ts >= end) continue;
      total += 1;
      const type = event.type ?? "";
      if (
        type.includes("exception") ||
        type.includes("rejection") ||
        type === "request_error" ||
        type === "third_party_response"
      ) {
        errors += 1;
      }
    }

    buckets.push({ label, errors, total });
  }

  return buckets;
}

export function topSlowEndpoints(events: unknown[], limit = 10): LabSlowEndpoint[] {
  const map = new Map<string, LabSlowEndpoint>();

  for (const raw of events) {
    const event = raw as RuntimeEvent;
    if (event.type !== "slow_request" || !event.endpoint) continue;
    const key = `${event.method ?? "GET"} ${event.endpoint}`;
    const duration = Number(event.durationMs ?? 0);
    const row = map.get(key) ?? {
      endpoint: event.endpoint,
      method: event.method ?? "GET",
      count: 0,
      avgMs: 0,
      maxMs: 0,
    };
    row.count += 1;
    row.maxMs = Math.max(row.maxMs, duration);
    row.avgMs = Math.round((row.avgMs * (row.count - 1) + duration) / row.count);
    map.set(key, row);
  }

  return [...map.values()].sort((a, b) => b.maxMs - a.maxMs).slice(0, limit);
}

export function eventsForIssue(issueId: string, issues: unknown[], events: unknown[]): RuntimeEvent[] {
  const issue = issues.find((raw) => (raw as RuntimeIssue).id === issueId) as RuntimeIssue | undefined;
  if (!issue) {
    // issueId may be the group id / fingerprint key from Lab UI
    const byFingerprint = (events as RuntimeEvent[]).filter((e) => e.fingerprint && issueId.includes(e.fingerprint));
    if (byFingerprint.length) {
      return byFingerprint
        .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))
        .slice(0, 50);
    }
    return [];
  }

  const title = String(issue.title || issue.summary || "");
  return (events as RuntimeEvent[])
    .filter((event) => {
      if (issue.fingerprint && event.fingerprint === issue.fingerprint) return true;
      if (issue.eventId && event.id === issue.eventId) return true;
      return (event.message ?? "").includes(title) || event.endpoint === issue.endpoint;
    })
    .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))
    .slice(0, 50);
}

export function thirdPartyEvents(events: unknown[], limit = 50): RuntimeEvent[] {
  return (events as RuntimeEvent[])
    .filter((e) => e.type === "third_party_response" || e.source === "outbound")
    .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))
    .slice(0, limit);
}
