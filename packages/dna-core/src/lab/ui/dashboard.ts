export const LAB_CLIENT_JS = `
const API = "/api/dna/labs";
const state = {
  view: "landing",
  tab: "overview",
  selectedIssueId: null,
  severityFilter: "all",
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
  ["overview", "Overview", "fa-chart-line"],
  ["issues", "Issues", "fa-bug"],
  ["events", "Events", "fa-bolt"],
  ["performance", "Performance", "fa-gauge-high"],
  ["releases", "Releases", "fa-rocket"],
  ["quality", "Quality", "fa-shield-halved"],
];

function esc(t) {
  return String(t ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function dnaWebBrand(href, fixed, tag) {
  return '<a class="dna-web-brand' + (fixed ? ' dna-web-brand--fixed' : '') + '" href="' + esc(href || '/labs') + '">' +
    '<span class="dna-web-brand__icon"><i class="fa-duotone fa-solid fa-dna" aria-hidden="true"></i></span>' +
    '<span class="dna-web-brand__label">by Humaan</span>' +
    (tag ? '<span class="dna-web-brand__tag">' + esc(tag) + '</span>' : '') +
    '</a>';
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
  return groups.find((i) => i.id === id) || groups.find((i) => i.title === id);
}

function eventsForIssue(issue) {
  if (!issue || !state.data) return [];
  return (state.data.runtimeEvents || []).filter((e) => {
    if (issue.endpoint && e.endpoint === issue.endpoint) return true;
    return (e.message || "").includes(issue.title);
  }).slice(0, 30);
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
  const links = NAV.map(([id, label, icon]) => {
    const badge = id === "issues" && issueCount ? '<span class="nav-badge">' + issueCount + '</span>' : '';
    return '<button type="button" class="' + (active === id ? 'on' : '') + '" data-tab="' + id + '"><i class="fa-solid ' + icon + '"></i>' + esc(label) + badge + '</button>';
  }).join("");
  return '<aside class="settings-nav"><div class="settings-nav-brand">' + dnaWebBrand('/labs', false, 'Lab') + '</div>' +
    '<div class="settings-nav-scroll"><div class="sn-title">Monitor</div>' + links +
    (!state.localMode ? '<div style="margin-top:20px"><button type="button" data-action="logout"><i class="fa-solid fa-right-from-bracket"></i> Sign out</button></div>' : '') +
    '</div></aside>';
}

function pageHeader(title) {
  const refreshed = state.lastRefresh ? 'Updated ' + timeAgo(state.lastRefresh.toISOString()) : '';
  return '<header class="soli-admin-page-header"><h1>' + esc(title) + '</h1>' +
    '<span class="env-pill"><i class="fa-solid fa-server"></i> ' + esc(state.localMode ? "development" : "production") + '</span>' +
    '<span class="soli-admin-page-header__meta">' + refreshed + '</span>' +
    '<button type="button" class="btnp btnp--sm" data-action="refresh"><i class="fa-solid fa-rotate"></i> Refresh</button></header>';
}

function overviewPanel() {
  const d = state.data || {};
  const s = d.stats || {};
  const valid = d.doctor?.validation?.valid;
  const issues = (d.issueGroups || []).slice(0, 8);
  return '<div class="lab-stats">' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Unresolved issues</div><div class="lab-stat-card__value ' + (s.issueCount ? 'is-warn' : 'is-ok') + '">' + esc(s.issueCount) + '</div><div class="lab-stat-card__sub">' + esc(s.unresolvedCritical || 0) + ' critical/high</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Errors (24h)</div><div class="lab-stat-card__value ' + (s.errors24h ? 'is-bad' : 'is-ok') + '">' + esc(s.errors24h) + '</div><div class="lab-stat-card__sub">' + esc(s.events24h) + ' events</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Error rate</div><div class="lab-stat-card__value ' + (s.errorRate24h > 5 ? 'is-bad' : 'is-ok') + '">' + esc(s.errorRate24h) + '%</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Doctor</div><div class="lab-stat-card__value ' + (valid ? 'is-ok' : 'is-bad') + '">' + (valid ? 'Healthy' : 'Issues') + '</div></div>' +
    '</div>' +
    '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Error volume</h2></div><div class="lab-panel__body"><canvas class="lab-chart" id="error-chart"></canvas></div></div>' +
    '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Top unresolved issues</h2></div><div class="lab-panel__body">' +
    (issues.length ? issueTable(issues, true) : emptyState('fa-circle-check', 'No issues', 'Runtime observer has not classified any issues yet.')) +
    '</div></div>';
}

function issueTable(issues, clickable) {
  const rows = issues.map((i) => '<tr class="' + (clickable ? 'is-clickable' : '') + '" data-issue="' + esc(i.id) + '"><td>' + severityBadge(i.severity) + '</td><td><div class="lab-table__title">' + esc(i.title) + '</div><div class="lab-table__sub">' + esc(i.category) + (i.endpoint ? ' · ' + esc(i.endpoint) : '') + '</div></td><td>' + esc(i.count) + '</td><td>' + timeAgo(i.lastSeen) + '</td></tr>').join("");
  return '<table class="lab-table"><thead><tr><th>Level</th><th>Issue</th><th>Events</th><th>Last seen</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function issuesPanel() {
  const all = state.data?.issueGroups || [];
  const filtered = state.severityFilter === "all" ? all : all.filter((i) => i.severity === state.severityFilter);
  const filters = ["all","critical","high","medium","low"].map((f) =>
    '<button type="button" class="lab-filter' + (state.severityFilter === f ? ' is-active' : '') + '" data-filter="' + f + '">' + esc(f) + '</button>'
  ).join("");
  return '<div class="lab-filters">' + filters + '</div>' +
    '<div class="lab-panel"><div class="lab-panel__body">' +
    (filtered.length ? issueTable(filtered, true) : emptyState('fa-bug', 'No issues', 'No issues match this filter.')) +
    '</div></div>';
}

function issueDetailPanel(issue) {
  const events = eventsForIssue(issue);
  const latest = events[0] || {};
  return '<div class="lab-breadcrumb"><a href="#" data-tab="issues">Issues</a><span>/</span><span>' + esc(issue.title) + '</span></div>' +
    '<div class="lab-detail"><div class="lab-detail__main">' +
    '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">' + severityBadge(issue.severity) + ' ' + esc(issue.title) + '</h2></div>' +
    '<div class="lab-panel__body" style="padding:16px"><p style="margin:0 0 14px;color:var(--color-text-tertiary);line-height:1.5">' + esc(issue.summary || "No summary") + '</p>' + stackHtml(latest.stack || issue.stackTraceSummary) + '</div></div>' +
    '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Related events</h2></div><div class="lab-panel__body">' +
    (events.length ? eventsTable(events) : emptyState('fa-bolt', 'No events', 'No matching runtime events.')) +
    '</div></div></div>' +
    '<div class="lab-detail__side"><div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Details</h2></div><div class="lab-panel__body" style="padding:16px"><div class="lab-kv">' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Events</span><span class="lab-kv__val">' + esc(issue.count) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">First seen</span><span class="lab-kv__val">' + timeAgo(issue.firstSeen) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Last seen</span><span class="lab-kv__val">' + timeAgo(issue.lastSeen) + '</span></div>' +
    '<div class="lab-kv__row"><span class="lab-kv__key">Category</span><span class="lab-kv__val">' + esc(issue.category) + '</span></div>' +
    (issue.endpoint ? '<div class="lab-kv__row"><span class="lab-kv__key">Endpoint</span><span class="lab-kv__val"><code>' + esc(issue.endpoint) + '</code></span></div>' : '') +
    '</div></div>' +
    (issue.suggestedFix ? '<div class="lab-panel" style="margin-top:14px"><div class="lab-panel__head"><h2 class="lab-panel__title">Suggested fix</h2></div><div class="lab-panel__body" style="padding:16px;font-size:13px;line-height:1.5">' + esc(issue.suggestedFix) + '</div></div>' : '') +
    '</div></div>';
}

function eventsTable(events) {
  const rows = events.map((e) => '<tr><td>' + eventTypeBadge(e.type) + '</td><td><div class="lab-table__title">' + esc(e.message) + '</div><div class="lab-table__sub">' + esc(e.method || "") + ' ' + esc(e.endpoint || "") + '</div></td><td>' + timeAgo(e.timestamp) + '</td></tr>').join("");
  return '<table class="lab-table"><thead><tr><th>Type</th><th>Message</th><th>When</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function eventsPanel() {
  const events = (state.data?.runtimeEvents || []).slice().reverse().slice(0, 100);
  return '<div class="lab-panel"><div class="lab-panel__body">' +
    (events.length ? eventsTable(events) : emptyState('fa-bolt', 'No events', 'Enable DNA runtime to capture events.')) +
    '</div></div>';
}

function performancePanel() {
  const s = state.data?.stats || {};
  const slow = state.data?.slowEndpoints || [];
  const rows = slow.map((r) => '<tr><td><code>' + esc(r.method) + ' ' + esc(r.endpoint) + '</code></td><td>' + esc(r.count) + '</td><td>' + esc(r.avgMs) + 'ms</td><td>' + esc(r.maxMs) + 'ms</td></tr>').join("");
  return '<div class="lab-stats"><div class="lab-stat-card"><div class="lab-stat-card__label">Slow requests</div><div class="lab-stat-card__value is-warn">' + esc(s.slowRequestCount) + '</div></div>' +
    '<div class="lab-stat-card"><div class="lab-stat-card__label">Memory spikes</div><div class="lab-stat-card__value is-warn">' + esc(s.memorySpikeCount) + '</div></div></div>' +
    '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Slowest endpoints</h2></div><div class="lab-panel__body">' +
    (rows ? '<table class="lab-table"><thead><tr><th>Endpoint</th><th>Count</th><th>Avg</th><th>Max</th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-gauge-high', 'No slow requests', 'No performance issues in the last 24 hours.')) +
    '</div></div>';
}

function releasesPanel() {
  const releases = state.data?.releases || [];
  const maps = state.data?.sourceMaps || [];
  const rows = releases.map((r) => '<tr><td><strong>' + esc(r.version) + '</strong></td><td>' + esc(r.environment) + '</td><td><code>' + esc((r.gitSha || "").slice(0, 8)) + '</code></td><td>' + timeAgo(r.deployedAt) + '</td></tr>').join("");
  return '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Deployments</h2></div><div class="lab-panel__body">' +
    (rows ? '<table class="lab-table"><thead><tr><th>Version</th><th>Env</th><th>SHA</th><th>Deployed</th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-rocket', 'No releases', 'Register deploys via POST /api/dna/labs/releases')) +
    '</div></div><p class="soli-admin-page-header__meta">' + esc(maps.length) + ' source map(s) registered</p>';
}

function qualityPanel() {
  const reports = state.data?.qualityReports || [];
  const list = reports.slice(-10).reverse().map((r) => '<tr><td>' + esc(r.name) + '</td><td>' + (r.score != null ? esc(r.score) + '%' : '—') + '</td><td>' + timeAgo(r.mtime) + '</td></tr>').join("");
  return '<div class="lab-panel"><div class="lab-panel__head"><h2 class="lab-panel__title">Coverage trend</h2></div><div class="lab-panel__body"><canvas class="lab-chart" id="quality-chart"></canvas></div></div>' +
    '<div class="lab-panel"><div class="lab-panel__body">' +
    (list ? '<table class="lab-table"><thead><tr><th>Report</th><th>Score</th><th>When</th></tr></thead><tbody>' + list + '</tbody></table>' : emptyState('fa-shield-halved', 'No reports', 'Run dna quality report to populate.')) +
    '</div></div>';
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
  return '<div class="settings-shell">' + sidebar(active) +
    '<section class="settings-main">' + pageHeader(title) +
    '<div class="soli-admin-page-body">' + body + '</div></section></div>';
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
  document.querySelectorAll("[data-tab]").forEach((el) => {
    el.onclick = (e) => { e.preventDefault(); state.tab = el.getAttribute("data-tab"); state.selectedIssueId = null; render(); };
  });
  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.onclick = (e) => { e.preventDefault(); state.severityFilter = el.getAttribute("data-filter"); render(); };
  });
  document.querySelectorAll("[data-issue]").forEach((el) => {
    el.onclick = (e) => { e.preventDefault(); state.selectedIssueId = el.getAttribute("data-issue"); render(); };
  });
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
