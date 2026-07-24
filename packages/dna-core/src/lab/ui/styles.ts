/**
 * DNA Lab CSS — Soli administration design system (self-contained).
 * Source of truth: Soli `css/tokens.css`, `css/shell/settings.css`, `react-app/src/portal/portal.css`.
 * Rules: cool-neutral chrome; brand violet only for CTAs / active / focus; Inter; soft borders; no heavy shadow.
 */

export const LAB_CSS = `
:root {
  --color-neutral-950: #0f172a;
  --color-neutral-900: #0a2540;
  --color-neutral-800: #1e293b;
  --color-neutral-700: #334155;
  --color-neutral-600: #475569;
  --color-neutral-500: #64748b;
  --color-neutral-400: #94a3b8;
  --color-neutral-200: #e2e8f0;
  --color-neutral-100: #f1f5f9;
  --color-neutral-50: #f8fafc;
  --color-neutral-0: #ffffff;

  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", "Source Code Pro", Menlo, monospace;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --tracking-tight: -0.02em;
  --text-3xl: 1.375rem;

  --color-brand-primary: #5b21b6;
  --color-brand-primary-mid: #7c3aed;
  --color-brand-primary-hover: #4c1d95;
  --color-brand-primary-soft: #f5f3ff;
  --color-text-on-brand: #ffffff;
  --color-accent-action: var(--color-brand-primary);

  --color-bg-app: #f6f9fc;
  --color-bg-sidebar: #f6f9fc;
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-surface-subtle: var(--color-neutral-50);
  --color-hover-overlay: rgba(15, 23, 42, 0.045);
  --color-border: #e6ebf1;
  --color-border-strong: var(--color-neutral-200);
  --color-border-muted: #e8edf4;
  --color-table-border: #eef2f6;
  --color-table-row-hover: rgba(15, 23, 42, 0.045);

  --color-text: var(--color-neutral-900);
  --color-text-secondary: #425466;
  --color-text-tertiary: #64748b;
  --color-text-muted: #697386;
  --color-link: var(--color-brand-primary);
  --color-link-hover: var(--color-brand-primary-hover);
  --color-icon-muted: #334155;

  --color-focus-ring: rgba(91, 33, 182, 0.25);
  --color-focus-ring-solid: var(--color-brand-primary);
  --focus-ring-width: 3px;

  --color-control-active-bg: var(--color-brand-primary-soft);
  --color-control-active-fg: var(--color-brand-primary-hover);
  --color-control-active-border: rgba(91, 33, 182, 0.32);

  --color-danger: #df1b41;
  --color-success: #00825d;
  --color-error: #9e2146;
  --color-warning: #d97706;
  --color-ok: #00825d;

  --color-warning-bg: #fff7ed;
  --color-warning-fg: #9a3412;
  --color-warning-border: #fed7aa;
  --color-info-surface-bg: #eff6ff;
  --color-info-surface-fg: #1e40af;
  --color-info-surface-border: #bfdbfe;
  --color-success-surface-bg: #ecfdf5;
  --color-success-surface-fg: #047857;
  --color-success-surface-border: #a7f3d0;
  --color-danger-surface-bg: #fef2f2;
  --color-danger-surface-fg: #991b1b;
  --color-danger-surface-border: #fecaca;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 999px;
  --control-height: 36px;
  --btn-min-height: 48px;
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --admin-page-gutter: 16px;
  --admin-title-bar-height: 64px;
  --dna-accent: #4ade9a;
}

*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; }
html { font-size: 16px; }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--color-text);
  background: var(--color-bg-app);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-link); text-decoration: none; }
a:hover { color: var(--color-link-hover); }
button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--focus-ring-width) var(--color-focus-ring);
}
::selection { background: rgba(91, 33, 182, 0.2); color: var(--color-text); }

/* DNA mark (icon only) */
.dna-web-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--color-text); font-weight: 600; letter-spacing: var(--tracking-tight); }
.dna-web-brand--fixed { position: fixed; top: 12px; left: 12px; z-index: 1000; }
.dna-web-brand__icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(74, 222, 154, 0.15); color: var(--dna-accent);
  display: grid; place-items: center; font-size: 18px;
  border: 1px solid rgba(74, 222, 154, 0.3); flex-shrink: 0;
}

/* Auth welcome (Soli auth shell) */
.soli-auth-root { min-height: 100dvh; position: relative; overflow: hidden; background: var(--color-bg-app); }
.soli-auth-atmosphere {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(140% 90% at 8% -6%, rgba(91, 33, 182, 0.13) 0%, rgba(91, 33, 182, 0) 56%),
    radial-gradient(130% 95% at 82% 4%, rgba(148, 163, 184, 0.22) 0%, rgba(148, 163, 184, 0) 58%),
    linear-gradient(140deg, #fff 0%, #f8fafc 40%, #f4f6fb 100%);
}
.soli-auth-welcome { min-height: 100dvh; display: grid; place-items: center; padding: 24px; position: relative; z-index: 1; }
.soli-auth-welcome__shell {
  width: min(518px, 100%); background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: 18px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07); overflow: hidden;
}
.soli-auth-welcome__hero { padding: 28px 28px 20px; }
.soli-auth-welcome__hero h1 { margin: 0 0 6px; font-size: 1.5rem; font-weight: 700; letter-spacing: var(--tracking-tight); }
.soli-auth-welcome__hero h2 { margin: 0 0 8px; font-size: 1rem; font-weight: 600; color: var(--color-text-secondary); }
.soli-auth-welcome__hero p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--color-text-tertiary); }
.soli-auth-welcome__panel { padding: 20px 28px 28px; border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 10px; }
.field { margin-bottom: 12px; }
.field label {
  display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px;
  color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.04em;
}
.field input, .field textarea {
  width: 100%; min-height: var(--control-height); padding: 10px 12px;
  border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; font-family: inherit;
  background: var(--color-surface); color: var(--color-text);
}
.field input:focus, .field textarea:focus { border-color: var(--color-brand-primary); outline: none; box-shadow: 0 0 0 3px var(--color-focus-ring); }
.field textarea { min-height: 88px; font-family: var(--font-mono); font-size: 12px; }
/* Humaan admin primary pill buttons */
.btnp, .soli-admin-header-btn, .humaan-page-primary-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  flex-shrink: 0;
  min-height: var(--btn-min-height); height: var(--btn-min-height);
  padding: 0 18px 0 14px; box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--color-brand-primary) 12%, transparent);
  background: var(--color-brand-primary);
  color: var(--color-text-on-brand);
  border-radius: var(--radius-pill);
  font-size: 0.9375rem; font-weight: 600; line-height: 1.2; letter-spacing: -0.01em;
  cursor: pointer; font-family: inherit; text-decoration: none; white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.btnp { width: 100%; padding: 0 18px; }
.btnp:hover, .soli-admin-header-btn:hover, .humaan-page-primary-btn:hover {
  background: var(--color-brand-primary-hover);
  border-color: color-mix(in srgb, var(--color-brand-primary) 22%, transparent);
  color: var(--color-text-on-brand);
}
.btns {
  display: inline-flex; align-items: center; justify-content: center; width: 100%;
  padding: 0 16px; border-radius: var(--radius-pill); border: 1.5px solid var(--color-border);
  background: var(--color-surface); color: var(--color-text); font-size: 0.9375rem; font-weight: 600;
  cursor: pointer; font-family: inherit; margin-top: 4px; min-height: var(--btn-min-height); height: var(--btn-min-height);
}
.btns:hover { background: var(--color-hover-overlay); }
.btnp--sm, .btns--sm, .soli-admin-header-btn--ghost {
  width: auto; min-height: var(--control-height); height: auto; padding: 0 12px; font-size: 0.8125rem;
  border-radius: 8px; box-shadow: none;
}
.soli-admin-header-btn--ghost {
  background: transparent; color: var(--color-brand-primary); border-color: var(--color-border);
}
.soli-admin-header-btn--ghost:hover { background: var(--color-brand-primary-soft); border-color: var(--color-control-active-border); }
.lab-error {
  margin-bottom: 12px; padding: 10px 12px; border-radius: 8px;
  background: var(--color-danger-surface-bg); border: 1px solid var(--color-danger-surface-border);
  color: var(--color-danger-surface-fg); font-size: 13px;
}
.lab-success {
  margin-bottom: 12px; padding: 10px 12px; border-radius: 8px;
  background: var(--color-success-surface-bg); border: 1px solid var(--color-success-surface-border);
  color: var(--color-success-surface-fg); font-size: 13px;
}
.lab-security-note {
  margin-top: 12px; padding: 10px 12px; border-radius: 8px;
  border: 1px solid var(--color-border-muted); background: var(--color-surface-subtle);
  font-size: 12px; color: var(--color-text-tertiary); line-height: 1.45;
}

/* ─── Soli administration portal shell ─── */
.soli-portal-root {
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--color-bg-app);
}
.soli-portal-root--settings {
  padding: 0;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-shell {
  display: grid;
  grid-template-columns: minmax(200px, 248px) minmax(0, 1fr);
  gap: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1 1 auto;
}

.settings-nav {
  border: none;
  border-right: 1px solid var(--color-border-muted);
  border-radius: 0;
  background: var(--color-surface);
  padding: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: none;
}

.soli-portal-nav-brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  height: var(--admin-title-bar-height);
  min-height: var(--admin-title-bar-height);
  box-sizing: border-box;
  margin: 0;
  padding: 0 12px;
  border-bottom: 1px solid var(--color-border-muted);
  background: var(--color-surface);
}

.settings-nav-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 16px 8px;
  box-sizing: border-box;
}

.sn-title {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
  padding: 4px 4px 8px;
  font-weight: 600;
}
.sn-title--toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
  border-radius: 8px;
  padding: 8px 8px;
}
.sn-title--toggle:hover {
  background: var(--color-hover-overlay);
  color: var(--color-text-secondary);
}
.sn-title--toggle i {
  font-size: 10px;
  color: var(--color-text-tertiary);
}
.settings-nav-group__links {
  display: flex;
  flex-direction: column;
}
.settings-nav-group__links[hidden] { display: none; }
.sn-title + .sn-title,
.settings-nav-group + .settings-nav-group { margin-top: 12px; }

.soli-settings-nav-link,
.settings-nav button.soli-settings-nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.84375rem;
  line-height: 1.35;
  cursor: pointer;
  margin: 0 0 2px;
  text-decoration: none;
  box-sizing: border-box;
  font-family: inherit;
  font-weight: 400;
}
.soli-settings-nav-link:hover {
  background: var(--color-hover-overlay);
  border-color: transparent;
}
.soli-settings-nav-link.is-active,
.soli-settings-nav-link.on {
  background: var(--color-brand-primary-soft);
  border-color: transparent;
  color: var(--color-brand-primary);
  font-weight: 600;
}
.soli-settings-nav-link i {
  width: 17px;
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 14px;
  flex-shrink: 0;
}
.soli-settings-nav-link.is-active i,
.soli-settings-nav-link.on i { color: var(--color-brand-primary); }

.nav-badge {
  margin-left: auto;
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  min-width: 18px;
  text-align: center;
}

.settings-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  padding: 0;
  background: var(--color-surface);
  box-sizing: border-box;
}

.soli-administration-page-header,
.soli-admin-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  flex-wrap: nowrap;
  width: 100%;
  height: var(--admin-title-bar-height);
  min-height: var(--admin-title-bar-height);
  margin: 0;
  padding: 0 var(--admin-page-gutter);
  box-sizing: border-box;
  flex-shrink: 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.soli-administration-page-header__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1 1 auto;
}
.soli-administration-page-header__title,
.soli-admin-page-header h1 {
  margin: 0;
  min-width: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  line-height: 1.25;
}
.soli-administration-page-header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}
.soli-admin-page-header__meta {
  font-size: 12px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.soli-admin-page-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 0;
  box-sizing: border-box;
  background: var(--color-surface);
}

.admin-page-body { min-width: 0; box-sizing: border-box; }
.admin-page-body--form { padding: var(--admin-page-gutter); }
.admin-page-body--table { padding: 0 0 var(--admin-page-gutter); }
.admin-page-body--table .lab-list-toolbar {
  padding: 16px var(--admin-page-gutter) 12px;
}
.admin-page-body--table .lab-list-stats {
  padding: 0 var(--admin-page-gutter) 12px;
}
.admin-page-body--table .lab-list-meta {
  padding: 12px var(--admin-page-gutter) 0;
  margin: 0;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.lab-list-toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
}
.lab-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.lab-search > i {
  position: absolute;
  left: 14px;
  color: var(--color-text-tertiary);
  font-size: 14px;
  pointer-events: none;
}
.lab-search__input {
  width: 100%;
  min-height: 44px;
  height: 44px;
  padding: 0 14px 0 40px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 0.9375rem;
  box-sizing: border-box;
}
.lab-search__input:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

/* Humaan ProductStyleTabBar-style pills */
.lab-product-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 0 2px;
}
.lab-product-tabs__tab {
  position: relative;
  margin: 0;
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  font: inherit;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-neutral-500);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}
.lab-product-tabs__tab:hover { color: var(--color-text-secondary); }
.lab-product-tabs__tab.is-active {
  background: var(--color-brand-primary);
  color: #fff;
}

.lab-table__empty td {
  text-align: center;
  color: var(--color-text-tertiary);
  padding: 32px 16px !important;
  font-size: 0.875rem;
}

/* Cards — Soli settings-card (no heavy shadow) */
.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; margin-bottom: 16px; }
.settings-card,
.lab-panel,
.lab-stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-muted);
  border-radius: 12px;
  box-shadow: none;
}
.lab-stat-card { padding: 16px 18px; }
.lab-stat-card__label {
  font-size: 0.6875rem; color: var(--color-text-tertiary); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;
}
.lab-stat-card__value {
  font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: var(--color-text);
}
.lab-stat-card__value.is-ok { color: var(--color-ok); }
.lab-stat-card__value.is-warn { color: var(--color-warning); }
.lab-stat-card__value.is-bad { color: var(--color-danger); }
.lab-stat-card__sub { margin-top: 6px; font-size: 12px; color: var(--color-text-tertiary); }

.lab-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 16px; }
.lab-panel { margin-bottom: 16px; overflow: hidden; }
.lab-panel__head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 16px; border-bottom: 1px solid var(--color-border-muted);
}
.lab-panel__title {
  margin: 0; font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em; color: var(--color-text);
}
.lab-panel__link {
  font-size: 0.8125rem; font-weight: 600; color: var(--color-brand-primary); text-decoration: none;
  white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
}
.lab-panel__link:hover { text-decoration: underline; }
.lab-panel__body { padding: 0; }
.lab-panel__body--chart { padding: 12px 16px 16px; }
.lab-chart { width: 100%; height: 140px; display: block; }
.lab-chart--lg { height: 160px; }

/* Overview analytics dashboard */
.lab-overview__intro {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  margin-bottom: 16px; flex-wrap: wrap;
}
.lab-overview__title {
  margin: 0 0 4px; font-size: 1.125rem; font-weight: 700; letter-spacing: -0.02em; color: var(--color-text);
}
.lab-overview__sub {
  margin: 0; font-size: 0.875rem; color: var(--color-text-tertiary); line-height: 1.4;
}
.lab-overview__release { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; max-width: 100%; }
.lab-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 10px; border-radius: 8px; font-size: 0.75rem;
  background: var(--color-surface-subtle); border: 1px solid var(--color-border-muted);
  color: var(--color-text-secondary);
}
.lab-chip--muted { color: var(--color-text-tertiary); }
.lab-overview__kpis { margin-bottom: 16px; }
.lab-batteries {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px; margin-bottom: 16px;
}
.lab-battery {
  background: var(--color-surface); border: 1px solid var(--color-border-muted);
  border-radius: 12px; padding: 14px 16px;
}
.lab-battery__meta {
  display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 10px;
}
.lab-battery__label {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
}
.lab-battery__value {
  font-size: 1rem; font-weight: 700; letter-spacing: -0.02em; color: var(--color-text);
}
.lab-battery--ok .lab-battery__value { color: var(--color-ok); }
.lab-battery--warn .lab-battery__value { color: var(--color-warning); }
.lab-battery--bad .lab-battery__value { color: var(--color-danger); }
.lab-battery--neutral .lab-battery__value { color: var(--color-text-tertiary); }
.lab-battery__track {
  height: 10px; border-radius: 999px; background: var(--color-surface-subtle);
  border: 1px solid var(--color-border-muted); overflow: hidden;
}
.lab-battery__fill {
  height: 100%; border-radius: 999px; background: var(--color-text-tertiary);
  transition: width 0.35s ease;
}
.lab-battery--ok .lab-battery__fill { background: var(--color-ok); }
.lab-battery--warn .lab-battery__fill { background: var(--color-warning); }
.lab-battery--bad .lab-battery__fill { background: var(--color-danger); }
.lab-battery.is-empty .lab-battery__fill { width: 0 !important; opacity: 0.35; }
.lab-battery__hint {
  margin-top: 8px; font-size: 0.75rem; color: var(--color-text-tertiary); line-height: 1.35;
}
.lab-overview__charts {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 16px;
}
.lab-overview__charts .lab-panel { margin-bottom: 0; }
.lab-overview__tables {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;
}
.lab-overview__tables .lab-panel { margin-bottom: 0; }
@media (max-width: 1100px) {
  .lab-overview__charts,
  .lab-overview__tables { grid-template-columns: 1fr; }
}

/* Tables — Soli admin edge + bordered */
.lab-table, .admin-table {
  width: 100%; border-collapse: collapse; font-size: 0.84375rem;
}
.lab-table th, .admin-table th {
  text-align: left; padding: 10px 16px; font-size: 0.6875rem;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--color-text-tertiary); font-weight: 700;
  background: var(--color-surface-subtle); border-bottom: 1px solid var(--color-border-muted);
}
.lab-table td, .admin-table td {
  padding: 12px 16px; border-bottom: 1px solid var(--color-table-border); vertical-align: middle;
}
.lab-table tr:hover td, .admin-table tr:hover td { background: var(--color-table-row-hover); }
.lab-table tr.is-clickable { cursor: pointer; }
.lab-table__title { font-weight: 600; color: var(--color-text); max-width: 420px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lab-table__sub { font-size: 12px; color: var(--color-text-tertiary); margin-top: 2px; }

.admin-table--edge {
  border-radius: 0 !important;
  border-left: none !important;
  border-right: none !important;
  width: 100%;
}
.admin-table--edge th:first-child,
.admin-table--edge td:first-child { padding-left: var(--admin-page-gutter); }
.admin-table--edge th:last-child,
.admin-table--edge td:last-child { padding-right: var(--admin-page-gutter); }

.lab-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.03em;
}
.lab-badge--critical, .lab-badge--fatal { background: var(--color-danger-surface-bg); color: var(--color-danger-surface-fg); border: 1px solid var(--color-danger-surface-border); }
.lab-badge--high, .lab-badge--error { background: var(--color-warning-bg); color: var(--color-warning-fg); border: 1px solid var(--color-warning-border); }
.lab-badge--medium, .lab-badge--warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.lab-badge--low, .lab-badge--info { background: var(--color-info-surface-bg); color: var(--color-info-surface-fg); border: 1px solid var(--color-info-surface-border); }
.lab-badge--ok { background: var(--color-success-surface-bg); color: var(--color-success-surface-fg); border: 1px solid var(--color-success-surface-border); }
.lab-badge--billing { background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; }

.lab-alert {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 14px 16px; margin-bottom: 16px;
  border-radius: 12px; border: 1px solid var(--color-border-muted);
  background: var(--color-surface);
}
.lab-alert--billing {
  border-color: #f59e0b;
  background: #fffbeb;
}
.lab-alert__icon {
  flex: 0 0 auto; width: 36px; height: 36px; border-radius: 10px;
  display: grid; place-items: center;
  background: #fef3c7; color: #b45309; font-size: 16px;
}
.lab-alert__title {
  display: block; font-size: 0.9375rem; font-weight: 700; color: var(--color-text); margin-bottom: 4px;
}
.lab-alert__text {
  margin: 0; font-size: 0.84375rem; line-height: 1.5; color: var(--color-text-secondary);
}
.lab-alert__sample { color: var(--color-text-tertiary); }
.lab-alert__actions {
  margin: 8px 0 0; font-size: 0.8125rem;
}
.lab-alert__actions a {
  color: var(--color-brand-primary); font-weight: 600; text-decoration: none;
}
.lab-alert__actions a:hover { text-decoration: underline; }

.lab-detail { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.lab-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-text-tertiary); margin-bottom: 14px; }
.lab-breadcrumb a { color: var(--color-brand-primary); font-weight: 600; }
.lab-stack {
  background: var(--color-neutral-950); color: #e2e8f0; border-radius: var(--radius-md);
  padding: 14px; font-family: var(--font-mono); font-size: 12px; line-height: 1.55;
  overflow: auto; max-height: 360px; white-space: pre-wrap; word-break: break-word;
}
.lab-stack__line--app { color: #fbbf24; }
.lab-frames {
  background: var(--color-neutral-950); color: #e2e8f0; border-radius: var(--radius-md);
  padding: 8px 0; font-family: var(--font-mono); font-size: 12px; max-height: 420px; overflow: auto;
}
.lab-frame { display: grid; gap: 2px; padding: 8px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.lab-frame--app { background: rgba(251, 191, 36, 0.08); }
.lab-frame__fn { color: #f8fafc; font-weight: 600; }
.lab-frame__file { color: var(--color-neutral-400); font-size: 11px; }
.lab-section-title {
  margin: 16px 0 8px; font-size: 0.6875rem; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--color-text-tertiary); font-weight: 600;
}
.lab-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.lab-tag {
  font-size: 11px; background: var(--color-neutral-100); border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-sm); padding: 3px 8px; color: var(--color-text-secondary);
}
.lab-pre {
  margin: 0; white-space: pre-wrap; word-break: break-word; font-family: var(--font-mono);
  font-size: 11px; background: var(--color-neutral-950); color: #e2e8f0; padding: 10px;
  border-radius: 8px; max-height: 160px; overflow: auto;
}
.lab-pre--sm { max-height: 88px; }
.lab-kv { display: grid; gap: 10px; }
.lab-kv__row { display: grid; grid-template-columns: 110px 1fr; gap: 8px; font-size: 13px; }
.lab-kv__key { color: var(--color-text-tertiary); font-weight: 600; }

/* Legacy chip filters kept for safety — prefer .lab-product-tabs */
.lab-filters, .admin-filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 0; }
.lab-filter {
  padding: 8px 16px; min-height: 36px; border-radius: var(--radius-pill);
  border: none; background: transparent;
  font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit;
  color: var(--color-neutral-500);
}
.lab-filter:hover { color: var(--color-text-secondary); }
.lab-filter.is-active {
  background: var(--color-brand-primary);
  color: #fff;
}

.lab-empty { text-align: center; padding: 48px 24px; color: var(--color-text-tertiary); }
.lab-empty i { font-size: 2rem; opacity: 0.35; margin-bottom: 12px; display: block; color: var(--color-icon-muted); }
.lab-empty h3 { margin: 0 0 6px; color: var(--color-text); font-size: 1rem; font-weight: 600; }
.lab-empty p { margin: 0; font-size: 13px; line-height: 1.5; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

@media (max-width: 960px) {
  .settings-shell { grid-template-columns: 1fr; height: auto; min-height: 100dvh; }
  .soli-portal-root--settings { height: auto; overflow: visible; }
  .settings-nav { height: auto; border-right: none; border-bottom: 1px solid var(--color-border-muted); }
  .settings-nav-scroll { max-height: none; }
  .settings-main { height: auto; overflow: visible; }
  .soli-admin-page-body { overflow: visible; }
  .lab-detail { grid-template-columns: 1fr; }
}
`;
