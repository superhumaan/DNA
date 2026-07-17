# Previous Solutions

## 2026-07-17 — Lab dashboard poll stampede / live-event load

**Symptom:** Lab UI with many open tabs (or a “live event” with ~200 operators) became unresponsive; `/data` latency climbed into seconds.

**Root cause:** Poll-based design (intentional — no WebSockets) called `collectLabData` on every request. That path took the runtime-db mutex, re-aggregated up to 2000 events + 2000 issues, and serialised the full blob with `Cache-Control: no-store`. Tabs also polled every 5s while hidden and in lockstep.

**Solution (keep this pattern):**

1. Coalesce reads: `getLabData(root)` — short TTL cache + single-flight Promise map.
2. Cheap revalidation: weak ETag + `If-None-Match` → 304.
3. Ship only what the UI needs: `trimLabPayload` (cap slim list events; drop unused file trees / raw issues).
4. Client: pause when `document.hidden`, jitter interval, skip render on 304.
5. Auth: short session-resolution cache; invalidate on logout.
6. Bound POST bodies (64 KiB) on public Lab endpoints.
7. Preserve detail off the hot path: fetch `/issues/:id/events` only when an
   operator opens an issue.
8. Run `pnpm run test:load:lab` in CI with explicit p95, throughput, response,
   and zero-error assertions.

**Validation:** `node scripts/lab-load-test.mjs --users 200` (BEFORE raw collect vs AFTER HTTP path).

**Do not “fix” by adding WebSockets** unless product explicitly changes the Lab realtime model — the user requirement is optimised request polling.

## 2026-07-17 — Lab trust and deployment boundary

**Problem:** Public development previews could inherit local mode, loopback
pairing callbacks were forgeable, and separate file-store replicas could
silently disagree about sessions.

**Solution:** Trust only literal loopback hosts; disclose dev OTPs only on
loopback outside both production environments; HMAC pairing callbacks using
the existing code hash; report state topology at `/health`; reject declared
multi-instance file-store deployments with 503. Keep one Lab replica until a
shared state adapter exists.

## Earlier

_Solutions to past issues will continue to be recorded here._
