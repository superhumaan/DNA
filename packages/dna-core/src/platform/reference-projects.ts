import { access } from "node:fs/promises";
import { isAbsolute, join } from "node:path";

export const DNA_REFERENCE_ROOT_VAR = "DNA_REFERENCE_ROOT";

export type ReferenceProjectId = "aistudio" | "colorparty" | "humaan" | "soli";

export interface ReferenceProjectDef {
  id: ReferenceProjectId;
  name: string;
  /** Default folder name under `DNA_REFERENCE_ROOT`. */
  repoDir: string;
  stack: string;
  highlights: string[];
}

export interface ReferenceProject extends ReferenceProjectDef {
  /** Resolved absolute path when `DNA_REFERENCE_ROOT` is set; otherwise `repoDir`. */
  path: string;
  pathAvailable: boolean;
}

export const DNA_REFERENCE_PROJECT_DEFS: ReferenceProjectDef[] = [
  {
    id: "aistudio",
    name: "AI Studio",
    repoDir: "AIStudio",
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
    repoDir: "ColorParty",
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
    repoDir: "Humaan",
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
    repoDir: "Soli",
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

export function getReferenceRoot(): string | undefined {
  const value = process.env[DNA_REFERENCE_ROOT_VAR]?.trim();
  return value || undefined;
}

export function formatReferencePath(project: ReferenceProject): string {
  const rootConfigured = project.path !== project.repoDir || isAbsolute(project.path);
  if (!rootConfigured) {
    return `${project.repoDir}/ (set ${DNA_REFERENCE_ROOT_VAR} to locate on disk)`;
  }
  if (!project.pathAvailable) {
    return `${project.path} (not found)`;
  }
  return project.path;
}

export function formatCodeReference(
  project: ReferenceProject | undefined,
  relativePath: string,
): string {
  if (!project) return `\`${relativePath}\``;
  if (project.pathAvailable) {
    return `\`${relativePath}\` in ${project.path}`;
  }
  return `\`${relativePath}\` in \`${project.repoDir}/\` under ${DNA_REFERENCE_ROOT_VAR}`;
}

export async function resolveReferenceProjects(
  referenceRoot?: string,
): Promise<ReferenceProject[]> {
  const base = referenceRoot ?? getReferenceRoot();
  const projects: ReferenceProject[] = [];

  for (const def of DNA_REFERENCE_PROJECT_DEFS) {
    const path = base ? join(base, def.repoDir) : def.repoDir;
    let pathAvailable = false;
    if (base) {
      try {
        await access(path);
        pathAvailable = true;
      } catch {
        pathAvailable = false;
      }
    }
    projects.push({ ...def, path, pathAvailable });
  }

  return projects;
}

export async function getReferenceProject(
  id: ReferenceProjectId,
  referenceRoot?: string,
): Promise<ReferenceProject | undefined> {
  const projects = await resolveReferenceProjects(referenceRoot);
  return projects.find((p) => p.id === id);
}
