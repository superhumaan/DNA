#!/usr/bin/env bash
# Publish DNA by Humaan (single bundled package) to npm
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "DNA by Humaan — npm publish"
echo "==========================="
echo ""

OIDC_AVAILABLE=0
if [[ -n "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" && -n "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]]; then
  OIDC_AVAILABLE=1
fi

AUTH_TOKEN="${NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"

if [[ "$OIDC_AVAILABLE" -eq 1 ]]; then
  echo "→ Auth: GitHub Actions OIDC (trusted publishing)"
  unset NODE_AUTH_TOKEN
  # A token in .npmrc / NODE_AUTH_TOKEN blocks OIDC. Keep NPM_TOKEN unset for
  # the publish process so npm exchanges the ID token instead of a stale secret.
  unset NPM_TOKEN
elif [[ -n "$AUTH_TOKEN" ]]; then
  echo "→ Auth: NPM_TOKEN / NODE_AUTH_TOKEN"
  NPM_USERCONFIG="$(mktemp)"
  trap 'rm -f "$NPM_USERCONFIG"' EXIT
  printf '//registry.npmjs.org/:_authToken=%s\n' "$AUTH_TOKEN" >"$NPM_USERCONFIG"
  export NPM_CONFIG_USERCONFIG="$NPM_USERCONFIG"
elif npm whoami &>/dev/null; then
  echo "→ Auth: existing npm login"
else
  echo "Set NPM_TOKEN, run npm login, or publish from GitHub Actions with a trusted publisher (publish-npm.yml)."
  exit 1
fi

node "$ROOT/scripts/sync-sponsors.mjs"

pnpm --filter './packages/*' build

echo "→ Verifying runtime preload (ESM --import)..."
cd "$ROOT/packages/dna-cli"
NODE_OPTIONS='--import ./dist/runtime-preload.js' node -e "console.log('runtime preload ok')"
if rg -q 'Dynamic require of|@kwsites/file-exists|from "commander"|from "simple-git"|from "zod"' dist/runtime-preload.js dist/runtime.js dist/index.js; then
  echo "ERROR: published bundle still imports external npm deps that should be inlined."
  exit 1
fi

echo "→ Publishing @superhumaan/dna-by-humaan..."
cd "$ROOT/packages/dna-cli"
# Call npm directly so ACTIONS_ID_TOKEN_* env vars reach the CLI (pnpm publish can drop them).
publish_ok=0
if [[ "$OIDC_AVAILABLE" -eq 1 ]]; then
  if npm publish --access public --provenance; then
    publish_ok=1
  else
    echo "→ OIDC publish was not accepted. Retrying with NPM_TOKEN."
  fi
fi
if [[ "$publish_ok" -eq 0 ]]; then
  if [[ -z "${AUTH_TOKEN}" ]]; then
    echo "Publish failed and no NPM_TOKEN is available."
    exit 1
  fi
  NPM_USERCONFIG="$(mktemp)"
  trap 'rm -f "$NPM_USERCONFIG"' EXIT
  printf '//registry.npmjs.org/:_authToken=%s\n' "$AUTH_TOKEN" >"$NPM_USERCONFIG"
  NPM_CONFIG_USERCONFIG="$NPM_USERCONFIG" npm publish --access public
fi

echo ""
echo "✓ Published. Install:"
echo "  npx @superhumaan/dna-by-humaan init -y"
echo "  import { dnaRuntime } from '@superhumaan/dna-by-humaan/runtime'"
