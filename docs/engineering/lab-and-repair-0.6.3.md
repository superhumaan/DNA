# DNA Lab + Aggressive Repair — v0.6.3

Release notes for errors found while dogfooding Lab / runtime, and the Aggressive Repair Loop (ARL) shipped in the same release.

**npm:** `@superhumaan/dna-by-humaan@0.6.3`  
**Date:** 2026-07-14  
**PR:** [#20](https://github.com/superhumaan/DNA/pull/20) (ARL) + Lab hardening on the same ship

---

## Aggressive Repair Loop (new)

| Capability | Behaviour |
|------------|-----------|
| Fingerprints | Runtime errors keyed; repeat counts drive escalation |
| CellularMemory | Writes `amygdala/repeated-failures.md`, `amygdala/blockers.md`, `temporalLobe/previous-solutions.md` |
| GitHub | Dedupes issues by fingerprint; comments instead of opening duplicates |
| AI patches | Structured search/replace + JSON patch parsing |
| Gateways | 502/503/504 classifiers + origin/health playbook |
| CLI | `dna ai force-repair` (+ `--dry-run`) for open blockers |
| Config | `ai.repair.aggressive` (default on): `minRepeatForRepair`, `minRepeatForBlocker`, `forceAgentLoop`, `dedupeIssues`, `retryOpenRepairs` |

Workbench / `reasoning.behaviour.md` require agents to load memory and run the repair loop when blockers exist.

---

## Lab / runtime errors fixed

### 1. CJS Express crash under `node --watch`

**Symptom:** Server dies immediately with:

```text
Error [ERR_REQUIRE_ESM]: require() of ES Module …/@superhumaan/dna-by-humaan/…/lab.js
not supported. Instead change the require of lab.js to a dynamic import()
```

**Cause:** `@superhumaan/dna-by-humaan/lab` is ESM-only. Lab auto-wire for CommonJS Express apps injected `require("…/lab")`.

**Fix:** For CJS entries, `wire-lab` writes `.DNA/lab/express-wire.cjs` that dynamic-imports the Lab package and exports `dnaLabMiddleware()`. The server `require`s that wire file instead of the ESM package.

**Verify:** `dna lab install` / `dna doctor` on a CJS Express app; start with `node --watch`; `/labs` responds without crashing.

---

### 2. Lab dashboard `/data` hang

**Symptom:** `/labs` UI loads shell but data never arrives; API appears stuck under watch/reload.

**Cause:** Collect path called full `runDoctor` (GitHub auth probe + full project scan) on every dashboard poll.

**Fix:**

- `runDoctorLite` — file-existence snapshot only (no GitHub auth / full scan)
- 60s in-memory cache for doctor lite results
- 2.5s timeout around doctor lite
- Collect uses `Promise.allSettled` so one slow source does not block the payload

**Verify:** Open `/labs`, confirm Issues / Performance / Quality populate within a few seconds under `node --watch`.

---

### 3. `runtime.db` corruption

**Symptom:** Lab collect throws JSON parse errors; empty or half-written `.DNA/data/runtime.db`.

**Cause:** Concurrent writers + non-atomic overwrite of the JSON store.

**Fix:**

- Per-path write mutex
- Atomic write via temp file + rename
- Quarantine corrupt files as `runtime.db.corrupt.<timestamp>`
- Recreate empty store when Lab collect cannot read a valid DB

**Verify:** Stress Lab collect + runtime middleware; no crash; at most a quarantined corrupt file and a fresh empty DB.

---

### 4. Lab CSP / helmet clash

**Symptom:** Browser blocks `/api/dna/labs/bootstrap` (or related fetches) on hosts using helmet with strict CSP.

**Cause:** Lab HTML inherited API CSP such as `default-src 'none'`.

**Fix:** Explicit document CSP on `/labs` HTML (`connect-src 'self'`, etc.); auto-wire mounts Lab middleware after `configureExpress` / helmet when present.

---

## Related packages / paths

| Area | Paths |
|------|--------|
| Doctor lite | `packages/dna-core/src/doctor.ts` (`runDoctorLite`) |
| Lab wire | `packages/dna-core/src/generators/wire-lab.ts` |
| Lab server / collect | `packages/dna-core/src/lab/server.ts`, `collect.ts`, `collect-aggregates.ts` |
| Lab UI | `packages/dna-core/src/lab/ui/` |
| Runtime DB | `packages/dna-core/src/storage/runtime-db.ts` |
| ARL pipeline | `packages/dna-runtime/src/pipeline.ts`, `fingerprint.ts`, `force-repair.ts`, `memory-updates.ts` |
| Issue dedup | `packages/dna-github/src/issue-dedup.ts` |

---

## Publish note

First `Publish npm` workflow run failed: `TS6133` unused `projectId` in `wireExpressLabCjsContent` during `dna-core` DTS build (run was then removed by Cleanup failed runs). Fixed in `dd1b407`; republish succeeded — `@superhumaan/dna-by-humaan@0.6.3` on npm (2026-07-14).

## Upgrade

```bash
npx @superhumaan/dna-by-humaan@0.6.3 doctor
# or
pnpm add @superhumaan/dna-by-humaan@0.6.3
dna lab install   # re-wire Express/Vite if needed
```
