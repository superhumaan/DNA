# DNA Lab — Refresh UX + upgrade-safe installs (v0.6.16)

**npm:** `@superhumaan/dna-by-humaan@0.6.17` (Refresh UX landed in 0.6.16; alert theme + force Refresh in 0.6.17)  
**Related:** [Lab upgrade DX v0.6.15](./lab-upgrade-dx-0.6.15.md) · [Lab analytics v0.6.14](./lab-analytics-0.6.14.md)

---

## What changed

### Refresh button (every Lab page)

- Tap **Refresh** → button **disables**, rotate icon **spins** (~0.55s/turn) until the fetch finishes
- Reloads **tab-specific** data (Coverage, Releases, APIs, Installs, Intelligence) plus probe + `/data`
- Prevents double-submit while a refresh is in flight

### Copy issue

- Issue list + detail: **Copy issue** puts a paste-ready markdown summary on the clipboard (title, severity, culprit, stack, tags, request, …)

### Upgrade process (never leave `/labs` stale)

`dna doctor` and `dna update` now **auto-align nested/stale installs** when versions diverge, then print mandatory next steps:

1. Restart every Node process that mounts Lab  
2. Hard-refresh `/labs`  
3. Confirm `dnaVersion` on `/api/dna/labs/health`

Canonical checklist: [lab-upgrade-dx-0.6.15](./lab-upgrade-dx-0.6.15.md).

---

## Install / upgrade (do this every time)

```bash
# Preferred — upgrades CLI, packs, rules, AND nested Lab packages
npx @superhumaan/dna-by-humaan@latest update

# Or explicitly
npx dna lab installs          # list every physical install
npx dna lab installs --fix   # npm i @latest in every owner package.json dir

# REQUIRED after any package bump
# Restart the API (or dna lab serve) that mounts Lab
# Hard-refresh /labs (Cmd+Shift+R)
```

Confirm:

```bash
curl -s http://localhost:<api-port>/api/dna/labs/health | jq '{dnaVersion, labUi, installs}'
```

Sidebar should show **v0.6.16** (or newer). If not: wrong process still running, or Vite proxying to another API.

---

### Fixed (v0.6.17)

- Dark-theme install/billing alert banners (no cream light-mode clash)
- Manual Refresh force-fetches (skips ETag 304), min 450ms disabled + fast spin
- Refresh spin kept under `prefers-reduced-motion`
