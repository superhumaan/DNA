#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: ./scripts/add-runtime.sh /path/to/your-project"
  exit 1
fi

PROJECT="$(cd "$1" && pwd)"
DNA_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_PKG="$DNA_ROOT/packages/dna-runtime"

if [ ! -f "$PROJECT/package.json" ]; then
  echo "Error: No package.json in $PROJECT"
  exit 1
fi

if [ ! -d "$PROJECT/.DNA" ]; then
  echo "→ DNA not found — running dna init -y..."
  dna init -y --cwd "$PROJECT"
fi

echo "→ Adding @humaan/dna-runtime from monorepo..."
cd "$PROJECT"

if [ -f pnpm-lock.yaml ] || [ -f pnpm-workspace.yaml ]; then
  pnpm add "@humaan/dna-runtime@file:$RUNTIME_PKG"
elif [ -f yarn.lock ]; then
  yarn add "file:$RUNTIME_PKG"
else
  npm install "file:$RUNTIME_PKG"
fi

echo "→ Writing runtime install snippets..."
dna runtime install --cwd "$PROJECT"

echo ""
echo "✓ Runtime package installed"
echo "  Snippets: $PROJECT/.DNA/runtime/install-snippet.ts"
echo "  Wire up per framework — see TEAM-TESTING.md § Runtime"
