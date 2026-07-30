# Feature Request

_Auto-maintained by DNA. Updated 2026-07-30._

## Latest request

> Make `/labs` mobile responsive. Review ColorParty admin panel (already mobile responsive). Use DNA.

## Problem

DNA Lab (`/labs`) uses a fixed desktop admin shell (sidebar + main). On narrow viewports the current CSS only stacks the full sidebar above content (`@media max-width: 960px`), which wastes vertical space and makes navigation/tables hard to use on phones.

## Pain

- Sidebar always visible on mobile — pushes overview KPIs and tables below the fold
- Tables/headers do not scroll or reflow like ColorParty admin
- No hamburger / off-canvas nav, backdrop, or Escape-to-close
- Operators cannot comfortably use Lab on a phone during incidents

## Users

- Developers and operators opening `/labs` on phones/tablets
- Anyone using `dna lab serve` or production Lab during on-call

## Desired Behaviour

1. Mirror **ColorParty admin** mobile shell (`settings-mobile-chrome`, off-canvas `settings-nav`, backdrop, `settings-shell--nav-open`)
2. ≤900px: hide sidebar off-canvas; show sticky mobile chrome with menu toggle
3. Open nav via menu; close on Escape, backdrop click, tab navigate, or viewport widen
4. Tables horizontally scrollable; page headers/actions wrap; KPI grids already collapse (keep)
5. Desktop (≥901px) unchanged
6. Unit/source tests + optional Playwright smoke for mobile menu

## Acceptance criteria

- [x] Mobile chrome + hamburger visible only ≤900px
- [x] Off-canvas nav slides in with backdrop; body scroll locked while open
- [x] Escape / backdrop / nav link closes menu; focus returns to menu button
- [x] Tables scroll horizontally on small screens (min-width + overflow)
- [x] Page title bar actions wrap / full-width where needed
- [x] Desktop layout unchanged
- [x] Tests cover mobile shell markers (ColorParty-style source/CSS assertions)
- [x] Docs/CHANGELOG note; quality PASS; preview push

## Edge cases

- Auth/pairing screens already centered — leave alone unless broken at small widths
- Reduced-motion: keep transitions short/off but menu still usable
- Deep links (`/labs/coverage`) should open with nav closed
- Sign-out in sidebar still reachable when menu open

## Out of scope

- Redesigning Lab visual tokens / Humaan brand
- New Lab pages or API changes
- Changing ColorParty itself
- Native PWA install for Lab
