import {
  DNA_LAB_API_PREFIX,
  DNA_LAB_GATEWAY_ALLOWLIST_FILE,
} from "@superhumaan/dna-config";

/** Relative paths under the Lab API for optional CLI pre-notify (not required for paste-verify). */
export const DNA_LAB_PAIRING_GATEWAY_PATHS = {
  init: `${DNA_LAB_API_PREFIX}/pairing/init`,
  statusPrefix: `${DNA_LAB_API_PREFIX}/pairing/status/`,
} as const;

/** Soft note when best-effort pairing/init fails — paste at /labs still works. */
export function formatGatewayAllowlistFailure(productionUrl: string, pushError?: string): string {
  const base = productionUrl.replace(/\/$/, "");
  return [
    "Note — optional production pre-notify did not succeed (paste at /labs still works).",
    pushError ?? "CLI could not reach POST /api/dna/labs/pairing/init",
    `Open ${base}/labs, paste Pairing ID + code, then create your account.`,
    `See ${DNA_LAB_GATEWAY_ALLOWLIST_FILE} only if you want CLI pre-notify.`,
  ].join("\n");
}

export const GATEWAY_PUBLIC_PATHS_MARKDOWN = `# DNA Lab — optional gateway notes

Lab pairing is **paste-verify**: run \`npx dna register lab --url …\`, then paste
Pairing ID + code at \`/labs\` while signed into the app (cookie / session / JWT).
The CLI does **not** need to reach production. No public allowlist is required.

\`POST /api/dna/labs/pairing/init\` remains available as an **optional** pre-notify.
If your edge auth blocks unauthenticated CLI calls, ignore init — paste still works.

## Optional allowlist (advanced)

Only if you want CLI pre-notify:

| Method | Path | Purpose |
|--------|------|---------|
| \`POST\` | \`/api/dna/labs/pairing/init\` | Best-effort CLI write of \`{ pairingId, codeHash }\` |
| \`GET\` | \`/api/dna/labs/pairing/status/*\` | CLI \`--wait\` / status poll |

## Pairing flow

1. \`npx dna register lab --url https://YOUR_HOST\` → copy Pairing ID + 148-digit code
2. Open \`https://YOUR_HOST/labs\` (use your app login if the host requires a session)
3. Paste → Verify → create Lab account
`;
