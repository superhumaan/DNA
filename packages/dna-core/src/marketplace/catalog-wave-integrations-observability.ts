import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const N = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["integrations"]);

export const INTEGRATION_PACK_DEFS = [
  N("integrations/twilio", "Twilio", "SMS, voice, verify, video", "2FA, notifications, telehealth video (BAA).", "Webhook signature validation. E.164 numbers. Rate limits."),
  N("integrations/sendgrid", "SendGrid", "Twilio email API", "Transactional email at scale.", "Dynamic templates. Event webhooks for bounces."),
  N("integrations/resend", "Resend", "Developer email API", "Modern DX email for startups.", "React email templates. Domain DNS setup."),
  N("integrations/postmark", "Postmark", "Transactional email", "High deliverability focus.", "Message streams. Bounce API."),
  N("integrations/slack", "Slack", "Team messaging apps", "Notifications, slash commands, workflows.", "OAuth install. Signing secret on requests. Block Kit UI."),
  N("integrations/microsoft-teams", "Microsoft Teams", "Enterprise collaboration", "Microsoft 365 customers.", "Bot Framework. Graph API for tabs."),
  N("integrations/discord", "Discord", "Community bots", "Dev communities, gaming.", "Gateway intents. Interaction endpoints."),
  N("integrations/zapier", "Zapier", "No-code automation", "Customer-facing integrations marketplace.", "REST hooks triggers. OAuth for users."),
  N("integrations/n8n", "n8n", "Self-hosted workflow automation", "Internal ops automation.", "Credentials vault. Webhook nodes."),
  N("integrations/make", "Make (Integromat)", "Visual automation", "SMB automation alternative to Zapier.", "Scenarios, data stores."),
  N("integrations/segment", "Segment", "Customer data platform", "Event routing hub.", "Tracking plan. Destinations per tool. PII classification."),
  N("integrations/posthog", "PostHog", "Product analytics + flags", "Open-source analytics option.", "EU hosting. Cookieless option. Feature flags."),
  N("integrations/mixpanel", "Mixpanel", "Product analytics", "Funnels, retention.", "Identify vs anonymous. Group analytics B2B."),
  N("integrations/amplitude", "Amplitude", "Product intelligence", "Enterprise product analytics.", "Taxonomy governance. Experiment integration."),
  N("integrations/intercom", "Intercom", "Customer messaging", "Support chat, product tours.", "Messenger SDK. Webhooks for conversations."),
  N("integrations/zendesk", "Zendesk", "Support ticketing", "Help desk scale.", "Ticket API. Sunshine conversations."),
  N("integrations/customer-io", "Customer.io", "Lifecycle messaging", "Behavioral email/push.", "Segment integration. Campaign workflows."),
  N("integrations/braze", "Braze", "Enterprise engagement", "Mobile push, email campaigns.", "Canvas journeys. Connected content."),
  N("integrations/cal-com", "Cal.com", "Scheduling infrastructure", "Open-source Calendly alternative.", "Embed booking. Webhooks on book."),
  N("integrations/docusign", "DocuSign", "E-signatures", "Contracts, healthcare consents.", "Envelope API. Embedded signing."),
  N("integrations/notion-api", "Notion API", "Workspace automation", "Docs and databases sync.", "Integration tokens. Rate limits."),
  N("integrations/linear", "Linear", "Issue tracking API", "Engineering workflow sync.", "GraphQL API. GitHub linking."),
  N("integrations/jira", "Jira Cloud", "Atlassian issue tracking", "Enterprise agile.", "REST API v3. Webhooks per project."),
  N("integrations/hubspot-api", "HubSpot API", "CRM and marketing automation", "SMB CRM integrations.", "Private apps OAuth. CRM object sync."),
  N("integrations/salesforce-api", "Salesforce API", "Enterprise CRM", "Sales Cloud integrations.", "Bulk API. Platform events. Governor limits."),
];

export const INTEGRATION_PACKS = packsFromDefs(INTEGRATION_PACK_DEFS);

const O = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["observability"]);

export const OBSERVABILITY_PACK_DEFS = [
  O("observability/datadog", "Datadog", "Full-stack observability SaaS", "APM, logs, RUM, synthetics.", "Unified service tagging. Sensitive data scanner."),
  O("observability/sentry", "Sentry", "Error tracking and performance", "Default error monitoring.", "Source maps upload. Release health."),
  O("observability/grafana-stack", "Grafana Stack", "Prometheus, Loki, Tempo, Grafana", "OSS observability.", "Dashboards as code. Alertmanager routing."),
  O("observability/prometheus", "Prometheus", "Metrics time-series", "K8s metrics standard.", "Histogram buckets. Cardinality control."),
  O("observability/honeycomb", "Honeycomb", "High-cardinality debugging", "Complex distributed systems.", "OpenTelemetry export. BubbleUp anomalies."),
  O("observability/pagerduty", "PagerDuty", "Incident management", "On-call paging.", "Service dependencies. Event orchestration."),
  O("observability/incident-io", "incident.io", "Modern incident response", "Status pages, workflows.", "Slack-native incidents. Postmortems."),
  O("observability/opentelemetry", "OpenTelemetry", "Vendor-neutral telemetry", "Standard tracing/metrics/logs.", "SDK + collector. Semantic conventions."),
  O("observability/new-relic", "New Relic", "APM and observability", "Enterprise APM.", "NRQL queries. Browser monitoring."),
  O("observability/k6", "k6", "Load testing", "Performance testing in CI.", "Thresholds on p95. Cloud distributed runs."),
  O("observability/sonarqube", "SonarQube", "Code quality and SAST", "CI quality gates.", "Quality profiles per language."),
  O("observability/snyk", "Snyk", "Dependency and container scanning", "Supply chain security.", "PR checks. License policies."),
];

export const OBSERVABILITY_PACKS = packsFromDefs(OBSERVABILITY_PACK_DEFS);
