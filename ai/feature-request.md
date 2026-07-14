# Feature Request

_Auto-maintained by DNA. Updated 2026-07-14T03:50:00.000Z._

## Latest request

> Apply the Soli admin design system into `/labs` — same structure, same design, same design rules.

## Problem

Labs already uses Soli class names loosely, but structure/tokens diverge from canonical Soli admin (`tokens.css` + `portal.css` + `settings.css`): wrong main bg, wrong nav brand bar, wrong page header markup, purple filter pills, Open Sans mixed in, padded cards vs flat edge tables.

## Proposed Solution

Port Soli administration shell fidelity into Lab UI (self-contained CSS string — no Soli package dependency):

1. Full Soli token subset in `:root`
2. Structure: `soli-portal-root--settings` → `settings-shell` → nav (`soli-portal-nav-brand` 56px + `settings-nav-scroll`) + main (`soli-administration-page-header` + `soli-admin-page-body`)
3. Nav links as `soli-settings-nav-link` / `.is-active`
4. Content: `settings-card` / flat `admin-page-body` + edge tables for lists
5. Primary actions: `soli-admin-header-btn` (violet text buttons in header)
6. Inter only; brand violet only for CTAs/active/focus

## Acceptance Criteria

1. Lab dashboard matches Soli admin shell layout (248px nav, 56px brand + title bars)
2. Tokens/colours align with Soli DESIGN_SYSTEM.md
3. Tables/filters/cards follow Soli admin patterns
4. Auth screens keep Soli auth welcome shell
5. No regression to lab data/API behaviour

## Status

Implementing (user directive: apply Soli design system).
