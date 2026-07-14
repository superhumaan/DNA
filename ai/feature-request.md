# Feature Request

_Auto-maintained by DNA. Updated 2026-07-14T04:35:00.000Z._

## Latest request

> Lab UI still isn’t 100%. For primary buttons, go into Humaan admin and utilise the primary buttons. Ensure we use the big blue rounded tabs instead of small ones. We just need the DNA logo — don’t need “by Humaan” or “Lab”. The whole development tab and “Updated just now” need to go. Every page with data tables needs a search, data table even if empty, filters; tabs go below the search. The menus in the sidebar can be collapsed, 1 open at a time.

## Problem

DNA Lab (`/labs`) still drifts from Humaan admin list UX:

1. Primary actions (Refresh, auth CTAs) use Soli 36px / 8px-radius buttons, not Humaan’s 48px pill primary (`HumaanPagePrimaryButton`).
2. Severity filters are small chip tabs (`.lab-filter`), not Humaan `ProductStyleTabBar` filled brand pills.
3. Sidebar brand shows DNA icon + “by Humaan” + “Lab” — user wants icon only.
4. Header still shows env pill (`development` / `production`) and “Updated just now” meta.
5. List pages replace the table with a centered empty state when there are no rows; there is no search; tabs sit above any search (and search is missing entirely).
6. Sidebar nav groups (Monitor / Delivery) are always expanded — should accordion (one open at a time).

## Pain

Lab looks unfinished next to Humaan admin. Operators can’t search list pages, and empty states hide the table chrome they expect.

## Users

- Engineers using `dna lab serve` / `/labs` locally and in production
- Anyone comparing Lab UX to Humaan Operations admin

## Desired Behaviour

1. **Logo** — Sidebar (and auth brand mark): DNA helix icon only. No “by Humaan”, no “Lab” tag.
2. **Header chrome** — Remove env pill and “Updated …” text. Keep page title + Refresh as Humaan-style primary pill button.
3. **Primary buttons** — Match Humaan admin primary: 48px min-height, `border-radius: 999px`, brand `#5b21b6` / hover `#4c1d95` (Humaan calls these “primary”; brand is violet, not literal blue).
4. **Tabs** — Severity (and any list section tabs) use big rounded brand pills like `ProductStyleTabBar` (active = filled brand + white text; inactive = transparent + muted text).
5. **List page layout** (Issues, Events, Performance slow-endpoints, Releases, Quality table sections):
   - Search input at top of content
   - Tabs / filter pills **below** search
   - Always render table structure (`thead` + `tbody`); when empty, keep headers and show empty message inside the table body (not a floating empty card that replaces the table)
6. **Sidebar accordion** — Monitor / Delivery groups collapse; only one group open at a time. Opening a group closes the other. Active route’s group stays open by default.

## Edge Cases

- Search with no matches: table still visible; empty row / message in `tbody`
- Overview dashboard: keep charts/stats; “Top unresolved issues” table should still render headers when empty
- Issue detail: not a list page — no mandatory search/tab bar
- Auth screens: primary CTAs get pill styling; logo icon-only is fine
- Switching to a nav item in a collapsed group opens that group (and closes the other)

## Acceptance Criteria

1. Sidebar brand = DNA icon only (no “by Humaan”, no “Lab”)
2. No development/production pill; no “Updated just now” in page header
3. Refresh (and other primaries) match Humaan `humaan-page-primary-btn` pill specs
4. Severity tabs are large rounded brand pills (not 32px chips)
5. Issues / Events / Releases (and other table pages) show: search → tabs/filters → table with headers even when empty
6. Client-side search filters the visible rows on those pages
7. Sidebar nav groups accordion — one open at a time

## Status

Implemented — Lab UI polish + accordion sidebar.
