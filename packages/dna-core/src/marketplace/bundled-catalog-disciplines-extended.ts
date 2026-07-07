import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

function discipline(
  id: string,
  name: string,
  desc: string,
  body: string,
  extra?: string,
): KnowledgePack {
  const files = [
    { path: `disciplines/${id}/positioning.dna.md`, content: body },
    ...(extra
      ? [{ path: `disciplines/${id}/practices.dna.md`, content: extra }]
      : []),
  ];
  return catalogPack(`disciplines/${id}`, name, "disciplines", desc, files, ["methodology", id]);
}

export const DISCIPLINE_EXTENDED_PACKS: KnowledgePack[] = [
  discipline(
    "trunk-based-development",
    "Trunk-Based Development",
    "Short-lived branches, feature flags, continuous integration on main",
    `# Trunk-Based Development

Integrate to \`main\` at least daily. Branches live < 2 days or use feature flags.

## Practices
- Feature flags for incomplete work (\`disciplines/feature-flags\`)
- Small PRs with tests
- Main always deployable`,
    `## Anti-patterns\n- Long-lived \`develop\` branch\n- Release branches without automated backport\n- Merging without CI green`,
  ),
  discipline(
    "tdd-bdd",
    "TDD & BDD",
    "Test-driven and behaviour-driven development practices",
    `# TDD & BDD

**TDD:** red → green → refactor at unit level.
**BDD:** Given/When/Then scenarios for product-aligned acceptance tests (Cucumber, Playwright BDD).

DNA default: tests required per \`testing.behaviour.md\` — TDD when team adopts explicitly.`,
    `- Colocate tests with modules\n- BDD for cross-cutting user journeys only — avoid cucumber soup`,
  ),
  discipline(
    "continuous-delivery",
    "Continuous Delivery",
    "Deploy-ready main, automated pipelines, progressive rollout",
    `# Continuous Delivery

Every commit can reach production. Pipelines: lint → test → build → deploy staging → promote prod.

Pair with \`disciplines/devops\` and feature flags for risk reduction.`,
  ),
  discipline(
    "domain-driven-design",
    "Domain-Driven Design",
    "Bounded contexts, ubiquitous language, aggregates",
    `# Domain-Driven Design

Use bounded contexts in Impressions architecture. Ubiquitous language in code (\`Order\`, not \`DataRecord\`).

## Tactical patterns
- Entities vs value objects
- Repositories at persistence boundary
- Domain events for cross-context integration`,
  ),
  discipline(
    "ai-assisted-development",
    "AI-Assisted Development",
    "Cursor, Copilot, Claude — safe and effective AI coding workflows",
    `# AI-Assisted Development (2025+)

## Rules
- AI follows \`.DNA/behaviour/\` — run \`dna validate\` before merge
- Never paste secrets into prompts
- Human review required for auth, crypto, and compliance code
- \`dna context <tool>\` loads minimal relevant context

## Trends
- Agentic multi-file edits — keep PRs reviewable size
- MCP tools for internal systems — see \`platforms/mcp-server\``,
  ),
  discipline(
    "edge-computing",
    "Edge Computing",
    "Edge functions, CDN compute, latency and data residency",
    `# Edge Computing

Run code at CDN edge (Vercel, Cloudflare Workers, Fastly) for auth, geo, A/B, personalization.

## Constraints
- No long CPU — offload to regional workers or origin
- KV/Durable Objects for ephemeral state — not primary DB
- Pair with \`frameworks/hono\``,
  ),
  discipline(
    "server-components",
    "Server Components & RSC",
    "React Server Components, streaming, partial prerendering",
    `# Server Components (RSC)

Default in Next.js App Router. Server Components fetch on server; Client Components only for interactivity.

## Rules
- \`"use client"\` only when needed (hooks, events, browser APIs)
- Pass serializable props — no functions from server to client except Server Actions
- Streaming + Suspense for slow data`,
  ),
  discipline(
    "monorepo",
    "Monorepo Practices",
    "Turborepo, pnpm workspaces, shared packages, boundary rules",
    `# Monorepo

pnpm workspaces + Turborepo common in DNA repos.

## Rules
- Package boundaries enforced (no app importing app internals)
- Shared \`@org/ui\`, \`@org/config\` packages versioned together
- \`turbo run test build --filter=...\` in CI`,
  ),
  discipline(
    "api-design",
    "API Design",
    "REST, GraphQL, versioning, pagination, error contracts",
    `# API Design

## REST defaults
- Nouns in URLs; HTTP verbs correct
- Cursor pagination for large lists
- Problem+json or consistent \`{ error, code }\` shape
- Version in path (\`/v1/\`) when breaking changes ship`,
    `## OpenAPI\n- Generate from Zod (tsoa, hono zod-openapi)\n- Contract tests in CI`,
  ),
  discipline(
    "event-driven",
    "Event-Driven Architecture",
    "Messages, outbox, idempotency, sagas",
    `# Event-Driven Architecture

Use when domains decouple (orders → inventory → notifications).

## Patterns
- Outbox table for reliable publish
- Idempotent consumers (dedupe key)
- Avoid distributed monolith — clear ownership per event type`,
  ),
  discipline(
    "observability",
    "Observability",
    "OpenTelemetry, structured logs, metrics, tracing",
    `# Observability

## Three pillars
- **Logs:** structured JSON, correlation IDs
- **Metrics:** RED/USE for services
- **Traces:** OpenTelemetry → vendor (Datadog, Honeycomb, Grafana)

Never log secrets or full PII. Pair with \`runtime.behaviour.md\`.`,
  ),
  discipline(
    "platform-engineering",
    "Platform Engineering",
    "Internal developer platforms, golden paths, self-service infra",
    `# Platform Engineering

Golden paths via DNA archetypes + templates. Self-service envs with guardrails.

## DNA role
- \`dna init\` scaffolds approved stack
- Marketplace packs = golden path knowledge
- Impressions document org-specific overrides`,
  ),
  discipline(
    "accessibility",
    "Accessibility (a11y)",
    "WCAG 2.2, semantic HTML, keyboard, screen readers",
    `# Accessibility

Target WCAG 2.2 AA for customer-facing UIs.

## Checklist
- Semantic HTML first; ARIA only when needed
- Keyboard navigable; visible focus
- Color contrast 4.5:1 text
- axe-core in CI; manual VoiceOver/NVDA on critical flows`,
  ),
  discipline(
    "design-systems",
    "Design Systems",
    "Tokens, components, Storybook, Figma code connect",
    `# Design Systems

Single source: design tokens → Tailwind/CSS vars → component library.

## Practices
- Storybook for states and a11y checks
- Breaking visual changes = semver on \`@org/ui\`
- Document in \`occipitalLobe/ui-patterns.md\``,
  ),
  catalogPack(
    "disciplines/coding-trends-2025",
    "Coding Trends (2025–2026)",
    "disciplines",
    "Current industry trends — AI agents, edge, typesafe full-stack, composable content",
    [
      {
        path: "disciplines/coding-trends-2025/overview.dna.md",
        content: `# Coding Trends — 2025–2026

## Dominant trends
1. **AI agents** in IDE and CI — DNA behaviour + validate gates
2. **Server Components** and partial prerendering (Next, Remix)
3. **Edge-first APIs** (Hono, Workers) for latency
4. **Composable content** (Sanity, Payload) over monolithic CMS
5. **TypeScript end-to-end** (tRPC, Prisma, Zod)
6. **Platform engineering** — golden paths, not ticket-driven infra
7. **OpenTelemetry** as observability default
8. **Feature flags** over long branches
9. **MCP** for tool integration with AI clients
10. **Bun/Deno** niche — Node LTS still enterprise default

## Declining for greenfield
- Create React App
- jQuery SPAs
- WordPress as primary app backend (support brownfield only)
- Microservices without domain boundaries
`,
      },
    ],
    ["methodology", "trends"],
  ),
];
