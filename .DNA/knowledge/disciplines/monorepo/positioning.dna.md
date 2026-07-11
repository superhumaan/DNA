# Monorepo

pnpm workspaces + Turborepo common in DNA repos.

## Rules
- Package boundaries enforced (no app importing app internals)
- Shared `@org/ui`, `@org/config` packages versioned together
- `turbo run test build --filter=...` in CI