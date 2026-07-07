import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const T = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["frameworks"]);

export const WAVE4_FRONTEND_DESIGN_PACK_DEFS = [
  T("tools/figma-workflow", "Figma → Code Workflow", "Design ops and handoff", "Design system to production pipeline.", "Code Connect. Dev Mode tokens. Component parity checklist."),
  T("tools/uploadcare", "Uploadcare", "File upload and CDN", "User-generated content uploads.", "Signed uploads. Image transformations. Virus scan add-on."),
  T("tools/imgix", "imgix", "Image CDN and processing", "Responsive images at scale.", "URL params for crop/format. Srcset generation."),
  T("tools/web-components", "Web Components", "Custom elements standard", "Framework-agnostic design systems.", "Shadow DOM encapsulation. CE manifests."),
  T("tools/design-tokens", "Design Tokens", "Cross-platform design variables", "Single source for color, spacing, type.", "Style Dictionary export. W3C token format."),
  T("tools/chromatic", "Chromatic", "Visual testing for Storybook", "UI review in CI.", "UI Review workflow. Baseline approvals."),
  T("tools/maestro-cloud", "Maestro Cloud", "Mobile CI testing cloud", "Run Maestro flows in cloud.", "Parallel device runs. PR checks."),
  T("realtime/ffmpeg", "FFmpeg Pipelines", "Video/audio transcoding", "Media processing self-hosted.", "HLS packaging. Thumbnail extraction. Worker queues."),
  T("realtime/cloudflare-stream", "Cloudflare Stream", "Video hosting and live", "Video without managing FFmpeg.", "Signed URLs. Webhooks on ready. Live inputs."),
  T("realtime/agora-extended", "Agora Extended", "APAC realtime RTC depth", "Large-scale live streaming.", "CDN push. Cloud recording. Content moderation hooks."),
  T("realtime/vimeo-api", "Vimeo API", "Video platform integration", "Premium video hosting.", "Upload API. Privacy domains. Stats API."),
  T("realtime/imagekit", "ImageKit", "Image CDN and optimization", "Real-time image transforms.", "URL-based transforms. DAM integration."),
];

export const WAVE4_FRONTEND_DESIGN_PACKS = packsFromDefs(WAVE4_FRONTEND_DESIGN_PACK_DEFS);

const E = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["ecommerce"]);

export const WAVE4_ECOMMERCE_LOGISTICS_PACK_DEFS = [
  E("ecommerce/shopify-hydrogen", "Shopify Hydrogen", "React framework for Shopify", "Headless Shopify storefront.", "Oxygen deploy. Storefront API. Cart mutations."),
  E("ecommerce/elastic-path", "Elastic Path", "Composable commerce API", "Enterprise composable stack.", "Cart merge. Catalog releases. Cortex extensibility."),
  E("ecommerce/amazon-marketplace", "Amazon Marketplace API", "Sell on Amazon", "Marketplace seller integrations.", "SP-API OAuth. Feed submissions. Order sync."),
  E("ecommerce/etsy-api", "Etsy Open API", "Handmade marketplace integration", "Etsy seller tools.", "OAuth2. Listing sync. Receipt webhooks."),
  E("ecommerce/ebay-api", "eBay APIs", "Auction and fixed-price marketplace", "Multi-channel sellers.", "Trading API. Inventory sync. Compliance policies."),
  E("ecommerce/shippo", "Shippo", "Shipping label API", "Multi-carrier shipping.", "Rate shopping. Tracking webhooks. Address validation."),
  E("ecommerce/shipbob", "ShipBob", "3PL fulfilment", "Outsourced pick-pack-ship.", "Inventory API. Webhook fulfilment events."),
  E("ecommerce/square-pos", "Square POS & Retail", "In-person + online retail", "Unified commerce Square.", "Catalog sync. Terminal API. Inventory locations."),
  E("ecommerce/inventory-management", "Inventory Management Patterns", "Stock, reservations, oversell prevention", "Any multi-channel retail.", "Atomic stock decrement. Backorder rules. Cycle counts."),
  E("crm/zoho", "Zoho CRM", "SMB CRM suite", "Zoho ecosystem customers.", "OAuth refresh tokens. Modules API v6."),
  E("crm/zendesk-sell", "Zendesk Sell", "Sales CRM (ex-Base)", "Pipeline CRM in Zendesk family.", "Sync with Support. Smart lists API."),
  E("logistics/flexport", "Flexport", "Freight forwarding platform", "International shipping logistics.", "Shipment API. Customs docs workflow."),
  E("logistics/easypost", "EasyPost", "Shipping API aggregator", "Label generation multi-carrier.", "Tracker webhooks. Address verification."),
];

export const WAVE4_ECOMMERCE_LOGISTICS_PACKS = packsFromDefs(WAVE4_ECOMMERCE_LOGISTICS_PACK_DEFS);
