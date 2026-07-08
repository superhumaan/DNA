# Monorepo layout

Guide to the DNA monorepo package graph and build order.

---

## Packages

| Package | Role |
|---------|------|
| `dna-config` | Zod schemas, constants — shared types |
| `dna-templates` | Runtime install snippets |
| `dna-core` | Scanner, wizard, marketplace, generators, IVF, quality |
| `dna-immune` | Issue classifier rules |
| `dna-runtime` | Runtime observer + Express/Fastify/NestJS/Next adapters |
| `dna-github` | GitHub API, auth, push |
| `dna-ai` | AI repair orchestrator |
| `dna-cli` | CLI entry — bundles core + publishes to npm |
| `dna-docs` | Documentation utilities |

---

## Apps

| App | Role |
|-----|------|
| `apps/examples` | Express + Vite demo projects |
| `apps/docs` | Docusaurus wiki site |
| `apps/marketplace` | Legacy standalone marketplace API |

---

## Build & test

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

Link CLI globally:

```bash
pnpm dna:link
```

---

## Publish

Public npm artifact: `@superhumaan/dna-by-humaan` (CLI + `/runtime` subpath).

```bash
export NPM_TOKEN=<token>
pnpm publish:npm
```

---

## Related

- [Local development](../local-development.md)
- [CI/CD](./ci-cd.md)
