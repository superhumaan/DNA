# Payload CMS — Architecture

# Payload CMS — Positioning

**Hot choice** for Next.js teams: CMS lives in your repo, TypeScript config, admin UI included.

## When to pick Payload
- Next.js full-stack and want CMS in monorepo
- Need custom fields, access control in code
- Prefer Postgres over proprietary cloud

Pair with `next-fullstack` or dedicated Payload template archetype.


## Content flow
- Editorial → API → frontend build or ISR
- Webhooks trigger cache invalidation
