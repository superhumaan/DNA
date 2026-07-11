# Express — Positioning

Schema-first HTTP APIs with explicit middleware chains.

## Structure
`routes/` — route modules mounted on app
`middleware/` — auth, rate limit, error handler
`services/` — business logic (no req/res in services)

## Security baseline
- Helmet, CORS allowlist, rate limits on auth routes
- Validate body/query with Zod or JSON Schema
- Never log passwords, tokens, or full PII payloads
