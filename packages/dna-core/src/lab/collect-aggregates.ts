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
  user?: { id?: string; email?: string; username?: string; ip_address?: string };
  extra?: Record<string, unknown>;
  spans?: Array<{
    op?: string;
    description?: string;
    startTimestamp?: number;
    timestamp?: number;
    durationMs?: number;
    status?: string;
  }>;
};

export interface LabIssueSummary {
  id: string;
  fingerprint?: string;
  /** Short scannable id for list rows (e.g. DNA-A1B2). */
  shortId: string;
  title: string;
  severity: string;
  category: string;
  count: number;
  /** Distinct user ids when events carry user context. */
  userCount: number;
  lastSeen: string;
  firstSeen: string;
  /** Milliseconds between first and last seen (0 if unknown). */
  ageMs: number;
  /** Hourly event counts for the last 24h (oldest → newest). */
  trend24h: number[];
  /** Culprit / origin line for list subtext. */
  culprit?: string;
  endpoint?: string;
  summary?: string;
  suggestedFix?: string;
  stackTraceSummary?: string;
  repeated?: boolean;
  latestEvent?: RuntimeEvent;
  environment?: string;
  release?: string;
  /** Top tag key=value pairs for list density. */
  topTags?: Array<{ key: string; value: string; count: number }>;
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

export function shortIssueId(seed: string): string {
  let hash = 0;
  const s = String(seed || "issue");
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return `DNA-${hash.toString(16).toUpperCase().slice(0, 4)}`;
}

export function eventUserKey(event: RuntimeEvent): string | null {
  const user = event.user ?? (event.contexts?.user as RuntimeEvent["user"] | undefined);
  if (!user || typeof user !== "object") return null;
  const id = user.id ?? user.email ?? user.username ?? user.ip_address;
  return id != null && String(id).length ? String(id) : null;
}

export function issueCulprit(issue: LabIssueSummary, latest?: RuntimeEvent): string {
  const frame =
    latest?.frames?.find((f) => f.inApp) ??
    latest?.frames?.[0];
  if (frame?.filename) {
    const loc =
      frame.lineno != null
        ? `${frame.filename}:${frame.lineno}`
        : frame.filename;
    return frame.function ? `${frame.function}(${loc})` : loc;
  }
  if (issue.endpoint) {
    return `${latest?.method ?? "GET"} ${issue.endpoint}`;
  }
  if (issue.stackTraceSummary) return issue.stackTraceSummary.slice(0, 120);
  return latest?.message?.slice(0, 120) || issue.summary?.slice(0, 120) || "";
}

/** Hourly counts for the last `hours` (default 24), oldest → newest. */
export function buildIssueTrend(events: RuntimeEvent[], hours = 24, now = Date.now()): number[] {
  const buckets = Array.from({ length: hours }, () => 0);
  for (const event of events) {
    const ts = parseTime(event.timestamp);
    if (!ts) continue;
    const ageH = Math.floor((now - ts) / (60 * 60 * 1000));
    if (ageH < 0 || ageH >= hours) continue;
    buckets[hours - 1 - ageH] += 1;
  }
  return buckets;
}

function relatedEventsForRow(
  row: LabIssueSummary,
  eventsByFingerprint: Map<string, RuntimeEvent[]>,
  allEvents: RuntimeEvent[],
): RuntimeEvent[] {
  if (row.fingerprint) {
    const byFp = eventsByFingerprint.get(row.fingerprint);
    if (byFp?.length) return byFp;
  }
  const title = row.title;
  return allEvents.filter((event) => {
    if (row.fingerprint && event.fingerprint === row.fingerprint) return true;
    if (row.endpoint && event.endpoint === row.endpoint) return true;
    return (event.message ?? "").includes(title);
  });
}

function enrichIssueRow(
  row: LabIssueSummary,
  related: RuntimeEvent[],
  now = Date.now(),
): LabIssueSummary {
  const users = new Set<string>();
  const tagCounts = new Map<string, number>();
  for (const event of related) {
    const key = eventUserKey(event);
    if (key) users.add(key);
    if (event.tags) {
      for (const [k, v] of Object.entries(event.tags)) {
        const tk = `${k}=${v}`;
        tagCounts.set(tk, (tagCounts.get(tk) ?? 0) + 1);
      }
    }
  }
  const first = parseTime(row.firstSeen);
  const last = parseTime(row.lastSeen);
  const latest = row.latestEvent ?? related[0];
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([pair, count]) => {
      const eq = pair.indexOf("=");
      return {
        key: eq >= 0 ? pair.slice(0, eq) : pair,
        value: eq >= 0 ? pair.slice(eq + 1) : "",
        count,
      };
    });

  return {
    ...row,
    shortId: shortIssueId(row.fingerprint || row.id || row.title),
    userCount: users.size,
    ageMs: first && last && last >= first ? last - first : first ? Math.max(0, now - first) : 0,
    trend24h: buildIssueTrend(related, 24, now),
    culprit: issueCulprit(row, latest),
    topTags,
    environment: row.environment ?? latest?.environment,
    release: row.release ?? latest?.release,
  };
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
        shortId: "",
        title: String(issue.title || issue.summary || "Untitled issue"),
        severity: String(issue.severity ?? "medium"),
        category: String(issue.category ?? "unknown"),
        count,
        userCount: 0,
        lastSeen: seenAt,
        firstSeen: firstAt,
        ageMs: 0,
        trend24h: [],
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

  const allEvents = events as RuntimeEvent[];
  const now = Date.now();

  // Prefer fingerprint event counts when richer, then enrich for list density.
  const enriched: LabIssueSummary[] = [];
  for (const row of grouped.values()) {
    const related = relatedEventsForRow(row, eventsByFingerprint, allEvents);
    if (related.length > row.count) row.count = related.length;
    if (related.length) {
      const sorted = [...related].sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp));
      if (!row.lastSeen || parseTime(sorted[0]?.timestamp) > parseTime(row.lastSeen)) {
        row.lastSeen = sorted[0]?.timestamp ?? row.lastSeen;
        row.latestEvent = sorted[0] ?? row.latestEvent;
      }
      const oldest = sorted[sorted.length - 1]?.timestamp;
      if (oldest && (!row.firstSeen || parseTime(oldest) < parseTime(row.firstSeen))) {
        row.firstSeen = oldest;
      }
    }
    enriched.push(enrichIssueRow(row, related, now));
  }

  return enriched.sort((a, b) => {
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
