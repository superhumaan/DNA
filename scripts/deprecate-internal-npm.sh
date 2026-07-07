#!/usr/bin/env bash
# Deprecate internal packages that were mistakenly published separately
set -euo pipefail

MSG="Internal package — install @superhumaan/dna-by-humaan instead"

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
  @superhumaan/dna-config
  @superhumaan/dna-templates
  @superhumaan/dna-immune
  @superhumaan/dna-github
  @superhumaan/dna-ai
  @superhumaan/dna-core
)

for pkg in "${INTERNAL[@]}"; do
  echo "→ Deprecating $pkg..."
  npm deprecate "$pkg" "$MSG" || true
done

echo "✓ Done"
