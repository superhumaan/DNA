/**
 * Humaan platform reference — distilled from production projects.
 * Used by dna plan feature and knowledge packs to guide AI builds.
 */

export interface PlatformFeature {
  id: string;
  name: string;
  category: "auth" | "admin" | "integration" | "cloud" | "product" | "ai" | "ops";
  sourceProjects: Array<"aistudio" | "colorparty" | "humaan" | "soli">;
  description: string;
  knowledgeFiles: string[];
  referencePaths?: Record<string, string>;
}

export interface PlatformProject {
  id: "aistudio" | "colorparty" | "humaan" | "soli";
  name: string;
  path: string;
  stack: string;
  highlights: string[];
}

export const HUMAAN_PROJECTS: PlatformProject[] = [
  {
    id: "aistudio",
    name: "AI Studio",
    path: "/Users/place/Desktop/Projects/AIStudio",
    stack: "React 19, Express 5, SQLite, Azure Container Apps, OpenAI/Gemini",
    highlights: [
      "Custom GPT with clinical safeguards and content policy",
      "Admin portal: directory, AI governance, audit, analytics",
      "Azure AD B2C SSO + local OTP auth",
      "RBAC: owner/admin/employee",
      "Usage quotas, rate limits, knowledge ingest",
    ],
  },
  {
    id: "colorparty",
    name: "ColorParty",
    path: "/Users/place/Desktop/Projects/ColorParty",
    stack: "React 18, Express, Supabase, Vercel, Google OAuth",
    highlights: [
      "Location-based proximity praise canvas",
      "Badges, scoreboards, gamification",
      "Invitrace SSO bridge (cross-subdomain JWT)",
      "Google Directory sync",
      "Admin: live map, users, feedback, profanity policy",
    ],
  },
  {
    id: "humaan",
    name: "Humaan Operations",
    path: "/Users/place/Desktop/Projects/Humaan",
    stack: "React 18, Express, Supabase, Vercel, Google/Harvest/Jira/Pipedrive",
    highlights: [
      "Operational dashboard: pipeline, delivery, reporting",
      "ProdPad alternative: products, initiatives, epics, roadmap",
      "CSS/NPS survey programmes with full customisation",
      "Google Directory sync, permission matrix RBAC",
      "Admin portal: org, reports config, audit",
    ],
  },
  {
    id: "soli",
    name: "Soli",
    path: "/Users/place/Desktop/Projects/Soli",
    stack: "React 18, Express 5, multi-tenant, Azure SQL/B2C",
    highlights: [
      "Notes + markdown + speech-to-text",
      "Kanban personal + team boards",
      "Multi-tenant workspaces, custom entities",
      "Shared team tasks, team schedules",
      "Admin portal: users, entity templates, data export",
    ],
  },
];

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: "admin-portal",
    name: "Admin Portal",
    category: "admin",
    sourceProjects: ["aistudio", "colorparty", "humaan", "soli"],
    description: "Full admin shell with nav groups, directory, settings, audit, analytics",
    knowledgeFiles: [
      "platforms/humaan/admin-portal.dna.md",
      "platforms/humaan/rbac-patterns.dna.md",
    ],
    referencePaths: {
      aistudio: "src/admin/AdminPortal.jsx",
      colorparty: "src/admin/AdminPortal.jsx",
      humaan: "src/admin/AdminPortal.jsx",
      soli: "src/portal/PortalShell.jsx",
    },
  },
  {
    id: "rbac-permissions",
    name: "RBAC & Permissions",
    category: "auth",
    sourceProjects: ["aistudio", "colorparty", "humaan", "soli"],
    description: "Role hierarchy, capability gates, menu/route/API enforcement",
    knowledgeFiles: [
      "security/rbac-fundamentals.dna.md",
      "security/zero-trust.dna.md",
      "security/ui-surface-checklist.dna.md",
      "platforms/humaan/rbac-patterns.dna.md",
    ],
  },
  {
    id: "sso-bridge",
    name: "Cross-App SSO Bridge",
    category: "auth",
    sourceProjects: ["colorparty", "humaan"],
    description: "Silent SSO between *.humaan.app apps via shared JWT + OTT handoff",
    knowledgeFiles: ["integrations/sso-bridge.dna.md"],
    referencePaths: {
      colorparty: "src/utils/invitraceSsoBridge.js",
      humaan: "src/pages/SsoBridge.jsx",
    },
  },
  {
    id: "google-oauth-directory",
    name: "Google OAuth + Directory Sync",
    category: "integration",
    sourceProjects: ["colorparty", "humaan"],
    description: "Google sign-in, Workspace Directory sync, domain lock, role mapping",
    knowledgeFiles: ["integrations/google-directory.dna.md"],
    referencePaths: {
      colorparty: "backend/lib/googleSync.js",
      humaan: "backend/google-sync.js",
    },
  },
  {
    id: "azure-ad-b2c",
    name: "Azure AD B2C Auth",
    category: "auth",
    sourceProjects: ["aistudio", "soli"],
    description: "MSAL client, B2C session exchange, tenant account URL model",
    knowledgeFiles: ["integrations/azure-ad-b2c.dna.md", "cloud/azure.dna.md"],
    referencePaths: {
      aistudio: "server/routes/auth/b2c.js",
      soli: "react-app/server/auth/config.js",
    },
  },
  {
    id: "mfa-2fa",
    name: "2FA / MFA / OTP",
    category: "auth",
    sourceProjects: ["aistudio", "soli"],
    description: "OTP flows, invite-only onboarding, password reset, session cookies",
    knowledgeFiles: ["disciplines/auth-mfa.dna.md"],
    referencePaths: { aistudio: "server/routes/auth/loginRoutes.js" },
  },
  {
    id: "ai-governance",
    name: "AI Governance & Safeguards",
    category: "ai",
    sourceProjects: ["aistudio"],
    description: "Content policy, input guards, quotas, server-proxied models, audit",
    knowledgeFiles: ["platforms/aistudio/ai-governance.dna.md"],
    referencePaths: { aistudio: "server/ai/chatHandler.js" },
  },
  {
    id: "feature-flags",
    name: "Feature Flags & Toggles",
    category: "product",
    sourceProjects: ["aistudio", "humaan"],
    description: "Env toggles, admin KV flags, capability gates — phased rollout pattern",
    knowledgeFiles: ["disciplines/feature-flags.dna.md"],
  },
  {
    id: "feature-management",
    name: "End-to-End Feature Management",
    category: "product",
    sourceProjects: ["humaan"],
    description: "Initiative→epic→story hierarchy, roadmap, kanban lanes, delivery tracking",
    knowledgeFiles: ["platforms/humaan/product-roadmap.dna.md", "disciplines/feature-management.dna.md"],
    referencePaths: { humaan: "docs/delivery/features/products-and-roadmap/" },
  },
  {
    id: "surveys-nps-css",
    name: "Survey Programme (CSS + NPS)",
    category: "ops",
    sourceProjects: ["humaan"],
    description: "Configurable surveys: audience, email, login branding, form builder, scheduler",
    knowledgeFiles: ["platforms/humaan/surveys.dna.md"],
    referencePaths: { humaan: "src/pages/surveys/" },
  },
  {
    id: "kanban-workspace",
    name: "Kanban Workspace",
    category: "product",
    sourceProjects: ["soli", "humaan"],
    description: "Personal + team boards, swimlanes, DnD, work item drawer, templates",
    knowledgeFiles: ["platforms/soli/kanban-workspace.dna.md"],
    referencePaths: { soli: "react-app/src/pages/workspace/WorkBoardView.jsx" },
  },
  {
    id: "notes-markdown-stt",
    name: "Notes + Markdown + STT",
    category: "product",
    sourceProjects: ["soli"],
    description: "Markdown notes, speech-to-text, transcripts, shared scopes, templates",
    knowledgeFiles: ["platforms/soli/notes-stt.dna.md"],
  },
  {
    id: "multi-tenant",
    name: "Multi-Tenant SaaS",
    category: "product",
    sourceProjects: ["aistudio", "soli"],
    description: "Tenant isolation, account URL, per-tenant store buckets, provision",
    knowledgeFiles: ["platforms/humaan/multi-tenant.dna.md"],
  },
  {
    id: "custom-entities",
    name: "Custom Entity System",
    category: "product",
    sourceProjects: ["soli"],
    description: "Configurable entity model, field templates, industry presets, dynamic routes",
    knowledgeFiles: ["platforms/soli/custom-entities.dna.md"],
  },
  {
    id: "gamification",
    name: "Badges & Scoreboards",
    category: "product",
    sourceProjects: ["colorparty"],
    description: "Badge catalog, leaderboards, proximity social features",
    knowledgeFiles: ["platforms/colorparty/gamification.dna.md"],
  },
  {
    id: "crm-pipeline",
    name: "CRM Pipeline",
    category: "ops",
    sourceProjects: ["humaan"],
    description: "Pipedrive-style pipeline kanban, deal tracking, BD reporting",
    knowledgeFiles: ["disciplines/crm.dna.md"],
    referencePaths: { humaan: "backend/routes/pipeline.js" },
  },
  {
    id: "cms-content",
    name: "CMS & Content Management",
    category: "product",
    sourceProjects: ["humaan", "aistudio"],
    description: "Admin-managed content, knowledge docs, configurable forms and templates",
    knowledgeFiles: ["disciplines/cms.dna.md"],
  },
  {
    id: "reporting-analytics",
    name: "Reporting & Analytics",
    category: "ops",
    sourceProjects: ["humaan", "aistudio", "colorparty"],
    description: "Ops reporting, Harvest time, delivery insights, admin KPIs",
    knowledgeFiles: ["platforms/humaan/reporting.dna.md"],
  },
  {
    id: "azure-deploy",
    name: "Azure Deployment",
    category: "cloud",
    sourceProjects: ["aistudio", "soli"],
    description: "Container Apps, Key Vault, Files share, B2C, Communication Email",
    knowledgeFiles: ["cloud/azure.dna.md"],
    referencePaths: { aistudio: "infra/terraform/" },
  },
  {
    id: "aws-deploy",
    name: "AWS Deployment",
    category: "cloud",
    sourceProjects: [],
    description: "ECS/Fargate, ALB, RDS, Cognito, S3, CloudFront — Humaan reference patterns",
    knowledgeFiles: ["cloud/aws.dna.md"],
  },
  {
    id: "vercel-supabase",
    name: "Vercel + Supabase Stack",
    category: "cloud",
    sourceProjects: ["colorparty", "humaan"],
    description: "Vercel FE+BE, Supabase Postgres, Upstash Redis, cron jobs",
    knowledgeFiles: ["cloud/vercel-supabase.dna.md"],
  },
  {
    id: "nginx-reverse-proxy",
    name: "Nginx Reverse Proxy",
    category: "integration",
    sourceProjects: [],
    description: "TLS termination, upstream routing, WebSocket, rate limits, custom headers",
    knowledgeFiles: ["integrations/nginx.dna.md"],
  },
  {
    id: "harvest-jira-integrations",
    name: "Harvest + Jira Integrations",
    category: "integration",
    sourceProjects: ["humaan"],
    description: "Time tracking sync, delivery insights, epic/story workflow",
    knowledgeFiles: ["integrations/harvest-jira.dna.md"],
  },
  {
    id: "audit-logging",
    name: "Audit Logging",
    category: "admin",
    sourceProjects: ["aistudio", "humaan", "soli"],
    description: "Append-only audit, admin UI, client allowlist, compliance export",
    knowledgeFiles: ["platforms/humaan/audit.dna.md"],
  },
];

export function getFeature(id: string): PlatformFeature | undefined {
  return PLATFORM_FEATURES.find((f) => f.id === id);
}

export function getProject(id: PlatformFeature["sourceProjects"][number]): PlatformProject | undefined {
  return HUMAAN_PROJECTS.find((p) => p.id === id);
}

export function featuresForProject(projectId: PlatformFeature["sourceProjects"][number]): PlatformFeature[] {
  return PLATFORM_FEATURES.filter((f) => f.sourceProjects.includes(projectId));
}
