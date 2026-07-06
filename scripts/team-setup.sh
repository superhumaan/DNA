#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "DNA by Humaan — team setup"
echo "=========================="
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js 20+ required. Install from https://nodejs.org"
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Error: Node.js 20+ required (found $(node -v))"
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Installing pnpm..."
  corepack enable
  corepack prepare pnpm@9 --activate
fi

echo "→ Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

echo "→ Building packages..."
pnpm build

echo "→ Linking dna CLI globally..."
cd packages/dna-cli
pnpm link --global

echo ""
echo "✓ DNA CLI ready"
echo ""
dna --version 2>/dev/null || echo "  Run: dna --help"
echo ""
echo "Next — in your project:"
echo "  cd /path/to/your-project"
echo "  dna init -y"
echo "  dna doctor"
echo ""
echo "Repository: https://github.com/superhumaan/DNA"
echo "Full guide:  TEAM-TESTING.md"
echo "Add runtime: $ROOT/scripts/add-runtime.sh /path/to/your-project"
