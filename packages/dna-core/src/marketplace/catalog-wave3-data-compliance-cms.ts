import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";
import { catalogPack } from "./bundled-catalog-helpers.js";
import type { KnowledgePack } from "@superhumaan/dna-config";

const D = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["databases"]);

export const WAVE3_DATA_PACK_DEFS = [
  D("databases/fivetran", "Fivetran", "Managed ELT connectors", "Warehouse ingestion without maintaining connectors.", "Connector per source. MAR billing awareness."),
  D("databases/prefect", "Prefect", "Modern workflow orchestration", "Python data pipelines.", "Flows as code. Work pools. Retry policies."),
  D("databases/dagster", "Dagster", "Data orchestrator with assets", "Data-aware pipeline DAGs.", "Software-defined assets. Lineage graph."),
  D("databases/lancedb", "LanceDB", "Embedded vector database", "Local/serverless vectors.", "Columnar Lance format. Hybrid search."),
  D("databases/amazon-neptune", "Amazon Neptune", "Managed graph database", "Graph on AWS without Neo4j ops.", "Gremlin or openCypher. IAM auth."),
  D("databases/supabase-platform", "Supabase Platform", "Postgres BaaS depth", "Auth + storage + realtime + edge.", "RLS per tenant. Branching preview DBs."),
  D("databases/mariadb", "MariaDB", "MySQL fork", "MySQL-compatible deployments.", "Galera cluster for HA. Feature differences vs MySQL documented."),
  D("databases/keydb", "KeyDB", "Multi-threaded Redis fork", "Redis-compatible higher throughput.", "Active-replica. License review for commercial."),
  D("databases/upstash", "Upstash", "Serverless Redis/Kafka", "Edge-friendly managed Redis.", "REST API option. Global replication tier."),
  D("databases/memcached", "Memcached", "Simple distributed cache", "Pure cache layer.", "No persistence. Consistent hashing clients."),
  D("databases/redshift", "Amazon Redshift", "AWS warehouse", "Analytics on AWS stack.", "Spectrum for S3. RA3 nodes. Concurrency scaling."),
  D("databases/singlestore", "SingleStore", "Distributed SQL + HTAP", "Real-time analytics on operational data.", "Rowstore + columnstore. Pipelines from Kafka."),
];

export const WAVE3_DATA_PACKS = packsFromDefs(WAVE3_DATA_PACK_DEFS);

const P = (id: string, name: string, desc: string, when: string, how: string) =>
  def(`payments/${id}`, name, desc, when, how, ["payments"]);

export const WAVE3_PAYMENTS_PACK_DEFS = [
  P("wise", "Wise Business", "International transfers and multi-currency", "Global payouts to contractors.", "API for quotes and transfers. Compliance per corridor."),
  P("revolut-business", "Revolut Business", "Business banking API", "EU/UK fintech banking.", "Open banking APIs. Webhook on transaction."),
  P("zuora", "Zuora", "Enterprise subscription billing", "Complex B2B billing.", "Zuora Billing + Revenue. SOAP/REST APIs."),
  P("afterpay", "Afterpay / Clearpay", "BNPL global", "Consumer installment at checkout.", "Regional merchant IDs. Refund flows."),
  P("marqeta", "Marqeta", "Card issuing platform", "Custom card programs.", "JIT funding. Webhook transaction events."),
  P("sift", "Sift", "Fraud detection", "Payment and account abuse.", "Device fingerprinting. Workflow automation. Score thresholds."),
  P("stripe-radar", "Stripe Radar", "Stripe fraud prevention", "Stripe-native fraud rules.", "Rules in Dashboard. Machine learning scores."),
  P("coinbase-commerce", "Coinbase Commerce", "Crypto payment acceptance", "Optional crypto checkout.", "Volatility disclosure. Regulatory review per region."),
  P("ledger-accounting", "SaaS Ledger Patterns", "Double-entry internal accounting", "Marketplace and wallet balances.", "Immutable journal. Idempotent posting. Reconciliation jobs."),
  P("onfido", "Onfido", "Identity verification KYC", "Fintech onboarding.", "Document + selfie check. Webhook results. GDPR retention."),
  P("jumio", "Jumio", "KYC/AML verification", "Regulated identity proofing.", "Workflow builder. AML watchlist screening."),
  P("mambu", "Mambu", "Cloud core banking", "Neobank lending/deposits.", "Mambu API composable banking. Multi-tenant cloud."),
];

export const WAVE3_PAYMENTS_PACKS = packsFromDefs(WAVE3_PAYMENTS_PACK_DEFS);

const V = (id: string, name: string, desc: string, when: string, how: string, tags: string[], category: "compliance" | "disciplines" = "compliance") =>
  def(`compliance/${id}`, name, desc, when, how, tags, category);

export const WAVE3_COMPLIANCE_PACK_DEFS = [
  V("pipeda", "PIPEDA", "Canadian privacy law", "Canadian users and data.", "Privacy commissioner requirements. Breach notification."),
  V("india-dpdp", "India DPDP Act", "Indian digital personal data protection", "India market entry.", "Consent manager. Data fiduciary obligations. Cross-border rules."),
  V("pdpa-thailand", "PDPA Thailand", "Thai personal data protection", "Thailand operations.", "DPO requirement. Consent records. Localization considerations."),
  V("cmmc", "CMMC", "Cybersecurity Maturity Model Certification", "US defense contractors.", "Level 2/3 controls. C3PAO assessment path."),
  V("tisax", "TISAX", "Automotive info security", "Automotive supply chain.", "Assessment levels. ENX registration."),
  V("data-residency-eu", "EU Data Residency", "GDPR data location patterns", "EU customer data sovereignty.", "Region pinning. SCCs for transfers. Schrems II mitigation."),
  V("data-residency-apac", "APAC Data Residency", "Asia-Pacific localization", "AU, SG, JP, IN data rules.", "Per-country matrix in Impressions. No blanket APAC region."),
  V("data-residency-us", "US Data Residency", "US state and sector residency", "FedRAMP, state privacy laws.", "State breach laws. Sector-specific (HIPAA, CJIS)."),
  V("wcag-22", "WCAG 2.2 AA", "Web accessibility standard depth", "Legal and ethical accessibility.", "Perceivable, operable, understandable, robust. VPAT output."),
  V("oscal", "OSCAL & NIST 800-53", "Security control automation", "US federal ATO packages.", "OSCAL catalogs. Control inheritance. SSP generation."),
  V("g-cloud-uk", "UK G-Cloud", "UK public sector procurement", "Selling to UK government.", "Service definitions on Digital Marketplace. Cyber Essentials+."),
  V("hipaa-depth", "HIPAA Depth", "HIPAA Security & Privacy Rule engineering", "Beyond overview — full safeguard mapping.", "Administrative, physical, technical safeguards. Risk analysis annually."),
];

export const WAVE3_COMPLIANCE_PACKS = packsFromDefs(WAVE3_COMPLIANCE_PACK_DEFS);

function cmsPack(id: string, name: string, desc: string, positioning: string, headless: string): KnowledgePack {
  return catalogPack(
    `cms/${id}`,
    name,
    "platforms",
    desc,
    [
      { path: `cms/${id}/positioning.dna.md`, content: positioning },
      { path: `cms/${id}/headless.dna.md`, content: headless },
    ],
    ["cms", id, "catalog"],
  );
}

export const WAVE3_CMS_PACKS: KnowledgePack[] = [
  cmsPack("datocms", "DatoCMS", "GraphQL headless CMS with visual editing", `# DatoCMS\n\nStructured content + image pipeline. Strong for marketing sites with editors.\n`, `# DatoCMS Headless\n\nGraphQL Content Delivery API. In-place editing. Webhooks for rebuild.\n`),
  cmsPack("builder-io", "Builder.io", "Visual headless CMS", `# Builder.io\n\nDrag-drop page building on any framework. A/B testing built-in.\n`, `# Builder Headless\n\nSDK register components. Content API fetch. Preview URLs.\n`),
  cmsPack("tina", "TinaCMS", "Git-backed CMS", `# TinaCMS\n\nContent in git with visual editing. Great for docs/marketing in monorepo.\n`, `# Tina Headless\n\ntina.io cloud or self-host. GraphQL layer over markdown/JSON.\n`),
];

const L = (id: string, name: string, desc: string, when: string, how: string) =>
  def(`languages/${id}`, name, desc, when, how, ["languages", id], "languages");

export const WAVE3_LANGUAGE_PACK_DEFS = [
  L("clojure", "Clojure", "Lisp on JVM — Datomic, Ring", "Data-oriented immutability. REPL-driven dev.", "deps.edn. spec at boundaries. Avoid mutable state."),
  L("zig", "Zig", "Systems language alternative to C", "Performance tooling, WASM, embed.", "comptime. Explicit allocators. No hidden control flow."),
  L("lua", "Lua", "Embedded scripting language", "Game engines, Redis scripting, Neovim.", "Sandbox scripts. Minimal stdlib exposure."),
  L("r", "R", "Statistical computing", "Data science, biostatistics, research.", "renv for reproducibility. Shiny for apps. PHI caution."),
  L("haskell", "Haskell", "Pure functional language", "High-assurance domains niche.", "GHC extensions documented. Strictness where needed."),
  L("ocaml", "OCaml", "Functional systems language", "Financial, compiler tooling.", "dune build. Jane Street patterns optional."),
  L("perl", "Perl", "Legacy scripting", "Brownfield automation only.", "Modernize to Python where possible. strict/warnings."),
  L("objective-c", "Objective-C", "Legacy Apple platforms", "Maintaining old iOS/macOS codebases.", "ARC. Bridge to Swift incrementally."),
];

export const WAVE3_LANGUAGE_PACKS = packsFromDefs(WAVE3_LANGUAGE_PACK_DEFS);

const DOC = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["documents"]);

export const WAVE3_DOCUMENTS_MAPS_PACK_DEFS = [
  DOC("documents/puppeteer-pdf", "PDF Generation", "HTML to PDF pipelines", "Invoices, reports, certificates.", "Puppeteer/Playwright print. PrinceXML for complex layouts."),
  DOC("documents/azure-doc-intelligence", "Azure Document Intelligence", "OCR and form extraction", "Document AI on Azure.", "Prebuilt models. Custom training. PHI BAA tier."),
  DOC("documents/tesseract-ocr", "Tesseract OCR", "Open-source OCR", "Self-hosted text extraction.", "Language packs. Preprocess images for accuracy."),
  DOC("documents/glean", "Glean", "Enterprise workplace search", "Internal knowledge discovery.", "Connectors per SaaS. Permission-aware indexing."),
  DOC("maps/openstreetmap", "OpenStreetMap", "Open map data", "Self-hosted maps without Google fees.", "Nominatim geocoding. Tile server ops. Attribution required."),
  DOC("maps/here-maps", "HERE Maps", "Enterprise mapping platform", "Logistics, automotive.", "Fleet Tracking API. Isochrone routing."),
  DOC("edtech/google-classroom", "Google Classroom", "Google education LMS", "K12 assignments and rosters.", "Classroom API OAuth. Domain-wide delegation for schools."),
  DOC("edtech/proctoring", "Online Proctoring", "Academic integrity remote exams", "High-stakes assessments.", "Privacy review. FERPA. Human review fallback."),
  DOC("fintech/thought-machine", "Thought Machine Vault", "Cloud-native core banking", "Tier-1 bank modernization.", "Smart contracts for products. Event streaming API."),
  DOC("fintech/stripe-treasury", "Stripe Treasury", "Embedded banking", "Platform-held balances.", "Financial account hooks. Regulatory partner dependency."),
];

export const WAVE3_DOCUMENTS_MAPS_PACKS = packsFromDefs(WAVE3_DOCUMENTS_MAPS_PACK_DEFS);

export const WAVE3_DATA_COMPLIANCE_CMS_PACKS = [
  ...WAVE3_DATA_PACKS,
  ...WAVE3_PAYMENTS_PACKS,
  ...WAVE3_COMPLIANCE_PACKS,
  ...WAVE3_CMS_PACKS,
  ...WAVE3_LANGUAGE_PACKS,
  ...WAVE3_DOCUMENTS_MAPS_PACKS,
];
