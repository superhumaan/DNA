#!/usr/bin/env bash
# Publish DNA by Humaan (single bundled package) to npm
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "DNA by Humaan — npm publish"
echo "==========================="
echo ""

if [[ -z "${NPM_TOKEN:-}" ]] && [[ -z "${NODE_AUTH_TOKEN:-}" ]] && ! npm whoami &>/dev/null; then
  echo "Set NPM_TOKEN (or NODE_AUTH_TOKEN) or run npm login first."
  exit 1
fi

AUTH_TOKEN="${NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"
if [[ -n "$AUTH_TOKEN" ]]; then
  NPM_USERCONFIG="$(mktemp)"
  trap 'rm -f "$NPM_USERCONFIG"' EXIT
  printf '//registry.npmjs.org/:_authToken=%s\n' "$AUTH_TOKEN" >"$NPM_USERCONFIG"
  export NPM_CONFIG_USERCONFIG="$NPM_USERCONFIG"
fi

node "$ROOT/scripts/sync-sponsors.mjs"

pnpm --filter './packages/*' build

echo "→ Verifying runtime preload (ESM --import)..."
cd "$ROOT/packages/dna-cli"
NODE_OPTIONS='--import ./dist/runtime-preload.js' node -e "console.log('runtime preload ok')"
if rg -q 'Dynamic require of|@kwsites/file-exists' dist/runtime-preload.js dist/runtime.js; then
  echo "ERROR: runtime bundles still inline CJS npm deps (check skipNodeModulesBundle)."
  exit 1
fi

echo "→ Publishing @superhumaan/dna-by-humaan..."
cd "$ROOT/packages/dna-cli"
pnpm publish --access public --no-git-checks --provenance

echo ""
echo "✓ Published. Install:"
echo "  npx @superhumaan/dna-by-humaan init -y"
echo "  import { dnaRuntime } from '@superhumaan/dna-by-humaan/runtime'"
