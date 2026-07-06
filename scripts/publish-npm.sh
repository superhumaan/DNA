#!/usr/bin/env bash
# Publish all @humaan/dna-* packages to npm (requires npm login + @humaan scope access)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "DNA — npm publish (all packages)"
echo "================================"
echo ""
echo "Prerequisites:"
echo "  npm login"
echo "  Access to publish @humaan/* packages"
echo ""

pnpm build

# Dependency order — config/templates first, then layers, CLI last
PACKAGES=(
  packages/dna-config
  packages/dna-templates
  packages/dna-immune
  packages/dna-github
  packages/dna-ai
  packages/dna-core
  packages/dna-runtime
  packages/dna-cli
)

for pkg in "${PACKAGES[@]}"; do
  echo "→ Publishing $(node -p "require('./$pkg/package.json').name")..."
  cd "$ROOT/$pkg"
  npm publish --access public
done

echo ""
echo "✓ Published. Colleagues can now run:"
echo "  npx @humaan/dna-cli init -y"
echo "  pnpm add @humaan/dna-runtime"
