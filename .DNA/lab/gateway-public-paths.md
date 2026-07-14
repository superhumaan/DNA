# DNA Lab — gateway public paths (pairing)

Auth gateways in front of your app (Invitrace Connect, oauth2-proxy, Cloudflare Access,
nginx auth_request, etc.) **must** allow these routes **without** a login session.

The CLI (`npx dna register lab --url …`) has no browser cookie. It POSTs the pairing
hash here. `/labs` only verifies against that stored row — it does not invent pairings.

## Required allowlist

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/dna/labs/pairing/init` | CLI writes `{ pairingId, codeHash }` into Lab store |
| `GET` | `/api/dna/labs/pairing/status/*` | CLI `--wait` / status poll |

All other Lab routes (`/labs`, `/api/dna/labs/*`) may stay behind Connect.

## What is stored

Pending rows live in `.DNA/data/lab-store.json` under `pairings[]`:

- `pairingId` — 32-char hex (public id)
- `codeHash` — SHA-256 of the 148-digit code (never store plaintext code)
- `expiresAt` — 15 minutes from init
- `verified` — set true after `/labs` verifies the code

## nginx / Connect example

```nginx
# Allow DNA Lab pairing init + status without Connect login
location = /api/dna/labs/pairing/init {
  # proxy to your Node API — do NOT redirect to /_connect/login
  proxy_pass http://api_upstream;
}
location /api/dna/labs/pairing/status/ {
  proxy_pass http://api_upstream;
}
```

For Invitrace Connect: add the same paths to the Connect **public / bypass** list for this host,
then restart the gateway. Confirm with:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST https://YOUR_HOST/api/dna/labs/pairing/init \
  -H "Content-Type: application/json" \
  -d '{"pairingId":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","codeHash":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","projectId":"app"}'
```

Expected: **200** (or **400** with DNA JSON error). Not **302** to `/_connect/login`.

## Pairing flow (store-first)

1. `npx dna register lab --url https://YOUR_HOST` → must print **Production notified**
2. Open `https://YOUR_HOST/labs` → paste Pairing ID + 148-digit code → verify
3. Create Lab account → sign in
