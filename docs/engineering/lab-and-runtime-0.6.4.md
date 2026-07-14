# DNA Lab + runtime hardening — v0.6.4

Release notes for Lab UI depth, observability envelopes, and repair/safety fixes shipped after v0.6.3.

**npm:** `@superhumaan/dna-by-humaan@0.6.4`  
**Related:** [v0.6.3 Lab + ARL](./lab-and-repair-0.6.3.md)

---

## Lab UI v4 (Soli parity)

- Portal root, 56px nav brand + title bars, `soli-settings-nav-link`
- Flat page body / edge tables
- Soli design tokens (cool-neutral chrome; violet for action/active only; Inter)

## Sentry-depth issues

- Fingerprint upsert (one row per issue fingerprint)
- Rich envelopes: stack frames, breadcrumbs, contexts, tags, request
- Browser ingest: `POST /api/dna/runtime`
- Outbound `third_party_response` capture (errors/slow always; healthy sampled at 5%)

## Quality hub

- Gate PASS/FAIL + severity counts from quality JSON/MD
- Coverage from `coverage/coverage-summary.json`
- Recent GitHub Actions runs via `gh`
- Third-party API response table in Lab

## Anti-spam

- Per-fingerprint 60s cooldown on full event persist
- Client 15s dedupe
- Secrets redacted in envelopes

## Reliability fixes

| Symptom | Fix |
|---------|-----|
| `write EPIPE` marked critical; mock AI flooded junk `src/index.ts` commits | Benign socket errors ignored; mock invents no patches; `applyPatches` rejects placeholders |
| Dashboard `/api/data` hang every 5s | `runDoctorLite` + 60s cache + 2.5s timeout |
| `lab-store.json` / `runtime.db` corruption | Mutex + atomic write + quarantine |
| Pipeline blocked on GitHub network | Fire-and-forget issue create + repair |
| `HEAD /labs` 404 | HEAD treated like GET (headers only) |

---

## Install

```bash
npx @superhumaan/dna-by-humaan@0.6.4 doctor
# or
pnpm add @superhumaan/dna-by-humaan@0.6.4
```

For Aggressive Repair Loop behaviour, keep `ai.repair.autoPr` off when `ai.provider` is `mock` — mock does not invent code patches.
