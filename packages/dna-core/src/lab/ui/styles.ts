/** DNA Lab — Soli admin shell + DNA-Web brand (self-contained, no bundler). */

export const LAB_CSS = `
:root {
  --font-sans: "Inter", "Open Sans", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
  --color-brand-primary: #5b21b6;
  --color-brand-primary-hover: #4c1d95;
  --color-brand-primary-soft: #f5f3ff;
  --color-bg-app: #f6f9fc;
  --color-surface: #ffffff;
  --color-border: #dce3ec;
  --color-border-muted: #e8edf4;
  --color-text: #0a2540;
  --color-text-secondary: #334155;
  --color-text-tertiary: #64748b;
  --color-hover-overlay: rgba(15, 23, 42, 0.045);
  --dna-accent: #4ade9a;
  --color-error: #dc2626;
  --color-warning: #d97706;
  --color-ok: #059669;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-sans); color: var(--color-text); background: var(--color-bg-app); }
a { color: inherit; text-decoration: none; }

/* DNA-Web logo — matches site-header.tsx */
.dna-web-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--color-text); font-weight: 600; letter-spacing: -0.02em; }
.dna-web-brand--fixed { position: fixed; top: 12px; left: 12px; z-index: 1000; }
.dna-web-brand__icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(74, 222, 154, 0.15); color: var(--dna-accent); display: grid; place-items: center; font-size: 18px; border: 1px solid rgba(74, 222, 154, 0.3); box-shadow: 0 0 0 1px rgba(74, 222, 154, 0.12); flex-shrink: 0; }
.dna-web-brand__label { font-weight: 600; letter-spacing: -0.02em; color: var(--color-text); }
.dna-web-brand__tag { margin-left: 4px; font-size: 0.82rem; font-weight: 700; color: var(--color-text-tertiary); }

/* Soli auth shell */
.soli-auth-root { min-height: 100dvh; position: relative; overflow: hidden; background: var(--color-bg-app); }
.soli-auth-atmosphere { position: absolute; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(140% 90% at 8% -6%, rgba(91, 33, 182, 0.13) 0%, rgba(91, 33, 182, 0) 56%), radial-gradient(130% 95% at 82% 4%, rgba(148, 163, 184, 0.22) 0%, rgba(148, 163, 184, 0) 58%), linear-gradient(140deg, #fff 0%, #f8fafc 40%, #f4f6fb 100%); }
.soli-auth-welcome { min-height: 100dvh; display: grid; place-items: center; padding: 24px; position: relative; z-index: 1; }
.soli-auth-welcome__shell { width: min(518px, 100%); background: var(--color-surface); border: 1px solid #e6ebf1; border-radius: 18px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07); overflow: hidden; }
.soli-auth-welcome__hero { padding: 28px 28px 20px; }
.soli-auth-welcome__hero h1 { margin: 0 0 6px; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
.soli-auth-welcome__hero h2 { margin: 0 0 8px; font-size: 1rem; font-weight: 600; color: var(--color-text-secondary); }
.soli-auth-welcome__hero p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--color-text-tertiary); }
.soli-auth-welcome__panel { padding: 20px 28px 28px; border-top: 1px solid #e6ebf1; display: flex; flex-direction: column; gap: 10px; }
.field { margin-bottom: 12px; }
.field label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; }
.field input, .field textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; font-family: inherit; }
.field textarea { min-height: 88px; font-family: var(--font-mono); font-size: 12px; }
.btnp { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 12px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; background: var(--color-brand-primary); color: #fff; }
.btnp:hover { background: var(--color-brand-primary-hover); }
.btns { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 11px 16px; border-radius: 8px; border: 1.5px solid var(--color-border); background: var(--color-surface); color: var(--color-text); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 4px; }
.btnp--sm, .btns--sm { width: auto; padding: 7px 12px; font-size: 13px; }
.lab-error { margin-bottom: 12px; padding: 10px 12px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 13px; }
.lab-success { margin-bottom: 12px; padding: 10px 12px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 13px; }
.lab-security-note { margin-top: 12px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--color-border-muted); background: #f8fafc; font-size: 12px; color: var(--color-text-tertiary); line-height: 1.45; }

/* Soli admin portal shell */
.settings-shell { display: grid; grid-template-columns: minmax(200px, 248px) minmax(0, 1fr); gap: 0; width: 100%; min-height: 100dvh; }
.settings-nav { background: var(--color-surface); border-right: 1px solid var(--color-border-muted); padding: 16px; overflow: auto; display: flex; flex-direction: column; min-height: 100dvh; }
.settings-nav-brand { padding: 8px 4px 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.settings-nav-scroll { flex: 1; overflow: auto; }
.sn-title { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-tertiary); padding: 4px 4px 8px; font-weight: 600; }
.settings-nav button, .settings-nav a.lab-nav-link { width: 100%; text-align: left; border: 1px solid transparent; background: transparent; color: var(--color-text); border-radius: 8px; padding: 8px 12px; font-size: 0.84375rem; line-height: 1.35; cursor: pointer; margin: 0 0 2px; display: flex; align-items: center; gap: 10px; font-family: inherit; text-decoration: none; }
.settings-nav button:hover, .settings-nav a.lab-nav-link:hover { background: var(--color-hover-overlay); }
.settings-nav button.on, .settings-nav a.lab-nav-link.is-active { background: var(--color-brand-primary-soft); color: var(--color-brand-primary); font-weight: 600; border-color: transparent; }
.settings-nav button i, .settings-nav a.lab-nav-link i { width: 17px; text-align: center; color: var(--color-text-tertiary); font-size: 14px; }
.settings-nav button.on i, .settings-nav a.lab-nav-link.is-active i { color: var(--color-brand-primary); }
.nav-badge { margin-left: auto; background: var(--color-error); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; min-width: 18px; text-align: center; }
.settings-main { display: flex; flex-direction: column; min-width: 0; min-height: 100dvh; background: var(--color-bg-app); }
.soli-admin-page-header { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 12px 24px; background: var(--color-surface); border-bottom: 1px solid var(--color-border-muted); position: sticky; top: 0; z-index: 2; }
.soli-admin-page-header h1 { margin: 0; font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; flex: 1; }
.soli-admin-page-header__meta { font-size: 12px; color: var(--color-text-tertiary); }
.soli-admin-page-body { padding: 20px 24px 32px; flex: 1; overflow: auto; }
.env-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: var(--color-brand-primary-soft); color: var(--color-brand-primary); border: 1px solid rgba(91, 33, 182, 0.2); }

/* Stats & panels */
.lab-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 20px; }
.lab-stat-card { background: var(--color-surface); border: 1px solid var(--color-border-muted); border-radius: 12px; padding: 16px; }
.lab-stat-card__label { font-size: 11px; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
.lab-stat-card__value { font-size: 1.85rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
.lab-stat-card__value.is-ok { color: var(--color-ok); }
.lab-stat-card__value.is-warn { color: var(--color-warning); }
.lab-stat-card__value.is-bad { color: var(--color-error); }
.lab-stat-card__sub { margin-top: 6px; font-size: 12px; color: var(--color-text-tertiary); }
.lab-panel { background: var(--color-surface); border: 1px solid var(--color-border-muted); border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
.lab-panel__head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--color-border-muted); }
.lab-panel__title { margin: 0; font-size: 14px; font-weight: 700; }
.lab-panel__body { padding: 0; }
.lab-chart { width: 100%; height: 140px; display: block; }

.lab-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lab-table th { text-align: left; padding: 10px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-tertiary); font-weight: 700; background: #fafbfc; border-bottom: 1px solid var(--color-border-muted); }
.lab-table td { padding: 12px 14px; border-bottom: 1px solid #f1f3f6; vertical-align: middle; }
.lab-table tr:hover td { background: #fafbfc; }
.lab-table tr.is-clickable { cursor: pointer; }
.lab-table__title { font-weight: 600; color: var(--color-text); max-width: 420px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lab-table__sub { font-size: 12px; color: var(--color-text-tertiary); margin-top: 2px; }

.lab-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; }
.lab-badge--critical, .lab-badge--fatal { background: #fee2e2; color: #991b1b; }
.lab-badge--high, .lab-badge--error { background: #ffedd5; color: #9a3412; }
.lab-badge--medium, .lab-badge--warning { background: #fef3c7; color: #92400e; }
.lab-badge--low, .lab-badge--info { background: #dbeafe; color: #1e40af; }

.lab-detail { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
.lab-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-text-tertiary); margin-bottom: 14px; }
.lab-breadcrumb a { color: var(--color-brand-primary); font-weight: 600; }
.lab-stack { background: #1e1e2e; color: #e2e8f0; border-radius: 10px; padding: 14px; font-family: var(--font-mono); font-size: 12px; line-height: 1.55; overflow: auto; max-height: 360px; white-space: pre-wrap; word-break: break-word; }
.lab-stack__line--app { color: #fbbf24; }
.lab-kv { display: grid; gap: 10px; }
.lab-kv__row { display: grid; grid-template-columns: 110px 1fr; gap: 8px; font-size: 13px; }
.lab-kv__key { color: var(--color-text-tertiary); font-weight: 600; }
.lab-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.lab-filter { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--color-border); background: var(--color-surface); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; color: var(--color-text-tertiary); }
.lab-filter.is-active { background: var(--color-brand-primary); border-color: var(--color-brand-primary); color: #fff; }
.lab-empty { text-align: center; padding: 48px 24px; color: var(--color-text-tertiary); }
.lab-empty i { font-size: 2rem; opacity: 0.35; margin-bottom: 12px; display: block; }
.lab-empty h3 { margin: 0 0 6px; color: var(--color-text); font-size: 1rem; }
.lab-empty p { margin: 0; font-size: 13px; line-height: 1.5; }

@media (max-width: 960px) {
  .settings-shell { grid-template-columns: 1fr; }
  .settings-nav { min-height: auto; border-right: none; border-bottom: 1px solid var(--color-border-muted); }
  .lab-detail { grid-template-columns: 1fr; }
}
`;
