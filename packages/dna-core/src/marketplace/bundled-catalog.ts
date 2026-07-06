import type { KnowledgePack, MarketplaceCatalog } from "@humaan/dna-config";

function pack(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  description: string,
  files: Array<{ path: string; content: string }>,
): KnowledgePack {
  return {
    id,
    name,
    version: "1.0.0",
    description,
    category,
    channel: "stable",
    tags: [category, id.split("/").pop() ?? id],
    files: files.map((f) => ({ path: f.path, content: f.content })),
    minDnaVersion: "0.1.0",
    publishedAt: "2026-01-01T00:00:00.000Z",
  };
}

const PACKS: KnowledgePack[] = [
  pack("frameworks/vite", "Vite", "frameworks", "Vite framework knowledge for DNA projects", [
    {
      path: "frameworks/vite/positioning.dna.md",
      content: `# Vite — Positioning\n\nUse Vite for fast dev server and optimized production builds.\n`,
    },
    {
      path: "frameworks/vite/pwa-patterns.dna.md",
      content: `# Vite — PWA Patterns\n\nUse vite-plugin-pwa for service workers and manifest.\n`,
    },
    {
      path: "frameworks/vite/testing.dna.md",
      content: `# Vite — Testing\n\nUse Vitest with Vite config for unit tests.\n`,
    },
    {
      path: "frameworks/vite/anti-patterns.dna.md",
      content: `# Vite — Anti-patterns\n\nDo not disable HMR in development without reason.\n`,
    },
  ]),
  pack("frameworks/nextjs", "Next.js", "frameworks", "Next.js App Router knowledge", [
    {
      path: "frameworks/nextjs/positioning.dna.md",
      content: `# Next.js — Positioning\n\nPrefer App Router, Server Components, and route handlers.\n`,
    },
    {
      path: "frameworks/nextjs/testing.dna.md",
      content: `# Next.js — Testing\n\nUse Vitest/Jest with next-test utilities.\n`,
    },
  ]),
  pack("frameworks/fastify", "Fastify", "frameworks", "Fastify backend patterns", [
    {
      path: "frameworks/fastify/positioning.dna.md",
      content: `# Fastify — Positioning\n\nSchema-first APIs, plugins, and performance-focused handlers.\n`,
    },
    {
      path: "frameworks/fastify/anti-patterns.dna.md",
      content: `# Fastify — Anti-patterns\n\nDo not bypass schema validation on public routes.\n`,
    },
  ]),
  pack("frameworks/nestjs", "NestJS", "frameworks", "NestJS modular backend patterns", [
    {
      path: "frameworks/nestjs/positioning.dna.md",
      content: `# NestJS — Positioning\n\nModules, providers, guards, interceptors, and DTO validation.\n`,
    },
    {
      path: "frameworks/nestjs/testing.dna.md",
      content: `# NestJS — Testing\n\nUse TestingModule for unit and e2e tests.\n`,
    },
  ]),
  pack("disciplines/security", "Security", "disciplines", "Security discipline baseline", [
    {
      path: "disciplines/security/positioning.dna.md",
      content: `# Security — Discipline\n\nFollow security Behaviour. Never commit secrets.\n`,
    },
    {
      path: "disciplines/security/gdpr.dna.md",
      content: `# Security — GDPR\n\nData minimisation, lawful basis, and breach notification.\n`,
    },
  ]),
  pack("compliance/gdpr", "GDPR Compliance", "compliance", "GDPR compliance knowledge pack", [
    {
      path: "compliance/gdpr/overview.dna.md",
      content: `# GDPR — Overview\n\nEU data protection requirements for software systems.\n`,
    },
    {
      path: "compliance/gdpr/engineering-checklist.dna.md",
      content: `# GDPR — Engineering Checklist\n\n- Data inventory\n- Consent flows\n- Right to erasure\n- DPIA for high-risk processing\n`,
    },
  ]),
  pack("compliance/soc2", "SOC 2", "compliance", "SOC 2 Type II engineering controls", [
    {
      path: "compliance/soc2/overview.dna.md",
      content: `# SOC 2 — Overview\n\nTrust service criteria: security, availability, confidentiality.\n`,
    },
  ]),
  pack("platforms/b2b-saas", "B2B SaaS", "platforms", "Multi-tenant B2B SaaS platform patterns", [
    {
      path: "platforms/b2b-saas/positioning.dna.md",
      content: `# B2B SaaS — Platform\n\nMulti-tenant, RBAC, audit logs, and API-first design.\n`,
    },
    {
      path: "platforms/b2b-saas/multi-tenancy.dna.md",
      content: `# B2B SaaS — Multi-tenancy\n\nTenant isolation at database and application layers.\n`,
    },
  ]),
  pack(
    "security/rbac-zero-trust",
    "RBAC & Zero Trust",
    "disciplines",
    "Role-based access control with zero trust — permission matrix, surface hiding, verification",
    [
      {
        path: "security/rbac-fundamentals.dna.md",
        content: `# RBAC Fundamentals

## Core concepts

- **Role:** named set of permissions (manager, hr, operations, admin)
- **Permission:** ability to perform an action on a resource
- **Resource:** route, API endpoint, menu item, notification type, button, data record
- **Default deny:** no access unless explicitly granted by an admin

## Permission matrix

Source of truth: feature/surface × role grid in \`.DNA/CellularMemory/prefrontalCortex/rbac-permission-matrix.md\`

Every layer must read from the same matrix:
1. API middleware
2. Server actions / route handlers
3. Frontend route guards
4. Menu and sidebar rendering
5. Notification feeds
6. Action buttons and widgets

## Role management

Document where admins:
- Invite users
- Assign roles
- Revoke access

No employee should access the platform until an admin grants a role.
`,
      },
      {
        path: "security/zero-trust.dna.md",
        content: `# Zero Trust for Application RBAC

## Principles

1. **Never trust the client** — UI hiding is UX, not security
2. **Verify every request** — API and server actions check role server-side
3. **Least privilege** — grant minimum permissions per role
4. **Assume breach** — log denied access; no sensitive data in error messages

## Enforcement layers

| Layer | Requirement |
|-------|-------------|
| API | Middleware returns 403 when role lacks permission |
| Server actions | Check role before mutation |
| Route guard | Block navigation to forbidden paths |
| UI | Hide menus, notifications, buttons user cannot use |

## Failure mode

Adding auth to one endpoint while leaving menus visible is **not** zero trust and **not** complete RBAC.
`,
      },
      {
        path: "security/ui-surface-checklist.dna.md",
        content: `# UI Surface Checklist — RBAC

Audit every surface. Users must not SEE what they cannot USE.

## Menus & navigation
- [ ] Sidebar items filtered by role
- [ ] Top nav links filtered by role
- [ ] Mobile menu filtered by role
- [ ] Breadcrumbs do not expose forbidden parent routes

## Notifications
- [ ] Notification bell hidden or empty for unauthorized roles
- [ ] Toast/action notifications filtered server-side
- [ ] Real-time feeds (WebSocket/SSE) respect permissions

## Routes & pages
- [ ] Direct URL access blocked
- [ ] Refresh does not flash forbidden content
- [ ] Deep links to sub-routes guarded

## Actions & widgets
- [ ] Buttons (export, shutdown, settings, delete) hidden per role
- [ ] Dashboard widgets filtered by permission
- [ ] Context menus filtered by role

## Verification
Test with fresh session per role. Refresh after login. Try direct URLs.
`,
      },
    ],
  ),
];

export function getBundledCatalog(channel: "stable" | "beta" | "nightly" = "stable"): MarketplaceCatalog {
  return {
    version: "1.0.0",
    channel,
    updatedAt: new Date().toISOString(),
    source: "bundled",
    marketplaceUrl: "https://dna.humaan.app/marketplace",
    packs: PACKS.filter((p) => p.channel === channel || channel === "stable"),
  };
}

export function getBundledPack(packId: string): KnowledgePack | undefined {
  return getBundledCatalog().packs.find((p) => p.id === packId);
}
