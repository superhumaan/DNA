#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: ./scripts/add-runtime.sh /path/to/your-project"
  exit 1
fi

PROJECT="$(cd "$1" && pwd)"
DNA_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI_PKG="$DNA_ROOT/packages/dna-cli"

if [ ! -f "$PROJECT/package.json" ]; then
  echo "Error: No package.json in $PROJECT"
  exit 1
fi

if [ ! -d "$PROJECT/.DNA" ]; then
  echo "→ DNA not found — running dna init -y..."
  dna init -y --cwd "$PROJECT"
fi

echo "→ Adding @superhumaan/dna-by-humaan from monorepo..."
cd "$PROJECT"

if [ -f pnpm-lock.yaml ] || [ -f pnpm-workspace.yaml ]; then
  pnpm add "@superhumaan/dna-by-humaan@file:$CLI_PKG"
elif [ -f yarn.lock ]; then
  yarn add "file:$CLI_PKG"
else
  npm install "file:$CLI_PKG"
fi

echo "→ Writing runtime install snippets..."
dna runtime install --cwd "$PROJECT"

echo ""
echo "✓ DNA by Humaan installed"
echo "  Import: import { dnaRuntime } from '@superhumaan/dna-by-humaan/runtime'"
echo "  Snippets: $PROJECT/.DNA/runtime/install-snippet.ts"
