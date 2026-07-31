/**
 * DNA platform feature catalog — production patterns as knowledge packs.
 * Used by dna plan feature and knowledge packs to guide AI builds.
 */

import {
  DNA_REFERENCE_PROJECT_DEFS,
  getReferenceProject,
  type ReferenceProjectDef,
  type ReferenceProjectId,
} from "./reference-projects.js";

export type { ReferenceProjectDef, ReferenceProjectId };
export {
  DNA_REFERENCE_PROJECT_DEFS,
  resolveReferenceProjects,
  getReferenceProject,
  formatReferencePath,
  formatCodeReference,
  getReferenceRoot,
} from "./reference-projects.js";

/** @deprecated Use `DNA_REFERENCE_PROJECT_DEFS` or `resolveReferenceProjects()`. */
export const HUMAAN_PROJECTS = DNA_REFERENCE_PROJECT_DEFS;

export interface PlatformFeature {
  id: string;
  name: string;
  category: "auth" | "admin" | "integration" | "cloud" | "product" | "ai" | "ops";
  sourceProjects: Array<ReferenceProjectId>;
  description: string;
  knowledgeFiles: string[];
  referencePaths?: Record<string, string>;
}

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: "admin-portal",
    name: "Admin Portal",
    category: "admin",
    sourceProjects: [],
    description: "Full admin shell with nav groups, directory, settings, audit, analytics",
    knowledgeFiles: [
      "platforms/dna/admin-portal.dna.md",
      "platforms/dna/rbac-patterns.dna.md",
    ],
  },
  {
    id: "rbac-permissions",
    name: "RBAC & Permissions",
    category: "auth",
    sourceProjects: [],
    description: "Role hierarchy, capability gates, menu/route/API enforcement",
    knowledgeFiles: [
      "security/rbac-fundamentals.dna.md",
      "security/zero-trust.dna.md",
      "security/ui-surface-checklist.dna.md",
      "platforms/dna/rbac-patterns.dna.md",
    ],
  },
  {
    id: "sso-bridge",
    name: "Cross-App SSO Bridge",
    category: "auth",
    sourceProjects: [],
    description: "Silent SSO between sibling apps via shared JWT + OTT handoff",
    knowledgeFiles: ["integrations/sso-bridge.dna.md"],
  },
  {
    id: "google-oauth-directory",
    name: "Google OAuth + Directory Sync",
    category: "integration",
    sourceProjects: [],
    description: "Google sign-in, Workspace Directory sync, domain lock, role mapping",
    knowledgeFiles: ["integrations/google-directory.dna.md"],
  },
  {
    id: "azure-ad-b2c",
    name: "Azure AD B2C Auth",
    category: "auth",
    sourceProjects: [],
    description: "MSAL client, B2C session exchange, tenant account URL model",
    knowledgeFiles: ["integrations/azure-ad-b2c.dna.md", "cloud/azure.dna.md"],
  },
  {
    id: "mfa-2fa",
    name: "2FA / MFA / OTP",
    category: "auth",
    sourceProjects: [],
    description: "OTP flows, invite-only onboarding, password reset, session cookies",
    knowledgeFiles: ["disciplines/auth-mfa.dna.md"],
  },
  {
    id: "ai-governance",
    name: "AI Governance & Safeguards",
    category: "ai",
    sourceProjects: [],
    description: "Content policy, input guards, quotas, server-proxied models, audit",
    knowledgeFiles: ["platforms/dna/ai-governance.dna.md"],
  },
  {
    id: "feature-flags",
    name: "Feature Flags & Toggles",
    category: "product",
    sourceProjects: [],
    description: "Env toggles, admin KV flags, capability gates — phased rollout pattern",
    knowledgeFiles: ["disciplines/feature-flags.dna.md"],
  },
  {
    id: "feature-management",
    name: "End-to-End Feature Management",
    category: "product",
    sourceProjects: [],
    description: "Initiative→epic→story hierarchy, roadmap, kanban lanes, delivery tracking",
    knowledgeFiles: ["platforms/dna/product-roadmap.dna.md", "disciplines/feature-management.dna.md"],
  },
  {
    id: "surveys-nps-css",
    name: "Survey Programme (CSS + NPS)",
    category: "ops",
    sourceProjects: [],
    description: "Configurable surveys: audience, email, login branding, form builder, scheduler",
    knowledgeFiles: ["platforms/dna/surveys.dna.md"],
  },
  {
    id: "kanban-workspace",
    name: "Kanban Workspace",
    category: "product",
    sourceProjects: [],
    description: "Personal + team boards, swimlanes, DnD, work item drawer, templates",
    knowledgeFiles: ["platforms/dna/kanban-workspace.dna.md"],
  },
  {
    id: "notes-markdown-stt",
    name: "Notes + Markdown + STT",
    category: "product",
    sourceProjects: [],
    description: "Markdown notes, speech-to-text, transcripts, shared scopes, templates",
    knowledgeFiles: ["platforms/dna/notes-stt.dna.md"],
  },
  {
    id: "multi-tenant",
    name: "Multi-Tenant SaaS",
    category: "product",
    sourceProjects: [],
    description: "Tenant isolation, account URL, per-tenant store buckets, provision",
    knowledgeFiles: ["platforms/dna/multi-tenant.dna.md"],
  },
  {
    id: "custom-entities",
    name: "Custom Entity System",
    category: "product",
    sourceProjects: [],
    description: "Configurable entity model, field templates, industry presets, dynamic routes",
    knowledgeFiles: ["platforms/dna/custom-entities.dna.md"],
  },
  {
    id: "gamification",
    name: "Badges & Scoreboards",
    category: "product",
    sourceProjects: [],
    description: "Badge catalog, leaderboards, proximity social features",
    knowledgeFiles: ["platforms/dna/gamification.dna.md"],
  },
  {
    id: "crm-pipeline",
    name: "CRM Pipeline",
    category: "ops",
    sourceProjects: [],
    description: "Pipedrive-style pipeline kanban, deal tracking, BD reporting",
    knowledgeFiles: ["disciplines/crm.dna.md"],
  },
  {
    id: "cms-content",
    name: "CMS & Content Management",
    category: "product",
    sourceProjects: [],
    description: "Admin-managed content, knowledge docs, configurable forms and templates",
    knowledgeFiles: ["disciplines/cms.dna.md"],
  },
  {
    id: "reporting-analytics",
    name: "Reporting & Analytics",
    category: "ops",
    sourceProjects: [],
    description: "Ops reporting, Harvest time, delivery insights, admin KPIs",
    knowledgeFiles: ["platforms/dna/reporting.dna.md"],
  },
  {
    id: "azure-deploy",
    name: "Azure Deployment",
    category: "cloud",
    sourceProjects: [],
    description: "Container Apps, Key Vault, Files share, B2C, Communication Email",
    knowledgeFiles: ["cloud/azure.dna.md"],
  },
  {
    id: "aws-deploy",
    name: "AWS Deployment",
    category: "cloud",
    sourceProjects: [],
    description: "ECS/Fargate, ALB, RDS, Cognito, S3, CloudFront — DNA reference patterns",
    knowledgeFiles: ["cloud/aws.dna.md"],
  },
  {
    id: "vercel-supabase",
    name: "Vercel + Supabase Stack",
    category: "cloud",
    sourceProjects: [],
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
    sourceProjects: [],
    description: "Time tracking sync, delivery insights, epic/story workflow",
    knowledgeFiles: ["integrations/harvest-jira.dna.md"],
  },
  {
    id: "audit-logging",
    name: "Audit Logging",
    category: "admin",
    sourceProjects: [],
    description: "Append-only audit, admin UI, client allowlist, compliance export",
    knowledgeFiles: ["platforms/dna/audit.dna.md"],
  },
];

export function getFeature(id: string): PlatformFeature | undefined {
  return PLATFORM_FEATURES.find((f) => f.id === id);
}

export async function getProject(id: ReferenceProjectId) {
  return getReferenceProject(id);
}

export function featuresForProject(projectId: ReferenceProjectId): PlatformFeature[] {
  return PLATFORM_FEATURES.filter((f) => f.sourceProjects.includes(projectId));
}
