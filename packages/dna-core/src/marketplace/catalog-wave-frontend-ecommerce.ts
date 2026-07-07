import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const F = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["frameworks"]);

export const FRONTEND_TOOL_PACK_DEFS = [
  F("tools/tailwind-css", "Tailwind CSS", "Utility-first CSS", "DNA default styling.", "Design tokens in tailwind.config. @apply sparingly."),
  F("tools/shadcn-ui", "shadcn/ui + Radix", "Accessible component primitives", "Copy-paste components.", "cn() helper. Theme via CSS variables."),
  F("tools/mui", "Material UI", "React component library", "Enterprise Material Design.", "Theming. Data grid license."),
  F("tools/tanstack-query", "TanStack Query", "Server state for React", "API data caching.", "Query keys structured. Invalidation on mutations."),
  F("tools/tanstack-router", "TanStack Router", "Type-safe routing", "SPA routing alternative.", "Search params validation."),
  F("tools/cypress", "Cypress", "E2E testing", "Browser E2E.", "Component testing optional. CI parallelization."),
  F("tools/playwright", "Playwright", "Cross-browser E2E", "Preferred E2E for DNA.", "Page object pattern. Trace on failure."),
  F("tools/webpack", "Webpack", "Module bundler", "Legacy and Next internals.", "Prefer Vite for greenfield SPAs."),
  F("tools/rspack", "Rspack", "Fast Rust bundler", "Webpack-compatible faster builds.", "Migration from webpack config."),
  F("tools/nx", "Nx", "Monorepo build system", "Enterprise monorepos.", "Affected commands in CI. Module boundaries."),
  F("tools/storybook", "Storybook", "Component documentation", "Design system dev.", "Chromatic visual tests optional."),
  F("tools/htmx", "HTMX", "HTML-over-the-wire", "Hypermedia-driven UIs.", "Server returns partials. CSP considerations."),
  F("tools/xstate", "XState", "State machines", "Complex UI flows.", "Visualizer. Typegen."),
  F("frameworks/aspnet-core", "ASP.NET Core", ".NET web APIs and Blazor", "Microsoft enterprise stack.", "Minimal APIs. EF Core. Identity."),
  F("frameworks/phoenix", "Phoenix (Elixir)", "Realtime web framework", "Channels, LiveView.", "OTP supervision. Ecto for DB."),
  F("frameworks/gin", "Gin (Go)", "Go HTTP framework", "Fast Go APIs.", "Middleware chain. Context timeouts."),
  F("frameworks/fiber", "Fiber (Go)", "Express-like Go framework", "Rapid Go HTTP.", "Prefork for production."),
  F("frameworks/temporal", "Temporal", "Durable workflow engine", "Long-running business processes.", "Workflows as code. Activity retries."),
  F("frameworks/inngest", "Inngest", "Serverless workflows", "Event-driven durable functions.", "Step functions. Cron on serverless."),
  F("frameworks/bullmq", "BullMQ", "Redis job queues", "Background jobs Node.", "Workers separate from API. Job idempotency."),
  F("frameworks/grpc", "gRPC", "High-performance RPC", "Microservices internal APIs.", "Protobuf contracts. mTLS between services."),
  F("frameworks/celery", "Celery", "Python distributed tasks", "Django/FastAPI workers.", "Broker Redis/RabbitMQ. Result backend."),
];

export const FRONTEND_TOOL_PACKS = packsFromDefs(FRONTEND_TOOL_PACK_DEFS);

const E = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["ecommerce"]);

export const ECOMMERCE_CRM_PACK_DEFS = [
  E("ecommerce/shopify", "Shopify", "E-commerce platform and apps", "Online stores, Hydrogen headless.", "Storefront API GraphQL. App OAuth. Webhooks HMAC."),
  E("ecommerce/woocommerce", "WooCommerce", "WordPress e-commerce", "WP-based shops.", "REST API. Webhook plugins. Prefer headless patterns."),
  E("ecommerce/bigcommerce", "BigCommerce", "SaaS e-commerce", "Mid-market storefronts.", "Stencil or headless APIs."),
  E("ecommerce/medusa", "Medusa", "Open-source headless commerce", "Custom commerce stacks.", "Modules architecture. Admin + storefront."),
  E("ecommerce/saleor", "Saleor", "GraphQL headless commerce", "Python/GraphQL commerce.", "Channels per region. Webhooks."),
  E("ecommerce/commercetools", "commercetools", "Enterprise headless commerce", "Large catalog B2B/B2C.", "Composable Commerce API."),
  E("crm/salesforce", "Salesforce", "Enterprise CRM", "Sales cloud integrations.", "REST/Bulk API. Platform events."),
  E("crm/hubspot", "HubSpot", "CRM and marketing", "SMB sales/marketing hub.", "Private app tokens. CRM cards."),
  E("crm/pipedrive", "Pipedrive", "Sales CRM", "Pipeline-focused SMB.", "API v2. Webhooks on deal stage."),
  E("crm/netsuite", "NetSuite", "ERP/CRM suite", "Mid-market ERP.", "SuiteScript. Token-based auth."),
  E("crm/workday", "Workday", "HCM and finance", "Enterprise HR integrations.", "RaaS APIs. Integration partners often required."),
  E("crm/dynamics", "Microsoft Dynamics 365", "CRM/ERP Microsoft", "Microsoft stack enterprises.", "Dataverse API. Azure AD auth."),
  E("crm/airtable", "Airtable", "Spreadsheet-database hybrid", "Ops teams, lightweight CRM.", "Bases API. Rate limits."),
  E("crm/monday", "Monday.com", "Work OS", "Project + sales workflows.", "GraphQL API. Board automations."),
  E("crm/asana", "Asana", "Work management", "Task sync integrations.", "Pat API. Webhooks."),
  E("crm/servicenow", "ServiceNow", "ITSM platform", "Enterprise service desk.", "Table API. MID server on-prem."),
];

export const ECOMMERCE_CRM_PACKS = packsFromDefs(ECOMMERCE_CRM_PACK_DEFS);
