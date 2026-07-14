# Recent Changes

_Last updated: 2026-07-14_

## 2026-07-14 — v0.6.3 ship

- **Aggressive Repair Loop** — fingerprints, CellularMemory blockers, GitHub dedup, `dna ai force-repair` (PR #20)
- **Lab CJS Express wire** — `.DNA/lab/express-wire.cjs` dynamic import (fixes `ERR_REQUIRE_ESM` under `node --watch`)
- **Lab `/data` hang** — `runDoctorLite` + cache/timeout; `Promise.allSettled` collect
- **runtime.db** — atomic writes, mutex, quarantine corrupt JSON
- Docs: `docs/engineering/lab-and-repair-0.6.3.md`, CHANGELOG, roadmap, scope

## 2026-07-13 — Lab v0.6.0–0.6.2

- DNA Lab at `/labs`, Vite proxy + Vercel rewrites, CSP / helmet mount order

## Initial Setup

- DNA initialised on 2026-07-11
- Project: dna-by-humaan
