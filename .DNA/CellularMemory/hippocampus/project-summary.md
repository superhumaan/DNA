# Project Summary

**dna-by-humaan** is a pnpm/TypeScript monorepo that ships the public
`@superhumaan/dna-by-humaan` CLI, embeddable runtime observers, DNA Lab, project
intelligence generators, knowledge packs, and delivery tooling.

## Actual stack

- **Primary product:** Node.js ESM CLI and libraries built with tsup
- **Runtime adapters:** Express, Fastify, NestJS, and Next.js consumers
- **Operator UI:** server-rendered DNA Lab JavaScript/CSS at `/labs`
- **Persistence:** atomic local JSON by default; optional shared Lab state
- **Testing:** Vitest plus Playwright browser smoke and deterministic load tests
- **Delivery:** pnpm, GitHub Actions, Docker, npm, GitHub/Vercel integrations

React/Vite/PostgreSQL describe one supported consumer archetype, not this
repository's own architecture. The public marketing site lives separately in
`superhumaan/DNA-Web`.
