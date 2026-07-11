# React — Positioning

Use React 18+ with function components and hooks. Prefer colocated state; lift only when multiple siblings need it.

## Defaults
- TypeScript for new files
- Server state: TanStack Query or framework-native data fetching (Next.js)
- Client state: useState/useReducer; Zustand only when prop drilling hurts
- Forms: controlled inputs + schema validation (Zod)

## File layout
`components/` — presentational + container split where useful
`hooks/` — reusable hooks
`pages/` or `routes/` — route-level composition

Pair with `frameworks/vite` or `frameworks/nextjs` — do not mix SPA Vite with Next in one app.
