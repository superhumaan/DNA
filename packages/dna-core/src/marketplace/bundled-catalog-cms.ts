import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

function cmsPack(
  id: string,
  name: string,
  description: string,
  positioning: string,
  headless: string,
  maturity?: import("./catalog-maturity.js").PackMaturity,
): KnowledgePack {
  return catalogPack(
    `cms/${id}`,
    name,
    "platforms",
    description,
    [
      { path: `cms/${id}/positioning.dna.md`, content: positioning },
      { path: `cms/${id}/headless.dna.md`, content: headless },
      {
        path: `cms/${id}/architecture.dna.md`,
        content: `# ${name} — Architecture\n\n${positioning}\n\n## Content flow\n- Editorial → API → frontend build or ISR\n- Webhooks trigger cache invalidation\n`,
      },
      {
        path: `cms/${id}/checklist.dna.md`,
        content: `# ${name} — Checklist\n\n- [ ] Preview/draft mode configured\n- [ ] Webhook secrets rotated\n- [ ] Image CDN transforms enabled\n- [ ] Multi-locale strategy documented\n`,
      },
    ],
    ["cms", id],
    maturity,
  );
}

export const CMS_PACKS: KnowledgePack[] = [
  cmsPack(
    "sanity",
    "Sanity",
    "Structured content platform — real-time studio, GROQ, portable text",
    `# Sanity — Positioning

**Preferred** for composable content + developer experience. React-based Studio, schema-as-code, CDN-backed API.

## When to pick Sanity
- Marketing + product content with rich structured types
- Multi-locale, preview, and editorial workflows
- Next.js / Remix / Astro frontends

## Avoid mixing
- Do not run Sanity Studio inside a separate WordPress install for the same content domain
`,
    `# Sanity — Headless Pattern

- Schema in \`sanity/schemaTypes/\`
- GROQ queries in \`sanity/lib/queries.ts\`
- Preview: draft mode + \`SANITY_API_READ_TOKEN\` server-only
- Webhooks → ISR revalidation on publish
- Images: \`@sanity/image-url\` builder — never hotlink raw CDN without transforms
`,
  ),
  cmsPack(
    "strapi",
    "Strapi",
    "Open-source headless CMS — REST/GraphQL, self-hosted or cloud",
    `# Strapi — Positioning

Self-hosted Node CMS with admin UI and plugin ecosystem. Good when team wants SQL-backed CMS on own infra.

## When to pick Strapi
- EU data residency with self-host
- REST/GraphQL out of the box
- Custom content-types without SaaS vendor lock-in

## Watch-outs
- Upgrade path across major versions — pin and test
- Media library size — use S3 provider in production
`,
    `# Strapi — Headless Pattern

- Content API: \`/api/{collection}\` with API tokens scoped per role
- Public routes: never expose draft; use \`publicationState=live\`
- Webhooks on \`entry.publish\` → frontend rebuild or tag revalidation
- Admin on separate subdomain; WAF + IP allowlist for internal teams
`,
  ),
  cmsPack(
    "contentful",
    "Contentful",
    "Enterprise SaaS headless CMS — multi-space, workflows, CDN",
    `# Contentful — Positioning

Managed headless CMS for global teams. Strong roles, locales, and app framework integrations.

## When to pick Contentful
- Enterprise procurement prefers SaaS SLA
- Many locales and approval workflows
- Composable architecture with multiple consuming apps
`,
    `# Contentful — Headless Pattern

- Delivery API for prod; Preview API behind auth for draft
- Content model in Impressions — field IDs are contract with frontend
- GraphQL or REST — pick one client pattern per app
- Webhooks + \`next/cache\` tags or static rebuild pipeline
`,
  ),
  cmsPack(
    "payload",
    "Payload CMS",
    "Code-first CMS on Next.js — TypeScript schemas, self-hosted",
    `# Payload CMS — Positioning

**Hot choice** for Next.js teams: CMS lives in your repo, TypeScript config, admin UI included.

## When to pick Payload
- Next.js full-stack and want CMS in monorepo
- Need custom fields, access control in code
- Prefer Postgres over proprietary cloud

Pair with \`next-fullstack\` or dedicated Payload template archetype.
`,
    `# Payload — Headless Pattern

- Collections/globals in \`payload.config.ts\`
- Local API in route handlers; REST/GraphQL for external consumers
- Migrations with Payload DB adapter
- Do not expose \`PAYLOAD_SECRET\` — rotate on leak
`,
  ),
  cmsPack(
    "directus",
    "Directus",
    "Data platform — SQL database to headless API + admin instantly",
    `# Directus — Positioning

Wraps existing Postgres/MySQL/SQLite as CMS. Great when DB already exists or team is SQL-first.

## When to pick Directus
- Operational data doubles as content
- Need granular row-level permissions
- Self-host on Docker/K8s
`,
    `# Directus — Headless Pattern

- Static token for server; user OAuth for studio
- Flows for automation (webhooks, transforms)
- Snapshot schema to git when possible
- Rate limit public endpoints
`,
  ),
  cmsPack(
    "drupal",
    "Drupal",
    "Enterprise PHP CMS — decoupled/headless with JSON:API",
    `# Drupal — Positioning

Mature enterprise CMS. Use **decoupled** mode with JSON:API or GraphQL — not Drupal theme + React SPA in same PHP theme layer.

## When to pick Drupal
- Public sector RFPs, complex workflows, accessibility mandates
- Large editorial teams with granular permissions
`,
    `# Drupal — Headless Pattern

- JSON:API modules; cache tags for invalidation
- Separate Next/Astro frontend repo or monorepo package
- Security updates on cadence — Drupal SA critical within 48h
`,
  ),
  cmsPack(
    "storyblok",
    "Storyblok",
    "Visual editor + headless — component-based content for marketers",
    `# Storyblok — Positioning

Component (blok) model maps cleanly to React/Vue components. Visual editor for marketers.

## When to pick Storyblok
- Marketing wants in-context editing
- Component library already exists in design system
`,
    `# Storyblok — Headless Pattern

- \`storyblok-js-client\` with bridge for preview
- Map blok types 1:1 to React components — no orphan bloks
- CDN + \`cv\` cache version for cache bust on publish
`,
  ),
  cmsPack(
    "hygraph",
    "Hygraph",
    "GraphQL-native federated content (formerly GraphCMS)",
    `# Hygraph — Positioning

GraphQL-first SaaS CMS. Strong for content federation across products.

## When to pick Hygraph
- GraphQL is org standard
- Federated content from multiple Hygraph projects
`,
    `# Hygraph — Headless Pattern

- Generated GraphQL types (\`graphql-codegen\`)
- Stage: DRAFT vs PUBLISHED in queries
- Webhooks → revalidation; respect rate limits on Management API
`,
  ),
  cmsPack(
    "keystone",
    "KeystoneJS",
    "Node.js CMS with Prisma — schema lists, GraphQL API",
    `# Keystone — Positioning

Lightweight code-first CMS on Prisma. Good for internal tools + marketing hybrid.

## When to pick Keystone
- Team already on Prisma
- Admin UI sufficient without custom studio build
`,
    `# Keystone — Headless Pattern

- Lists in \`keystone.ts\`; access control in list config
- GraphQL playground disabled in production
- Session + role hooks for admin routes
`,
  ),
  cmsPack(
    "webflow",
    "Webflow",
    "Visual site builder — export or headless via API/DevLink",
    `# Webflow — Positioning

Design-led marketing sites. Integrate via **DevLink** (React components) or embed — avoid duplicating entire site in code.

## When to pick Webflow
- Design team owns marketing pages
- Engineering owns app subdomain only
`,
    `# Webflow — Integration Pattern

- DevLink for React/Next component sync
- Or Webflow Cloud + reverse proxy for \`www\`
- Forms → Zapier/Make or custom webhook with validation
- Do not store PII in Webflow form exports without DPA
`,
  ),
  catalogPack(
    "cms/wordpress",
    "WordPress",
    "platforms",
    "WordPress headless or classic — supported but prefer modern CMS when greenfield",
    [
      {
        path: "cms/wordpress/positioning.dna.md",
        content: `# WordPress — Positioning

**Legacy support** — WordPress is widely deployed but has higher security and plugin debt than modern headless CMS options.

## DNA guidance
- **Greenfield:** prefer \`cms/sanity\`, \`cms/payload\`, \`cms/strapi\`, or \`cms/contentful\`
- **Brownfield:** headless via WPGraphQL/REST + separate frontend (\`wordpress-headless\` archetype)
- **Never:** new WooCommerce + custom React in same PHP theme without clear boundaries

See also \`platforms/wordpress-headless\` for engineering patterns.
`,
      },
      {
        path: "cms/wordpress/security.dna.md",
        content: `# WordPress — Security (mandatory)

- Auto-updates for core; staged plugin updates
- Disable file editor, XML-RPC if unused
- Least-privilege DB user; no \`wp_\` table prefix security theater only
- WAF + rate limit \`wp-login.php\`
- No nulled plugins; composer for premium when possible
`,
      },
      {
        path: "cms/wordpress/headless.dna.md",
        content: `# WordPress — Headless

Same patterns as \`platforms/wordpress-headless\` — WPGraphQL or REST, Next/Astro frontend, preview tokens, HMAC webhooks.

Migrate path: static marketing on Sanity/Payload while keeping WP for blog until content migration completes.
`,
      },
    ],
    ["cms", "wordpress", "legacy"],
  ),
  catalogPack(
    "cms/ghost",
    "Ghost (CMS)",
    "platforms",
    "Ghost publishing platform — newsletters, memberships, Handlebars themes",
    [
      {
        path: "cms/ghost/positioning.dna.md",
        content: `# Ghost — Positioning

Publishing-first CMS (blog + newsletter + memberships). Use \`ghost-cms\` archetype for theme development.

Not a general app backend — pair with separate API for product features.
`,
      },
      {
        path: "cms/ghost/headless.dna.md",
        content: `# Ghost — Headless

Content API + Admin API keys in env. Frontend can be Next/Astro consuming Ghost Content API while Ghost hosts editorial.

Memberships and Stripe stay on Ghost unless explicitly migrated.
`,
      },
    ],
    ["cms", "ghost"],
  ),
];
