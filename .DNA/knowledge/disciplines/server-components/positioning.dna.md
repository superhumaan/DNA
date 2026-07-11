# Server Components (RSC)

Default in Next.js App Router. Server Components fetch on server; Client Components only for interactivity.

## Rules
- `"use client"` only when needed (hooks, events, browser APIs)
- Pass serializable props — no functions from server to client except Server Actions
- Streaming + Suspense for slow data