# Lab upgrade DX (v0.6.15+)

## Problem

Lab UI is served by whichever `@superhumaan/dna-by-humaan` copy the **API process** resolves — not the package at the monorepo root. Nested installs (e.g. `backend/node_modules` pinned to an older version) leave `/labs` on a stale UI after `npm i` at the root. Long-lived Node processes also keep an old in-memory module until restart.

## What shipped

| Signal | Where |
|--------|--------|
| `dnaVersion`, `labUi.fingerprint`, install warnings | `GET /api/dna/labs/health`, `/bootstrap`, `/installs` |
| Version in sidebar + install mismatch banner | Lab UI |
| Disk-backed `dist/lab-ui/client.js` + `styles.css` | Re-read on mtime change (no-cache headers) |
| Install scan | `dna doctor`, `dna lab installs` |
| Force upgrade every owner | `dna lab installs --fix` |
| **Auto-align on doctor/update (v0.6.16+)** | Stale/multi-version installs → `npm i @latest` in every owner; CLI prints restart + hard-refresh steps |

## Canonical upgrade checklist (every app, every release)

```bash
# From the project root that contains .DNA /
npx @superhumaan/dna-by-humaan@latest update   # preferred — CLI + packs + Lab installs
# or:
npx dna lab installs          # list every physical install + versions
npx dna lab installs --fix   # npm i @latest in each owner package.json dir

# REQUIRED — Node keeps the old module until restart:
# 1. Restart the API (or dna lab serve) process that mounts Lab
# 2. Hard-refresh /labs (Cmd+Shift+R / Ctrl+Shift+R)
```

Confirm live version:

```bash
curl -s http://localhost:<api-port>/api/dna/labs/health | jq '{dnaVersion, labUi, installs}'
```

The sidebar shows the active package version (e.g. `v0.6.16`). If you still see an older version, the browser is talking to a process that has not restarted, or Vite is proxying to a different API port.

### Do not

- Rely on `npx @superhumaan/dna-by-humaan@x.y.z` alone to refresh `/labs` in a running host app
- Upgrade only the monorepo root when the API lives under `backend/` (or similar)
- Skip the API restart after `lab installs --fix`

## Nested backend pattern

If the API lives in `backend/` and imports `@superhumaan/dna-by-humaan/lab`, **that** `node_modules` tree is authoritative. Root-only upgrades never change Lab. Prefer aligning dependency ranges (`"^0.6.16"`) in both package.json files, or rely on `dna lab installs --fix` / `dna update`.

## Related

- [Lab Refresh UX v0.6.16](./lab-refresh-ux-0.6.16.md)
- [Lab CI billing blocker — Upgrade](./lab-ci-billing-blocker.md#upgrade-lab-in-a-host-app)
