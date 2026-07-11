# Development

Guide for contributors working in the [DNA monorepo](https://github.com/superhumaan/DNA).

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

Link the CLI globally (optional):

```bash
pnpm dna:link
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm test` | Run Vitest (all packages) |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm lint` | ESLint |
| `pnpm dna` | Run CLI from source |
| `pnpm dna:link` | Build + global link |
| `pnpm dna:setup` | Team setup script |
| `pnpm publish:npm` | Publish all `@superhumaan/*` packages |
| `pnpm gdpr:ingest` | Ingest GDPR .docx templates into bundled assets |
| `pnpm gdpr:scrub` | Scrub vendor branding from GDPR templates |

---

## Monorepo layout

```
packages/
  dna-cli/        CLI entry (`dna` command)
  dna-core/       Scanner, wizard, generators, marketplace
  dna-config/     Typed config schemas, validators, constants
  dna-runtime/    Runtime observer + adapters
  dna-immune/     Issue classifier
  dna-github/     GitHub API
  dna-ai/         AI repair orchestrator
  dna-templates/  Install snippets
  dna-docs/       Doc utilities

apps/
  examples/       Express + Vite demos
  marketplace/    Standalone marketplace API (local dev)

# Web UI: github.com/superhumaan/DNA-Web (deployed to dna.humaan.app)
```

---

## Local environment variables

| Variable | Purpose |
|----------|---------|
| `DNA_REFERENCE_ROOT` | Parent dir of reference repos for `dna platform projects` |
| `DNA_GDPR_SOURCE_DOCS` | Source .docx folder for `pnpm gdpr:ingest` |
| `DNA_MARKETPLACE_URL` | Override remote marketplace URL |
| `NPM_TOKEN` | Required for `pnpm publish:npm` |

Full list for end users: [Integrations](./integrations.md#environment-variables).

---

## Package dependency order (publish)

Public on npm:

- `@superhumaan/dna-by-humaan` — bundled CLI + `/runtime` export

Internal packages are `private` in the monorepo.

```bash
export NPM_TOKEN=<token>
pnpm publish:npm
```

---

## CI

GitHub Actions runs on push/PR to `main`:

- `pnpm install`
- `pnpm build`
- `pnpm test`
- `pnpm typecheck`

---

## Adding a knowledge pack

1. Add pack definition under `packages/dna-core/src/marketplace/`.
2. Register in `bundled-catalog.ts` if it belongs in the core bundle.
3. Rebuild and test:

```bash
pnpm build
pnpm test
```

For retired pack IDs, add aliases in `marketplace/aliases.ts`.

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).

## See also

- [Documentation hub](./README.md)
- [Changelog](../CHANGELOG.md)
- [Naming conventions](./naming.md)
