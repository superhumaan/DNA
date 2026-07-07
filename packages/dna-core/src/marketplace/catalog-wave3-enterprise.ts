import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const E = (id: string, name: string, desc: string, when: string, how: string, tags: string[]) =>
  def(id, name, desc, when, how, tags, "platforms");

export const WAVE3_ENTERPRISE_PACK_DEFS = [
  E("erp/sap", "SAP", "Enterprise resource planning", "Global manufacturing, finance, supply chain.", "S/4HANA APIs via OData/BAPI. Integration middleware (CPI). Never replicate SAP as system of record.", ["erp", "enterprise"]),
  E("erp/oracle-fusion", "Oracle Fusion Cloud", "Oracle ERP/HCM/SCM suite", "Oracle enterprise customers.", "REST APIs. IDCS auth. Batch interfaces for bulk."),
  E("erp/microsoft-dynamics-365", "Dynamics 365 ERP", "Microsoft business apps", "D365 Finance & Operations integrations.", "Dataverse/OData. Dual-write patterns cautiously."),
  E("hr/greenhouse", "Greenhouse", "Applicant tracking system", "Hiring pipeline integrations.", "Harvest API. Webhooks on candidate stage."),
  E("hr/lever", "Lever", "ATS and recruiting CRM", "High-growth hiring teams.", "REST API. OAuth partner access."),
  E("hr/ashby", "Ashby", "Modern ATS", "Startup recruiting ops.", "GraphQL API. Structured interview plans."),
  E("hr/rippling", "Rippling", "HR, IT, payroll unified", "US/global workforce platform.", "App marketplace API. SCIM for provisioning."),
  E("hr/deel", "Deel", "Global payroll and compliance", "International contractors and EOR.", "Contractor API. Compliance docs per country."),
  E("hr/bamboohr", "BambooHR", "SMB HRIS", "HR records, time off, onboarding.", "API key per company. Webhooks limited — poll where needed."),
  E("hr/gusto", "Gusto", "US payroll and benefits", "Small business payroll.", "Partner API. Embedded payroll flows."),
  E("legal/ironclad", "Ironclad", "Contract lifecycle management", "Legal ops automation.", "Workflow API. Smart clauses. Redlines audit trail."),
  E("legal/legal-hold", "Legal Hold & eDiscovery", "Litigation and compliance holds", "Regulated enterprises.", "Immutable audit. Preserve data without deletion. Chain of custody."),
  E("integrations/workato", "Workato", "Enterprise iPaaS", "Complex multi-system automation.", "Recipes per integration. On-prem agent for SAP."),
  E("integrations/tray-io", "Tray.io", "Low-code enterprise automation", "Citizen integrator + IT governance.", "Workflow versioning. Connector credentials vault."),
  E("integrations/mailgun", "Mailgun", "Transactional email API", "Developer email at scale.", "Domain verification. Event webhooks. EU region option."),
  E("integrations/amazon-ses", "Amazon SES", "AWS email service", "High volume on AWS.", "Sandbox exit. SNS bounce topics. Configuration sets."),
  E("integrations/freshdesk", "Freshdesk", "Support ticketing", "SMB help desk alternative.", "Ticket API. SLA policies in product."),
  E("integrations/iterable", "Iterable", "Cross-channel marketing", "Email, push, SMS campaigns.", "Journey API. User profile sync."),
  E("integrations/google-analytics-4", "Google Analytics 4", "Web analytics", "Marketing attribution.", "GTM + consent mode. Server-side tagging for privacy."),
  E("integrations/agora", "Agora", "Realtime voice and video", "APAC-heavy video apps.", "Token auth. Cloud recording. Channel events."),
  E("integrations/pubnub", "PubNub", "Realtime messaging network", "Global pub/sub without ops.", "Access manager. Message persistence tier."),
  E("integrations/rudderstack", "RudderStack", "Open-source CDP", "Warehouse-first event pipeline.", "Self-host or cloud. Transformations in code."),
  E("integrations/zoom-api", "Zoom API", "Meeting and webinar integrations", "Scheduling + video embed.", "OAuth app. Webhook validation. Recording compliance."),
  E("integrations/confluence-api", "Confluence API", "Documentation sync", "Engineering docs automation.", "REST API v2. Space permissions mirror RBAC."),
  E("integrations/mulesoft", "MuleSoft", "Salesforce enterprise integration", "API-led connectivity layer.", "Anypoint Exchange assets. API manager policies."),
];

export const WAVE3_ENTERPRISE_PACKS = packsFromDefs(WAVE3_ENTERPRISE_PACK_DEFS);
