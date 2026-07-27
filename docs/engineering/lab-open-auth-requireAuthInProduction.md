# Lab open auth — honor `requireAuthInProduction: false`

**Source:** ColorParty Invitrace `/labs` Coverage page (2026-07-27)  
**Status:** Implemented in `packages/dna-core` (this change set); ColorParty keeps a Host-spoof shim until the published `@superhumaan/dna-by-humaan` includes it.

## Symptom

On a non-localhost Lab host (Invitrace / preview):

1. App sets `lab.requireAuthInProduction: false` (or fakes bootstrap `localMode: true`).
2. Lab shell loads without Sign in / Pair.
3. Refresh on **Coverage** calls `GET /api/dna/labs/coverage` → **401 Unauthorized**.
4. UI shows red “Unauthorized” and empty “No coverage yet” (catch sets empty detail).

Same gate hits `/intelligence`, `/apis`, `/releases`, `/probe`, `/data`.

## Root cause

`lab.requireAuthInProduction` existed in `dna-config` schema and wire templates but was **never read** by `handleLabRequestInner`. Open Lab without pairing only happened when `isLocalHost(Host | X-Forwarded-Host)` was true.

Apps that only patched `/bootstrap` looked authenticated in the UI while every detail API still required a Lab pairing session.

## Fix (global)

In `packages/dna-core/src/lab/server.ts`:

```ts
const loopbackLocal = isLocalLabRequest(host, { … });
const openLabWithoutAuth = options.config?.lab?.requireAuthInProduction === false;
const localMode = loopbackLocal || openLabWithoutAuth;
```

- Default `requireAuthInProduction: true` → behaviour unchanged (public hosts stay closed).
- Explicit `false` → open Lab APIs on public hosts (intentional Invitrace / private preview opt-in).

Regression: `opens Lab APIs on a public host when requireAuthInProduction is false` in `server.test.ts`.

## Consumer guidance

```json
{
  "lab": {
    "enabled": true,
    "path": "/labs",
    "requireAuthInProduction": false,
    "openLocalWithoutAuth": true
  }
}
```

Or pass the same into `createLabMiddleware({ config: { lab: { … } } })`.

Do **not** treat `NODE_ENV=development` as open — only this flag or loopback Host.

## ColorParty compatibility

Until npm ships this DNA build, ColorParty `dnaLabWire` spoofs `Host` / `X-Forwarded-Host` to `127.0.0.1` when `COLORPARTY_LAB_OPEN=1`, and still intercepts bootstrap + fast `/data`. After upgrade, the spoof can be removed; keep `requireAuthInProduction: !isLabOpenWithoutAuth()`.
