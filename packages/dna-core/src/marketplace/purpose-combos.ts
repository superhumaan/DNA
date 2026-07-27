/**
 * Purpose Combos — one purpose per bundle.
 * Installing a combo (or any pack that is a combo id) installs required packs
 * always, plus preferred packs by default.
 *
 * Precedent: healthcare-country-bundles.ts
 * Plan: docs/engineering/knowledge-pack-zero-stubs-plan.md (approved 2026-07-24)
 */

export type PurposeCombo = {
  id: string;
  purpose: string;
  description: string;
  /** Always installed with the combo. */
  required: readonly string[];
  /** Installed by default with the combo (can be opted out later). */
  preferred: readonly string[];
  /** Suggested only — not auto-installed unless includeRecommended. */
  recommended: readonly string[];
};

export const PURPOSE_COMBOS: readonly PurposeCombo[] = [
  {
    id: "combo/product-canvas-creation",
    purpose: "Product canvas creation",
    description: "Grounded product canvas from real architecture — not stub Impressions.",
    required: [
      "discovery/overview",
      "discovery/opportunity-solution-tree",
      "discovery/processes/value-proposition-canvas",
      "discovery/ux-research-foundations",
      "platforms/dna-stack",
    ],
    preferred: [
      "discovery/continuous-discovery",
      "discovery/lifecycle/ideation",
      "methodologies/document-writing",
      "industries/saas-b2b",
    ],
    recommended: [
      "discovery/methods/user-interviews",
      "discovery/handoff-to-delivery",
      "languages/stem-bridge",
    ],
  },
  {
    id: "combo/product-diagnosis-upgrade",
    purpose: "Product diagnosis → competitor → upgrade leverage",
    description:
      "Strategy ladder grounded with DNA CLI + CellularMemory + Impression Guard.",
    required: [
      "discovery/overview",
      "discovery/product-market-fit",
      "discovery/lifecycle/problem-validation",
      "discovery/lifecycle/solution-validation",
      "platforms/dna-stack",
    ],
    preferred: [
      "discovery/opportunity-solution-tree",
      "industries/saas-b2b",
      "disciplines/platform-engineering",
      "methodologies/shape-up",
    ],
    recommended: [
      "discovery/lifecycle/pmf",
      "discovery/lifecycle/growth",
      "discovery/handoff-to-delivery",
    ],
  },
  {
    id: "combo/pmf-check",
    purpose: "Product-market fit check",
    description: "Validate PMF with research methods and lifecycle gates.",
    required: [
      "discovery/product-market-fit",
      "discovery/lifecycle/pmf",
      "discovery/research-types/behavioral",
      "discovery/research-types/attitudinal",
    ],
    preferred: [
      "discovery/methods/surveys",
      "discovery/methods/user-interviews",
      "discovery/continuous-discovery",
    ],
    recommended: ["discovery/lifecycle/growth", "industries/saas-b2b"],
  },
  {
    id: "combo/discovery-to-delivery",
    purpose: "Discovery → engineering handoff",
    description: "Research synthesis into tickets/specs for the Feature Factory.",
    required: [
      "discovery/handoff-to-delivery",
      "discovery/continuous-discovery",
      "methodologies/ticket-writing",
      "methodologies/document-writing",
      "methodologies/dna-default",
    ],
    preferred: [
      "discovery/opportunity-solution-tree",
      "methodologies/shape-up",
      "discovery/teams/dual-track-squad",
    ],
    recommended: [
      "discovery/events/story-mapping",
      "discovery/lifecycle/solution-validation",
    ],
  },
  {
    id: "combo/shape-up-cycle",
    purpose: "Shape Up betting cycle",
    description: "Appetite, pitch, and delivery alignment for a six-week cycle.",
    required: [
      "methodologies/shape-up",
      "methodologies/ticket-writing",
      "methodologies/document-writing",
      "discovery/handoff-to-delivery",
    ],
    preferred: ["methodologies/dna-default", "discovery/opportunity-solution-tree"],
    recommended: ["discovery/teams/discovery-squad", "industries/saas-b2b"],
  },
  {
    id: "combo/nextjs-fullstack",
    purpose: "Next.js fullstack app stack",
    description: "Next.js + React + auth + DB + UI + observability patterns.",
    required: [
      "frameworks/nextjs",
      "frameworks/react",
      "frameworks/vite",
      "databases/postgresql",
      "auth/clerk",
    ],
    preferred: [
      "databases/neon",
      "auth/webauthn-passkeys",
      "observability/sentry",
      "tools/tailwind-css",
      "tools/shadcn-ui",
    ],
    recommended: ["ai/vercel-ai-sdk", "payments/stripe", "cloud/railway"],
  },
  {
    id: "combo/saas-billing",
    purpose: "SaaS billing & subscriptions",
    description: "Subscriptions, tax, metered billing, Connect, customer portal.",
    required: ["payments/overview", "payments/stripe", "payments/stripe-connect", "auth/clerk"],
    preferred: [
      "payments/anrok",
      "payments/avalara",
      "payments/chargebee",
      "databases/postgresql",
    ],
    recommended: ["payments/paddle", "payments/lemon-squeezy", "industries/saas-b2b"],
  },
  {
    id: "combo/auth-rbac",
    purpose: "Auth + RBAC zero-trust",
    description: "Identity, org tenancy, passkeys, admin guards.",
    required: [
      "auth/clerk",
      "auth/saml-oidc",
      "auth/webauthn-passkeys",
      "security/rbac-zero-trust",
    ],
    preferred: ["auth/workos", "auth/scim", "auth/okta"],
    recommended: ["auth/stytch", "auth/magic-link", "disciplines/security"],
  },
  {
    id: "combo/gdpr-eu-ready",
    purpose: "GDPR / EU compliance readiness",
    description: "Privacy engineering + EU legal overlay.",
    required: [
      "compliance/gdpr",
      "compliance/tiered-standards",
      "legal/tiered-standards",
      "legal/regions/eu-gdpr",
    ],
    preferred: ["compliance/eu-ai-act", "legal/regions/uk-gdpr", "disciplines/security"],
    recommended: ["compliance/wcag-22", "compliance/data-residency-eu"],
  },
  {
    id: "combo/healthcare-us",
    purpose: "US healthcare interoperability",
    description: "FHIR + US EHR bridges + PHI engineering.",
    required: [
      "healthcare/overview",
      "healthcare/overview-us",
      "healthcare/us-support",
      "healthcare/fhir-r4",
      "healthcare/phi-engineering",
      "healthcare/smart-on-fhir",
    ],
    preferred: [
      "healthcare/epic",
      "healthcare/redox",
      "healthcare/telehealth",
      "healthcare/patient-portal",
    ],
    recommended: [
      "healthcare/cms-interop",
      "healthcare/tefca-qhin",
      "compliance/hipaa-depth",
    ],
  },
  {
    id: "combo/ai-rag-product",
    purpose: "AI RAG product surface",
    description: "LLM + RAG + evals + guardrails for a grounded AI feature.",
    required: [
      "ai/openai",
      "ai/rag-patterns",
      "ai/ai-evals",
      "ai/guardrails",
      "databases/pgvector",
    ],
    preferred: ["ai/anthropic", "ai/vercel-ai-sdk", "ai/langsmith", "ai/braintrust"],
    recommended: ["ai/ollama", "ai/llamaindex", "observability/sentry"],
  },
  {
    id: "combo/observability-sre",
    purpose: "Observability & SRE baseline",
    description: "Errors, metrics, alerts, and SLOs for production readiness.",
    required: [
      "observability/sentry",
      "observability/datadog",
      "observability/opentelemetry",
      "disciplines/sli-slo",
    ],
    preferred: [
      "observability/grafana-stack",
      "observability/prometheus",
      "observability/pagerduty",
    ],
    recommended: ["testing/chaos-engineering", "cloud/kubernetes"],
  },
  {
    id: "combo/cloud-aws",
    purpose: "Cloud deploy on AWS",
    description: "Core AWS compute, data, edge, and IaC.",
    required: [
      "cloud/aws-overview",
      "cloud/aws-ecs",
      "cloud/aws-lambda",
      "cloud/aws-rds",
      "cloud/aws-s3",
      "cloud/terraform",
    ],
    preferred: [
      "cloud/aws-cloudfront",
      "cloud/aws-cognito",
      "databases/postgresql",
      "observability/datadog",
    ],
    recommended: ["disciplines/security"],
  },
  {
    id: "combo/ecommerce-storefront",
    purpose: "Ecommerce storefront",
    description: "Storefront + payments + catalog patterns.",
    required: [
      "ecommerce/shopify",
      "payments/stripe",
      "industries/ecommerce-retail",
      "frameworks/nextjs",
      "frameworks/react",
    ],
    preferred: ["ecommerce/medusa", "payments/apple-google-pay", "auth/clerk"],
    recommended: ["observability/sentry"],
  },
  {
    id: "combo/cms-marketing-site",
    purpose: "CMS-driven marketing site",
    description: "Headless CMS + Next + preview/publish flows.",
    required: ["cms/sanity", "frameworks/nextjs", "frameworks/react", "tools/tailwind-css"],
    preferred: ["cms/contentful", "platforms/marketing-website"],
    recommended: ["cloud/cloudflare-overview"],
  },
  {
    id: "combo/fintech-open-banking",
    purpose: "Fintech / open banking",
    description: "Payments rails, identity, ledger-aware SaaS.",
    required: [
      "industries/fintech",
      "payments/plaid",
      "payments/open-banking",
      "payments/stripe",
      "auth/clerk",
    ],
    preferred: ["fintech/stripe-treasury", "compliance/soc2", "databases/postgresql"],
    recommended: ["disciplines/security"],
  },
  {
    id: "combo/accessibility-ux",
    purpose: "Accessibility & inclusive UX",
    description: "WCAG engineering + design-system a11y.",
    required: [
      "compliance/wcag-22",
      "disciplines/accessibility",
      "disciplines/design-systems",
      "frameworks/react",
    ],
    preferred: ["gov/section-508", "tools/shadcn-ui"],
    recommended: [],
  },
  {
    id: "combo/monorepo-platform",
    purpose: "Monorepo platform engineering",
    description: "Monorepo DX, CI, and golden paths.",
    required: [
      "disciplines/monorepo",
      "disciplines/platform-engineering",
      "disciplines/continuous-delivery",
      "methodologies/dna-default",
      "platforms/dna-stack",
    ],
    preferred: ["devtools/pnpm", "cloud/github-actions", "finops"],
    recommended: [],
  },
  {
    id: "combo/startup-saas",
    purpose: "Startup B2B SaaS delivery",
    description: "Startup size + B2B SaaS industry overlay + DNA Feature Factory.",
    required: [
      "companies/startup",
      "methodologies/industry-saas-b2b",
      "methodologies/dna-default",
      "industries/saas-b2b",
    ],
    preferred: ["methodologies/shape-up", "methodologies/lean-startup"],
    recommended: ["auth/clerk", "payments/stripe"],
  },
  {
    id: "combo/enterprise-healthcare",
    purpose: "Enterprise healthcare delivery",
    description: "Enterprise size + healthcare industry overlay + compliance gates.",
    required: [
      "companies/enterprise",
      "methodologies/industry-healthcare",
      "methodologies/safe",
      "healthcare/fhir-r4",
      "compliance/hipaa-depth",
    ],
    preferred: ["methodologies/document-writing", "healthcare/phi-engineering"],
    recommended: ["healthcare/smart-on-fhir", "healthcare/overview-us"],
  },
  {
    id: "combo/agency-fintech",
    purpose: "Agency fintech engagement",
    description: "Agency delivery with fintech industry overlay.",
    required: [
      "companies/agency",
      "methodologies/industry-fintech",
      "methodologies/kanban",
      "industries/fintech",
    ],
    preferred: ["payments/stripe", "compliance/soc2"],
    recommended: ["payments/plaid", "payments/open-banking"],
  },
  {
    id: "combo/scrum-team",
    purpose: "Single-team Scrum delivery",
    description: "Scrum + DoD + user stories + estimation + ticket writing.",
    required: [
      "methodologies/scrum",
      "methodologies/definition-of-done",
      "methodologies/user-stories",
      "methodologies/ticket-writing",
    ],
    preferred: ["methodologies/estimation-planning-poker", "methodologies/document-writing"],
    recommended: ["methodologies/tdd", "methodologies/bdd"],
  },
  {
    id: "combo/less-org",
    purpose: "Multi-team LeSS organisation",
    description: "LeSS (+ Huge path) with Scrum of Scrums and strong DoD.",
    required: [
      "methodologies/less",
      "methodologies/scrum",
      "methodologies/definition-of-done",
      "methodologies/scrum-of-scrums",
    ],
    preferred: ["methodologies/less-huge", "methodologies/user-stories"],
    recommended: ["methodologies/nexus", "companies/scale-up"],
  },
  {
    id: "combo/safe-enterprise",
    purpose: "SAFe enterprise ART delivery",
    description: "SAFe + WSJF + Scrum team practices for ARTs.",
    required: [
      "methodologies/safe",
      "methodologies/wsjf",
      "methodologies/scrum",
      "companies/enterprise",
    ],
    preferred: ["methodologies/definition-of-done", "methodologies/document-writing"],
    recommended: ["methodologies/okr-delivery"],
  },
  {
    id: "combo/agency-delivery",
    purpose: "Software agency delivery system",
    description: "Agency archetype + Kanban + ticket/doc writing.",
    required: [
      "companies/agency",
      "methodologies/kanban",
      "methodologies/ticket-writing",
      "methodologies/document-writing",
    ],
    preferred: ["methodologies/dna-default", "companies/consultancy"],
    recommended: ["methodologies/scrum"],
  },
  {
    id: "combo/sme-scrum",
    purpose: "SME Scrum product team",
    description: "SME size + Scrum family for growing product orgs.",
    required: [
      "companies/sme",
      "methodologies/scrum",
      "methodologies/definition-of-done",
      "methodologies/user-stories",
    ],
    preferred: ["methodologies/estimation-planning-poker", "industries/saas-b2b"],
    recommended: ["methodologies/dual-track-agile"],
  },
  {
    id: "combo/enterprise-devtools",
    purpose: "Enterprise developer-tools product",
    description: "Enterprise size + DevTools vertical + Scrum/DoD.",
    required: [
      "companies/enterprise",
      "industries/developer-tools",
      "methodologies/industry-developer-tools",
      "methodologies/scrum",
    ],
    preferred: ["disciplines/platform-engineering", "methodologies/definition-of-done"],
    recommended: ["methodologies/continuous-delivery"],
  },
] as const;

export type ResolvePurposeComboOptions = {
  /** When true, also install recommended packs. Default false. */
  includeRecommended?: boolean;
  /** When false, skip preferred packs. Default true. */
  includePreferred?: boolean;
};

export function getPurposeCombo(id: string): PurposeCombo | undefined {
  return PURPOSE_COMBOS.find((c) => c.id === id);
}

/**
 * Resolve pack ids to install for a purpose combo.
 * Returns null if `packId` is not a known combo id.
 */
export function resolvePurposeComboPackIds(
  packId: string,
  options: ResolvePurposeComboOptions = {},
): string[] | null {
  const combo = getPurposeCombo(packId);
  if (!combo) return null;

  const includePreferred = options.includePreferred !== false;
  const includeRecommended = options.includeRecommended === true;

  const ids = [
    ...combo.required,
    ...(includePreferred ? combo.preferred : []),
    ...(includeRecommended ? combo.recommended : []),
  ];

  return [...new Set(ids)];
}

/** Flat list of all pack ids referenced by any combo (for catalog validation). */
export function allPurposeComboMemberPackIds(): string[] {
  const ids = new Set<string>();
  for (const c of PURPOSE_COMBOS) {
    ids.add(c.id);
    for (const id of c.required) ids.add(id);
    for (const id of c.preferred) ids.add(id);
    for (const id of c.recommended) ids.add(id);
  }
  return [...ids];
}
