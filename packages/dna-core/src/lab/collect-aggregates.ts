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
};

type RuntimeEvent = {
  id?: string;
  timestamp?: string;
  type?: string;
  message?: string;
  stack?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  environment?: string;
  release?: string;
};

export interface LabIssueSummary {
  id: string;
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
  return String(issue.title || issue.summary || issue.id || "unknown");
}

export function groupIssues(issues: unknown[], events: unknown[]): LabIssueSummary[] {
  const eventById = new Map<string, RuntimeEvent>();
  for (const raw of events) {
    const event = raw as RuntimeEvent;
    if (event.id) eventById.set(event.id, event);
  }

  const grouped = new Map<string, LabIssueSummary>();

  for (const raw of issues) {
    const issue = raw as RuntimeIssue;
    const key = issueKey(issue);
    const linked = issue.eventId ? eventById.get(issue.eventId) : undefined;
    const seenAt = linked?.timestamp ?? new Date().toISOString();
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        id: String(issue.id ?? key),
        title: key,
        severity: String(issue.severity ?? "medium"),
        category: String(issue.category ?? "unknown"),
        count: 1,
        lastSeen: seenAt,
        firstSeen: seenAt,
        endpoint: issue.endpoint ?? linked?.endpoint,
        summary: issue.summary,
        suggestedFix: issue.suggestedFix,
        stackTraceSummary: issue.stackTraceSummary ?? linked?.stack?.split("\n")[0],
        repeated: issue.repeated,
      });
      continue;
    }

    existing.count += 1;
    if (parseTime(seenAt) > parseTime(existing.lastSeen)) existing.lastSeen = seenAt;
    if (parseTime(seenAt) < parseTime(existing.firstSeen)) existing.firstSeen = seenAt;
    if (!existing.endpoint && (issue.endpoint || linked?.endpoint)) {
      existing.endpoint = issue.endpoint ?? linked?.endpoint;
    }
    if (!existing.stackTraceSummary && (issue.stackTraceSummary || linked?.stack)) {
      existing.stackTraceSummary = issue.stackTraceSummary ?? linked?.stack?.split("\n")[0];
    }
    const rank = SEVERITY_RANK[issue.severity ?? ""] ?? 9;
    const existingRank = SEVERITY_RANK[existing.severity] ?? 9;
    if (rank < existingRank) existing.severity = String(issue.severity);
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
    const end = now - i * 60 * 60 * 1000;
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
      if (type.includes("exception") || type.includes("rejection") || type === "request_error") {
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
    row.avgMs = Math.round(((row.avgMs * (row.count - 1)) + duration) / row.count);
    map.set(key, row);
  }

  return [...map.values()].sort((a, b) => b.maxMs - a.maxMs).slice(0, limit);
}

export function eventsForIssue(issueId: string, issues: unknown[], events: unknown[]): RuntimeEvent[] {
  const issue = issues.find((raw) => (raw as RuntimeIssue).id === issueId) as RuntimeIssue | undefined;
  if (!issue) return [];

  const title = issueKey(issue);
  return (events as RuntimeEvent[])
    .filter((event) => {
      if (issue.eventId && event.id === issue.eventId) return true;
      return (event.message ?? "").includes(title) || event.endpoint === issue.endpoint;
    })
    .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))
    .slice(0, 50);
}
