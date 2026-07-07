import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const V = (id: string, name: string, desc: string, when: string, how: string, tags: string[], category?: "platforms" | "disciplines" | "compliance") =>
  def(id, name, desc, when, how, tags, category);

export const WAVE4_VERTICALS_PACK_DEFS = [
  V("gov/govuk-one-login", "GOV.UK One Login", "UK government identity", "Citizen auth for UK gov services.", "OIDC integration. Identity assurance levels.", ["gov", "auth"]),
  V("gov/oscal-compliance", "OSCAL Compliance Automation", "Automated security documentation", "Federal ATO acceleration.", "Component definitions. SSP assembly from OSCAL.", ["gov", "compliance"], "compliance"),
  V("edtech/coursera-patterns", "MOOC Platform Patterns", "Coursera/Udemy-style course platforms", "Online course marketplaces.", "Progress tracking. Certificate issuance. DRM considerations."),
  V("edtech/academic-integrity", "Academic Integrity", "Plagiarism and proctoring overview", "Higher ed assessments.", "Turnitin integration patterns. Honor code flows."),
  V("insurance/guidewire", "Guidewire", "Insurance core platform", "P&C insurance carriers.", "PolicyCenter integration. Batch jobs. Event messaging."),
  V("insurance/duck-creek", "Duck Creek", "Insurance SaaS platform", "Policy admin and billing.", "REST APIs. Versioned policy transactions."),
  V("insurance/claims-automation", "Claims Automation", "FNOL to settlement workflows", "Insurtech apps.", "Photo upload. Adjuster assignment. Fraud scoring hooks."),
  V("proptech/matterport", "Matterport", "3D property tours", "Real estate virtual tours.", "SDK embed. Webhook on model ready."),
  V("proptech/mls-reso", "RESO Web API", "Real estate MLS standard", "US/CA property listings.", "OAuth MLS access. Data licensing compliance."),
  V("martech/adobe-experience", "Adobe Experience Cloud", "Enterprise marketing suite", "Adobe Analytics, Target, Campaign.", "Experience Platform API. Launch tags."),
  V("martech/salesforce-marketing-cloud", "Salesforce Marketing Cloud", "Enterprise email journeys", "B2C marketing at scale.", "Journey Builder API. Subscriber model."),
  V("energy/grid-apis", "Utility Grid APIs", "Energy data and demand response", "Cleantech integrations.", "Green Button Connect. OAuth utility portals."),
  V("agtech/john-deere", "John Deere Operations Center", "Agriculture equipment data", "Precision ag integrations.", "OAuth partner API. Field operation sync."),
  V("travel/amadeus", "Amadeus GDS", "Travel distribution APIs", "Flight/hotel booking.", "NDC vs EDIFACT legacy. PCI for payments."),
  V("travel/sabre", "Sabre APIs", "Travel technology platform", "Agency and airline integrations.", "Sessionless token auth. Shop/book flows."),
  V("hospitality/opera-pms", "Oracle Opera PMS", "Hotel property management", "Hospitality integrations.", "OHIP APIs. Reservation sync."),
  V("hospitality/mews", "Mews PMS", "Cloud hotel PMS", "Modern hospitality stack.", "Connector API. Webhook events."),
  V("media/spotify-api", "Spotify Web API", "Music platform integration", "Playlist apps, audio features.", "OAuth scopes. Rate limits. Audio playback SDK."),
  V("media/youtube-api", "YouTube Data API", "Video platform integration", "Creator tools, embeds.", "Quota units. OAuth for uploads."),
  V("media/podcast-rss", "Podcast & RSS Patterns", "Podcast distribution", "Show hosting and analytics.", "RSS enclosure tags. Apple Podcasts requirements."),
];

export const WAVE4_VERTICALS_PACKS = packsFromDefs(WAVE4_VERTICALS_PACK_DEFS);

const I = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["ai"]);

export const WAVE4_AI_MEDIA_PACK_DEFS = [
  I("ai/midjourney-api", "Midjourney & Image APIs", "Generative image integrations", "Marketing asset generation.", "API terms of use. Human review before publish."),
  I("ai/github-copilot", "GitHub Copilot", "AI pair programming", "IDE code completion.", "Copilot Business policies. No secrets in prompts."),
  I("ai/windsurf-cascade", "Windsurf Cascade", "Agentic IDE workflows", "Multi-file AI edits.", "Flow checkpoints. MCP tool policies."),
  I("ai/perplexity-api", "Perplexity API", "Search-augmented answers", "Research assistants.", "Citation requirements. Rate limits."),
  I("ai/groq", "Groq", "Fast inference LPU", "Low-latency LLM inference.", "Model selection. Token throughput limits."),
  I("ai/together-ai", "Together AI", "Open model hosting", "Fine-tune and inference OSS models.", "Dedicated endpoints. Model license compliance."),
  I("ai/fireworks-ai", "Fireworks AI", "Fast open model API", "Production inference alternative.", "Function calling. Batch API."),
  I("ai/fine-tuning", "LLM Fine-Tuning", "Custom model training patterns", "Domain-specific models.", "LoRA/QLoRA. Eval before deploy. Version pinning."),
  I("ai/feature-store", "Feature Store Patterns", "ML feature serving", "Traditional ML at scale.", "Offline/online parity. Point-in-time correctness."),
  I("ai/nemo-guardrails", "NVIDIA NeMo Guardrails", "Programmable LLM guardrails", "Enterprise AI safety.", "Colang flows. Topic control. Fact-check hooks."),
  I("observability/gremlin", "Gremlin", "Chaos engineering SaaS", "Controlled failure injection.", "Blast radius limits. Game day runbooks."),
  I("observability/litmus", "LitmusChaos", "Kubernetes chaos engineering", "K8s fault injection OSS.", "ChaosExperiment CRDs. Probe validation."),
  I("observability/betterstack", "Better Stack", "Logs and uptime unified", "SMB observability.", "Logtail ingestion. Incident management."),
  I("devtools/bitbucket", "Bitbucket", "Atlassian Git hosting", "Teams on Bitbucket Cloud/Server.", "Pipelines YAML. Branch restrictions."),
  I("devtools/sonarcloud", "SonarCloud", "Cloud code quality", "SaaS SonarQube.", "Quality gate on PR. Security hotspots."),
  I("devtools/dependabot", "Dependabot", "Automated dependency updates", "GitHub security updates.", "Grouped updates. Auto-merge policy cautiously."),
  I("devtools/renovate", "Renovate", "Multi-platform dependency bot", "Monorepo dependency freshness.", "renovate.json presets. Schedule windows."),
  I("devtools/turborepo-remote-cache", "Turborepo Remote Cache", "Distributed build cache", "CI speed for monorepos.", "Vercel remote cache or self-host. Token scoping."),
];

export const WAVE4_AI_DEVTOOLS_PACKS = packsFromDefs(WAVE4_AI_MEDIA_PACK_DEFS);
