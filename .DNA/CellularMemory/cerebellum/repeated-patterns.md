# Repeated Patterns

## Lab / JSON-store hot paths

- **Atomic JSON stores** (`.DNA/data/runtime.db`, `lab-store.json`): load → mutate → write temp → rename; per-path Promise mutex. Do not bypass the mutex.
- **Poll dashboards (no sockets):** never recompute heavy aggregates per request. Use short TTL + single-flight + ETag/304. Cap wire payloads to UI needs.
- **Detail on demand:** keep polling rows slim; fetch stacks/breadcrumbs/context from a resource-specific endpoint only when selected.
- **Doctor on dashboards:** use `runDoctorLite` with timeout + cache (see Lab collect) — full doctor blocks the event loop.
- **File-store topology:** one app instance only. Fail closed when replicas are declared; never imply local JSON is shared storage.

## Auth

- Lab production: pairing → OTP → HttpOnly cookie session.
- Cache resolved sessions briefly; always invalidate on logout.
- Environment names are not a trust boundary. Only literal loopback requests may bypass Lab auth or receive development OTPs.
- Authenticate loopback callbacks with HMAC and timing-safe comparison.

## Monorepo CI

- pnpm lockfile is SoT. Prefer `pnpm audit` over `npm audit` (no package-lock).
- Generate audit commands from the detected package manager; test each branch.
- Cap Vitest workers for filesystem-heavy monorepo suites after major runner upgrades.
- Example apps may only typecheck via `build` — keep their `tsc` green.
