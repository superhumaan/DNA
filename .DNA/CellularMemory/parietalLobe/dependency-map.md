# Dependency Map

## Build-time dependencies

- pnpm workspace links internal `@superhumaan/dna-*` packages
- TypeScript + tsup compile ESM and declaration bundles
- Vitest/V8 provide unit, integration, and scoped coverage evidence
- Playwright Chromium provides the Lab browser smoke gate

## Runtime boundaries

- The published CLI keeps required production dependencies at zero
- Frameworks (Express/Fastify/NestJS) are optional peers supplied by consumers
- File-backed JSON is the default local state/runtime store
- Shared Lab state uses an explicitly configured remote adapter; secrets stay in env
- GitHub API/CLI supports issues, CI, releases, and delivery
- DNA-Web consumes only sanitized public health artifacts, never Lab private data

## Supply-chain rule

Any new runtime dependency requires explicit justification, audit, lockfile
review, and npm package inspection. Test/build-only dependencies remain dev-only.
