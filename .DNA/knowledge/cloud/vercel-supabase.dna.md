# Vercel + Supabase (a production app, Ops)

## Topology
- Vercel frontend (`dist/`)
- Vercel backend (`backend/server.js` serverless)
- Supabase Postgres
- Upstash Redis (rate limits)

## Patterns
- `vercel.ts` — CSP, API rewrite to backend project
- Migrations in `supabase/migrations/` + cold-start bootstrap
- Cron via Vercel cron or GitHub Actions
- `sync:vercel-env` for local dev parity

## SSO
Shared JWT secret across sibling apps for cross-app bridge.
