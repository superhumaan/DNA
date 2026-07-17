# Solution Architecture

## Stack

| Layer | Technology |
|-------|------------|
| Public distribution | Node.js ESM CLI and libraries on npm |
| Core | TypeScript pnpm monorepo, tsup bundles |
| Runtime integration | Express, Fastify, NestJS, Next.js adapters |
| Operator surface | DNA Lab server-rendered UI and request-polling APIs |
| State | Atomic JSON default; explicitly configured shared Lab adapter for replicas |
| Testing | Vitest/V8, Playwright, deterministic HTTP load harness |
| Delivery | GitHub Actions, Docker, npm workflow |
| Public website | Separate Next.js repository: `superhumaan/DNA-Web` |

## Architecture principles

- Zero required production dependencies in the public CLI package
- Framework adapters remain optional and consumer-owned
- Request-specific polling; no socket dependency for DNA Lab
- Fail closed at authentication, topology, and quality boundaries
- Generated/catalog content is separated from behavioral product code
- Canonical machine-readable evidence drives all public health summaries
