export const LAB_CLIENT_JS = `
const API = "/api/dna/labs";
const state = {
  view: "landing",
  tab: "overview",
  selectedIssueId: null,
  severityFilter: "all",
  searchQuery: "",
  tagSearchQuery: "",
  navOpenGroup: null,
  qualityTab: "reports",
  pairingId: null,
  registerStep: "pair",
  localMode: false,
  data: null,
  error: "",
  success: "",
  otpDev: "",
  lastRefresh: null,
  dataEtag: null,
  issueEvents: {},
};

const NAV = [
  ["overview", "Overview", "fa-chart-line", "Monitor"],
  ["issues", "Issues", "fa-bug", "Monitor"],
  ["events", "Events", "fa-bolt", "Monitor"],
  ["performance", "Performance", "fa-gauge-high", "Monitor"],
  ["releases", "Releases", "fa-rocket", "Delivery"],
  ["quality", "Quality", "fa-shield-halved", "Delivery"],
];

function esc(t) {
  return String(t ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function dnaWebBrand(href, fixed) {
  return '<a class="dna-web-brand' + (fixed ? ' dna-web-brand--fixed' : '') + '" href="' + esc(href || '/labs') + '" aria-label="DNA Lab">' +
    '<span class="dna-web-brand__icon"><i class="fa-duotone fa-solid fa-dna" aria-hidden="true"></i></span>' +
    '</a>';
}

function groupForTab(tab) {
  const item = NAV.find((n) => n[0] === tab);
  return item ? item[3] : "Monitor";
}

function matchesSearch() {
  const q = String(state.searchQuery || "").trim().toLowerCase();
  if (!q) return () => true;
  return (parts) => parts.some((p) => String(p || "").toLowerCase().includes(q));
}

function listToolbar(placeholder, tabsHtml) {
  return '<div class="lab-list-toolbar">' +
    '<div class="lab-search">' +
    '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
    '<input type="search" class="lab-search__input" data-search placeholder="' + esc(placeholder) + '" value="' + esc(state.searchQuery || "") + '" autocomplete="off" />' +
    '</div>' +
    (tabsHtml ? '<div class="lab-product-tabs" role="tablist">' + tabsHtml + '</div>' : '') +
    '</div>';
}

function tableEmptyRow(colspan, message) {
  return '<tr class="lab-table__empty"><td colspan="' + colspan + '">' + esc(message) + '</td></tr>';
}

function authAtmosphere() {
  return '<div class="soli-auth-atmosphere" aria-hidden="true"></div>';
}

function authShell(hero, panel) {
  return '<div class="soli-auth-root">' + authAtmosphere() + dnaWebBrand('/labs', true) +
    '<div class="soli-auth-welcome"><main class="soli-auth-welcome__shell">' +
    '<div class="soli-auth-welcome__hero">' + hero + '</div>' +
    '<div class="soli-auth-welcome__panel">' + panel + '</div></main></div></div>';
}

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

function severityBadge(sev) {
  const s = String(sev || "medium").toLowerCase();
  const cls = ["critical","fatal"].includes(s) ? "critical" : ["high","error"].includes(s) ? "high" : ["medium","warning"].includes(s) ? "medium" : "low";
  return '<span class="lab-badge lab-badge--' + cls + '">' + esc(s) + '</span>';
}

function eventTypeBadge(type) {
  const t = String(type || "event");
  const bad = t.includes("exception") || t.includes("rejection") || t === "request_error";
  return '<span class="lab-badge lab-badge--' + (bad ? "error" : "info") + '">' + esc(t.replace(/_/g, " ")) + '</span>';
}

async function api(path, opts) {
  const res = await fetch(API + path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(opts && opts.headers) },
    ...opts,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.message || res.statusText);
  return json;
}

async function bootstrap() {
  try {
    const boot = await api("/bootstrap");
    state.localMode = boot.localMode;
    if (boot.localMode || boot.authenticated) {
      state.view = "dashboard";
      await refreshData();
    } else {
      state.view = "landing";
    }
  } catch (e) {
    state.error = e.message;
    state.view = "landing";
  }
  render();
}

async function refreshData() {
  const headers = {};
  if (state.dataEtag) headers["If-None-Match"] = state.dataEtag;
  const res = await fetch(API + "/data", { credentials: "same-origin", headers });
  state.lastRefresh = new Date();
  if (res.status === 304) return; // unchanged — skip re-render/redraw
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.message || res.statusText);
  state.dataEtag = res.headers.get("ETag") || state.dataEtag;
  state.data = json;
  render();
}

function findIssue(id) {
  const groups = state.data?.issueGroups || [];
  return groups.find((i) => i.id === id)
    || groups.find((i) => i.fingerprint === id)
    || groups.find((i) => i.title === id);
}

function eventsForIssue(issue) {
  if (!issue || !state.data) return [];
  const loaded = state.issueEvents[issue.id];
  if (loaded) return loaded;
  return (state.data.runtimeEvents || []).filter((e) => {
    if (issue.fingerprint && e.fingerprint === issue.fingerprint) return true;
    if (issue.endpoint && e.endpoint === issue.endpoint) return true;
    return (e.message || "").includes(issue.title);
  }).slice(0, 50);
}

async function loadIssueEvents(issueId) {
  if (!issueId || state.issueEvents[issueId]) return;
  const result = await api("/issues/" + encodeURIComponent(issueId) + "/events");
  state.issueEvents[issueId] = result.events || [];
  if (state.selectedIssueId === issueId) render();
}

function contextTable(contexts) {
  if (!contexts || !Object.keys(contexts).length) return emptyState('fa-cube', 'No contexts', 'Browser/OS/runtime contexts will appear when the client sends them.');
  return Object.keys(contexts).map((key) => {
    const rows = Object.entries(contexts[key] || {}).map(([k, v]) =>
      '<div class="lab-kv__row"><span class="lab-kv__key">' + esc(k) + '</span><span class="lab-kv__val"><code>' + esc(typeof v === 'object' ? JSON.stringify(v) : v) + '</code></span></div>'
    ).join("");
    return '<div class="lab-panel settings-card" style="margin-bottom:12px"><div class="lab-panel__head"><h2 class="lab-panel__title">' + esc(key) + '</h2></div><div class="lab-panel__body" style="padding:14px"><div class="lab-kv">' + rows + '</div></div></div>';
  }).join("");
}

function breadcrumbsHtml(crumbs) {
  if (!crumbs || !crumbs.length) return emptyState('fa-shoe-prints', 'No breadcrumbs', 'Enable the browser runtime client to capture navigation, clicks, and console trail.');
  const rows = crumbs.slice().reverse().map((b) =>
    '<tr><td><span class="lab-badge lab-badge--info">' + esc(b.category || "event") + '</span></td><td>' + esc(b.message) + '</td><td>' + timeAgo(b.timestamp) + '</td></tr>'
  ).join("");
  return '<table class="lab-table"><thead><tr><th>Category</th><th>Message</th><th>When</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function framesHtml(frames, stack) {
  if (frames && frames.length) {
    const rows = frames.map((f) =>
      '<div class="lab-frame' + (f.inApp ? ' lab-frame--app' : '') + '">' +
      '<span class="lab-frame__fn">' + esc(f.function || "(anonymous)") + '</span>' +
      '<span class="lab-frame__file">' + esc(f.filename || "?") + (f.lineno != null ? ':' + esc(f.lineno) + (f.colno != null ? ':' + esc(f.colno) : '') : '') + '</span></div>'
    ).join("");
    return '<div class="lab-frames">' + rows + '</div>';
  }
  return stackHtml(stack);
}

function requestHtml(req, event) {
  if (!req && !event?.endpoint) return emptyState('fa-globe', 'No request', 'HTTP snapshot not attached to this event.');
  const r = req || { url: event.endpoint, method: event.method, statusCode: event.statusCode };
  return '<div class="lab-kv">' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Method</span><span class="lab-kv__val"><code>' + esc(r.method || "—") + '</code></span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">URL</span><span class="lab-kv__val"><code>' + esc(r.url || event.endpoint || "—") + '</code></span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Status</span><span class="lab-kv__val">' + esc(r.statusCode ?? event.statusCode ?? "—") + '</span></div>' +
    (event.durationMs != null ? '<div class="lab-kv__row"><span class="lab-kv__key">Duration</span><span class="lab-kv__val">' + esc(event.durationMs) + 'ms</span></div>' : '') +
    (event.responseBody || r.bodySnippet ? '<div class="lab-kv__row"><span class="lab-kv__key">Body</span><span class="lab-kv__val"><pre class="lab-pre">' + esc(event.responseBody || r.bodySnippet) + '</pre></span></div>' : '') +
    '</div>';
}

function formatAge(ms) {
  if (!ms || ms < 0) return "—";
  const s = Math.floor(ms / 1000);
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 48) return h + "h";
  return Math.floor(h / 24) + "d";
}

function sparklineSvg(values, width, height) {
  const vals = Array.isArray(values) ? values : [];
  const w = width || 88;
  const h = height || 28;
  if (!vals.length) {
    return '<svg class="lab-spark" width="' + w + '" height="' + h + '" aria-hidden="true"><line x1="0" y1="' + (h - 2) + '" x2="' + w + '" y2="' + (h - 2) + '" stroke="#e2e4e9" stroke-width="2"/></svg>';
  }
  const max = Math.max(1, ...vals);
  const step = w / Math.max(vals.length - 1, 1);
  const pts = vals.map((v, i) => {
    const x = i * step;
    const y = h - 2 - ((v / max) * (h - 6));
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");
  return '<svg class="lab-spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
    '<polyline fill="none" stroke="#5b21b6" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="' + pts + '"/>' +
    '</svg>';
}

function prettyJson(value) {
  try { return JSON.stringify(value, null, 2); } catch (_) { return String(value); }
}

function tagsTableHtml(tags, filterQ) {
  const entries = Object.entries(tags || {});
  if (!entries.length) return emptyState('fa-tags', 'No tags', 'Tags appear when the runtime client attaches key/value metadata.');
  const q = String(filterQ || "").trim().toLowerCase();
  const filtered = q
    ? entries.filter(([k, v]) => (k + " " + v).toLowerCase().includes(q))
    : entries;
  const rows = filtered.length
    ? filtered.map(([k, v]) => '<tr><td><code>' + esc(k) + '</code></td><td><code>' + esc(v) + '</code></td></tr>').join("")
    : tableEmptyRow(2, 'No tags match this filter.');
  return '<div class="lab-tag-filter"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
    '<input type="search" class="lab-tag-filter__input" data-tag-search placeholder="Filter tags…" value="' + esc(state.tagSearchQuery || "") + '" autocomplete="off" /></div>' +
    '<table class="lab-table"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function packagesHtml(contexts) {
  const pkgs = contexts?.packages || contexts?.app?.packages;
  if (!pkgs || typeof pkgs !== "object") {
    return emptyState('fa-box', 'No packages', 'Dependency versions appear when the client sends contexts.packages.');
  }
  const entries = Array.isArray(pkgs)
    ? pkgs.map((p) => [p.name || p, p.version || ""])
    : Object.entries(pkgs);
  if (!entries.length) return emptyState('fa-box', 'No packages', 'Dependency versions appear when the client sends contexts.packages.');
  const rows = entries.slice(0, 80).map(([name, ver]) =>
    '<tr><td><code>' + esc(name) + '</code></td><td><code>' + esc(ver) + '</code></td></tr>'
  ).join("");
  return '<table class="lab-table"><thead><tr><th>Package</th><th>Version</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function additionalDataHtml(event) {
  const extra = event?.extra || {};
  const known = new Set(["id","timestamp","type","message","stack","frames","breadcrumbs","contexts","tags","request","endpoint","method","statusCode","durationMs","environment","release","fingerprint","provider","source","responseBody","user","extra","spans"]);
  const leftover = {};
  Object.keys(event || {}).forEach((k) => {
    if (!known.has(k) && event[k] != null) leftover[k] = event[k];
  });
  const payload = Object.keys(extra).length ? { ...extra, ...leftover } : leftover;
  if (!Object.keys(payload).length) {
    return emptyState('fa-brackets-curly', 'No additional data', 'Arbitrary event.extra fields will show here as JSON.');
  }
  return '<pre class="lab-json">' + esc(prettyJson(payload)) + '</pre>';
}

function spansHtml(spans) {
  if (!spans || !spans.length) {
    return emptyState('fa-timeline', 'No trace spans', 'Span waterfalls appear when events include OpenTelemetry-style spans.');
  }
  const maxDur = Math.max(1, ...spans.map((s) => Number(s.durationMs || ((s.timestamp - s.startTimestamp) * 1000) || 0)));
  const rows = spans.slice(0, 40).map((s) => {
    const dur = Number(s.durationMs || ((s.timestamp - s.startTimestamp) * 1000) || 0);
    const pct = Math.max(2, Math.round((dur / maxDur) * 100));
    return '<div class="lab-span"><div class="lab-span__meta"><span class="lab-span__op">' + esc(s.op || "span") + '</span> ' +
      '<span class="lab-span__desc">' + esc(s.description || "") + '</span>' +
      '<span class="lab-span__dur">' + esc(Math.round(dur)) + 'ms</span></div>' +
      '<div class="lab-span__track"><div class="lab-span__bar" style="width:' + pct + '%"></div></div></div>';
  }).join("");
  return '<div class="lab-spans">' + rows + '</div>';
}

function highlightsHtml(issue, latest, events) {
  const items = [];
  if (issue.severity) items.push({ label: "Severity", value: issue.severity });
  if (issue.culprit) items.push({ label: "Culprit", value: issue.culprit });
  if (latest?.endpoint || issue.endpoint) items.push({ label: "Endpoint", value: (latest?.method || "GET") + " " + (latest?.endpoint || issue.endpoint) });
  if (latest?.environment || issue.environment) items.push({ label: "Environment", value: latest?.environment || issue.environment });
  if (latest?.release || issue.release) items.push({ label: "Release", value: latest?.release || issue.release });
  const appFrame = (latest?.frames || []).find((f) => f.inApp);
  if (appFrame) items.push({ label: "In-app frame", value: (appFrame.function || "?") + " · " + (appFrame.filename || "") + (appFrame.lineno != null ? ":" + appFrame.lineno : "") });
  if (issue.topTags && issue.topTags[0]) items.push({ label: "Top tag", value: issue.topTags[0].key + "=" + issue.topTags[0].value });
  if (events && events.length) items.push({ label: "Related events loaded", value: String(events.length) });
  if (!items.length) return emptyState('fa-lightbulb', 'No highlights yet', 'Highlights appear once events include stack, tags, or request context.');
  return '<div class="lab-highlights">' + items.map((it) =>
    '<div class="lab-highlight"><span class="lab-highlight__label">' + esc(it.label) + '</span><span class="lab-highlight__value">' + esc(it.value) + '</span></div>'
  ).join("") + '</div>';
}

function issueHeroHtml(issue) {
  return '<div class="lab-issue-hero">' +
    '<div class="lab-issue-hero__stat"><span class="lab-issue-hero__label">Events</span><span class="lab-issue-hero__value">' + esc(issue.count ?? 0) + '</span></div>' +
    '<div class="lab-issue-hero__stat"><span class="lab-issue-hero__label">Users</span><span class="lab-issue-hero__value">' + esc(issue.userCount != null ? issue.userCount : "—") + '</span></div>' +
    '<div class="lab-issue-hero__stat"><span class="lab-issue-hero__label">First seen</span><span class="lab-issue-hero__value">' + esc(timeAgo(issue.firstSeen)) + '</span><span class="lab-issue-hero__sub">' + esc(issue.firstSeen ? new Date(issue.firstSeen).toLocaleString() : "—") + '</span></div>' +
    '<div class="lab-issue-hero__stat"><span class="lab-issue-hero__label">Last seen</span><span class="lab-issue-hero__value">' + esc(timeAgo(issue.lastSeen)) + '</span><span class="lab-issue-hero__sub">' + esc(issue.lastSeen ? new Date(issue.lastSeen).toLocaleString() : "—") + '</span></div>' +
    '<div class="lab-issue-hero__stat lab-issue-hero__stat--trend"><span class="lab-issue-hero__label">24h trend</span>' + sparklineSvg(issue.trend24h, 120, 32) + '</div>' +
    '</div>';
}

function issueTable(issues, clickable, edge, emptyMsg) {
  const rows = issues.length
    ? issues.map((i) => {
      const shortId = i.shortId || ("DNA-" + String(i.id || "").slice(0, 4).toUpperCase());
      const culprit = i.culprit || i.endpoint || i.summary || "";
      return '<tr class="' + (clickable ? 'is-clickable' : '') + '" data-issue="' + esc(i.id) + '">' +
        '<td class="lab-issue-col"><div class="lab-issue-row__type">' + severityBadge(i.severity) + ' <span class="lab-issue-row__cat">' + esc(i.category || "error") + '</span></div>' +
        '<div class="lab-table__title">' + esc(i.title) + '</div>' +
        '<div class="lab-table__sub"><code>' + esc(shortId) + '</code>' + (culprit ? ' · ' + esc(String(culprit).slice(0, 80)) : '') + '</div></td>' +
        '<td>' + esc(timeAgo(i.lastSeen)) + '</td>' +
        '<td>' + esc(formatAge(i.ageMs)) + '</td>' +
        '<td class="lab-issue-trend">' + sparklineSvg(i.trend24h) + '</td>' +
        '<td>' + esc(i.count) + '</td>' +
        '<td>' + esc(i.userCount != null ? i.userCount : "—") + '</td></tr>';
    }).join("")
    : tableEmptyRow(6, emptyMsg || 'No issues match this filter.');
  return '<table class="lab-table admin-table lab-table--issues' + (edge ? ' admin-table--edge' : '') + '"><thead><tr>' +
    '<th>Issue</th><th>Last seen</th><th>Age</th><th>Trend <span class="lab-th-hint">24h</span></th><th>Events</th><th>Users</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table>';
}

function chartEmpty(ctx, w, h, msg) {
  ctx.fillStyle = "#94a3b8";
  ctx.font = "22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(msg || "No data yet", 24, Math.max(40, h / 2));
}

function drawTimeline(canvas, buckets) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = Math.max(320, canvas.offsetWidth * 2);
  const h = canvas.height = 320;
  ctx.clearRect(0, 0, w, h);
  if (!buckets?.length) { chartEmpty(ctx, w, h, "No event timeline yet"); return; }
  const pad = 36;
  const max = Math.max(1, ...buckets.map((b) => Math.max(b.errors || 0, b.total || 0)));
  const barW = (w - pad * 2) / buckets.length;
  buckets.forEach((b, i) => {
    const totalH = ((b.total / max) * (h - pad * 2)) || 2;
    const errH = ((b.errors / max) * (h - pad * 2)) || 0;
    const x = pad + i * barW + barW * 0.12;
    const bw = barW * 0.76;
    ctx.fillStyle = "#e2e4e9";
    ctx.fillRect(x, h - pad - totalH, bw, totalH);
    if (errH > 0) {
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(x, h - pad - errH, bw, errH);
    }
  });
  ctx.fillStyle = "#64748b";
  ctx.font = "20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Traffic (gray) · Errors (red) — 24h", pad, 26);
}

function drawSeverityChart(canvas, counts) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = Math.max(320, canvas.offsetWidth * 2);
  const h = canvas.height = 320;
  ctx.clearRect(0, 0, w, h);
  const entries = [
    ["critical", counts.critical || 0, "#7f1d1d"],
    ["high", counts.high || 0, "#dc2626"],
    ["medium", counts.medium || 0, "#d97706"],
    ["low", counts.low || 0, "#64748b"],
  ];
  const total = entries.reduce((n, e) => n + e[1], 0) + (counts.other || 0);
  if (!total) { chartEmpty(ctx, w, h, "No issues to chart"); return; }
  if (counts.other) entries.push(["other", counts.other, "#94a3b8"]);
  const pad = 36;
  const max = Math.max(1, ...entries.map((e) => e[1]));
  const rowH = (h - pad * 2) / entries.length;
  entries.forEach((e, i) => {
    const barW = ((e[1] / max) * (w - pad * 2 - 120)) || 2;
    const y = pad + i * rowH + rowH * 0.2;
    ctx.fillStyle = e[2];
    ctx.fillRect(pad + 100, y, barW, rowH * 0.55);
    ctx.fillStyle = "#334155";
    ctx.font = "20px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(e[0], pad, y + rowH * 0.45);
    ctx.fillStyle = "#64748b";
    ctx.fillText(String(e[1]), pad + 110 + barW, y + rowH * 0.45);
  });
}

function drawLatencyChart(canvas, slow) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = Math.max(320, canvas.offsetWidth * 2);
  const h = canvas.height = 320;
  ctx.clearRect(0, 0, w, h);
  const rows = (slow || []).slice(0, 8);
  if (!rows.length) { chartEmpty(ctx, w, h, "No slow endpoints yet"); return; }
  const pad = 36;
  const max = Math.max(1, ...rows.map((r) => Math.max(r.avgMs || 0, r.maxMs || 0)));
  const rowH = (h - pad * 2) / rows.length;
  rows.forEach((r, i) => {
    const label = ((r.method || "GET") + " " + (r.endpoint || "")).slice(0, 36);
    const avgW = ((r.avgMs / max) * (w - pad * 2 - 160)) || 2;
    const maxW = ((r.maxMs / max) * (w - pad * 2 - 160)) || 2;
    const y = pad + i * rowH + rowH * 0.15;
    ctx.fillStyle = "#c4b5fd";
    ctx.fillRect(pad + 150, y, maxW, rowH * 0.55);
    ctx.fillStyle = "#5b21b6";
    ctx.fillRect(pad + 150, y, avgW, rowH * 0.55);
    ctx.fillStyle = "#334155";
    ctx.font = "18px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(label, pad, y + rowH * 0.45);
  });
  ctx.fillStyle = "#64748b";
  ctx.font = "18px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Avg (purple) · Max (lilac)", pad, 24);
}

function drawIssueEventsChart(canvas, trend) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = Math.max(320, canvas.offsetWidth * 2);
  const h = canvas.height = 220;
  ctx.clearRect(0, 0, w, h);
  const vals = Array.isArray(trend) ? trend : [];
  if (!vals.length || !vals.some((v) => v > 0)) {
    chartEmpty(ctx, w, h, "No events in the last 24h");
    return;
  }
  const pad = 28;
  const max = Math.max(1, ...vals);
  const barW = (w - pad * 2) / vals.length;
  vals.forEach((v, i) => {
    const barH = ((v / max) * (h - pad * 2)) || (v ? 2 : 0);
    const x = pad + i * barW + barW * 0.15;
    ctx.fillStyle = v ? "#5b21b6" : "#e2e4e9";
    ctx.fillRect(x, h - pad - Math.max(barH, v ? 2 : 1), barW * 0.7, Math.max(barH, v ? 2 : 1));
  });
  ctx.fillStyle = "#64748b";
  ctx.font = "18px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Event volume (24h)", pad, 22);
}

function drawQualityTrend(canvas, reports) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = Math.max(320, canvas.offsetWidth * 2);
  const h = canvas.height = 320;
  ctx.clearRect(0, 0, w, h);
  const scores = (reports || []).map((r) => r.score ?? 0).filter((s) => s > 0);
  if (!scores.length) { chartEmpty(ctx, w, h, "No quality history yet"); return; }
  const pad = 36;
  // 80% reference line
  ctx.strokeStyle = "#e2e4e9";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  const y80 = h - pad - 0.8 * (h - pad * 2);
  ctx.beginPath(); ctx.moveTo(pad, y80); ctx.lineTo(w - pad, y80); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#5b21b6";
  ctx.lineWidth = 4;
  ctx.beginPath();
  scores.forEach((s, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(scores.length - 1, 1);
    const y = h - pad - (s / 100) * (h - pad * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#64748b";
  ctx.font = "20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Quality score trend · 80% gate", pad, 26);
}

function stackHtml(stack) {
  if (!stack) return '<div class="lab-empty"><p>No stack trace captured</p></div>';
  const lines = String(stack).split("\\n").map((line) => {
    const isApp = line.includes("/src/") || line.includes("/backend/") || line.includes("at ");
    return '<div class="' + (isApp ? "lab-stack__line--app" : "") + '">' + esc(line) + '</div>';
  }).join("");
  return '<div class="lab-stack">' + lines + '</div>';
}

function emptyState(icon, title, msg) {
  return '<div class="lab-empty"><i class="fa-solid ' + icon + '"></i><h3>' + esc(title) + '</h3><p>' + esc(msg) + '</p></div>';
}

function landingView() {
  const hero = '<h1>DNA Lab</h1><h2>Observability for your stack.</h2><p>Runtime issues, performance, quality gates, and releases — self-hosted on your project.</p>';
  const panel = (state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : '') +
    '<button class="btnp" data-action="signin">Sign in</button>' +
    '<button class="btns" data-action="register">Pair project</button>' +
    '<p class="lab-security-note">Local dev opens without login. Production uses email + OTP after <code>npx dna register lab</code>.</p>';
  return authShell(hero, panel);
}

function signinView() {
  const hero = '<h1>Sign in</h1><h2>Welcome back.</h2><p>Email, password, and one-time code.</p>';
  const panel = (state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : '') +
    (state.otpDev ? '<div class="lab-success">Dev OTP: <strong>' + esc(state.otpDev) + '</strong></div>' : '') +
    '<form id="signin-form"><div class="field"><label>Email</label><input name="email" type="email" required /></div>' +
    '<div class="field"><label>Password</label><input name="password" type="password" required /></div>' +
    '<div class="field"><label>OTP</label><input name="otp" inputmode="numeric" required /></div>' +
    '<button class="btnp" type="submit">Sign in</button>' +
    '<button class="btns" type="button" data-action="otp">Send OTP</button></form>';
  return authShell(hero, panel);
}

function registerView() {
  if ((state.registerStep || "pair") === "pair") {
    const hero = '<h1>Pair your project</h1><h2>Link local DNA to this deploy.</h2><p>Run <code>npx dna register lab --url ' + esc(location.origin) + '</code>, then paste the Pairing ID and 148-digit code below. Sign into the app first if your host requires a session — pairing uses that session plus the code.</p>';
    const panel = (state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : '') +
      (state.success ? '<div class="lab-success">' + esc(state.success) + '</div>' : '') +
      '<form id="pair-form"><div class="field"><label>Pairing ID</label><input name="pairingId" required /></div>' +
      '<div class="field"><label>148-digit code</label><textarea name="code" required></textarea></div>' +
      '<button class="btnp" type="submit">Verify pairing</button></form>';
    return authShell(hero, panel);
  }
  const hero = '<h1>Create account</h1><h2>Pairing verified.</h2><p>Set your profile and credentials.</p>';
  const panel = (state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : '') +
    '<form id="register-form"><div class="field"><label>Name</label><input name="name" required /></div>' +
    '<div class="field"><label>Email</label><input name="email" type="email" required /></div>' +
    '<div class="field"><label>Password</label><input name="password" type="password" required minlength="8" /></div>' +
    '<div class="field"><label>OTP</label><input name="otp" required /></div>' +
    '<button class="btns" type="button" data-action="reg-otp">Send OTP</button>' +
    '<button class="btnp" type="submit">Create account</button></form>';
  return authShell(hero, panel);
}

function sidebar(active) {
  const stats = state.data?.stats || {};
  const issueCount = stats.issueCount || 0;
  const openGroup = openNavGroup(active);
  const groups = {};
  NAV.forEach(([id, label, icon, group]) => {
    if (!groups[group]) groups[group] = [];
    groups[group].push([id, label, icon]);
  });
  const sections = Object.keys(groups).map((group) => {
    const isOpen = openGroup === group;
    const links = groups[group].map(([id, label, icon]) => {
      const badge = id === "issues" && issueCount ? '<span class="nav-badge">' + issueCount + '</span>' : '';
      return '<button type="button" class="soli-settings-nav-link' + (active === id ? ' is-active' : '') + '" data-tab="' + id + '"><i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span>' + badge + '</button>';
    }).join("");
    return '<div class="settings-nav-group' + (isOpen ? ' is-open' : '') + '">' +
      '<button type="button" class="sn-title sn-title--toggle" data-nav-group="' + esc(group) + '" aria-expanded="' + (isOpen ? 'true' : 'false') + '">' +
      '<span>' + esc(group) + '</span>' +
      '<i class="fa-solid fa-chevron-' + (isOpen ? 'down' : 'right') + '" aria-hidden="true"></i>' +
      '</button>' +
      '<div class="settings-nav-group__links"' + (isOpen ? '' : ' hidden') + '>' + links + '</div>' +
      '</div>';
  }).join("");
  const logout = !state.localMode
    ? '<div class="settings-nav-group" style="margin-top:20px"><button type="button" class="soli-settings-nav-link" data-action="logout"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i><span>Sign out</span></button></div>'
    : '';
  return '<aside class="settings-nav">' +
    '<div class="soli-portal-nav-brand">' + dnaWebBrand('/labs', false) + '</div>' +
    '<div class="settings-nav-scroll">' + sections + logout + '</div></aside>';
}

function openNavGroup(active) {
  return state.navOpenGroup != null ? state.navOpenGroup : groupForTab(active);
}

function pageHeader(title) {
  return '<header class="soli-administration-page-header">' +
    '<div class="soli-administration-page-header__title-row">' +
    '<h1 class="soli-administration-page-header__title">' + esc(title) + '</h1>' +
    '</div>' +
    '<div class="soli-administration-page-header__actions">' +
    '<button type="button" class="humaan-page-primary-btn soli-admin-header-btn" data-action="refresh"><i class="fa-solid fa-rotate" aria-hidden="true"></i> Refresh</button>' +
    '</div></header>';
}

function ciBillingBanner() {
  const b = state.data?.ciBillingBlocker;
  if (!b || !b.active) return "";
  return '<div class="lab-alert lab-alert--billing" role="alert">' +
    '<div class="lab-alert__icon" aria-hidden="true"><i class="fa-solid fa-credit-card"></i></div>' +
    '<div class="lab-alert__body">' +
    '<strong class="lab-alert__title">GitHub Actions billing blocker</strong>' +
    '<p class="lab-alert__text">' + esc(b.reason) +
    (b.sampleMessage ? ' <span class="lab-alert__sample">' + esc(b.sampleMessage) + '</span>' : '') +
    ' · ' + esc(b.affectedRuns) + ' recent run(s).</p>' +
    '<p class="lab-alert__actions"><a href="' + esc(b.billingUrl) + '" target="_blank" rel="noopener noreferrer">Open GitHub Billing</a>' +
    ' · Fix payment or raise the Actions spending limit, then re-run CI.</p>' +
    '</div></div>';
}

function overviewCountBySeverity(issues) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, other: 0 };
  for (const issue of issues || []) {
    const s = String(issue.severity || "").toLowerCase();
    if (s === "critical" || s === "fatal") counts.critical += 1;
    else if (s === "high" || s === "error") counts.high += 1;
    else if (s === "medium" || s === "warning") counts.medium += 1;
    else if (s === "low" || s === "info") counts.low += 1;
    else counts.other += 1;
  }
  return counts;
}

function overviewCiSuccess(runs) {
  let success = 0, total = 0, billing = 0;
  for (const run of runs || []) {
    if (run.failureKind === "billing") { billing += 1; total += 1; continue; }
    const conclusion = String(run.conclusion || "").toLowerCase();
    if (!conclusion && String(run.status || "").toLowerCase() === "in_progress") continue;
    if (!conclusion) continue;
    total += 1;
    if (conclusion === "success") success += 1;
  }
  if (!total) return { percent: null, success: 0, total: 0, billing };
  return { percent: Math.round((success / total) * 1000) / 10, success, total, billing };
}

function overviewLatestQuality(reports) {
  if (!reports || !reports.length) return { score: null, gate: null };
  const sorted = reports.slice().sort((a, b) => {
    const ta = a.mtime ? new Date(a.mtime).getTime() : 0;
    const tb = b.mtime ? new Date(b.mtime).getTime() : 0;
    return tb - ta;
  });
  const latest = sorted[0];
  return {
    score: latest?.score != null && Number.isFinite(latest.score) ? Number(latest.score) : null,
    gate: latest?.gate ?? null,
  };
}

function overviewTone(value, warnBelow, badBelow) {
  if (value == null || !Number.isFinite(value)) return "neutral";
  if (value < badBelow) return "bad";
  if (value < warnBelow) return "warn";
  return "ok";
}

function overviewBatteries(d) {
  const s = d.stats || {};
  const doctorOk = !!d.doctor?.validation?.valid;
  const doctorIssues = d.doctor?.validation?.issueCount ?? 0;
  const errorHealth = Math.max(0, Math.min(100, Math.round(100 - (s.errorRate24h || 0))));
  const coverage = s.coverageLines != null ? s.coverageLines : (d.coverage?.lines ?? null);
  const q = overviewLatestQuality(d.qualityReports || []);
  const ci = overviewCiSuccess(d.ciRuns || []);
  return [
    {
      id: "doctor", label: "Doctor",
      percent: doctorOk ? 100 : Math.max(10, 100 - doctorIssues * 15),
      display: doctorOk ? "Healthy" : "Issues",
      tone: doctorOk ? "ok" : "bad",
      hint: doctorOk ? "Validation passed" : doctorIssues + " validation issue(s)",
    },
    {
      id: "errors", label: "Error health",
      percent: errorHealth, display: errorHealth + "%",
      tone: overviewTone(errorHealth, 95, 90),
      hint: (s.errorRate24h || 0) + "% error rate (24h)",
    },
    {
      id: "coverage", label: "Coverage",
      percent: coverage != null ? Math.round(coverage) : null,
      display: coverage != null ? (Math.round(coverage * 10) / 10) + "%" : "—",
      tone: overviewTone(coverage, 80, 60),
      hint: coverage != null ? "Line coverage" : "Run test:coverage",
    },
    {
      id: "quality", label: "Quality",
      percent: q.score != null ? Math.round(q.score) : null,
      display: q.score != null ? String(Math.round(q.score)) : (q.gate ? String(q.gate).toUpperCase() : "—"),
      tone: q.gate === "pass" ? "ok" : q.gate === "fail" ? "bad" : overviewTone(q.score, 80, 60),
      hint: q.gate ? "Gate: " + q.gate : "Latest quality report",
    },
    {
      id: "ci", label: "CI success",
      percent: ci.percent != null ? Math.round(ci.percent) : null,
      display: ci.percent != null ? ci.percent + "%" : "—",
      tone: ci.billing > 0 ? "warn" : overviewTone(ci.percent, 90, 70),
      hint: ci.billing > 0 ? ci.billing + " billing-blocked run(s)" : (ci.total ? ci.success + "/" + ci.total + " recent runs" : "No concluded runs"),
    },
  ];
}

function batteryHtml(b) {
  const pct = b.percent == null ? 0 : Math.max(0, Math.min(100, b.percent));
  const empty = b.percent == null;
  return '<div class="lab-battery lab-battery--' + esc(b.tone || "neutral") + (empty ? ' is-empty' : '') + '" title="' + esc(b.hint || "") + '">' +
    '<div class="lab-battery__meta"><span class="lab-battery__label">' + esc(b.label) + '</span><span class="lab-battery__value">' + esc(b.display) + '</span></div>' +
    '<div class="lab-battery__track" role="meter" aria-label="' + esc(b.label) + '" aria-valuemin="0" aria-valuemax="100"' +
    (empty ? ' aria-valuetext="unknown"' : ' aria-valuenow="' + pct + '"') + '>' +
    '<div class="lab-battery__fill" style="width:' + (empty ? 0 : pct) + '%"></div></div>' +
    '<div class="lab-battery__hint">' + esc(b.hint || "") + '</div></div>';
}

function kpiCard(label, value, tone, sub) {
  return '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">' + esc(label) + '</div>' +
    '<div class="lab-stat-card__value' + (tone ? ' is-' + tone : '') + '">' + esc(value) + '</div>' +
    (sub ? '<div class="lab-stat-card__sub">' + esc(sub) + '</div>' : '') + '</div>';
}

function overviewPanelLink(tab, label) {
  return '<a href="#" class="lab-panel__link" data-tab="' + esc(tab) + '">' + esc(label) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>';
}

function overviewPanel() {
  const d = state.data || {};
  const s = d.stats || {};
  const issues = (d.issueGroups || []).slice(0, 8);
  const slow = (d.slowEndpoints || []).slice(0, 8);
  const ciRuns = (d.ciRuns || []).slice(0, 6);
  const events = (d.runtimeEvents || []).slice().reverse().slice(0, 8);
  const releases = (d.releases || []).slice(0, 4);
  const batteries = overviewBatteries(d);
  const q = overviewLatestQuality(d.qualityReports || []);
  const ci = overviewCiSuccess(d.ciRuns || []);
  const coverage = s.coverageLines != null ? s.coverageLines : (d.coverage?.lines ?? null);
  const doctorOk = !!d.doctor?.validation?.valid;

  const slowRows = slow.length
    ? slow.map((r) => '<tr><td><code>' + esc(r.method) + ' ' + esc(r.endpoint) + '</code></td><td>' + esc(r.count) + '</td><td>' + esc(r.avgMs) + 'ms</td><td>' + esc(r.maxMs) + 'ms</td></tr>').join("")
    : tableEmptyRow(4, 'No slow requests yet.');

  const ciRows = ciRuns.length
    ? ciRuns.map((r) => {
      const conclusion = (r.conclusion || r.status || "").toLowerCase();
      const billing = r.failureKind === "billing";
      const cls = billing ? "billing" : conclusion === "success" ? "ok" : conclusion === "failure" || conclusion === "cancelled" ? "critical" : "info";
      const badgeLabel = billing ? "billing" : (r.conclusion || r.status || "—");
      const title = r.url
        ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.displayTitle || r.workflowName) + '</a>'
        : esc(r.displayTitle || r.workflowName || "run");
      return '<tr><td>' + title + '<div class="lab-table__sub">' + esc(r.headBranch || r.workflowName || "") + '</div></td><td><span class="lab-badge lab-badge--' + cls + '">' + esc(badgeLabel) + '</span></td><td>' + timeAgo(r.updatedAt || r.createdAt) + '</td></tr>';
    }).join("")
    : tableEmptyRow(3, 'No CI runs yet.');

  const eventRows = events.length
    ? events.map((e) => '<tr><td>' + eventTypeBadge(e.type) + '</td><td><div class="lab-table__title">' + esc(e.message) + '</div><div class="lab-table__sub">' + esc(e.method || "") + ' ' + esc(e.endpoint || "") + '</div></td><td>' + timeAgo(e.timestamp) + '</td></tr>').join("")
    : tableEmptyRow(3, 'No runtime events yet.');

  const releaseBits = releases.length
    ? releases.map((r) => '<span class="lab-chip"><strong>' + esc(r.version) + '</strong> · ' + esc(r.environment || "—") + ' · ' + timeAgo(r.deployedAt) + '</span>').join("")
    : '<span class="lab-chip lab-chip--muted">No releases registered</span>';

  return '<div class="admin-page-body admin-page-body--form lab-overview">' +
    ciBillingBanner() +
    '<div class="lab-overview__intro"><div><h2 class="lab-overview__title">System performance</h2><p class="lab-overview__sub">Runtime, delivery, and quality signals from the last 24 hours.</p></div>' +
    '<div class="lab-overview__release">' + releaseBits + '</div></div>' +
    '<div class="lab-stats settings-grid lab-overview__kpis">' +
    kpiCard("Unresolved issues", s.issueCount ?? 0, s.issueCount ? "warn" : "ok", (s.unresolvedCritical || 0) + " critical/high") +
    kpiCard("Errors (24h)", s.errors24h ?? 0, s.errors24h ? "bad" : "ok", (s.events24h ?? 0) + " events") +
    kpiCard("Error rate", (s.errorRate24h ?? 0) + "%", (s.errorRate24h || 0) > 5 ? "bad" : "ok", "of recent events") +
    kpiCard("Slow requests", s.slowRequestCount ?? 0, s.slowRequestCount ? "warn" : "ok", "last 24h") +
    kpiCard("Memory spikes", s.memorySpikeCount ?? 0, s.memorySpikeCount ? "warn" : "ok", "last 24h") +
    kpiCard("Third-party", s.thirdPartyCount ?? 0, s.thirdPartyCount ? "warn" : "ok", "API captures") +
    kpiCard("Coverage", coverage != null ? (Math.round(coverage * 10) / 10) + "%" : "—", coverage == null ? "" : coverage >= 80 ? "ok" : "warn", "line coverage") +
    kpiCard("CI / Quality", (ci.percent != null ? ci.percent + "% CI" : "—") + (q.gate ? " · " + String(q.gate) : ""), doctorOk && (ci.percent == null || ci.percent >= 90) ? "ok" : "warn", "doctor " + (doctorOk ? "ok" : "issues")) +
    '</div>' +
    '<div class="lab-batteries">' + batteries.map(batteryHtml).join("") + '</div>' +
    '<div class="lab-overview__charts">' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Event volume</h2></div><div class="lab-panel__body lab-panel__body--chart"><canvas class="lab-chart lab-chart--lg" id="error-chart"></canvas></div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Issue severity</h2></div><div class="lab-panel__body lab-panel__body--chart"><canvas class="lab-chart lab-chart--lg" id="severity-chart"></canvas></div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Quality trend</h2>' + overviewPanelLink("quality", "Quality") + '</div><div class="lab-panel__body lab-panel__body--chart"><canvas class="lab-chart lab-chart--lg" id="overview-quality-chart"></canvas></div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Latency (slow endpoints)</h2>' + overviewPanelLink("performance", "Performance") + '</div><div class="lab-panel__body lab-panel__body--chart"><canvas class="lab-chart lab-chart--lg" id="latency-chart"></canvas></div></div>' +
    '</div>' +
    '<div class="lab-overview__tables">' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Top unresolved issues</h2>' + overviewPanelLink("issues", "Issues") + '</div><div class="lab-panel__body">' +
    issueTable(issues, true, false, 'No issues yet.') +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Slow endpoints</h2>' + overviewPanelLink("performance", "Performance") + '</div><div class="lab-panel__body">' +
    '<table class="lab-table admin-table"><thead><tr><th>Endpoint</th><th>Count</th><th>Avg</th><th>Max</th></tr></thead><tbody>' + slowRows + '</tbody></table>' +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Recent CI</h2>' + overviewPanelLink("quality", "Quality") + '</div><div class="lab-panel__body">' +
    '<table class="lab-table admin-table"><thead><tr><th>Run</th><th>Status</th><th>When</th></tr></thead><tbody>' + ciRows + '</tbody></table>' +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Recent events</h2>' + overviewPanelLink("events", "Events") + '</div><div class="lab-panel__body">' +
    '<table class="lab-table admin-table"><thead><tr><th>Type</th><th>Message</th><th>When</th></tr></thead><tbody>' + eventRows + '</tbody></table>' +
    '</div></div>' +
    '</div></div>';
}

function issuesPanel() {
  const match = matchesSearch();
  const all = (state.data?.issueGroups || []).filter((i) =>
    match([i.title, i.category, i.endpoint, i.severity, i.summary, i.shortId, i.culprit, i.fingerprint])
  );
  const filtered = state.severityFilter === "all" ? all : all.filter((i) => i.severity === state.severityFilter);
  const tabs = ["all","critical","high","medium","low"].map((f) =>
    '<button type="button" role="tab" class="lab-product-tabs__tab' + (state.severityFilter === f ? ' is-active' : '') + '" data-filter="' + f + '" aria-selected="' + (state.severityFilter === f ? 'true' : 'false') + '">' + esc(f) + '</button>'
  ).join("");
  return '<div class="admin-page-body admin-page-body--table">' +
    listToolbar('Search issues…', tabs) +
    issueTable(filtered, true, true, 'No issues match this filter.') +
    '</div>';
}

function issueDetailPanel(issue) {
  const events = eventsForIssue(issue);
  const latest = events[0] || issue.latestEvent || {};
  const shortId = issue.shortId || ("DNA-" + String(issue.id || "").slice(0, 4).toUpperCase());
  const trend = issue.trend24h && issue.trend24h.length
    ? issue.trend24h
    : (function () {
        const buckets = Array.from({ length: 24 }, () => 0);
        const now = Date.now();
        events.forEach((e) => {
          const ts = e.timestamp ? new Date(e.timestamp).getTime() : 0;
          if (!ts) return;
          const ageH = Math.floor((now - ts) / 3600000);
          if (ageH >= 0 && ageH < 24) buckets[23 - ageH] += 1;
        });
        return buckets;
      })();

  return '<div class="admin-page-body admin-page-body--form lab-issue-detail">' +
    '<div class="lab-breadcrumb"><a href="#" data-tab="issues">Issues</a><span>/</span><code>' + esc(shortId) + '</code><span>/</span><span>' + esc(issue.title) + '</span></div>' +
    '<div class="lab-issue-title-row">' +
    '<div><div class="lab-issue-title-row__badges">' + severityBadge(issue.severity) +
    ' <span class="lab-badge lab-badge--info">' + esc(issue.category || "error") + '</span></div>' +
    '<h2 class="lab-issue-title">' + esc(issue.title) + '</h2>' +
    '<p class="lab-issue-summary">' + esc(issue.summary || latest.message || "No summary") + '</p>' +
    (issue.culprit ? '<p class="lab-issue-culprit"><i class="fa-solid fa-code" aria-hidden="true"></i> ' + esc(issue.culprit) + '</p>' : '') +
    '</div></div>' +
    issueHeroHtml({ ...issue, trend24h: trend }) +
    '<div class="lab-detail"><div class="lab-detail__main">' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Events</h2><span class="lab-panel__meta">24h</span></div>' +
    '<div class="lab-panel__body lab-panel__body--chart"><canvas class="lab-chart" id="issue-events-chart"></canvas></div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Highlights</h2></div><div class="lab-panel__body" style="padding:14px">' +
    highlightsHtml(issue, latest, events) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Stack Trace</h2></div>' +
    '<div class="lab-panel__body" style="padding:14px">' + framesHtml(latest.frames, latest.stack || issue.stackTraceSummary) + '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Breadcrumbs</h2><span class="lab-panel__meta">' + esc((latest.breadcrumbs || []).length) + '</span></div>' +
    '<div class="lab-panel__body">' + breadcrumbsHtml((latest.breadcrumbs || []).slice(-100)) + '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Trace</h2></div><div class="lab-panel__body" style="padding:14px">' +
    spansHtml(latest.spans) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Tags</h2></div><div class="lab-panel__body">' +
    tagsTableHtml(latest.tags, state.tagSearchQuery) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Contexts</h2></div><div class="lab-panel__body" style="padding:14px">' +
    contextTable(latest.contexts) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Packages</h2></div><div class="lab-panel__body">' +
    packagesHtml(latest.contexts) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Additional Data</h2></div><div class="lab-panel__body" style="padding:14px">' +
    additionalDataHtml(latest) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Request</h2></div><div class="lab-panel__body" style="padding:14px">' +
    requestHtml(latest.request, latest) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Related events</h2><span class="lab-panel__meta">' + esc(events.length) + '</span></div><div class="lab-panel__body">' +
    eventsTable(events, false, 'No matching runtime events (may be sampled).') +
    '</div></div></div>' +
    '<div class="lab-detail__side">' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Details</h2></div><div class="lab-panel__body" style="padding:14px"><div class="lab-kv">' +
    '<div class="lab-kv__row"><span class="lab-kv__key">ID</span><span class="lab-kv__val"><code>' + esc(shortId) + '</code></span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Events</span><span class="lab-kv__val">' + esc(issue.count) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Users</span><span class="lab-kv__val">' + esc(issue.userCount != null ? issue.userCount : "—") + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Age</span><span class="lab-kv__val">' + esc(formatAge(issue.ageMs)) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">First seen</span><span class="lab-kv__val">' + esc(timeAgo(issue.firstSeen)) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Last seen</span><span class="lab-kv__val">' + esc(timeAgo(issue.lastSeen)) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Category</span><span class="lab-kv__val">' + esc(issue.category) + '</span></div>' +
    (issue.fingerprint ? '<div class="lab-kv__row"><span class="lab-kv__key">Fingerprint</span><span class="lab-kv__val"><code>' + esc(issue.fingerprint) + '</code></span></div>' : '') +
    (issue.endpoint ? '<div class="lab-kv__row"><span class="lab-kv__key">Endpoint</span><span class="lab-kv__val"><code>' + esc(issue.endpoint) + '</code></span></div>' : '') +
    (latest.environment || issue.environment ? '<div class="lab-kv__row"><span class="lab-kv__key">Environment</span><span class="lab-kv__val">' + esc(latest.environment || issue.environment) + '</span></div>' : '') +
    (latest.release || issue.release ? '<div class="lab-kv__row"><span class="lab-kv__key">Release</span><span class="lab-kv__val"><code>' + esc(latest.release || issue.release) + '</code></span></div>' : '') +
    (latest.source ? '<div class="lab-kv__row"><span class="lab-kv__key">Source</span><span class="lab-kv__val">' + esc(latest.source) + '</span></div>' : '') +
    (latest.provider ? '<div class="lab-kv__row"><span class="lab-kv__key">Provider</span><span class="lab-kv__val">' + esc(latest.provider) + '</span></div>' : '') +
    '</div></div></div>' +
    (issue.suggestedFix ? '<div class="lab-panel settings-card" style="margin-top:14px"><div class="lab-panel__head"><h2 class="lab-panel__title">Suggested fix</h2></div><div class="lab-panel__body" style="padding:14px;font-size:13px;line-height:1.5">' + esc(issue.suggestedFix) + '</div></div>' : '') +
    '</div></div></div>';
}

function eventsTable(events, edge, emptyMsg) {
  const rows = events.length
    ? events.map((e) => '<tr><td>' + eventTypeBadge(e.type) + '</td><td><div class="lab-table__title">' + esc(e.message) + '</div><div class="lab-table__sub">' + esc(e.method || "") + ' ' + esc(e.endpoint || "") + '</div></td><td>' + timeAgo(e.timestamp) + '</td></tr>').join("")
    : tableEmptyRow(3, emptyMsg || 'No events.');
  return '<table class="lab-table admin-table' + (edge ? ' admin-table--edge' : '') + '"><thead><tr><th>Type</th><th>Message</th><th>When</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function eventsPanel() {
  const match = matchesSearch();
  const events = (state.data?.runtimeEvents || []).slice().reverse().slice(0, 100).filter((e) =>
    match([e.type, e.message, e.method, e.endpoint])
  );
  return '<div class="admin-page-body admin-page-body--table">' +
    listToolbar('Search events…', '') +
    eventsTable(events, true, 'No events match this search.') +
    '</div>';
}

function performancePanel() {
  const s = state.data?.stats || {};
  const match = matchesSearch();
  const slow = (state.data?.slowEndpoints || []).filter((r) => match([r.method, r.endpoint]));
  const rows = slow.length
    ? slow.map((r) => '<tr><td><code>' + esc(r.method) + ' ' + esc(r.endpoint) + '</code></td><td>' + esc(r.count) + '</td><td>' + esc(r.avgMs) + 'ms</td><td>' + esc(r.maxMs) + 'ms</td></tr>').join("")
    : tableEmptyRow(4, 'No slow requests match this search.');
  return '<div class="admin-page-body admin-page-body--table">' +
    listToolbar('Search endpoints…', '') +
    '<div class="lab-list-stats">' +
    '<div class="lab-stats settings-grid">' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Slow requests</div><div class="lab-stat-card__value is-warn">' + esc(s.slowRequestCount) + '</div></div>' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Memory spikes</div><div class="lab-stat-card__value is-warn">' + esc(s.memorySpikeCount) + '</div></div>' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Third-party</div><div class="lab-stat-card__value is-warn">' + esc(s.thirdPartyCount || 0) + '</div></div>' +
    '</div></div>' +
    '<table class="lab-table admin-table admin-table--edge"><thead><tr><th>Endpoint</th><th>Count</th><th>Avg</th><th>Max</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '</div>';
}

function releasesPanel() {
  const match = matchesSearch();
  const releases = (state.data?.releases || []).filter((r) => match([r.version, r.environment, r.gitSha]));
  const maps = state.data?.sourceMaps || [];
  const rows = releases.length
    ? releases.map((r) => '<tr><td><strong>' + esc(r.version) + '</strong></td><td>' + esc(r.environment) + '</td><td><code>' + esc((r.gitSha || "").slice(0, 8)) + '</code></td><td>' + timeAgo(r.deployedAt) + '</td></tr>').join("")
    : tableEmptyRow(4, 'No releases match this search.');
  return '<div class="admin-page-body admin-page-body--table">' +
    listToolbar('Search releases…', '') +
    '<table class="lab-table admin-table admin-table--edge"><thead><tr><th>Version</th><th>Env</th><th>SHA</th><th>Deployed</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p class="lab-list-meta">' + esc(maps.length) + ' source map(s) registered</p>' +
    '</div>';
}

function qualityPanel() {
  const match = matchesSearch();
  const reports = (state.data?.qualityReports || []).filter((r) => match([r.name, r.summary, r.scope, r.gate]));
  const coverage = state.data?.coverage;
  const ciRuns = (state.data?.ciRuns || []).filter((r) => match([r.displayTitle, r.workflowName, r.headBranch, r.conclusion, r.status, r.event]));
  const thirdParty = (state.data?.thirdPartyApis || []).filter((e) => match([e.provider, e.source, e.message, e.method]));

  const qualityTabs = [
    ["reports", "Reports"],
    ["ci", "CI"],
    ["apis", "APIs"],
  ];
  const activeQualityTab = state.qualityTab || "reports";
  const tabs = qualityTabs.map(([id, label]) =>
    '<button type="button" role="tab" class="lab-product-tabs__tab' + (activeQualityTab === id ? ' is-active' : '') + '" data-quality-tab="' + id + '" aria-selected="' + (activeQualityTab === id ? 'true' : 'false') + '">' + esc(label) + '</button>'
  ).join("");

  const covCards = '<div class="lab-list-stats"><div class="lab-stats">' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Lines</div><div class="lab-stat-card__value ' + ((coverage?.lines ?? 0) >= 80 ? 'is-ok' : 'is-warn') + '">' + (coverage?.lines != null ? esc(Math.round(coverage.lines * 10) / 10) + '%' : '—') + '</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Statements</div><div class="lab-stat-card__value">' + (coverage?.statements != null ? esc(Math.round(coverage.statements * 10) / 10) + '%' : '—') + '</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Functions</div><div class="lab-stat-card__value">' + (coverage?.functions != null ? esc(Math.round(coverage.functions * 10) / 10) + '%' : '—') + '</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Branches</div><div class="lab-stat-card__value">' + (coverage?.branches != null ? esc(Math.round(coverage.branches * 10) / 10) + '%' : '—') + '</div></div>' +
    '</div>' +
    (coverage?.path ? '<p class="lab-list-meta">From <code>' + esc(coverage.path) + '</code> · ' + timeAgo(coverage.mtime) + '</p>' : '<p class="lab-list-meta">Run <code>npm run test:coverage</code> to generate coverage/coverage-summary.json</p>') +
    '<canvas class="lab-chart" id="quality-chart" style="margin-top:12px"></canvas></div>';

  const reportRows = reports.length
    ? reports.slice().reverse().map((r) => {
      const gate = r.gate ? '<span class="lab-badge lab-badge--' + (r.gate === 'pass' ? 'ok' : 'critical') + '">' + esc(r.gate) + '</span>' : '—';
      const score = r.score != null ? esc(r.score) + (r.gate ? '' : '%') : '—';
      return '<tr><td><div class="lab-table__title">' + esc(r.name) + '</div><div class="lab-table__sub">' + esc(r.summary || r.scope || '') + '</div></td><td>' + gate + '</td><td>' + score + '</td><td>' + esc(r.blockers ?? '—') + ' / ' + esc(r.critical ?? '—') + '</td><td>' + timeAgo(r.mtime) + '</td></tr>';
    }).join("")
    : tableEmptyRow(5, 'No quality reports match this search.');

  const ciRows = ciRuns.length
    ? ciRuns.map((r) => {
      const conclusion = (r.conclusion || r.status || "").toLowerCase();
      const billing = r.failureKind === "billing";
      const cls = billing ? "billing" : conclusion === "success" ? "ok" : conclusion === "failure" || conclusion === "cancelled" ? "critical" : "info";
      const badgeLabel = billing ? "billing" : (r.conclusion || r.status || "—");
      const title = r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.displayTitle || r.workflowName) + '</a>' : esc(r.displayTitle || r.workflowName || "run");
      const sub = esc(r.workflowName || "") + (r.headBranch ? ' · ' + esc(r.headBranch) : '') + (billing ? ' · not a code failure' : '');
      return '<tr><td>' + title + '<div class="lab-table__sub">' + sub + '</div></td><td><span class="lab-badge lab-badge--' + cls + '">' + esc(badgeLabel) + '</span></td><td>' + esc(r.event || "—") + '</td><td>' + timeAgo(r.updatedAt || r.createdAt) + '</td></tr>';
    }).join("")
    : tableEmptyRow(4, 'No CI runs match this search.');

  const apiRows = thirdParty.length
    ? thirdParty.map((e) =>
      '<tr><td><span class="lab-badge lab-badge--info">' + esc(e.provider || e.source || "api") + '</span></td><td><div class="lab-table__title">' + esc(e.message) + '</div><div class="lab-table__sub">' + esc(e.method || "") + ' ' + esc(e.statusCode ?? "") + (e.durationMs != null ? ' · ' + esc(e.durationMs) + 'ms' : '') + '</div></td><td><pre class="lab-pre lab-pre--sm">' + esc((e.responseBody || "").slice(0, 280) || "—") + '</pre></td><td>' + timeAgo(e.timestamp) + '</td></tr>'
    ).join("")
    : tableEmptyRow(4, 'No outbound API captures match this search.');

  let table = '';
  if (activeQualityTab === "ci") {
    table = '<table class="lab-table admin-table admin-table--edge"><thead><tr><th>Run</th><th>Status</th><th>Event</th><th>When</th></tr></thead><tbody>' + ciRows + '</tbody></table>';
  } else if (activeQualityTab === "apis") {
    table = '<table class="lab-table admin-table admin-table--edge"><thead><tr><th>Provider</th><th>Call</th><th>Response</th><th>When</th></tr></thead><tbody>' + apiRows + '</tbody></table>';
  } else {
    table = '<table class="lab-table admin-table admin-table--edge"><thead><tr><th>Report</th><th>Gate</th><th>Score</th><th>Blocker / Critical</th><th>When</th></tr></thead><tbody>' + reportRows + '</tbody></table>';
  }

  return '<div class="admin-page-body admin-page-body--table">' +
    listToolbar('Search quality…', tabs) +
    (activeQualityTab === "ci" ? ciBillingBanner() : "") +
    covCards +
    table +
    '</div>';
}

function dashboardView() {
  const active = state.tab || "overview";
  const navItem = NAV.find((n) => n[0] === active) || NAV[0];
  let body = "";
  if (state.selectedIssueId) {
    const issue = findIssue(state.selectedIssueId);
    body = issue ? issueDetailPanel(issue) : issuesPanel();
  } else if (active === "overview") body = overviewPanel();
  else if (active === "issues") body = issuesPanel();
  else if (active === "events") body = eventsPanel();
  else if (active === "performance") body = performancePanel();
  else if (active === "releases") body = releasesPanel();
  else if (active === "quality") body = qualityPanel();
  else body = overviewPanel();

  const title = state.selectedIssueId ? "Issue detail" : navItem[1];
  return '<div class="soli-portal-root soli-portal-root--settings">' +
    '<div class="settings-shell">' + sidebar(active) +
    '<section class="settings-main">' + pageHeader(title) +
    '<div class="soli-admin-page-body">' + body + '</div></section></div></div>';
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;
  if (state.view === "landing") app.innerHTML = landingView();
  else if (state.view === "signin") app.innerHTML = signinView();
  else if (state.view === "register") app.innerHTML = registerView();
  else app.innerHTML = dashboardView();
  bind();
  if (state.view === "dashboard" && state.data) {
    const chart = document.getElementById("error-chart");
    if (chart) drawTimeline(chart, state.data.eventTimeline);
    const sev = document.getElementById("severity-chart");
    if (sev) drawSeverityChart(sev, overviewCountBySeverity(state.data.issueGroups || []));
    const lat = document.getElementById("latency-chart");
    if (lat) drawLatencyChart(lat, state.data.slowEndpoints || []);
    const oq = document.getElementById("overview-quality-chart");
    if (oq) drawQualityTrend(oq, state.data.qualityReports);
    const q = document.getElementById("quality-chart");
    if (q) drawQualityTrend(q, state.data.qualityReports);
    const issueChart = document.getElementById("issue-events-chart");
    if (issueChart && state.selectedIssueId) {
      const issue = findIssue(state.selectedIssueId);
      drawIssueEventsChart(issueChart, issue?.trend24h || []);
    }
  }
}

function bind() {
  document.querySelectorAll("[data-action]").forEach((el) => {
    el.onclick = async (e) => {
      e.preventDefault();
      state.error = "";
      const action = el.getAttribute("data-action");
      try {
        if (action === "signin") { state.view = "signin"; render(); return; }
        if (action === "register") { state.view = "register"; state.registerStep = "pair"; render(); return; }
        if (action === "refresh") { await refreshData(); return; }
        if (action === "logout") { await api("/auth/logout", { method: "POST" }); state.view = "landing"; render(); return; }
        if (action === "otp") {
          const email = document.querySelector('#signin-form [name=email]').value;
          const r = await api("/auth/otp", { method: "POST", body: JSON.stringify({ email, purpose: "login" }) });
          state.otpDev = r.devOtp || ""; render();
        }
        if (action === "reg-otp") {
          const email = document.querySelector('#register-form [name=email]').value;
          const r = await api("/auth/otp", { method: "POST", body: JSON.stringify({ email, purpose: "register" }) });
          state.otpDev = r.devOtp || ""; render();
        }
      } catch (err) { state.error = err.message; render(); }
    };
  });
  document.querySelectorAll("[data-nav-group]").forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      const group = el.getAttribute("data-nav-group");
      const current = openNavGroup(state.tab || "overview");
      state.navOpenGroup = current === group ? "" : group;
      render();
    };
  });
  document.querySelectorAll("[data-tab]").forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      const tab = el.getAttribute("data-tab");
      state.tab = tab;
      state.selectedIssueId = null;
      state.tagSearchQuery = "";
      state.searchQuery = "";
      state.navOpenGroup = groupForTab(tab);
      render();
    };
  });
  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.onclick = (e) => { e.preventDefault(); state.severityFilter = el.getAttribute("data-filter"); render(); };
  });
  document.querySelectorAll("[data-quality-tab]").forEach((el) => {
    el.onclick = (e) => { e.preventDefault(); state.qualityTab = el.getAttribute("data-quality-tab"); render(); };
  });
  document.querySelectorAll("[data-issue]").forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      const issueId = el.getAttribute("data-issue");
      state.selectedIssueId = issueId;
      render();
      loadIssueEvents(issueId).catch(() => {});
    };
  });
  const search = document.querySelector("[data-search]");
  if (search) {
    search.oninput = (e) => {
      state.searchQuery = e.target.value;
      state._searchCaret = [e.target.selectionStart, e.target.selectionEnd];
      state._searchFocused = true;
      render();
    };
    search.onfocus = () => { state._searchFocused = true; };
    search.onblur = () => { state._searchFocused = false; };
    if (state._searchFocused) {
      search.focus();
      const caret = state._searchCaret;
      if (caret) {
        try { search.setSelectionRange(caret[0], caret[1]); } catch (_) {}
      }
    }
  }
  const tagSearch = document.querySelector("[data-tag-search]");
  if (tagSearch) {
    tagSearch.oninput = (e) => {
      state.tagSearchQuery = e.target.value;
      state._tagCaret = [e.target.selectionStart, e.target.selectionEnd];
      state._tagFocused = true;
      render();
    };
    tagSearch.onfocus = () => { state._tagFocused = true; };
    tagSearch.onblur = () => { state._tagFocused = false; };
    if (state._tagFocused) {
      tagSearch.focus();
      const caret = state._tagCaret;
      if (caret) {
        try { tagSearch.setSelectionRange(caret[0], caret[1]); } catch (_) {}
      }
    }
  }
  const signin = document.getElementById("signin-form");
  if (signin) signin.onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(signin))) });
      state.view = "dashboard"; await refreshData();
    } catch (err) { state.error = err.message; render(); }
  };
  const pair = document.getElementById("pair-form");
  if (pair) pair.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(pair);
    try {
      const r = await api("/pairing/verify", { method: "POST", body: JSON.stringify({ pairingId: fd.get("pairingId"), code: fd.get("code") }) });
      state.pairingId = fd.get("pairingId"); state.registerStep = "account"; state.success = r.message || "Verified"; render();
    } catch (err) { state.error = err.message; render(); }
  };
  const reg = document.getElementById("register-form");
  if (reg) reg.onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(reg)); body.pairingId = state.pairingId;
    try {
      await api("/auth/register", { method: "POST", body: JSON.stringify(body) });
      state.view = "dashboard"; await refreshData();
    } catch (err) { state.error = err.message; render(); }
  };
}

bootstrap();

// Poll-based refresh (no sockets). Optimised for many concurrent viewers:
//  - pauses while the tab is hidden (backgrounded tabs cost nothing),
//  - revalidates with ETag so unchanged data returns a cheap 304,
//  - jitters the interval so 100s of tabs don't stampede the server in lockstep.
let pollTimer = null;
const POLL_BASE_MS = 5000;
const POLL_JITTER_MS = 2000;
function schedulePoll() {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(async () => {
    if (state.view === "dashboard" && !document.hidden) {
      try { await refreshData(); } catch (_) {}
    }
    schedulePoll();
  }, POLL_BASE_MS + Math.floor(Math.random() * POLL_JITTER_MS));
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.view === "dashboard") refreshData().catch(() => {});
});
schedulePoll();
`;
