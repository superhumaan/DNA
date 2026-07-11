import type { IndustrySectorDef } from "./types.js";

export const INDUSTRY_SECTOR_DEFINITIONS: IndustrySectorDef[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Clinical systems, patient portals, telehealth, and health data platforms",
    landscape: `Hospitals, clinics, payers, pharma, and digital health startups buy software for EHR integration, patient engagement, scheduling, billing, and population health.

**Typical products:** patient portals, clinician dashboards, telehealth, prior auth, RPM devices, practice management, clinical decision support.

**Jargon:** PHI, EHR/EMR, HL7, FHIR, CPT/ICD codes, prior authorization, care pathways, ADT feeds.`,
    influencers: `**Standards bodies:** HL7, FHIR (R4/R5), DICOM, IHE profiles
**Influencers:** Epic, Cerner/Oracle Health, athenahealth, Teladoc, Philips, GE HealthCare
**US:** CMS, ONC, HHS
**EU:** EMA, national health ministries
**APAC:** MOH agencies, HIRA (KR), NHS (UK)`,
    techStack: `**Common stacks:** Node/Java APIs, FHIR servers (HAPI), Postgres + audit logs, React clinical UIs
**Integrations:** HL7 v2 MLLP, FHIR REST, SMART on FHIR, SAML for clinician SSO
**Data:** immutable audit trails, consent records, break-glass access
**Related packs:** \`healthcare/fhir\`, \`compliance/hipaa\`, \`legal/domains/healthcare\``,
    latest: `**2025–2026 leaps:**
- FHIR R4 becoming default for new integrations (US CMS mandates)
- AI scribe and ambient documentation in clinical workflows
- Patient-generated health data (PGHD) from wearables
- TEFCA / QHIN for US nationwide exchange
- Zero-trust for clinical workstation access`,
    practices: `**Do:**
- Treat PHI as toxic — minimize, encrypt, audit every access
- Use FHIR resources idiomatically; don't invent clinical schemas
- Design for clinician interruption and 10-second tasks
- Support accessibility (WCAG 2.2 AA) — aging patients and clinicians
- Plan for offline/degraded mode in wards

**Don't:**
- Store PHI in analytics without de-identification
- Mix prod and staging patient data
- Skip BAA/DPA before any subprocessor
- Use consumer chat UX for clinical alerts (alarm fatigue)`,
    regulation: `**US:** HIPAA Privacy & Security Rules, HITECH, 21st Century Cures (info blocking)
**EU:** GDPR + MDR for devices, EHDS emerging
**UK:** UK GDPR, DSPT for NHS suppliers
**Run:** \`dna plan compliance --frameworks hipaa\` + \`dna plan legal --domains healthcare\``,
    agencyNotes: `**Client tone:** clinical accuracy over marketing hype; cite guidelines when possible
**Scope traps:** "HIPAA compliant hosting" ≠ HIPAA-compliant product; integration scope with legacy HL7
**RFP signals:** BAA required, SOC 2 + HIPAA, FHIR conformance, penetration test
**Handoff:** document data flows, retention, and breach notification playbooks`,
    uiPatterns: `**Density:** high information density; tables over cards for clinical lists
**Colour:** avoid red/green-only status; support colour-blind clinicians
**Typography:** 14px minimum body; monospace for IDs and codes
**Components:** patient banner (allergies, alerts), timeline views, status chips with text labels
**Trust:** show data source and last-updated on clinical values`,
    linkedPacks: ["healthcare/fhir", "compliance/hipaa", "legal/domains/healthcare"],
    tags: ["healthcare", "regulated", "phi"],
  },
  {
    id: "fintech",
    name: "Fintech & Banking",
    description: "Payments, banking, lending, wealth, and embedded finance",
    landscape: `Banks, neobanks, payment processors, lenders, and B2B fintech sell APIs and apps for money movement, KYC, fraud, and compliance.

**Typical products:** neobank apps, merchant dashboards, lending portals, treasury tools, open banking aggregators.

**Jargon:** KYC/AML, PCI, PSD2, SCA, ledger, settlement, chargeback, float, BIN, IBAN.`,
    influencers: `**Influencers:** Stripe, Plaid, Wise, Adyen, Monzo, Revolut, Square
**Regulators:** FCA (UK), MAS (SG), OCC/FDIC (US), ECB, BaFin
**Standards:** ISO 20022, SWIFT, EMV, 3DS2`,
    techStack: `**Common stacks:** event-sourced ledgers, idempotent APIs, Postgres with strict migrations
**Integrations:** Stripe/Adyen, Plaid, core banking APIs, webhooks with signature verification
**Related packs:** \`payments/stripe\`, \`payments/plaid\`, \`compliance/pci-dss\`, \`legal/domains/banking-finance\``,
    latest: `**2025–2026 leaps:**
- Embedded finance in vertical SaaS
- Real-time payments (FedNow, SEPA Instant, PayNow)
- AI fraud scoring with explainability requirements
- Tokenized card data and network tokens
- Open banking expansion beyond EU/UK`,
    practices: `**Do:**
- Idempotency keys on all money-moving operations
- Double-entry ledger or proven accounting module
- Show fees and FX rates before confirmation
- Audit log every balance change with actor and reason
- Sandbox-first integration testing

**Don't:**
- Store PAN/CVV — use tokenization
- Skip KYC on onboarding shortcuts
- Mix prod and sandbox API keys
- Rely on client-side amount validation`,
    regulation: `**Payments:** PCI DSS, PSD2/PSD3, Strong Customer Authentication
**Banking:** AML/KYC, sanctions screening (OFAC), MiFID II (investments)
**Run:** \`dna plan compliance --frameworks pci_dss\` + \`dna plan legal --domains banking\``,
    agencyNotes: `**Client tone:** precise, trust-building; no "bank-grade" without evidence
**Scope traps:** "PCI compliant" scope (SAQ A vs full); multi-currency settlement
**RFP signals:** SOC 2 Type II, penetration test, disaster recovery RTO/RPO`,
    uiPatterns: `**Trust signals:** padlock, regulator badges where licensed, clear fee breakdown
**Status:** transfer timelines with explicit states (initiated → processing → settled)
**Forms:** mask account numbers; reveal on explicit action
**Colour:** conservative palette; red only for irreversible actions`,
    linkedPacks: ["payments/stripe", "payments/plaid", "compliance/pci-dss", "legal/domains/banking-finance"],
    tags: ["fintech", "payments", "regulated"],
  },
  {
    id: "ecommerce-retail",
    name: "E-commerce & Retail",
    description: "Online stores, marketplaces, omnichannel retail, and D2C brands",
    landscape: `Brands and retailers need storefronts, inventory, fulfilment, loyalty, and personalisation at scale.

**Typical products:** D2C shops, B2B ordering portals, marketplace seller tools, POS integrations, loyalty apps.

**Jargon:** SKU, PDP, PLP, OMS, WMS, AOV, CAC, LTV, cart abandonment, omnichannel.`,
    influencers: `**Platforms:** Shopify, Amazon, BigCommerce, Salesforce Commerce Cloud
**Influencers:** Nike DTC model, Shein speed-to-market, Walmart omnichannel
**Standards:** GS1 barcodes, EDI for wholesale`,
    techStack: `**Common stacks:** headless commerce (Shopify Hydrogen, Medusa), Next.js storefronts, CDN-first
**Integrations:** payment gateways, ERP (NetSuite), 3PL APIs, search (Algolia)
**Related packs:** \`payments/stripe\`, \`frameworks/nextjs\`, \`legal/domains/consumer-protection\``,
    latest: `**2025–2026 leaps:**
- AI product discovery and visual search
- Buy-now-pay-later embedded at checkout
- Social commerce and live shopping
- Sustainable sourcing and carbon labels on PDP
- Composable commerce (best-of-breed vs monolith)`,
    practices: `**Do:**
- Optimise Core Web Vitals on PDP and checkout
- Guest checkout with optional account creation
- Clear returns policy and order tracking
- Inventory reservation at checkout, not cart
- Multi-currency and tax at address level

**Don't:**
- Block checkout with forced account creation
- Hide shipping costs until last step
- Skip accessibility on product images (alt text)
- Store card data — use hosted fields`,
    regulation: `**Consumer:** EU Consumer Rights, UK CRA, US state consumer protection
**Privacy:** GDPR, CCPA for personalisation cookies
**Run:** \`dna plan legal --domains consumer,privacy\``,
    agencyNotes: `**Client tone:** conversion-focused but honest; avoid dark patterns
**Scope traps:** "Shopify theme" vs custom headless; ERP integration depth
**Peak seasons:** plan load testing before Black Friday / 11.11`,
    uiPatterns: `**PDP:** large imagery, size/colour swatches, sticky add-to-cart on mobile
**Checkout:** progress indicator, trust badges, minimal fields
**Density:** consumer-spacious; B2B catalogues can be denser
**Motion:** subtle; never block interaction for animations`,
    linkedPacks: ["payments/stripe", "legal/domains/consumer-protection", "legal/domains/privacy"],
    tags: ["ecommerce", "retail", "consumer"],
  },
  {
    id: "edtech",
    name: "EdTech",
    description: "Learning platforms, LMS integrations, assessment, and student information systems",
    landscape: `Schools, universities, corporates, and publishers need LMS, content delivery, assessment, and analytics.

**Typical products:** course platforms, tutoring apps, SIS portals, corporate L&D, proctoring tools.

**Jargon:** LMS, LTI, SCORM, xAPI, SIS, FERPA, rostering, mastery learning.`,
    influencers: `**Platforms:** Canvas, Moodle, Blackboard, Google Classroom, Coursera
**Standards:** IMS Global (LTI 1.3), 1EdTech, SCORM/xAPI
**Influencers:** Khan Academy, Duolingo (gamification)`,
    techStack: `**Common stacks:** LTI tool providers, video CDN, progress tracking DB
**Integrations:** OIDC launch, deep linking, roster sync (OneRoster)
**Related packs:** \`edtech/lti\`, \`edtech/canvas\`, \`compliance/ferpa\`, \`compliance/coppa\``,
    latest: `**2025–2026 leaps:**
- AI tutoring with guardrails and teacher oversight
- Adaptive learning paths from analytics
- Micro-credentials and skills wallets
- Accessibility mandates for public education procurement`,
    practices: `**Do:**
- Support LTI 1.3 for institutional sales
- Role separation: student, teacher, admin, parent
- COPPA/FERPA gates before collecting student data
- Offline-friendly content where possible
- WCAG 2.2 AA for all learning UI

**Don't:**
- Share student PII with third-party analytics without consent
- Gamify in ways that harm younger learners
- Skip institution SSO for K12/higher ed`,
    regulation: `**US:** FERPA (education records), COPPA (under-13)
**EU:** GDPR for student data, national education rules
**Run:** \`dna plan compliance --frameworks gdpr\` + check FERPA/COPPA packs`,
    agencyNotes: `**Client tone:** pedagogically sound; teachers are primary users for B2B
**Scope traps:** content authoring vs delivery platform; roster sync complexity
**Procurement:** VPAT/WCAG evidence often required`,
    uiPatterns: `**Learner UI:** clear progress, encouragement without infantilising adults
**Teacher UI:** batch actions, gradebook density, export
**Accessibility:** captions, keyboard nav, dyslexia-friendly options
**Mobile:** assignments and notifications; deep work on desktop`,
    linkedPacks: ["edtech/lti", "edtech/canvas", "compliance/ferpa", "compliance/coppa"],
    tags: ["edtech", "education"],
  },
  {
    id: "gov-public-sector",
    name: "Government & Public Sector",
    description: "Citizen services, procurement portals, and regulated public systems",
    landscape: `Government agencies need accessible, secure, auditable systems for citizens and civil servants.

**Typical products:** benefit portals, permit applications, case management, open data, procurement platforms.

**Jargon:** G-Cloud, FedRAMP, ATO, WCAG, VPAT, citizen identity, FOIA.`,
    influencers: `**Frameworks:** US Digital Service, GDS (UK), Digital Marketplace (UK), 18F
**Standards:** WCAG 2.2 AA, Section 508, EN 301 549
**Identity:** Login.gov, GOV.UK One Login, Singpass`,
    techStack: `**Common stacks:** hardened cloud (GovCloud, Azure Government), Java/.NET legacy + modern APIs
**Integrations:** identity brokers, document management, payment gateways (gov-specific)
**Related packs:** \`gov/fedramp\`, \`gov/section-508\`, \`gov/login-gov\``,
    latest: `**2025–2026 leaps:**
- Digital identity wallets and verifiable credentials
- AI for caseworker assist (with human-in-loop mandates)
- Cloud migration off legacy mainframes (slow but ongoing)
- Mandatory accessibility in EU public sector apps`,
    practices: `**Do:**
- WCAG 2.2 AA from day one; publish VPAT
- Plain language (grade 8–10 reading level for citizens)
- Full audit trail for case decisions
- Multi-language where legally required
- Security assessment before production (ATO path)

**Don't:**
- Use dark patterns on consent or data collection
- Skip records retention schedules
- Deploy without disaster recovery tested`,
    regulation: `**US:** Section 508, FedRAMP, state breach laws, CJIS (law enforcement)
**UK:** G-Cloud, Cyber Essentials+, UK GDPR
**Run:** \`dna plan legal --domains privacy\` + install gov packs`,
    agencyNotes: `**Client tone:** neutral, inclusive, no marketing fluff
**Scope traps:** accessibility "later"; integration with legacy case systems
**Procurement:** fixed-price milestones; security questionnaires early`,
    uiPatterns: `**Citizen:** large touch targets, plain labels, step-by-step wizards
**Contrast:** high contrast mode support
**Status:** clear application status with reference numbers
**Print:** printable confirmation pages`,
    linkedPacks: ["gov/fedramp", "gov/section-508", "gov/login-gov"],
    tags: ["gov", "public-sector", "a11y"],
  },
  {
    id: "travel-hospitality",
    name: "Travel & Hospitality",
    description: "Booking, airlines, hotels, tours, and loyalty platforms",
    landscape: `OTAs, airlines, hotel groups, and tour operators need search, booking, payments, and loyalty at global scale.

**Typical products:** booking engines, property management, loyalty apps, tour marketplaces, airline ancillaries.

**Jargon:** GDS, PNR, OTA, ADR, RevPAR, fare rules, dynamic packaging, NDC.`,
    influencers: `**Platforms:** Amadeus, Sabre, Booking.com, Expedia, Airbnb
**Influencers:** Agoda (APAC scale), Marriott Bonvoy, Ryanair direct model`,
    techStack: `**Common stacks:** search (Elasticsearch), geo pricing, high-read caches, mobile-first React
**Integrations:** GDS/NDC, payment multi-currency, SMS/push for itinerary
**Related packs:** \`maps/mapbox\`, \`payments/stripe\`, \`companies/travel-scale-up\``,
    latest: `**2025–2026 leaps:**
- NDC adoption for airline direct distribution
- AI trip planning with bookable inventory (not hallucinated)
- Sustainable travel filters and carbon offset APIs
- Super-app bundles (flights + hotels + experiences)`,
    practices: `**Do:**
- Show all-in pricing where law requires (EU, Australia)
- Handle timezone and locale for itineraries
- Graceful handling of inventory race conditions
- Loyalty currency clarity (points vs cash value)
- Performance on search results (<2s TTFB target)

**Don't:**
- Hide mandatory fees until payment
- Store passport data without encryption and retention policy
- Block cancellation flows required by consumer law`,
    regulation: `**Consumer:** package travel directives (EU), DOT (US airlines)
**Privacy:** GDPR for guest profiles, PCI for payments
**Run:** \`dna plan legal --domains consumer,privacy\``,
    agencyNotes: `**Client tone:** aspirational but accurate; no fake urgency
**Scope traps:** GDS fees and certification; multi-supplier cancellation policies
**Peak:** load test before holiday seasons`,
    uiPatterns: `**Search:** flexible dates, map views, filter chips
**Booking:** sticky price summary, clear cancellation terms
**Mobile:** boarding passes, offline itinerary access
**Imagery:** high-quality destination photos with lazy load`,
    linkedPacks: ["maps/mapbox", "payments/stripe", "companies/travel-scale-up"],
    tags: ["travel", "hospitality"],
  },
  {
    id: "saas-b2b",
    name: "SaaS B2B",
    description: "Business software, vertical SaaS, and product-led growth tools",
    landscape: `B2B SaaS sells workflows to teams — CRM, HR, devtools, vertical ops, and platform APIs.

**Typical products:** admin dashboards, multi-tenant apps, integrations marketplaces, usage billing.

**Jargon:** ARR, MRR, churn, NRR, PLG, ICP, SSO, RBAC, tenant, seat-based pricing.`,
    influencers: `**Influencers:** Salesforce, HubSpot, Slack, Notion, Datadog, Vercel
**Patterns:** product-led growth, sales-led enterprise, land-and-expand`,
    techStack: `**Common stacks:** multi-tenant Postgres (row or schema), Next.js + API, Stripe Billing
**Integrations:** SAML/OIDC SSO, SCIM provisioning, webhooks, REST/GraphQL APIs
**Related packs:** \`disciplines/solution-architecture\`, \`platforms/api\`, \`compliance/soc2\``,
    latest: `**2025–2026 leaps:**
- AI copilots embedded in workflows (not bolt-on chat)
- Usage-based and hybrid pricing models
- EU data residency as enterprise requirement
- MCP and API-first for AI agent integrations`,
    practices: `**Do:**
- Multi-tenancy isolation tested (no cross-tenant leaks)
- SSO and RBAC for enterprise deals
- Audit logs for admin actions
- Onboarding that reaches first value in <15 minutes
- Public status page and API versioning policy

**Don't:**
- Ship without export/delete for customer data (GDPR)
- Hardcode tenant IDs in queries
- Break API without deprecation window`,
    regulation: `**Privacy:** GDPR, SOC 2 for enterprise sales
**Contracts:** DPA standard; subprocessors list maintained
**Run:** \`dna plan compliance --frameworks gdpr,iso27001,soc2\``,
    agencyNotes: `**Client tone:** outcome-focused for buyers; technical depth in appendices
**Scope traps:** "MVP" without tenancy; integration count in SOW
**Enterprise:** security questionnaire pack ready early`,
    uiPatterns: `**Admin:** list/report pages, bulk actions, CSV export
**Density:** medium-high; power users expect keyboard shortcuts
**Empty states:** guide to first integration or invite
**Settings:** org vs user settings clearly separated`,
    linkedPacks: ["platforms/api", "compliance/gdpr", "disciplines/solution-architecture"],
    tags: ["saas", "b2b"],
  },
  {
    id: "logistics-supply-chain",
    name: "Logistics & Supply Chain",
    description: "Freight, warehousing, last-mile delivery, and supply chain visibility",
    landscape: `3PLs, carriers, and shippers need tracking, routing, warehouse ops, and partner integrations.

**Typical products:** TMS, WMS, fleet dashboards, track-and-trace portals, customs documentation.

**Jargon:** TMS, WMS, ASN, BOL, last-mile, cross-dock, ETA, geofence, SKU velocity.`,
    influencers: `**Influencers:** Flexport, Maersk Digital, Amazon Logistics, Project44
**Standards:** EDI X12, GS1, UN/CEFACT`,
    techStack: `**Common stacks:** event streams for shipment updates, maps/routing APIs, mobile driver apps
**Integrations:** carrier APIs, ERP, IoT telematics, barcode/RFID
**Related packs:** \`maps/postgis\`, \`iot/mqtt\`, \`realtime/websockets\``,
    latest: `**2025–2026 leaps:**
- Real-time visibility platforms (control tower)
- AI demand forecasting and route optimisation
- Electric fleet charging integration
- Blockchain for provenance (niche but RFP-driven)`,
    practices: `**Do:**
- Idempotent shipment state machine (picked → in-transit → delivered)
- GPS privacy for drivers; geofence with consent
- Handle partial deliveries and exceptions explicitly
- Timezone-aware ETAs
- Offline-capable driver apps

**Don't:**
- Lose audit trail on custody transfers
- Expose internal cost data to shipper portals
- Skip retry on partner API failures`,
    regulation: `**Safety:** driver hours regulations (region-specific)
**Customs:** export controls for cross-border
**Privacy:** driver location as personal data under GDPR`,
    agencyNotes: `**Client tone:** operational precision; ROI in minutes saved
**Scope traps:** number of carrier integrations; exception handling depth
**Go-live:** pilot with one lane before network rollout`,
    uiPatterns: `**Maps:** shipment map with status timeline
**Ops dashboards:** exception queues front and centre
**Mobile:** large tap targets for warehouse floor
**Tables:** dense; filters by hub, carrier, SLA breach`,
    linkedPacks: ["maps/postgis", "iot/mqtt", "realtime/websockets"],
    tags: ["logistics", "supply-chain"],
  },
  {
    id: "media-entertainment",
    name: "Media & Entertainment",
    description: "Streaming, publishing, gaming platforms, and content rights",
    landscape: `Studios, publishers, and platforms need content delivery, rights, subscriptions, and engagement.

**Typical products:** streaming apps, news paywalls, podcast platforms, UGC moderation, rights CMS.

**Jargon:** CDN, DRM, SVOD/AVOD, CPM, DMCA, geo-blocking, content ID, churn.`,
    influencers: `**Platforms:** Netflix, Spotify, YouTube, Disney+, Twitch
**Tech:** AWS MediaConvert, Mux, Cloudinary, Widevine/FairPlay`,
    techStack: `**Common stacks:** CDN-first video, recommendation APIs, subscription billing
**Integrations:** encoders, ad servers, rights metadata (EIDR)
**Related packs:** \`realtime/mux\`, \`realtime/cloudinary\`, \`payments/stripe\``,
    latest: `**2025–2026 leaps:**
- FAST channels and ad-supported streaming growth
- AI-generated content moderation at scale
- Interactive/live streaming (sports, events)
- Short-form vertical video in apps`,
    practices: `**Do:**
- Adaptive bitrate streaming; measure QoE
- Geo-rights enforcement at API and CDN
- Parental controls where required
- DMCA/takedown workflow for UGC
- Subscription pause/cancel compliance (FTC, EU)

**Don't:**
- Store master content without DRM strategy
- Block accessibility (captions, audio description)
- Ignore royalty reporting requirements`,
    regulation: `**Copyright:** DMCA (US), EU Copyright Directive
**Privacy:** GDPR for viewing history; COPPA for kids content
**Advertising:** ASA/CAP (UK), FTC endorsements`,
    agencyNotes: `**Client tone:** brand voice varies wildly — ask for style guide early
**Scope traps:** DRM licensing; number of platforms (web, TV, mobile)
**Launch:** content ingest pipeline often underestimated`,
    uiPatterns: `**Consumer:** immersive hero, carousel rails, continue watching
**Player:** minimal chrome; gesture-friendly on mobile
**Paywall:** clear value prop; trial terms visible
**Dark mode:** default for video apps`,
    linkedPacks: ["realtime/mux", "realtime/cloudinary", "payments/stripe"],
    tags: ["media", "entertainment"],
  },
  {
    id: "real-estate-proptech",
    name: "Real Estate & PropTech",
    description: "Property listings, transactions, property management, and construction tech",
    landscape: `Agencies, portals, landlords, and builders need listings, viewings, leases, and transaction workflows.

**Typical products:** property portals, CRM for agents, tenant portals, valuation tools, BIM viewers.

**Jargon:** MLS, lease, strata, conveyancing, yield, cap rate, floor plan, off-plan.`,
    influencers: `**Portals:** Zillow, Rightmove, Domain, PropertyGuru
**PropTech:** CoStar, Yardi, Matterport (3D tours)`,
    techStack: `**Common stacks:** map search, image CDN, document e-sign, CRM pipelines
**Integrations:** MLS feeds, DocuSign, payment for deposits
**Related packs:** \`maps/google-maps\`, \`maps/mapbox\`, \`legal/domains/consumer-protection\``,
    latest: `**2025–2026 leaps:**
- 3D virtual tours as standard listing feature
- AI valuation models (with disclosure requirements)
- Embedded mortgage and insurance at point of listing
- ESG/building energy ratings on commercial listings`,
    practices: `**Do:**
- Accurate geo search with map bounds
- Disclose listing freshness and data source
- Anti-discrimination in search filters (fair housing)
- Secure document vault for contracts
- Mobile-first for agents in the field

**Don't:**
- Scrape MLS without licence
- Hide fees in rental listings where illegal
- Store identity docs without encryption`,
    regulation: `**US:** Fair Housing Act, RESPA (referrals)
**UK:** AML for high-value transactions
**Privacy:** GDPR for tenant/landlord data`,
    agencyNotes: `**Client tone:** local market expertise; photos and location sell
**Scope traps:** MLS integration fees; multi-country listing rules
**Stakeholders:** agents resist workflow change — plan training`,
    uiPatterns: `**Search:** map + list split view; save search alerts
**Listings:** image gallery, floor plan tab, neighbourhood info
**Forms:** progressive disclosure for mortgage pre-qual
**Trust:** verified agent badges, listing reference IDs`,
    linkedPacks: ["maps/google-maps", "maps/mapbox"],
    tags: ["proptech", "real-estate"],
  },
  {
    id: "energy-utilities",
    name: "Energy & Utilities",
    description: "Power, water, oil & gas, renewables, and smart grid platforms",
    landscape: `Utilities and energy tech need metering, billing, asset management, and customer portals.

**Typical products:** smart meter portals, outage maps, billing systems, renewable asset monitoring, field service.

**Jargon:** AMI, kWh, demand response, DER, SCADA, OT/IT, grid balancing.`,
    influencers: `**Influencers:** Schneider Electric, Siemens, Octopus Energy, Tesla Energy
**Regulators:** FERC (US), Ofgem (UK), national utility commissions`,
    techStack: `**Common stacks:** time-series DB (Influx/Timescale), GIS, integration buses to SCADA (careful)
**Integrations:** meter data management, payment, weather APIs
**Related packs:** \`iot/mqtt\`, \`iot/aws-iot-core\`, \`maps/postgis\``,
    latest: `**2025–2026 leaps:**
- Smart home energy optimisation (dynamic tariffs)
- EV charge point roaming networks
- Grid-scale battery management dashboards
- CSRD reporting for energy companies`,
    practices: `**Do:**
- Separate OT and IT networks; never expose SCADA to internet
- Time-series data retention policies
- Outage communication with realistic ETAs
- Accessibility for billing portals (all demographics)
- Resilience testing for peak demand events

**Don't:**
- Control critical infrastructure from consumer app tier
- Underestimate regulatory reporting cycles
- Store meter data without customer consent where required`,
    regulation: `**Critical infrastructure:** NERC CIP (US grid), NIS2 (EU)
**Consumer:** utility billing dispute rights (region-specific)
**Environmental:** emissions reporting (CSRD, SEC climate rules)`,
    agencyNotes: `**Client tone:** safety and reliability first; no hype on grid stability
**Scope traps:** OT integration certification; 24/7 support SLAs
**Procurement:** long sales cycles; compliance evidence heavy`,
    uiPatterns: `**Consumer portal:** usage charts, bill comparison, outage map
**Ops:** alarm dashboards with acknowledge workflow
**Charts:** time-series with zoom; export CSV for disputes
**Colour:** status green/amber/red with text labels`,
    linkedPacks: ["iot/mqtt", "iot/aws-iot-core", "maps/postgis"],
    tags: ["energy", "utilities", "iot"],
  },
  {
    id: "legal-tech",
    name: "Legal Tech",
    description: "Practice management, e-discovery, contract lifecycle, and legal research",
    landscape: `Law firms and legal ops need matter management, document review, billing, and client portals.

**Typical products:** CLM, e-discovery, legal research, client intake, court filing integrations.

**Jargon:** matter, billable hour, privilege, redaction, CLM, DMS, e-discovery, metadata.`,
    influencers: `**Platforms:** Clio, Relativity, Ironclad, LexisNexis, Thomson Reuters
**Standards:** Legal XML, court e-filing formats (jurisdiction-specific)`,
    techStack: `**Common stacks:** document stores with versioning, full-text search, granular RBAC
**Integrations:** DMS (iManage), e-sign, court APIs
**Related packs:** \`legal/domains/intellectual-property\`, \`legal/domains/privacy\``,
    latest: `**2025–2026 leaps:**
- AI contract review with human review gates
- Privilege detection in document AI
- Client collaboration portals replacing email
- Regulatory change monitoring feeds`,
    practices: `**Do:**
- Attorney-client privilege boundaries in data model
- Immutable audit on document access
- Ethical walls between conflicting matters
- Redaction tools before export
- Regional data residency for law firms

**Don't:**
- Train public models on client documents without consent
- Allow cross-matter search without ethical checks
- Skip conflict-of-interest checks on new matters`,
    regulation: `**Professional:** bar rules on advertising and confidentiality
**Privacy:** GDPR for client PII; legal privilege vs breach notification
**AI:** emerging court rules on AI-generated filings — verify locally`,
    agencyNotes: `**Client tone:** conservative, precise; lawyers notice errors
**Scope traps:** matter types vary by practice area; integration with firm DMS
**Security:** penetration test and SOC 2 often mandatory`,
    uiPatterns: `**Document UI:** version history, compare, redaction mode
**Matter list:** dense tables; advanced search
**Time entry:** minimal friction for lawyers on mobile
**Client portal:** clean, formal typography; download audit trail`,
    linkedPacks: ["legal/domains/intellectual-property", "legal/domains/privacy"],
    tags: ["legal-tech", "professional-services"],
  },
];
