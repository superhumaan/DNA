import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const P = (id: string, name: string, desc: string, when: string, how: string) =>
  def(`payments/${id}`, name, desc, when, how, ["payments"]);

const L = (id: string, name: string, desc: string, when: string, how: string) =>
  def(`languages/${id}`, name, desc, when, how, ["languages", id], "languages");

const D = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["disciplines"], "disciplines");

const F = (id: string, name: string, desc: string, when: string, how: string) =>
  def(`frameworks/${id}`, name, desc, when, how, ["frameworks"]);

const PL = (id: string, name: string, desc: string, when: string, how: string) =>
  def(`platforms/${id}`, name, desc, when, how, ["platforms"]);

export const WAVE5_FINAL_PACK_DEFS = [
  P("paytm", "Paytm", "India digital payments", "India consumer payments beyond Razorpay.", "Checksum validation. Refund APIs."),
  P("mercadopago", "Mercado Pago", "Latin America payments", "LATAM market checkout.", "OAuth merchant. Installments regional."),
  P("paypay", "PayPay", "Japan QR payments", "Japan mobile wallet.", "Merchant API. Dynamic QR generation."),
  P("worldpay", "Worldpay", "Global payment processor", "Enterprise multi-region acquirer.", "XML API legacy. Tokenization vault."),
  L("fsharp", "F#", ".NET functional language", "Data science on .NET, domain modeling.", "Railway-oriented programming. Type providers sparingly."),
  L("erlang", "Erlang/OTP", "Telecom-grade concurrency", "WhatsApp-style messaging backends.", "Supervision trees. Hot code reload. ETS carefully."),
  L("julia", "Julia", "Scientific computing", "Numerical computing, research.", "Multiple dispatch. Package manager compat."),
  D("cis-controls", "CIS Controls", "Center for Internet Security benchmarks", "Security hardening baseline.", "IG1 for SMB. IG2 for enterprise. Map to implementation."),
  D("platform-engineering", "Platform Engineering", "Internal developer platforms", "IDP team patterns.", "Golden paths. Self-service portals. Backstage catalog."),
  D("finops", "FinOps", "Cloud financial operations", "Cost accountability engineering.", "Showback/chargeback. Rightsizing automation. Commitment planning."),
  D("green-software", "Green Software", "Sustainable engineering", "Carbon-aware workloads.", "Region selection by carbon intensity. Efficient algorithms."),
  F("electron-depth", "Electron Depth", "Desktop apps with web stack", "Cross-platform desktop beyond stem pack.", "Context isolation. Auto-update. Code signing per OS."),
  F("tauri-depth", "Tauri Depth", "Rust-backed lightweight desktop", "Smaller binaries than Electron.", "IPC commands. Capability allowlist. Updater plugin."),
  PL("app-store-connect", "App Store Connect", "Apple app distribution", "iOS/macOS release management.", "TestFlight. App Review guidelines. IAP compliance."),
  PL("google-play-console", "Google Play Console", "Android distribution", "Play Store releases.", "Play Billing. Data safety form. Staged rollouts."),
  PL("chrome-web-store", "Chrome Web Store", "Browser extension distribution", "Chrome extension publishing.", "Manifest V3 requirements. Review policies."),
  PL("marketplace-saas-patterns", "Marketplace SaaS Patterns", "Two-sided platform architecture", "Build marketplaces like DNA.", "Stripe Connect. Dispute flows. Seller onboarding KYC."),
  def("compliance/cis-benchmarks", "CIS Benchmarks", "OS and cloud hardening benchmarks", "Infrastructure compliance.", "CIS-CAT scans. Remediation playbooks.", ["compliance", "security"], "compliance"),
  def("healthcare/oracle-health-research", "Oracle Health Research", "Clinical trials and research systems", "Academic medical centers.", "CTMS integration. IRB workflow. 21 CFR Part 11.", ["healthcare", "research"]),
  def("tools/biome", "Biome", "Fast linter and formatter", "JS/TS toolchain alternative.", "biome.json. Replaces ESLint+Prettier stack."),
  def("tools/eslint-prettier", "ESLint & Prettier", "JS lint and format standard", "DNA default code quality.", "Flat config ESLint 9+. Prettier integration via eslint-config-prettier."),
  def("browsers/safari-ios", "Safari iOS WebKit", "Mobile Safari quirks depth", "PWA and web on iOS beyond desktop Safari pack.", "ITP storage limits. 100vh bug. Touch events. Standalone mode."),
  def("data/cdc-patterns", "CDC Patterns", "Change data capture architecture", "Extend geo-replication knowledge.", "Debezium + Kafka. Idempotent consumers. Schema evolution."),
  def("data/data-mesh", "Data Mesh", "Decentralized data architecture", "Large org data ownership.", "Domain data products. Federated governance. Self-serve platform."),
  def("data/data-contracts", "Data Contracts", "Producer-consumer data agreements", "Reliable analytics pipelines.", "Schema registry. Breaking change detection. SLAs on freshness."),
  def("web3/coinbase-wallet", "Coinbase Wallet SDK", "Web3 wallet connection", "dApp onboarding.", "Wallet link. Chain switching UX."),
  def("web3/nft-marketplace", "NFT Marketplace Patterns", "Digital collectibles platforms", "Optional web3 vertical.", "Royalty standards. Metadata pinning. Gas abstraction."),
];

export const WAVE5_FINAL_PACKS = packsFromDefs(WAVE5_FINAL_PACK_DEFS);
