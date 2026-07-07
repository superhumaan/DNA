import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

function fw(
  id: string,
  name: string,
  desc: string,
  positioning: string,
  extra?: { path: string; content: string },
): KnowledgePack {
  const files = [
    { path: `frameworks/${id}/positioning.dna.md`, content: positioning },
    ...(extra ? [extra] : []),
  ];
  return catalogPack(`frameworks/${id}`, name, "frameworks", desc, files, ["framework", id]);
}

export const FRAMEWORK_EXTENDED_PACKS: KnowledgePack[] = [
  fw(
    "remix",
    "Remix",
    "Full-stack React framework — loaders, actions, nested routes",
    `# Remix — Positioning

React framework with web standards focus: loaders/actions on server, forms over client state.

## When to use
- SEO + auth on same codebase without Next vendor lock-in
- Progressive enhancement for forms

## Excludes
- Do not add Vite SPA alongside Remix in same app
`,
    {
      path: "frameworks/remix/testing.dna.md",
      content: `# Remix — Testing\n\nVitest for utils; Playwright for routes. Test loaders with mocked \`Request\`.\n`,
    },
  ),
  fw(
    "nuxt",
    "Nuxt",
    "Vue meta-framework — SSR, file routing, Nitro server",
    `# Nuxt — Positioning

Vue 3 full-stack. Use \`nuxt-fullstack\` archetype. Nitro for serverless/Node edge.

Pair with \`frameworks/vue\`. Excludes React in same frontend.`,
  ),
  fw(
    "sveltekit",
    "SvelteKit",
    "Svelte application framework — SSR, adapters, form actions",
    `# SvelteKit — Positioning

Default for Svelte apps needing routing/SSR. Adapters: Vercel, Node, static.

Prefer over raw Vite SPA when SEO or SSR required.`,
  ),
  fw(
    "angular",
    "Angular",
    "Enterprise SPA framework — modules, RxJS, signals (v17+)",
    `# Angular — Positioning

Batteries-included SPA. Use for large enterprise teams with Angular standard.

## Modern Angular
- Standalone components default
- Signals for state where team adopts v17+ patterns
- Zoneless experimental — document if enabled`,
  ),
  fw(
    "hono",
    "Hono",
    "Ultralight edge-first web framework — Workers, Deno, Bun, Node",
    `# Hono — Positioning

Edge APIs and microservices. Runs on Cloudflare Workers, Vercel Edge, Bun, Node.

## When to use
- Latency-sensitive public APIs at edge
- Lightweight BFF in front of monolith

Pair with \`disciplines/edge-computing\`.`,
  ),
  fw(
    "bun",
    "Bun",
    "JavaScript runtime — fast package manager, test runner, native TS",
    `# Bun — Positioning

Alternative JS runtime. Use when team commits to Bun for dev+prod Node replacement.

## Rules
- Lock \`bun.lock\`; CI uses same Bun version
- Verify native module compatibility vs Node before migration
- Hono + Bun is common pairing`,
  ),
  fw(
    "deno",
    "Deno",
    "Secure TypeScript runtime — built-in tooling, permissions model",
    `# Deno — Positioning

TypeScript-native runtime with explicit permissions (\`--allow-net\` etc.).

Good for scripts, edge functions, and teams wanting fewer npm supply-chain deps.`,
  ),
  fw(
    "solidjs",
    "SolidJS",
    "Fine-grained reactive UI — JSX without virtual DOM",
    `# Solid — Positioning

Performance-critical SPAs. Different mental model from React — do not mix React + Solid in one app.

Use Vite + solid-js router.`,
  ),
  fw(
    "qwik",
    "Qwik",
    "Resumable framework — instant-on via lazy hydration",
    `# Qwik — Positioning

Marketing and content sites needing minimal JS. Qwik City for routing.

Evaluate vs Astro for content-heavy sites.`,
  ),
  fw(
    "django",
    "Django",
    "Batteries-included Python web — ORM, admin, auth",
    `# Django — Positioning

Monolithic Python web. Admin for internal ops; DRF or Ninja for APIs.

## When to use
- Rapid CRUD + admin
- Team strength in Python over Node

Separate frontend SPA optional — document API contract.`,
  ),
  fw(
    "fastapi",
    "FastAPI",
    "Modern Python async APIs — Pydantic, OpenAPI auto-docs",
    `# FastAPI — Positioning

Default for Python microservices and ML-serving APIs.

- Pydantic v2 models at boundaries
- Async endpoints for IO-bound work
- OpenAPI drives client codegen`,
  ),
  fw(
    "laravel",
    "Laravel",
    "PHP web framework — Eloquent, queues, Livewire",
    `# Laravel — Positioning

Full-stack PHP. Inertia + Vue/React for SPA hybrid; or API-only with separate frontend.

Pair with \`languages/php\`.`,
  ),
  fw(
    "rails",
    "Ruby on Rails",
    "Convention-over-configuration full-stack Ruby",
    `# Rails — Positioning

Hotwire (Turbo/Stimulus) for HTML-first; or API mode + React Native client.

Rails 7+ defaults: import maps or bundler per team choice.`,
  ),
  fw(
    "spring-boot",
    "Spring Boot",
    "Java/Kotlin enterprise APIs and microservices",
    `# Spring Boot — Positioning

JVM microservices standard. Spring Security for auth; validate DTOs at controller.

Prefer Kotlin for new services when team agrees.`,
  ),
  fw(
    "graphql",
    "GraphQL",
    "API query layer — schema-first, federation patterns",
    `# GraphQL — Positioning

Single graph for clients. Use when multiple clients need flexible queries — not for every CRUD API.

## Rules
- Complexity limits + depth limits on public graph
- Persisted queries for mobile in production
- Pair with \`disciplines/api-design\``,
  ),
  fw(
    "trpc",
    "tRPC",
    "End-to-end typesafe APIs without GraphQL schema",
    `# tRPC — Positioning

TypeScript monorepo APIs sharing types with React/Next client.

Best when frontend+backend same repo and team is TS-only.`,
  ),
  fw(
    "turbo",
    "Turborepo",
    "Monorepo build system — caching, task pipelines",
    `# Turborepo — Positioning

JS/TS monorepos. \`turbo.json\` pipelines; remote cache in CI.

Pair with \`disciplines/monorepo\`. Not a framework — orchestration layer.`,
  ),
];
