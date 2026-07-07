# Development

## Prerequisites

- Node.js 20+
- pnpm 9+

## Setup

```bash
git clone https://github.com/superhumaan/DNA.git
cd DNA
pnpm install
pnpm build
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm test` | Run Vitest (25 tests) |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm lint` | ESLint |
| `pnpm dna` | Run CLI from source |
| `pnpm dna:link` | Build + global link |
| `pnpm dna:setup` | Team setup script |
| `pnpm publish:npm` | Publish all `@superhumaan/*` packages |

## Monorepo layout

```
packages/
  dna-cli/        CLI entry (dna command)
  dna-core/       Scanner, wizard, generators, marketplace
  dna-config/     Zod schemas, constants
  dna-runtime/    Runtime observer + adapters
  dna-immune/     Issue classifier
  dna-github/     GitHub API
  dna-ai/         AI repair orchestrator
  dna-templates/  Install snippets
  dna-docs/       Doc utilities

apps/
  examples/       Express + Vite demos
  marketplace/    Marketplace API
```

## Package dependency order (publish)

Public on npm:

- `@superhumaan/dna-by-humaan` — bundled CLI + `/runtime` export

Internal packages are `private` in the monorepo.

```bash
export NPM_TOKEN=<bypass token>
pnpm publish:npm
```

## CI

GitHub Actions runs on push/PR to `main`:

- `pnpm install`
- `pnpm build`
- `pnpm test`
- `pnpm typecheck`

## Adding a knowledge pack

Edit `packages/dna-core/src/marketplace/bundled-catalog.ts`, rebuild, test:

```bash
pnpm --filter @superhumaan/dna-core test
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
