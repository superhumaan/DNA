import { isAbsolute } from "node:path";

export const DNA_REFERENCE_ROOT_VAR = "DNA_REFERENCE_ROOT";

/** @deprecated Use feature ids via `dna platform list`. */
export type ReferenceProjectId = string;

/** @deprecated Unused. */
export const REFERENCE_PROJECT_ALIASES: Record<string, string> = {};

export function normalizeReferenceProjectId(id: string | undefined): string | undefined {
  return id?.trim() || undefined;
}

export interface ReferenceProjectDef {
  id: string;
  name: string;
  repoDir: string;
  stack: string;
  highlights: string[];
}

export interface ReferenceProject extends ReferenceProjectDef {
  path: string;
  pathAvailable: boolean;
}

/** Reserved. */
export const DNA_REFERENCE_PROJECT_DEFS: ReferenceProjectDef[] = [];

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
  _referenceRoot?: string,
): Promise<ReferenceProject[]> {
  return [];
}

export async function getReferenceProject(
  _id: string,
  _referenceRoot?: string,
): Promise<ReferenceProject | undefined> {
  return undefined;
}
