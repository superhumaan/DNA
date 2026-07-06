# Knowledge Pack Marketplace

Curated guidance packs install into `.DNA/knowledge/`.

**Live URL:** [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace)  
**Repository API:** `apps/marketplace` in this monorepo

## CLI usage

```bash
dna marketplace list
dna marketplace search --query next
dna marketplace search --category compliance
dna marketplace install frameworks/vite
dna update
```

## Bundled packs (v0.1.0)

| Pack ID | Category |
|---------|----------|
| `frameworks/vite` | Vite + Vitest patterns |
| `frameworks/nextjs` | Next.js App Router |
| `frameworks/fastify` | Fastify backend |
| `frameworks/nestjs` | NestJS modules |
| `disciplines/security` | Security baseline |
| `compliance/gdpr` | GDPR engineering checklist |
| `compliance/soc2` | SOC 2 controls overview |
| `platforms/b2b-saas` | Multi-tenant SaaS patterns |

## Remote vs bundled

The CLI fetches:

```
GET {MARKETPLACE_URL}/api/v1/catalog?channel=stable
GET {MARKETPLACE_URL}/api/v1/packs/{packId}
```

If the remote is unreachable, it **falls back to the bundled catalog** — colleagues can work offline.

Override URL:

```bash
export DNA_MARKETPLACE_URL=http://localhost:3100/marketplace
```

## Installed pack tracking

- `.DNA/config.dna.json` → `knowledgePacks: ["frameworks/vite@1.0.0"]`
- `.DNA/marketplace/installed.json` → version registry

## Run marketplace API locally

```bash
pnpm --filter @humaan/dna-marketplace-api dev
# http://localhost:3100/marketplace/api/v1/catalog
```

## Deploy to dna.humaan.app

Deploy `apps/marketplace` to Vercel with `MARKETPLACE_BASE_PATH=/marketplace`.

## Creating packs (future)

Pack schema (`@humaan/dna-config`):

```json
{
  "id": "frameworks/vite",
  "name": "Vite",
  "version": "1.0.0",
  "category": "frameworks",
  "channel": "stable",
  "files": [{ "path": "frameworks/vite/positioning.dna.md", "content": "..." }]
}
```
