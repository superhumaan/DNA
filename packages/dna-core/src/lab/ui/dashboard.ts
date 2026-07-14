export const LAB_CLIENT_JS = `
const API = "/api/dna/labs";
const state = {
  view: "landing",
  tab: "overview",
  selectedIssueId: null,
  severityFilter: "all",
  searchQuery: "",
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
  if (!res.ok) throw new Error(json.error || res.statusText);
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
  state.data = await api("/data");
  state.lastRefresh = new Date();
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
  return (state.data.runtimeEvents || []).filter((e) => {
    if (issue.fingerprint && e.fingerprint === issue.fingerprint) return true;
    if (issue.endpoint && e.endpoint === issue.endpoint) return true;
    return (e.message || "").includes(issue.title);
  }).slice(0, 50);
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

function tagsHtml(tags) {
  if (!tags || !Object.keys(tags).length) return "";
  return '<div class="lab-tags">' + Object.entries(tags).map(([k, v]) =>
    '<span class="lab-tag"><strong>' + esc(k) + '</strong> ' + esc(v) + '</span>'
  ).join("") + '</div>';
}

function drawTimeline(canvas, buckets) {
  if (!canvas || !buckets?.length) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 280;
  ctx.clearRect(0, 0, w, h);
  const pad = 24;
  const max = Math.max(1, ...buckets.map((b) => b.errors));
  const barW = (w - pad * 2) / buckets.length;
  buckets.forEach((b, i) => {
    const barH = ((b.errors / max) * (h - pad * 2)) || 2;
    const x = pad + i * barW + barW * 0.15;
    const y = h - pad - barH;
    ctx.fillStyle = b.errors ? "#dc2626" : "#e2e4e9";
    ctx.fillRect(x, y, barW * 0.7, barH);
  });
  ctx.fillStyle = "#64748b";
  ctx.font = "20px Inter, sans-serif";
  ctx.fillText("Errors (24h)", pad, 28);
}

function drawQualityTrend(canvas, reports) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 280;
  ctx.clearRect(0, 0, w, h);
  const scores = (reports || []).map((r) => r.score ?? 0).filter((s) => s > 0);
  if (!scores.length) {
    ctx.fillStyle = "#64748b";
    ctx.font = "22px Inter, sans-serif";
    ctx.fillText("No quality history yet", 24, 40);
    return;
  }
  const pad = 24;
  ctx.strokeStyle = "#5b21b6";
  ctx.lineWidth = 4;
  ctx.beginPath();
  scores.forEach((s, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(scores.length - 1, 1);
    const y = h - pad - (s / 100) * (h - pad * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
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
    const hero = '<h1>Pair your project</h1><h2>Connect local DNA to this deploy.</h2><p>Run <code>npx dna register lab --url ' + esc(location.origin) + '</code> then paste the code below.</p>';
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

function overviewPanel() {
  const d = state.data || {};
  const s = d.stats || {};
  const valid = d.doctor?.validation?.valid;
  const issues = (d.issueGroups || []).slice(0, 8);
  return '<div class="admin-page-body admin-page-body--form">' +
    '<div class="lab-stats settings-grid">' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Unresolved issues</div><div class="lab-stat-card__value ' + (s.issueCount ? 'is-warn' : 'is-ok') + '">' + esc(s.issueCount) + '</div><div class="lab-stat-card__sub">' + esc(s.unresolvedCritical || 0) + ' critical/high</div></div>' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Errors (24h)</div><div class="lab-stat-card__value ' + (s.errors24h ? 'is-bad' : 'is-ok') + '">' + esc(s.errors24h) + '</div><div class="lab-stat-card__sub">' + esc(s.events24h) + ' events</div></div>' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Error rate</div><div class="lab-stat-card__value ' + (s.errorRate24h > 5 ? 'is-bad' : 'is-ok') + '">' + esc(s.errorRate24h) + '%</div></div>' +
    '<div class="lab-stat-card settings-card"><div class="lab-stat-card__label">Doctor</div><div class="lab-stat-card__value ' + (valid ? 'is-ok' : 'is-bad') + '">' + (valid ? 'Healthy' : 'Issues') + '</div></div>' +
    '</div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Error volume</h2></div><div class="lab-panel__body" style="padding:16px"><canvas class="lab-chart" id="error-chart"></canvas></div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Top unresolved issues</h2></div><div class="lab-panel__body">' +
    issueTable(issues, true, false, 'No issues yet.') +
    '</div></div></div>';
}

function issueTable(issues, clickable, edge, emptyMsg) {
  const rows = issues.length
    ? issues.map((i) => '<tr class="' + (clickable ? 'is-clickable' : '') + '" data-issue="' + esc(i.id) + '"><td>' + severityBadge(i.severity) + '</td><td><div class="lab-table__title">' + esc(i.title) + '</div><div class="lab-table__sub">' + esc(i.category) + (i.endpoint ? ' · ' + esc(i.endpoint) : '') + '</div></td><td>' + esc(i.count) + '</td><td>' + timeAgo(i.lastSeen) + '</td></tr>').join("")
    : tableEmptyRow(4, emptyMsg || 'No issues match this filter.');
  return '<table class="lab-table admin-table' + (edge ? ' admin-table--edge' : '') + '"><thead><tr><th>Level</th><th>Issue</th><th>Events</th><th>Last seen</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function issuesPanel() {
  const match = matchesSearch();
  const all = (state.data?.issueGroups || []).filter((i) =>
    match([i.title, i.category, i.endpoint, i.severity, i.summary])
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
  const latest = issue.latestEvent || events[0] || {};
  return '<div class="admin-page-body admin-page-body--form">' +
    '<div class="lab-breadcrumb"><a href="#" data-tab="issues">Issues</a><span>/</span><span>' + esc(issue.title) + '</span></div>' +
    '<div class="lab-detail"><div class="lab-detail__main">' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">' + severityBadge(issue.severity) + ' ' + esc(issue.title) + '</h2></div>' +
    '<div class="lab-panel__body" style="padding:16px">' +
    '<p style="margin:0 0 14px;color:var(--color-text-tertiary);line-height:1.5">' + esc(issue.summary || latest.message || "No summary") + '</p>' +
    tagsHtml(latest.tags) +
    '<h3 class="lab-section-title">Exception</h3>' +
    framesHtml(latest.frames, latest.stack || issue.stackTraceSummary) +
    '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Breadcrumbs</h2></div><div class="lab-panel__body">' + breadcrumbsHtml(latest.breadcrumbs) + '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Request</h2></div><div class="lab-panel__body" style="padding:16px">' + requestHtml(latest.request, latest) + '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Contexts</h2></div><div class="lab-panel__body" style="padding:16px">' + contextTable(latest.contexts) + '</div></div>' +
    '<div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Related events</h2></div><div class="lab-panel__body">' +
    eventsTable(events, false, 'No matching runtime events (may be sampled).') +
    '</div></div></div>' +
    '<div class="lab-detail__side"><div class="lab-panel settings-card"><div class="lab-panel__head"><h2 class="lab-panel__title">Details</h2></div><div class="lab-panel__body" style="padding:16px"><div class="lab-kv">' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Events</span><span class="lab-kv__val">' + esc(issue.count) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">First seen</span><span class="lab-kv__val">' + timeAgo(issue.firstSeen) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Last seen</span><span class="lab-kv__val">' + timeAgo(issue.lastSeen) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Category</span><span class="lab-kv__val">' + esc(issue.category) + '</span></div>' +
    (issue.fingerprint ? '<div class="lab-kv__row"><span class="lab-kv__key">Fingerprint</span><span class="lab-kv__val"><code>' + esc(issue.fingerprint) + '</code></span></div>' : '') +
    (issue.endpoint ? '<div class="lab-kv__row"><span class="lab-kv__key">Endpoint</span><span class="lab-kv__val"><code>' + esc(issue.endpoint) + '</code></span></div>' : '') +
    (latest.environment || issue.environment ? '<div class="lab-kv__row"><span class="lab-kv__key">Environment</span><span class="lab-kv__val">' + esc(latest.environment || issue.environment) + '</span></div>' : '') +
    (latest.release || issue.release ? '<div class="lab-kv__row"><span class="lab-kv__key">Release</span><span class="lab-kv__val"><code>' + esc(latest.release || issue.release) + '</code></span></div>' : '') +
    (latest.source ? '<div class="lab-kv__row"><span class="lab-kv__key">Source</span><span class="lab-kv__val">' + esc(latest.source) + '</span></div>' : '') +
    (latest.provider ? '<div class="lab-kv__row"><span class="lab-kv__key">Provider</span><span class="lab-kv__val">' + esc(latest.provider) + '</span></div>' : '') +
    '</div></div>' +
    (issue.suggestedFix ? '<div class="lab-panel settings-card" style="margin-top:14px"><div class="lab-panel__head"><h2 class="lab-panel__title">Suggested fix</h2></div><div class="lab-panel__body" style="padding:16px;font-size:13px;line-height:1.5">' + esc(issue.suggestedFix) + '</div></div>' : '') +
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
      const cls = conclusion === "success" ? "ok" : conclusion === "failure" || conclusion === "cancelled" ? "critical" : "info";
      const title = r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.displayTitle || r.workflowName) + '</a>' : esc(r.displayTitle || r.workflowName || "run");
      return '<tr><td>' + title + '<div class="lab-table__sub">' + esc(r.workflowName || "") + (r.headBranch ? ' · ' + esc(r.headBranch) : '') + '</div></td><td><span class="lab-badge lab-badge--' + cls + '">' + esc(r.conclusion || r.status) + '</span></td><td>' + esc(r.event || "—") + '</td><td>' + timeAgo(r.updatedAt || r.createdAt) + '</td></tr>';
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
    const q = document.getElementById("quality-chart");
    if (q) drawQualityTrend(q, state.data.qualityReports);
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
    el.onclick = (e) => { e.preventDefault(); state.selectedIssueId = el.getAttribute("data-issue"); render(); };
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
setInterval(() => { if (state.view === "dashboard") refreshData().catch(() => {}); }, 5000);
`;
