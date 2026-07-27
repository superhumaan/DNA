# Next.js — Positioning

Prefer **App Router**, React Server Components (RSC), and Route Handlers for DNA web apps.

## When to use
- Fullstack TypeScript product on Vercel / Node
- Need SSR/SSG, streaming, and file-based routing
- Pair with `auth/clerk`, `payments/stripe`, `tools/tailwind-css`

## DNA defaults
- App Router over Pages Router for new work
- Server Components by default; `"use client"` only for interactivity
- `dna quality report` + `dna docker build` before ship
