/**
 * Wave 1 P0 marketplace packs — jam flagship frameworks/auth/payments/cloud
 * to the richness bar. Appended last in PACKS so Map last-write-wins.
 */
import type { KnowledgePack } from "@superhumaan/dna-config";
import {
  richCatalogPack,
  type P0DomainHints,
  type RichDocSet,
} from "./pack-richness.js";
import { P0_WAVE2_PACKS, P0_WAVE2_PACK_IDS } from "./bundled-catalog-p0-wave2.js";

function p0(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  desc: string,
  docs: RichDocSet,
  tags: string[],
  repos: [string, string, string],
  domain?: P0DomainHints,
): KnowledgePack {
  return richCatalogPack(id, name, category, desc, docs, ["p0", "rich", ...tags], {
    repos,
    fixtureName: `${id.replace(/\//g, "-")}-sample`,
    p0Depth: true,
    domain: domain ?? {
      stack: `${name} in a DNA TypeScript product`,
      failureModes: [
        `${name} misconfiguration between environments`,
        `Dependency outage affecting ${name}`,
        `Silent permission or schema drift`,
      ],
      recipes: [
        `${name} happy-path smoke`,
        `${name} failure / timeout handling`,
        `${name} rollback or flag-off`,
      ],
      security: [
        `Least privilege for ${name} credentials`,
        `Validate inputs at ${name} trust boundaries`,
        `No secrets in git or client bundles`,
      ],
      metrics: [`${name} error rate`, `${name} latency p95`, `${name} saturation`],
    },
  });
}

export const P0_WAVE1_PACK_IDS = [
  "frameworks/nextjs",
  "frameworks/react",
  "frameworks/vite",
  "frameworks/nestjs",
  "frameworks/fastify",
  "auth/clerk",
  "payments/stripe",
  "payments/overview",
  "payments/stripe-connect",
  "cloud/github-actions",
  "cloud/aws-overview",
  "cloud/docker",
] as const;

export const P0_RICH_PACK_IDS = [...P0_WAVE1_PACK_IDS, ...P0_WAVE2_PACK_IDS] as const;

const P0_WAVE1_PACKS: KnowledgePack[] = [
  p0(
    "frameworks/nextjs",
    "Next.js",
    "frameworks",
    "Next.js App Router — Server Components, route handlers, caching, deploy",
    {
      positioning: `# Next.js — Positioning

Prefer **App Router**, React Server Components (RSC), and Route Handlers for DNA web apps.

## When to use
- Fullstack TypeScript product on Vercel / Node
- Need SSR/SSG, streaming, and file-based routing
- Pair with \`auth/clerk\`, \`payments/stripe\`, \`tools/tailwind-css\`

## DNA defaults
- App Router over Pages Router for new work
- Server Components by default; \`"use client"\` only for interactivity
- \`dna quality report\` + \`dna docker build\` before ship
`,
      architecture: `# Architecture — Next.js App Router

\`\`\`
app/
  layout.tsx          # RSC shell
  page.tsx            # route UI
  loading.tsx         # Suspense fallback
  error.tsx           # error boundary
  api/**/route.ts     # Route Handlers
\`\`\`

| Concern | Pattern |
|---------|---------|
| Data fetch | async Server Components / \`fetch\` cache |
| Mutations | Server Actions or Route Handlers |
| Auth | Middleware + server helpers |
| Admin | Separate \`/admin\` tree + RBAC |
`,
      integration: `# Integration

| Pack | Role |
|------|------|
| auth/clerk | Session + middleware |
| payments/stripe | Checkout / webhooks via Route Handlers |
| cloud/vercel | Deploy (or docker for self-host) |
| tools/tailwind-css | Styling |

## Env
Never commit secrets. Use \`.env.local\` + platform env. Validate with Zod at boot.
`,
      checklist: `# Checklist — Next.js feature

- [ ] RSC vs client boundary intentional
- [ ] No secrets in client bundles
- [ ] Route Handler validates input
- [ ] Loading/error UI for async routes
- [ ] Admin routes guarded (UI + API)
- [ ] Tests for critical handlers
- [ ] \`dna quality report --feature\` PASS
`,
      examples: `# Examples

## Route Handler
\`\`\`ts
export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  // …
  return Response.json({ ok: true });
}
\`\`\`

## Server Component data
\`\`\`tsx
export default async function Page() {
  const data = await getData();
  return <View data={data} />;
}
\`\`\`
`,
      antiPatterns: `# Anti-patterns

- \`"use client"\` on entire trees by default
- Fetching secrets in Client Components
- Mixing Pages Router and App Router without need
- Treating stub Impressions as product requirements
`,
      references: `# References

1. https://nextjs.org/docs
2. https://github.com/vercel/next.js
3. https://react.dev/reference/rsc/server-components
4. Pair: \`frameworks/react\`, \`auth/clerk\`
`,
      extras: {
        caching: `# Caching

- \`fetch\` cache / \`revalidate\` / \`unstable_cache\` with intent
- Tag-based revalidation for CMS-like data
- Do not cache personalized or auth-sensitive responses publicly
`,
      },
    },
    ["nextjs", "react", "app-router"],
    ["vercel/next.js", "vercel/next.js", "facebook/react"],
  ),

  p0(
    "frameworks/react",
    "React",
    "frameworks",
    "React UI — components, hooks, Server Components awareness",
    {
      positioning: `# React — Positioning

Component model for DNA UIs. Prefer composition, clear props, accessibility.

## With Next.js
Default to RSC; client components for state, effects, browser APIs.
`,
      architecture: `# Architecture

\`\`\`
presentational ← hooks ← data (server or query)
\`\`\`

Keep side effects at the edges. Prefer controlled forms with schema validation.
`,
      integration: `# Integration

Pair \`frameworks/nextjs\` or \`frameworks/vite\`. Testing via Vitest + Testing Library.
`,
      checklist: `# Checklist

- [ ] Keys stable on lists
- [ ] a11y: labels, focus, keyboard
- [ ] No prop drilling beyond 2–3 levels without context
- [ ] Effects have correct deps / cleanup
`,
      examples: `# Example

\`\`\`tsx
export function SubmitButton({ pending }: { pending: boolean }) {
  return <button disabled={pending} type="submit">Save</button>;
}
\`\`\`
`,
      antiPatterns: `# Anti-patterns

- Derived state duplicated from props
- Effects for pure transforms
- Ignoring accessibility
`,
      references: `# References

1. https://react.dev
2. https://github.com/facebook/react
3. Testing Library docs
`,
    },
    ["react", "ui"],
    ["facebook/react", "testing-library/react-testing-library", "facebook/react"],
  ),

  p0(
    "frameworks/vite",
    "Vite",
    "frameworks",
    "Vite — fast dev server, Vitest, library and SPA builds",
    {
      positioning: `# Vite — Positioning

Default bundler/dev server for Vite-based DNA frontends and package builds (tsup still common for libs).
`,
      architecture: `# Architecture

\`vite.config.ts\` → plugins → \`import.meta.env\` · Vitest shares Vite resolve.
`,
      integration: `# Integration

- \`frameworks/react\` / Vue / Svelte plugins
- \`vite-plugin-pwa\` when offline needed
- Pair \`cloud/docker\` for static nginx serve
`,
      checklist: `# Checklist

- [ ] Env prefixed \`VITE_\` for client
- [ ] Production sourcemaps policy set
- [ ] Vitest path aliases match Vite
`,
      examples: `# Example

\`\`\`ts
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom" },
});
\`\`\`
`,
      antiPatterns: `# Anti-patterns

- Putting secrets in \`VITE_\` env
- Disabling HMR permanently
`,
      references: `# References

1. https://vitejs.dev
2. https://github.com/vitejs/vite
3. Vitest docs
`,
    },
    ["vite", "bundler"],
    ["vitejs/vite", "vitest-dev/vitest", "vitejs/vite"],
  ),

  p0(
    "frameworks/nestjs",
    "NestJS",
    "frameworks",
    "NestJS — modules, DI, guards, pipes, OpenAPI",
    {
      positioning: `# NestJS — Positioning

Modular Node backend with DI. Use for enterprise APIs needing structure over micro-handlers.
`,
      architecture: `# Architecture

Module → Controller → Service → Repository  
Guards (auth) · Pipes (validation) · Interceptors (cross-cutting)
`,
      integration: `# Integration

Pair \`auth/*\`, \`databases/*\`, \`cloud/docker\`. Prefer class-validator DTOs on all public inputs.
`,
      checklist: `# Checklist

- [ ] DTO validation on every endpoint
- [ ] Guards on admin routes
- [ ] TestingModule unit tests for services
`,
      examples: `# Example

\`\`\`ts
@UseGuards(AuthGuard)
@Post()
create(@Body() dto: CreateDto) { return this.svc.create(dto); }
\`\`\`
`,
      antiPatterns: `# Anti-patterns

- Fat controllers with business logic
- Skipping ValidationPipe globally
`,
      references: `# References

1. https://docs.nestjs.com
2. https://github.com/nestjs/nest
`,
    },
    ["nestjs", "backend"],
    ["nestjs/nest", "nestjs/nest", "typestack/class-validator"],
  ),

  p0(
    "frameworks/fastify",
    "Fastify",
    "frameworks",
    "Fastify — schema-first HTTP APIs, plugins, performance",
    {
      positioning: `# Fastify — Positioning

Schema-first JSON APIs. Prefer when you want speed + JSON Schema validation without Nest ceremony.
`,
      architecture: `# Architecture

\`fastify.register(plugin)\` · route schemas · encapsulate contexts  
Hooks: onRequest → preHandler → handler → onSend
`,
      integration: `# Integration

DNA examples often use Fastify. Pair with Zod/JSON Schema, OpenAPI generators, \`cloud/docker\`.
`,
      checklist: `# Checklist

- [ ] Schema on every public route
- [ ] Error handler maps validation failures to 400
- [ ] Plugin encapsulation for auth/db
`,
      examples: `# Example

\`\`\`ts
app.post('/v1/items', { schema: { body: bodySchema } }, handler);
\`\`\`
`,
      antiPatterns: `# Anti-patterns

- Bypassing schema validation
- Global mutable state outside decorate
`,
      references: `# References

1. https://fastify.dev
2. https://github.com/fastify/fastify
`,
    },
    ["fastify", "backend"],
    ["fastify/fastify", "fastify/fastify", "ajv-validator/ajv"],
  ),

  p0(
    "auth/clerk",
    "Clerk",
    "platforms",
    "Clerk auth — sessions, organizations, middleware for Next.js",
    {
      positioning: `# Clerk — Positioning

DNA default hosted auth for many stacks. Use organizations for B2B tenancy when needed.
`,
      architecture: `# Architecture

ClerkProvider → middleware protect → server \`auth()\` / client hooks  
Map Clerk org/user ids to app tenancy carefully.
`,
      integration: `# Integration

Pair \`frameworks/nextjs\`, \`combo/auth-rbac\`. Webhooks for user lifecycle. Never trust client-only role checks.
`,
      checklist: `# Checklist

- [ ] Middleware protects private routes
- [ ] Server components read auth server-side
- [ ] Admin APIs use \`requireAdmin\` equivalent
- [ ] Webhook signatures verified
`,
      examples: `# Example

Protect \`/dashboard(.*)\` in middleware; public marketing routes exempt.
`,
      antiPatterns: `# Anti-patterns

- Hiding admin UI without API enforcement
- Logging session tokens
`,
      references: `# References

1. https://clerk.com/docs
2. https://github.com/clerk/javascript
`,
    },
    ["clerk", "auth"],
    ["clerk/javascript", "clerk/javascript", "colinhacks/zod"],
  ),

  p0(
    "payments/stripe",
    "Stripe",
    "platforms",
    "Stripe Checkout, Billing, webhooks, idempotency",
    {
      positioning: `# Stripe — Positioning

Default payments for DNA SaaS. Prefer Checkout Sessions + webhooks over raw card handling (PCI scope).
`,
      architecture: `# Architecture

Client → Checkout Session → Stripe → webhook → fulfill  
Idempotency keys on money moves. Store \`stripeCustomerId\` / subscription status locally.
`,
      integration: `# Integration

Pair \`payments/overview\`, \`payments/stripe-connect\` for marketplaces, tax packs (anrok/avalara) when needed.
`,
      checklist: `# Checklist

- [ ] Webhook signature verified
- [ ] Idempotent fulfillment
- [ ] Test mode keys never in prod
- [ ] Customer portal for self-serve billing
`,
      examples: `# Example

On \`checkout.session.completed\` upsert entitlement; ignore duplicates by event id.
`,
      antiPatterns: `# Anti-patterns

- Fulfilling only from client success redirect
- Trusting client-reported amounts
`,
      references: `# References

1. https://stripe.com/docs
2. https://github.com/stripe/stripe-node
`,
    },
    ["stripe", "payments"],
    ["stripe/stripe-node", "stripe/stripe-python", "stripe/openapi"],
  ),

  p0(
    "payments/overview",
    "Payments Overview",
    "platforms",
    "Choose payment stack — Checkout vs Billing vs Connect vs regional",
    {
      positioning: `# Payments Overview

Decision pack before installing a processor. Match product shape → provider.
`,
      architecture: `# Decision matrix

| Product | Prefer |
|---------|--------|
| SaaS subscription | Stripe Billing |
| One-shot checkout | Stripe Checkout / Lemon Squeezy |
| Marketplace | Stripe Connect |
| Bank linking | Plaid |
`,
      integration: `# Integration

Install specific packs after choice. Always plan webhooks + ledger/entitlements.
`,
      checklist: `# Checklist

- [ ] PCI scope minimized
- [ ] Tax/VAT considered
- [ ] Refund/chargeback path documented
`,
      examples: `# Example

B2B SaaS EU → Stripe Billing + tax pack + Customer Portal.
`,
      antiPatterns: `# Anti-patterns

- Building custom card forms without need
- No webhook before go-live
`,
      references: `# References

1. Stripe docs architecture
2. \`payments/stripe\`, \`payments/stripe-connect\`
`,
    },
    ["payments", "overview"],
    ["stripe/stripe-node", "stripe/openapi", "plaid/plaid-node"],
  ),

  p0(
    "payments/stripe-connect",
    "Stripe Connect",
    "platforms",
    "Stripe Connect — marketplaces, connected accounts, payouts",
    {
      positioning: `# Stripe Connect

Use for multi-party money movement (marketplaces, platforms). Choose Standard / Express / Custom intentionally.
`,
      architecture: `# Architecture

Platform account → Connected accounts → Charges with \`transfer_data\` / destination charges  
Onboarding Express accounts for sellers.
`,
      integration: `# Integration

Pair \`companies/platform-marketplace\`, \`payments/stripe\`, strong admin/moderation packs.
`,
      checklist: `# Checklist

- [ ] Connected account onboarding complete before payouts
- [ ] Application fees explicit
- [ ] Webhook covers account.updated + capability changes
`,
      examples: `# Example

Destination charge: buyer pays platform; transfer to seller minus fee.
`,
      antiPatterns: `# Anti-patterns

- Paying out before KYC capabilities active
- Mixing Connect modes casually
`,
      references: `# References

1. Stripe Connect docs
2. \`payments/stripe\`
`,
    },
    ["stripe", "connect", "marketplace"],
    ["stripe/stripe-node", "stripe/openapi", "stripe/stripe-php"],
  ),

  p0(
    "cloud/github-actions",
    "GitHub Actions",
    "platforms",
    "CI/CD with GitHub Actions — DNA CI, OIDC, caches",
    {
      positioning: `# GitHub Actions

DNA default CI. Prefer reusable workflows, OIDC to cloud (no long-lived keys), and advisory vs strict gates per \`ci.strict\`.
`,
      architecture: `# Architecture

on: push/PR → jobs (lint, test, coverage, SAST, docker)  
Artifacts + caches. Secrets in GitHub Environments.
`,
      integration: `# Integration

\`dna ci install\` scaffolds workflows. Pair \`cloud/docker\`, npm publish workflow with \`NPM_TOKEN\` secret.
`,
      checklist: `# Checklist

- [ ] \`contents\` / \`id-token\` permissions least-privilege
- [ ] No secrets in logs
- [ ] Cache keys include lockfile hash
`,
      examples: `# Example

OIDC assume-role to AWS instead of static \`AWS_ACCESS_KEY_ID\`.
`,
      antiPatterns: `# Anti-patterns

- curl|bash installers without pin
- Force-push main from Actions
`,
      references: `# References

1. https://docs.github.com/actions
2. DNA \`.github/workflows/dna-ci.yml\`
`,
    },
    ["ci", "github-actions"],
    ["actions/checkout", "actions/setup-node", "docker/build-push-action"],
  ),

  p0(
    "cloud/aws-overview",
    "AWS Overview",
    "platforms",
    "AWS landing — accounts, IAM, regions, well-architected defaults",
    {
      positioning: `# AWS Overview

Enterprise cloud hub. Start with IAM least privilege, one region, and clear account boundaries before service sprawl.
`,
      architecture: `# Architecture

Org / accounts → VPC → compute (ECS/Lambda) → data (RDS/S3) → edge (CloudFront)  
Prefer IaC (Terraform/CDK) over console clicks for prod.
`,
      integration: `# Integration

Child packs: \`cloud/aws-lambda\`, \`cloud/aws-rds\`, \`cloud/aws-s3\`, \`cloud/aws-cognito\`, etc.
`,
      checklist: `# Checklist

- [ ] MFA on humans
- [ ] No long-lived AKIA in CI (use OIDC)
- [ ] Budgets/alerts on
- [ ] Backup + restore tested
`,
      examples: `# Example

Separate prod/nonprod accounts; promote via pipeline not manual sync.
`,
      antiPatterns: `# Anti-patterns

- Root keys for automation
- Public S3 buckets by accident
`,
      references: `# References

1. AWS Well-Architected
2. https://github.com/aws/aws-cdk
`,
    },
    ["aws", "cloud"],
    ["aws/aws-cdk", "hashicorp/terraform-provider-aws", "aws/aws-cli"],
  ),

  p0(
    "cloud/docker",
    "Docker",
    "platforms",
    "Docker images — DNA docker build, multi-stage, non-root",
    {
      positioning: `# Docker

Required DNA ship path: \`dna docker build\`. Multi-stage builds, non-root user, minimal base images.
`,
      architecture: `# Architecture

deps stage → build stage → runtime stage  
Healthcheck + read-only root FS where possible.
`,
      integration: `# Integration

Pair CI (\`cloud/github-actions\`), registry push, compose for local deps only.
`,
      checklist: `# Checklist

- [ ] Non-root USER
- [ ] No secrets in layers
- [ ] \`.dockerignore\` excludes node_modules/.env
- [ ] Image builds in CI
`,
      examples: `# Example

Copy lockfile first for layer cache; \`pnpm deploy\` or \`pnpm --filter\` prune for runtime.
`,
      antiPatterns: `# Anti-patterns

- Running as root in prod
- \`latest\` tags without digest for prod
`,
      references: `# References

1. https://docs.docker.com
2. DNA \`dna docker build\`
`,
    },
    ["docker", "containers"],
    ["docker/dockerfile", "docker/compose", "docker/build-push-action"],
  ),
];

/** All Wave 1+2 P0 rich packs (last-write-wins when appended to PACKS). */
export const P0_RICH_PACKS: KnowledgePack[] = [...P0_WAVE1_PACKS, ...P0_WAVE2_PACKS];
