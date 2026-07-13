/** DNA Lab — ColorParty auth shell + Soli portal dashboard (self-contained, no bundler). */

export const LAB_CSS = `
:root {
  --humaan-font-sans: "Open Sans", system-ui, sans-serif;
  --humaan-auth-bg: #f6f9fc;
  --humaan-text: #0a2540;
  --humaan-text-secondary: #425466;
  --color-bg-app: #f6f9fc;
  --color-surface: #fff;
  --dna-accent: #635bff;
  --dna-accent-hover: #4f46e5;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--humaan-font-sans); color: var(--humaan-text); background: var(--color-bg-app); }
.humaan-auth-root { min-height: 100dvh; display: flex; flex-direction: column; background: var(--humaan-auth-bg); }
.humaan-auth-header { padding: 22px 28px; display: flex; align-items: center; }
.humaan-auth-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; font-weight: 700; font-size: 1.1rem; }
.humaan-auth-brand__dna { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #635bff, #00d4ff); display: grid; place-items: center; color: #fff; font-size: 14px; font-weight: 800; }
.humaan-auth-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px 16px 28px; }
.auth-page-card { width: 100%; max-width: 480px; background: #fff; border-radius: 16px; box-shadow: 0 4px 28px rgba(15,23,42,.07); padding: 28px; }
.auth-page-card h1 { margin: 0 0 8px; font-size: 1.5rem; }
.auth-page-card p.sub { margin: 0 0 20px; color: var(--humaan-text-secondary); font-size: 14px; line-height: 1.5; }
.lab-hero { width: 100%; height: 120px; border-radius: 12px; background: linear-gradient(135deg, #eef2ff 0%, #f0fdfa 100%); margin-bottom: 20px; display: grid; place-items: center; color: #4338ca; font-weight: 600; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field input, .field textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
.field textarea { min-height: 88px; font-family: ui-monospace, monospace; font-size: 12px; }
.btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 12px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn--primary { background: var(--dna-accent); color: #fff; }
.btn--primary:hover { background: var(--dna-accent-hover); }
.btn--ghost { background: #fff; color: var(--humaan-text); border: 1px solid #e2e8f0; margin-top: 10px; }
.btn:disabled { opacity: .6; cursor: not-allowed; }
.lab-error { margin-bottom: 14px; padding: 10px 12px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 13px; }
.lab-success { margin-bottom: 14px; padding: 10px 12px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 13px; }
.lab-security-note { margin-top: 14px; padding: 10px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; color: #475569; line-height: 1.45; }
.lab-shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100dvh; }
.lab-side { background: #fff; border-right: 1px solid #e2e8f0; padding: 16px 8px; overflow: auto; }
.lab-side .brand { padding: 8px 12px 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.lab-side .sn-title { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; padding: 12px 12px 6px; font-weight: 700; }
.lab-nav-link { display: block; padding: 8px 12px; border-radius: 8px; color: #334155; text-decoration: none; font-size: 14px; margin: 2px 4px; }
.lab-nav-link.is-active, .lab-nav-link:hover { background: #f1f5f9; color: #0f172a; }
.lab-main { padding: 20px 24px; overflow: auto; }
.lab-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.lab-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.lab-card h2 { margin: 0 0 8px; font-size: 14px; color: #64748b; font-weight: 600; }
.lab-stat { font-size: 2rem; font-weight: 700; }
.lab-stat.ok { color: #059669; }
.lab-stat.warn { color: #d97706; }
.lab-stat.bad { color: #dc2626; }
.lab-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lab-table th, .lab-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
.lab-table th { color: #64748b; font-weight: 600; }
pre.lab-pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; overflow: auto; max-height: 320px; font-size: 11px; }
.lab-meta { font-size: 12px; color: #64748b; margin-top: 16px; }
@media (max-width: 768px) { .lab-shell { grid-template-columns: 1fr; } .lab-side { border-right: none; border-bottom: 1px solid #e2e8f0; } }
`;

export const LAB_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DNA Lab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>${LAB_CSS}</style>
</head>
<body>
  <div id="app"></div>
  <script src="__LAB_JS_PATH__"></script>
</body>
</html>`;

export const LAB_CLIENT_JS = `
const API = "/api/dna/labs";
const state = { view: "landing", pairingId: null, email: "", localMode: false, data: null, error: "", success: "", otpDev: "" };

function esc(t) { return String(t ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

async function api(path, opts) {
  const res = await fetch(API + path, { credentials: "same-origin", headers: { "Content-Type": "application/json", ...(opts && opts.headers) }, ...opts });
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
  render();
}

function landingView() {
  return \`<div class="humaan-auth-root"><header class="humaan-auth-header"><a class="humaan-auth-brand" href="/labs"><span class="humaan-auth-brand__dna">DNA</span> Lab</a></header>
  <main class="humaan-auth-main"><div class="auth-page-card">
    <div class="lab-hero">Production observability — errors, performance, quality</div>
    <h1>DNA Lab</h1>
    <p class="sub">Sentry-class runtime intelligence, self-hosted and free. Sign in on production or open locally without auth.</p>
    \${state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : ''}
    <button class="btn btn--primary" data-action="signin">Sign in</button>
    <button class="btn btn--ghost" data-action="register">Create account</button>
    <p class="lab-security-note">Local development opens Lab without login. Production requires email, password, and OTP after pairing your project with <code>npx dna register lab</code>.</p>
  </div></main></div>\`;
}

function signinView() {
  return \`<div class="humaan-auth-root"><header class="humaan-auth-header"><a class="humaan-auth-brand" href="/labs"><span class="humaan-auth-brand__dna">DNA</span> Lab</a></header>
  <main class="humaan-auth-main"><div class="auth-page-card">
    <h1>Sign in</h1>
    <p class="sub">Email, password, and one-time code.</p>
    \${state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : ''}
    \${state.otpDev ? '<div class="lab-success">Dev OTP: <strong>' + esc(state.otpDev) + '</strong></div>' : ''}
    <form id="signin-form">
      <div class="field"><label>Email</label><input name="email" type="email" required /></div>
      <div class="field"><label>Password</label><input name="password" type="password" required /></div>
      <div class="field"><label>OTP</label><input name="otp" inputmode="numeric" pattern="[0-9]*" required placeholder="6-digit code" /></div>
      <button class="btn btn--primary" type="submit">Sign in</button>
      <button class="btn btn--ghost" type="button" data-action="otp">Send OTP</button>
    </form>
  </div></main></div>\`;
}

function registerView() {
  const step = state.registerStep || "pair";
  if (step === "pair") {
    return \`<div class="humaan-auth-root"><header class="humaan-auth-header"><a class="humaan-auth-brand" href="/labs"><span class="humaan-auth-brand__dna">DNA</span> Lab</a></header>
    <main class="humaan-auth-main"><div class="auth-page-card">
      <h1>Pair your project</h1>
      <p class="sub">Run locally: <code>npx dna register lab --url \${esc(location.origin)}</code> then paste the 148-digit code below.</p>
      \${state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : ''}
      \${state.success ? '<div class="lab-success">' + esc(state.success) + '</div>' : ''}
      <form id="pair-form">
        <div class="field"><label>Pairing ID</label><input name="pairingId" required placeholder="From terminal output" /></div>
        <div class="field"><label>148-digit code</label><textarea name="code" required placeholder="Paste code from npx dna register lab"></textarea></div>
        <button class="btn btn--primary" type="submit">Verify pairing</button>
      </form>
    </div></main></div>\`;
  }
  return \`<div class="humaan-auth-root"><header class="humaan-auth-header"><a class="humaan-auth-brand" href="/labs"><span class="humaan-auth-brand__dna">DNA</span> Lab</a></header>
  <main class="humaan-auth-main"><div class="auth-page-card">
    <h1>Create account</h1>
    <p class="sub">Pairing verified. Set your profile and credentials.</p>
    \${state.error ? '<div class="lab-error">' + esc(state.error) + '</div>' : ''}
    \${state.otpDev ? '<div class="lab-success">Dev OTP: <strong>' + esc(state.otpDev) + '</strong></div>' : ''}
    <form id="register-form">
      <div class="field"><label>Name</label><input name="name" required /></div>
      <div class="field"><label>Email</label><input name="email" type="email" required /></div>
      <div class="field"><label>Password</label><input name="password" type="password" required minlength="8" /></div>
      <div class="field"><label>OTP</label><input name="otp" required placeholder="Request OTP first" /></div>
      <button class="btn btn--ghost" type="button" data-action="reg-otp">Send OTP</button>
      <button class="btn btn--primary" type="submit">Create account</button>
    </form>
  </div></main></div>\`;
}

function dashboardView() {
  const d = state.data || {};
  const stats = d.stats || {};
  const issues = (d.runtimeIssues || []).slice(-20).reverse();
  const events = (d.runtimeEvents || []).slice(-20).reverse();
  const nav = [
    ["overview","Overview"],["issues","Issues"],["events","Events"],["performance","Performance"],["quality","Quality"],["releases","Releases"],["logs","Logs"]
  ];
  const active = state.tab || "overview";
  let main = "";
  if (active === "overview") {
    const valid = d.doctor && d.doctor.validation && d.doctor.validation.valid;
    main = '<div class="lab-grid">' +
      '<div class="lab-card"><h2>Doctor</h2><div class="lab-stat ' + (valid ? 'ok' : 'bad') + '">' + (valid ? 'Healthy' : 'Issues') + '</div></div>' +
      '<div class="lab-card"><h2>Issues</h2><div class="lab-stat ' + (stats.issueCount ? 'warn' : 'ok') + '">' + esc(stats.issueCount) + '</div></div>' +
      '<div class="lab-card"><h2>Events</h2><div class="lab-stat">' + esc(stats.eventCount) + '</div></div>' +
      '<div class="lab-card"><h2>Error rate (24h)</h2><div class="lab-stat ' + (stats.errorRate24h > 5 ? 'bad' : 'ok') + '">' + esc(stats.errorRate24h) + '%</div></div>' +
      '</div><p class="lab-meta">Auto-refreshes every 5s. DNA Lab complements external uptime tools — it does not replace dedicated ping monitoring.</p>';
  } else if (active === "issues") {
    main = '<table class="lab-table"><thead><tr><th>Title</th><th>Severity</th><th>Category</th></tr></thead><tbody>' +
      issues.map(i => '<tr><td>' + esc(i.title || i.message || i.id) + '</td><td>' + esc(i.severity) + '</td><td>' + esc(i.category) + '</td></tr>').join('') +
      '</tbody></table><pre class="lab-pre">' + esc(JSON.stringify(issues.slice(0,5), null, 2)) + '</pre>';
  } else if (active === "events") {
    main = '<pre class="lab-pre">' + esc(JSON.stringify(events, null, 2)) + '</pre>';
  } else if (active === "performance") {
    main = '<div class="lab-grid"><div class="lab-card"><h2>Slow requests (24h)</h2><div class="lab-stat warn">' + esc(stats.slowRequestCount) + '</div></div>' +
      '<div class="lab-card"><h2>Memory spikes (24h)</h2><div class="lab-stat warn">' + esc(stats.memorySpikeCount) + '</div></div></div>';
  } else if (active === "quality") {
    const reports = d.qualityReports || [];
    main = '<ul>' + reports.slice(-10).map(r => '<li>' + esc(r.name) + (r.score != null ? ' — ' + r.score + '%' : '') + '</li>').join('') + '</ul>';
  } else if (active === "releases") {
    const releases = d.releases || [];
    const maps = d.sourceMaps || [];
    main = '<h3>Release tracking (v2)</h3><table class="lab-table"><thead><tr><th>Version</th><th>Env</th><th>SHA</th><th>Deployed</th></tr></thead><tbody>' +
      releases.map(r => '<tr><td>' + esc(r.version) + '</td><td>' + esc(r.environment) + '</td><td>' + esc(r.gitSha) + '</td><td>' + esc(r.deployedAt) + '</td></tr>').join('') +
      '</tbody></table><h3>Source maps (v2)</h3><p class="lab-meta">' + esc(maps.length) + ' map(s) registered. Upload via API POST /api/dna/labs/sourcemaps.</p>';
  } else {
    main = '<pre class="lab-pre">' + esc(JSON.stringify(events.filter(e => (e.type||'').includes('log') || (e.message||'').toLowerCase().includes('log')), null, 2)) + '</pre>';
  }
  return '<div class="lab-shell"><aside class="lab-side"><div class="brand"><span class="humaan-auth-brand__dna">DNA</span> Lab' + (state.localMode ? ' <span style="font-size:11px;color:#059669">(local)</span>' : '') + '</div>' +
    nav.map(([id,label]) => '<a href="#" class="lab-nav-link' + (active===id?' is-active':'') + '" data-tab="' + id + '">' + label + '</a>').join('') +
    (!state.localMode ? '<a href="#" class="lab-nav-link" data-action="logout" style="margin-top:24px">Sign out</a>' : '') +
    '</aside><main class="lab-main"><h1 style="margin:0 0 16px;font-size:1.25rem">' + esc(nav.find(n=>n[0]===active)[1]) + '</h1>' + main + '</main></div>';
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;
  state.error = state.error || "";
  if (state.view === "landing") app.innerHTML = landingView();
  else if (state.view === "signin") app.innerHTML = signinView();
  else if (state.view === "register") app.innerHTML = registerView();
  else app.innerHTML = dashboardView();
  bind();
}

function bind() {
  document.querySelectorAll("[data-action]").forEach(el => {
    el.onclick = async (e) => {
      e.preventDefault();
      const action = el.getAttribute("data-action");
      state.error = "";
      try {
        if (action === "signin") { state.view = "signin"; render(); return; }
        if (action === "register") { state.view = "register"; state.registerStep = "pair"; render(); return; }
        if (action === "logout") { await api("/auth/logout", { method: "POST" }); state.view = "landing"; render(); return; }
        if (action === "otp") {
          const email = document.querySelector('#signin-form [name=email]').value;
          const r = await api("/auth/otp", { method: "POST", body: JSON.stringify({ email, purpose: "login" }) });
          state.otpDev = r.devOtp || "";
          state.success = "OTP sent";
          render();
        }
        if (action === "reg-otp") {
          const email = document.querySelector('#register-form [name=email]').value;
          const r = await api("/auth/otp", { method: "POST", body: JSON.stringify({ email, purpose: "register" }) });
          state.otpDev = r.devOtp || "";
          render();
        }
      } catch (err) { state.error = err.message; render(); }
    };
  });
  document.querySelectorAll("[data-tab]").forEach(el => {
    el.onclick = (e) => { e.preventDefault(); state.tab = el.getAttribute("data-tab"); render(); };
  });
  const signin = document.getElementById("signin-form");
  if (signin) signin.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(signin);
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(fd)) });
      state.view = "dashboard";
      await refreshData();
    } catch (err) { state.error = err.message; render(); }
  };
  const pair = document.getElementById("pair-form");
  if (pair) pair.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(pair);
    try {
      const r = await api("/pairing/verify", { method: "POST", body: JSON.stringify({ pairingId: fd.get("pairingId"), code: fd.get("code") }) });
      state.pairingId = fd.get("pairingId");
      state.registerStep = "account";
      state.success = r.message || "Pairing verified";
      render();
    } catch (err) { state.error = err.message; render(); }
  };
  const reg = document.getElementById("register-form");
  if (reg) reg.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(reg);
    const body = Object.fromEntries(fd);
    body.pairingId = state.pairingId;
    try {
      await api("/auth/register", { method: "POST", body: JSON.stringify(body) });
      state.view = "dashboard";
      await refreshData();
    } catch (err) { state.error = err.message; render(); }
  };
}

bootstrap();
setInterval(() => { if (state.view === "dashboard") refreshData().catch(() => {}); }, 5000);
`;
