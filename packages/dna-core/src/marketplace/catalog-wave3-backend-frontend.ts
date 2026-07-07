import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const F = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["frameworks"]);

export const WAVE3_BACKEND_FRONTEND_PACK_DEFS = [
  F("frameworks/axum", "Axum (Rust)", "Async Rust web framework", "High-performance APIs on Tokio.", "Tower middleware. Extractors. Shared state via Arc."),
  F("frameworks/actix-web", "Actix Web", "Actor-model Rust HTTP", "Legacy Rust services.", "Prefer Axum for greenfield. Worker pool tuning."),
  F("frameworks/koa", "Koa.js", "Minimal Node HTTP", "Lightweight Node APIs.", "Async middleware stack. ctx pattern."),
  F("frameworks/kong", "Kong API Gateway", "API gateway and management", "Rate limits, auth at edge, microservices.", "Declarative config. OIDC plugins. Upstream health checks."),
  F("frameworks/hasura", "Hasura", "GraphQL engine on Postgres", "Instant GraphQL from schema.", "Row-level security via Postgres. Remote schemas for custom logic."),
  F("frameworks/postgrest", "PostgREST", "REST from Postgres", "Auto REST for SQL tables.", "RLS mandatory. OpenAPI from schema."),
  F("frameworks/trigger-dev", "Trigger.dev", "Background jobs for full-stack JS", "Long-running tasks in Next/Remix.", "Task retries. Dashboard for runs."),
  F("frameworks/electric-sql", "ElectricSQL", "Postgres sync to clients", "Local-first with Postgres source of truth.", "Shape subscriptions. Conflict rules."),
  F("frameworks/powersync", "PowerSync", "Offline-first sync SDK", "Mobile/web offline with backend DB.", "Sync rules per tenant. Bucket isolation."),
  F("frameworks/sidekiq", "Sidekiq", "Ruby background jobs", "Rails async processing.", "Redis-backed. Idempotent jobs. Dead job monitoring."),
  F("frameworks/apache-camel", "Apache Camel", "Enterprise integration routes", "ESB-style routing brownfield.", "Route DSL. Error handlers. Prefer lighter iPaaS for greenfield."),
  F("frameworks/webhooks-patterns", "Webhooks Patterns", "Inbound/outbound webhook design", "Every SaaS integration surface.", "HMAC verification. Idempotency keys. Retry with exponential backoff."),
  F("frameworks/openapi-tooling", "OpenAPI & Swagger", "API contract-first design", "Public APIs, client codegen.", "Spec in repo. Spectral lint. Breaking change detection."),
  F("frameworks/server-sent-events", "Server-Sent Events", "HTTP streaming to clients", "Live feeds simpler than WebSockets.", "Reconnect headers. Heartbeat comments."),
  F("tools/preact", "Preact", "Lightweight React alternative", "Performance-sensitive embeds.", "preact/compat for React libs. 3kB core."),
  F("tools/lit", "Lit", "Web components library", "Design system export, framework-agnostic.", "LitElement. Shadow DOM styling strategy."),
  F("tools/alpine-js", "Alpine.js", "Sprinkle interactivity on HTML", "Marketing pages, HTMX companion.", "x-data scopes. CSP-friendly patterns."),
  F("tools/chakra-ui", "Chakra UI", "Accessible React component library", "Rapid SaaS UI prototyping.", "Theme tokens. Modal focus trap."),
  F("tools/ant-design", "Ant Design", "Enterprise React UI (Ant)", "Admin dashboards, data-heavy UIs.", "Form validation. Table virtualization."),
  F("tools/fresh", "Fresh (Deno)", "Deno full-stack framework", "Islands architecture on Deno.", "No client JS by default. Deploy to Deno Deploy."),
  F("tools/redwoodjs", "RedwoodJS", "Full-stack React + GraphQL", "Opinionated startup stack.", "Cells pattern. Prisma default."),
  F("tools/tanstack-table", "TanStack Table", "Headless data tables", "Admin grids, reporting UIs.", "Column defs typed. Virtualization for large sets."),
  F("tools/tanstack-start", "TanStack Start", "Full-stack React router", "SPA + SSR with TanStack Router.", "Server functions. Type-safe routes."),
  F("tools/module-federation", "Module Federation", "Micro-frontend architecture", "Independent deployable UI modules.", "Shared dependencies. Version skew policy."),
  F("tools/zustand", "Zustand", "Lightweight React state", "Client UI state without boilerplate.", "Slice pattern. Devtools optional."),
  F("tools/jotai", "Jotai", "Atomic React state", "Fine-grained derived state.", "Atoms compose. Async atoms for data."),
  F("tools/maestro", "Maestro", "Mobile UI testing", "Cross-platform mobile E2E.", "YAML flows. iOS + Android."),
  F("tools/phoenix-liveview", "Phoenix LiveView", "Server-rendered realtime UI", "Elixir teams, minimal JS.", "LiveView streams. PubSub for broadcasts."),
  F("tools/react-server-components", "React Server Components", "RSC patterns depth", "Next.js App Router default.", "Server vs client boundaries. Serialization rules."),
  F("disciplines/sli-slo", "SLI/SLO & Error Budgets", "SRE reliability engineering", "Production SaaS maturity.", "Define SLIs per user journey. Error budget policy gates releases."),
];

export const WAVE3_BACKEND_FRONTEND_PACKS = packsFromDefs(WAVE3_BACKEND_FRONTEND_PACK_DEFS);
