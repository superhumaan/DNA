# Feature Request

_Auto-maintained by DNA. Updated 2026-07-30._

## Latest request

> Go into DNA, make sure that DNA by default, pulls data from Skeletor, if skeletor is installed, and it feeds the AI, so that it's much easier to share, cross coordinate and work with it

## Problem

DNA projects are islands. Skeletor already scans the whole Projects folder but that intelligence lived only inside the desktop app. DNA CLI / workbench never read it.

## Desired behaviour

1. Skeletor writes `bridge/fleet.json` on each full fleet scan
2. DNA detects Skeletor by default and pulls settings + kit + fleet
3. Feeds AI via `dna context`, doctor CellularMemory, always-on rules
4. CLI: `dna skeletor status|feed|context`
5. Opt out: `"skeletor": { "enabled": false }`

## Acceptance criteria

- [x] DNA detects Skeletor Application Support
- [x] Skeletor writes fleet bridge on full scan
- [x] `dna context` / doctor feed include Skeletor section
- [x] Always-on rules mention Skeletor pull
- [x] Absent Skeletor → silent skip
- [x] Unit tests for detect / pull / opt-out / feed
- [x] Opt-out via config
