# Strapi — Architecture

# Strapi — Positioning

Self-hosted Node CMS with admin UI and plugin ecosystem. Good when team wants SQL-backed CMS on own infra.

## When to pick Strapi
- EU data residency with self-host
- REST/GraphQL out of the box
- Custom content-types without SaaS vendor lock-in

## Watch-outs
- Upgrade path across major versions — pin and test
- Media library size — use S3 provider in production


## Content flow
- Editorial → API → frontend build or ISR
- Webhooks trigger cache invalidation
