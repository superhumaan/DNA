#!/usr/bin/env bash
# Remove mistakenly-published internal packages from npm (within 72h window)
set -euo pipefail

if [[ -z "${NPM_TOKEN:-}" ]] && ! npm whoami &>/dev/null; then
  echo "Set NPM_TOKEN or run npm login first."
  exit 1
fi

if [[ -n "${NPM_TOKEN:-}" ]]; then
  NPM_USERCONFIG="$(mktemp)"
  trap 'rm -f "$NPM_USERCONFIG"' EXIT
  printf '//registry.npmjs.org/:_authToken=%s\n' "$NPM_TOKEN" >"$NPM_USERCONFIG"
  export NPM_CONFIG_USERCONFIG="$NPM_USERCONFIG"
fi

INTERNAL=(
  @superhumaan/dna-runtime
)

for pkg in "${INTERNAL[@]}"; do
  echo "→ Unpublishing $pkg..."
  npm unpublish "$pkg" --force || echo "  (skipped — may be outside 72h window or already removed)"
done

echo "✓ Done. Org should show only dna-by-humaan + dna-runtime."
