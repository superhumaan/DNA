# Edge Computing

Run code at CDN edge (Vercel, Cloudflare Workers, Fastly) for auth, geo, A/B, personalization.

## Constraints
- No long CPU — offload to regional workers or origin
- KV/Durable Objects for ephemeral state — not primary DB
- Pair with `frameworks/hono`