# DNA Lab — optional gateway notes

Lab pairing is **paste-verify**: run `npx dna register lab --url …`, then paste
Pairing ID + code at `/labs` while signed into the app (cookie / session / JWT).
The CLI does **not** need to reach production. No public allowlist is required.

`POST /api/dna/labs/pairing/init` remains available as an **optional** pre-notify.
If your edge auth blocks unauthenticated CLI calls, ignore init — paste still works.

## Optional allowlist (advanced)

Only if you want CLI pre-notify:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/dna/labs/pairing/init` | Best-effort CLI write of `{ pairingId, codeHash }` |
| `GET` | `/api/dna/labs/pairing/status/*` | CLI `--wait` / status poll |

## Pairing flow

1. `npx dna register lab --url https://YOUR_HOST` → copy Pairing ID + 148-digit code
2. Open `https://YOUR_HOST/labs` (use your app login if the host requires a session)
3. Paste → Verify → create Lab account
