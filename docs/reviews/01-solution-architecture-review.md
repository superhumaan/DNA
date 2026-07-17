# Stage 1 — Solution Architecture Review

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical findings:** 0 unresolved
* **High-risk findings:** 1 fixed (Lab `/data` poll path could not sustain concurrent viewers), 1 residual (legacy dashboard coexists with Lab)
* **Decision:** PASS WITH DOCUMENTED RISKS

DNA by Humaan is a TypeScript monorepo delivering a CLI, runtime observer, knowledge marketplace, and the **DNA Lab** observability UI at `/labs`. The stack declared in `.DNA/config.dna.json` (`react-vite-api` / Express / PostgreSQL) describes the *target consumer archetype*, not this repository’s own runtime. This repo’s primary HTTP surface is the Lab (poll-based JSON API + static dashboard JS), plus `apps/web` (marketing/marketplace) and example apps.

## 2. Scope Reviewed

* `packages/` — dna-cli, dna-core, dna-runtime, dna-immune, dna-feedback, dna-github, dna-ai, dna-config, dna-templates
* `apps/web`, `apps/marketplace`, `apps/examples/*`
* `.DNA/` config, behaviour, CellularMemory, lab assets
* Lab: `packages/dna-core/src/lab/**`
* Legacy dashboard: `packages/dna-core/src/dashboard/server.ts`
* CI: `.github/workflows/dna-ci.yml`
* DNA files: `config.dna.json`, `AGENTS.md`, behaviour rules, CellularMemory

## 3. Architecture Map

```
Consumer project                    DNA platform (this repo)
─────────────────                   ───────────────────────
npx dna doctor  ──────►  dna-cli → dna-core (scan/doctor/generators)
app server      ──────►  @superhumaan/dna-by-humaan/runtime
                         └─ observers → .DNA/data/runtime.db (JSON)
app server      ──────►  /lab middleware
                         ├─ GET  /labs            → HTML shell
                         ├─ GET  /api/dna/labs/*  → JSON (poll)
                         └─ POST auth/pairing     → lab-store.json
```

**Trust boundaries**

1. Local host → Lab open without auth (`openLocalWithoutAuth`)
2. Production host → cookie session after pairing + OTP
3. Public pairing paths (gateway allowlist) → `pairing/init`, `pairing/status/*`
4. Runtime observer → writes local `.DNA/data/` only (no remote unless GitHub/AI configured)

**Critical journeys**

1. `dna doctor` / init → scaffold `.DNA/`
2. Runtime error → classify → GitHub issue / repair PR
3. Lab dashboard → poll `/data` → render issues/events/quality
4. Production Lab register → pairing → account → session

## 4. Findings

### ARCH-01 — Lab `/data` unbounded per-request cost under concurrent viewers

* **Severity:** High
* **Status:** Fixed
* **Evidence:** Load test BEFORE path — 200 concurrent `collectLabData` calls → p95 ~4100ms, 48 req/s. Client polled every 5s with `Cache-Control: no-store` and no ETag (`dashboard.ts` L693).
* **Root cause:** Every poll recomputed full aggregates under the runtime-db mutex; full events/issues shipped on the wire (~1MB).
* **User impact:** Lab unusable during a live incident with many operators watching.
* **Technical impact:** Lock contention, event-loop saturation, large JSON serialisation.
* **Fix:** `getLabData` micro-cache + single-flight; ETag/304; payload trim; client visibility/jitter polling.
* **Tests:** `collect.test.ts`, `server.test.ts`, `scripts/lab-load-test.mjs`
* **Fixed:** Yes

### ARCH-02 — Legacy dashboard coexists with Lab

* **Severity:** Medium
* **Status:** Open (documented)
* **Evidence:** `packages/dna-core/src/dashboard/server.ts` still exported from `dna-core/src/index.ts`; Lab is the product path (`/labs`).
* **Root cause:** Incremental replacement without deleting the old module.
* **User impact:** Conflicting mental model for agents/docs; risk of wiring the wrong server.
* **Technical impact:** Duplicate collect/doctor-cache logic.
* **Recommended fix:** Deprecate export; route all CLI dashboard commands to Lab; delete after one release.
* **Tests required:** Grep/CLI smoke that no path starts the legacy server by default.
* **Fixed:** No — deferred (behaviour-preserving)

### ARCH-03 — Config stack vs actual monorepo shape

* **Severity:** Low / Informational
* **Status:** Accepted
* **Evidence:** `config.dna.json` stack = react-vite-api + postgresql; this repo is a pnpm packages monorepo with Lab JSON store.
* **Root cause:** Config describes consumer defaults / scan archetype.
* **Recommended fix:** Document clearly in Impressions (already partially in README). No code change required.

## 5. Duplicate and Conflicting Implementations

| Area | Locations | Notes |
|------|-----------|-------|
| Dashboard collect | `lab/collect.ts` vs `dashboard/server.ts` | Lab is SoT; legacy still exported |
| Doctor cache | Both modules keep a 60s doctor TTL Map | Duplicated |
| Store mutex | `lab/storage.ts` + `storage/runtime-db.ts` | Same pattern — OK (separate files) |

## 6. Missing Coverage

* No architectural contract test that CLI `lab serve` mounts Lab (not legacy dashboard)
* No load test in CI (harness added locally)

## 7. Changes Made

* Lab poll architecture: cached coalesced `/data`, ETag, trimmed payload, smarter client poll
* Example Express app build fix (unrelated unused Fastify import / DnaConfig cast)
* Validated via unit tests + 200-user load harness

## 8. Test Results

| Command | Result |
|---------|--------|
| `pnpm run test` (lab) | 25/25 PASS |
| `node scripts/lab-load-test.mjs --users 200` | AFTER p95 ≈114ms, 120× throughput vs BEFORE |
| `pnpm run build` | PASS (after example fix) |

## 9. Residual Risks

* Legacy dashboard still exported — risk of accidental use
* Lab store is process-local JSON — not multi-instance safe without sticky sessions / shared store
* CI remains advisory — green Actions run ≠ gates passed

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
