import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const A = (id: string, name: string, desc: string, when: string, how: string) =>
  def(id, name, desc, when, how, ["auth"]);

export const WAVE4_AUTH_SECURITY_PACK_DEFS = [
  A("auth/magic-link", "Magic.link", "Passwordless auth SDK", "Email magic link login.", "DID token validation. Admin API for users."),
  A("auth/tailscale", "Tailscale", "Zero Trust mesh VPN", "Secure internal service access.", "ACL tags. Subnet routers. SSH over tailnet."),
  A("auth/waf-bot-protection", "WAF & Bot Protection", "Edge security patterns", "DDoS, scraping, credential stuffing.", "Cloudflare Bot Fight. Vercel Firewall. Rate limit + challenge."),
  A("auth/fido-hardware-keys", "FIDO & Hardware Keys", "Hardware security keys", "High-assurance auth.", "WebAuthn resident keys. YubiKey enrollment flows."),
  A("auth/pam-break-glass", "PAM & Break-Glass Access", "Privileged access management", "Emergency admin access.", "Time-bound elevation. Session recording. Approval workflow."),
  A("auth/azure-communication", "Azure Communication Services", "SMS/email/voice on Azure", "Microsoft stack notifications.", "Connection strings rotated. Event Grid delivery."),
  A("payments/stripe-issuing", "Stripe Issuing", "Card issuing platform", "Virtual/physical cards for users.", "Cardholder KYC. Authorization webhooks. Spending controls."),
  A("payments/revenue-recognition", "ASC 606 Revenue Recognition", "SaaS revenue accounting patterns", "Enterprise finance compliance.", "Deferred revenue schedules. Performance obligations. Audit trail."),
  A("compliance/sox", "SOX Controls", "Sarbanes-Oxley IT controls", "Public company financial systems.", "Change management. Segregation of duties. Audit logs immutable."),
  A("compliance/pci-dss-depth", "PCI DSS Depth", "Payment card industry full scope", "Beyond SAQ A merchant scope.", "Network segmentation. ASV scans. QSA assessment path."),
  A("compliance/cjis", "CJIS Security Policy", "US criminal justice data", "Law enforcement software.", "FBI CJIS audit. Background checks for admins. Encryption FIPS 140-2."),
  A("compliance/il5-il6", "IL5 / IL6 DoD Cloud", "US defense impact levels", "DoD workloads.", "IL5 authorized clouds only. DISA STIGs. CAC auth."),
  A("compliance/pipeda-depth", "PIPEDA Engineering Depth", "Canadian privacy implementation", "Beyond overview checklist.", "Breach notification 72h. Accountability principle docs."),
  A("security/pen-test-process", "Penetration Testing Process", "Security assessment lifecycle", "Annual pen test programs.", "Scope definition. Remediation SLAs. Retest validation."),
  A("security/bug-bounty", "Bug Bounty Programs", "Coordinated vulnerability disclosure", "Public-facing security posture.", "HackerOne/Bugcrowd. Safe harbor policy. Triage SLAs."),
  A("security/owasp-asvs", "OWASP ASVS", "Application security verification", "Security requirements checklist.", "Level 2 for SaaS. Map to test cases."),
];

export const WAVE4_AUTH_SECURITY_PACKS = packsFromDefs(WAVE4_AUTH_SECURITY_PACK_DEFS);

const N = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["integrations"]);

export const WAVE4_INTEGRATIONS_PACK_DEFS = [
  N("integrations/calendly", "Calendly", "Scheduling embed and API", "Sales demo booking.", "Webhook on invitee.created. Embed widget."),
  N("integrations/hellosign", "Dropbox Sign (HelloSign)", "E-signature API", "Contract signing flows.", "Embedded signing. Test mode. Callback URL validation."),
  N("integrations/mailchimp", "Mailchimp", "Email marketing", "Newsletters and campaigns.", "Audience sync. Tag segmentation. GDPR consent."),
  N("integrations/hubspot-marketing", "HubSpot Marketing Hub", "Inbound marketing automation", "Lead nurturing.", "Forms API. Workflow enrollments. Tracking code."),
  N("integrations/google-workspace", "Google Workspace APIs", "Gmail, Drive, Calendar, Directory", "Google enterprise integrations.", "Domain-wide delegation. OAuth scopes minimal."),
  N("integrations/microsoft-graph", "Microsoft Graph API", "Microsoft 365 integration", "Outlook, Teams, SharePoint.", "Application vs delegated permissions. Throttling handling."),
  N("integrations/stripe-apps", "Stripe Apps", "Ecosystem inside Stripe Dashboard", "Stripe marketplace apps.", "UI extension SDK. Secret store API."),
  N("integrations/plaid-assets", "Plaid Assets & Income", "Extended Plaid products", "Mortgage, lending underwriting.", "Asset reports. Income verification webhooks."),
  N("integrations/twilio-flex", "Twilio Flex", "Contact center platform", "Omnichannel support.", "TaskRouter workflows. Plugin framework."),
  N("integrations/amplitude-experiment", "Amplitude Experiment", "A/B testing platform", "Product experimentation.", "Flag key governance. Exposure events."),
  N("integrations/optimizely", "Optimizely", "Feature flags and experimentation", "Enterprise experimentation.", "Full Stack SDK. Audience targeting."),
  N("integrations/contentful-webhooks", "Contentful Webhooks Depth", "CMS event-driven rebuilds", "Headless CMS automation.", "HMAC signature. Retry handling. Preview vs delivery."),
];

export const WAVE4_INTEGRATIONS_PACKS = packsFromDefs(WAVE4_INTEGRATIONS_PACK_DEFS);
