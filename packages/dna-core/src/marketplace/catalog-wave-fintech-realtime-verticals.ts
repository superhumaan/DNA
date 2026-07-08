import type { KnowledgePack } from "@superhumaan/dna-config";
import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const P = (id: string, name: string, desc: string, when: string, how: string) =>
  def(id, name, desc, when, how, ["payments"]);

export const FINTECH_EXTENDED_PACK_DEFS = [
  P("payments/plaid", "Plaid", "Bank account linking", "Fintech, personal finance.", "Link token flow. Webhook transactions sync."),
  P("payments/klarna", "Klarna", "Buy now pay later", "Consumer checkout BNPL.", "Session API. Regional availability."),
  P("payments/affirm", "Affirm", "BNPL US", "US installment checkout.", "Promotional messaging compliance."),
  P("payments/chargebee", "Chargebee", "Subscription billing platform", "Complex billing without building.", "Webhook subscription events. Tax integration."),
  P("payments/recurly", "Recurly", "Subscription management", "Enterprise recurring billing.", "Account hierarchy. Dunning."),
  P("payments/anrok", "Anrok", "Sales tax for SaaS", "Modern tax automation.", "Transaction API. Nexus tracking."),
  P("payments/avalara", "Avalara", "Tax compliance", "Enterprise tax.", "AvaTax calculation. CertCapture."),
  P("payments/taxjar", "TaxJar", "Sales tax API", "SMB tax automation.", "SmartCalcs API."),
  P("payments/stripe-connect", "Stripe Connect", "Marketplace payouts", "Platform payments split.", "Express vs Custom accounts. KYC flows."),
  P("payments/open-banking", "Open Banking (PSD2)", "UK/EU bank APIs", "Account aggregation regulated.", "FCA/PSD2 compliance. Consent tokens."),
  P("payments/ios-android-iap", "Mobile In-App Purchases", "App Store and Play Billing", "Digital goods on mobile.", "StoreKit 2. Server notification V2. No bypassing store for digital."),
];

export const FINTECH_EXTENDED_PACKS = packsFromDefs(FINTECH_EXTENDED_PACK_DEFS);

const R = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["realtime"]);

export const REALTIME_PACK_DEFS = [
  R("realtime/websockets", "WebSockets Patterns", "Bidirectional realtime", "Live dashboards, chat.", "Heartbeat, reconnect, auth on upgrade."),
  R("realtime/socketio", "Socket.IO", "Realtime library", "Fallback transports.", "Rooms per tenant. Redis adapter scale."),
  R("realtime/ably", "Ably", "Realtime pub/sub SaaS", "Managed websockets.", "Token auth per channel. Message history."),
  R("realtime/pusher", "Pusher", "Channels realtime", "Simple broadcast.", "Private channel auth endpoint."),
  R("realtime/liveblocks", "Liveblocks", "Collaborative UI", "Figma-like multiplayer.", "Yjs under hood options. Room permissions."),
  R("realtime/partykit", "Partykit", "Realtime at edge", "Collab on Cloudflare.", "Parties as rooms. Durable Objects."),
  R("realtime/yjs", "Yjs CRDT", "Conflict-free replicated data", "Build your own collab.", "y-websocket provider. Awareness API."),
  R("realtime/livekit", "LiveKit", "WebRTC infrastructure", "Video/audio rooms.", "Self-host or cloud. E2EE option."),
  R("realtime/webrtc", "WebRTC", "Peer media connections", "Low-latency media.", "TURN servers required. Signaling server."),
  R("realtime/mux", "Mux", "Video API", "On-demand and live video.", "Webhooks encoding done. Signed playback URLs."),
  R("realtime/cloudinary", "Cloudinary", "Media management CDN", "Image/video transform.", "Upload presets. AI tagging optional."),
];

export const REALTIME_PACKS = packsFromDefs(REALTIME_PACK_DEFS);

const V = (
  id: string,
  name: string,
  desc: string,
  when: string,
  how: string,
  tags: string[] = [],
  category?: KnowledgePack["category"],
) => def(id, name, desc, when, how, tags, category);

export const VERTICAL_MISC_PACK_DEFS = [
  V("edtech/moodle", "Moodle", "Open-source LMS", "Universities, training.", "Plugins. LTI integration. Self-host security.", ["edtech"]),
  V("edtech/canvas", "Canvas LMS", "Instructure LMS", "US K12/higher ed.", "LTI 1.3. REST API keys per institution.", ["edtech"]),
  V("edtech/lti", "LTI 1.3", "Learning Tools Interoperability", "Embed tools in LMS.", "OIDC launch. Deep linking.", ["edtech", "standards"]),
  V("edtech/scorm", "SCORM & xAPI", "E-learning content standards", "Legacy courseware.", "SCORM cloud or Rustici engine.", ["edtech"]),
  V("gov/fedramp", "FedRAMP", "US government cloud authorization", "Selling to US federal.", "Moderate/High baselines. 3PAO assessment.", ["gov", "compliance"], "disciplines"),
  V("gov/section-508", "Section 508 / EN 301 549", "Government accessibility", "Public sector US/EU.", "VPAT documentation. WCAG 2.2 AA.", ["gov", "a11y"], "disciplines"),
  V("gov/login-gov", "Login.gov", "US federal identity", "Citizen-facing gov apps.", "OIDC integration. IAL levels.", ["gov", "auth"]),
  V("iot/mqtt", "MQTT", "IoT messaging protocol", "Devices, industrial.", "TLS, client certs. Topic ACLs."),
  V("iot/aws-iot-core", "AWS IoT Core", "Managed IoT platform", "Fleet provisioning.", "Thing shadows. Rules engine to Lambda."),
  V("gaming/unity", "Unity", "Game engine", "3D/2D games cross-platform.", "Netcode for GameObjects. Addressables."),
  V("gaming/unreal", "Unreal Engine", "AAA game engine", "High-fidelity games.", "Replication graph. Dedicated servers."),
  V("gaming/godot", "Godot", "Open-source game engine", "Indie games.", "GDScript/C#. Multiplayer API."),
  V("web3/ethereum", "Ethereum & EVM", "Smart contracts", "On-chain apps optional.", "Hardhat/Foundry. Audit before mainnet.", ["web3"]),
  V("web3/solana", "Solana", "High-throughput chain", "NFT, DeFi niche.", "Anchor framework. Wallet adapter.", ["web3"]),
  V("maps/mapbox", "Mapbox", "Maps and location APIs", "Custom maps, navigation.", "Token rotation. Tile usage billing."),
  V("maps/google-maps", "Google Maps Platform", "Maps, places, routes", "Default maps API.", "API key restrictions. Static vs dynamic maps."),
  V("maps/postgis", "PostGIS", "Spatial extension for Postgres", "Geospatial queries.", "GIST indexes. SRID consistency."),
  V("compliance/ccpa", "CCPA / CPRA", "California privacy", "US state privacy.", "Do not sell link. Opt-out APIs.", ["compliance"], "compliance"),
  V("compliance/lgpd", "LGPD", "Brazil privacy law", "Brazilian users.", "DPO appointment. Legal bases documented.", ["compliance"], "compliance"),
  V("compliance/eu-ai-act", "EU AI Act", "European AI regulation", "AI products in EU.", "Risk classification. Documentation for high-risk.", ["compliance", "ai"], "compliance"),
  V("compliance/nist-csf", "NIST Cybersecurity Framework", "US security framework", "Enterprise security programs.", "Identify, Protect, Detect, Respond, Recover.", ["compliance", "security"], "compliance"),
  V("compliance/ferpa", "FERPA", "US education records privacy", "EdTech US.", "Parent/student access rights. School official exception.", ["compliance", "edtech"], "compliance"),
  V("compliance/coppa", "COPPA", "US children's privacy", "Apps for under-13.", "Parental consent verifiable.", ["compliance"], "compliance"),
];

export const VERTICAL_MISC_PACKS = packsFromDefs(VERTICAL_MISC_PACK_DEFS);
