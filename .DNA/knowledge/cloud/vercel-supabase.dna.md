# Vercel + Supabase

Optional hosting stack notes for apps that use DNA.

## Common topology
- Vercel frontend
- Vercel serverless / Node backend
- Supabase Postgres
- Redis (rate limits) when needed

## Patterns
- Env vars in Vercel project settings (never commit secrets)
- SQL migrations under version control
- Cron via Vercel cron or GitHub Actions
- Local env sync for development

DNA Lab and quality gates work with this stack when wired via `dna lab` / doctor.
