# Lab upgrade DX (v0.6.15)

## Problem

Lab UI is served by whichever `@superhumaan/dna-by-humaan` copy the **API process** resolves — not the package at the monorepo root. Nested installs (e.g. `backend/node_modules` pinned to an older version) leave `/labs` on a stale UI after `npm i` at the root. Long-lived Node processes also keep an old in-memory module until restart.

## What 0.6.15 adds

| Signal | Where |
|--------|--------|
| `dnaVersion`, `labUi.fingerprint`, install warnings | `GET /api/dna/labs/health`, `/bootstrap`, `/installs` |
| Version in sidebar + install mismatch banner | Lab UI |
| Disk-backed `dist/lab-ui/client.js` + `styles.css` | Re-read on mtime change (no-cache headers) |
| Install scan | `dna doctor`, `dna lab installs` |
| Force upgrade every owner | `dna lab installs --fix` |

## Upgrade checklist (every app)

```bash
# From the project root that contains .DNA /
npx dna lab installs          # list every physical install + versions
npx dna lab installs --fix   # npm i @latest in each owner package.json dir
# Restart the API (or dna lab serve) process that mounts Lab
# Hard-refresh /labs (Cmd+Shift+R)
```

Confirm live version:

```bash
curl -s http://localhost:<api-port>/api/dna/labs/health | jq '{dnaVersion, labUi, installs}'
```

The sidebar shows `v0.6.15` (or whatever is active). If you still see an older version, the browser is talking to a process that has not restarted, or Vite is proxying to a different API port.

## Nested backend pattern

If the API lives in `backend/` and imports `@superhumaan/dna-by-humaan/lab`, **that** `node_modules` tree is authoritative. Root-only upgrades never change Lab. Prefer aligning dependency ranges (`"^0.6.15"`) in both package.json files, or rely on `dna lab installs --fix`.
