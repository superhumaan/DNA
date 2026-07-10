#!/usr/bin/env bash
# Register the first-party DNA GitHub OAuth App and update oauth-config.ts
#
# GitHub does not expose OAuth App creation via REST API — this script guides
# manual registration then patches the client ID into the codebase.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="$ROOT/packages/dna-github/src/oauth-config.ts"
OAUTH_NEW_URL="https://github.com/settings/applications/new"

echo "DNA GitHub OAuth App Setup"
echo "=========================="
echo ""
echo "1. Open: $OAUTH_NEW_URL"
echo ""
echo "   Application name:  DNA by Humaan"
echo "   Homepage URL:      https://dna.humaan.app"
echo "   Authorization callback URL: http://localhost"
echo ""
echo "2. Enable 'Device Flow' and register the application"
echo ""
echo "3. Copy the Client ID and paste it below"
echo ""

if command -v open >/dev/null 2>&1; then
  open "$OAUTH_NEW_URL" 2>/dev/null || true
fi

read -r -p "Client ID: " CLIENT_ID

if [[ -z "$CLIENT_ID" ]]; then
  echo "Error: Client ID is required." >&2
  exit 1
fi

if [[ "$CLIENT_ID" == "DNA_GITHUB_OAUTH_APP" ]]; then
  echo "Error: Replace the placeholder with your registered Client ID." >&2
  exit 1
fi

sed -i.bak "s/export const DNA_OAUTH_CLIENT_ID = \"[^\"]*\"/export const DNA_OAUTH_CLIENT_ID = \"$CLIENT_ID\"/" "$CONFIG_FILE"
rm -f "$CONFIG_FILE.bak"

echo ""
echo "✓ Updated $CONFIG_FILE"
echo ""
echo "Next steps:"
echo "  pnpm build"
echo "  dna github login    # test device flow without gh CLI"
echo "  Close GitHub issue #11 after verifying login"
