/**
 * Lab URL helpers — path-based deep links for the Lab SPA.
 * Client JS in dashboard.ts mirrors this algorithm (keep in sync).
 */

export const LAB_TAB_IDS = [
  "overview",
  "issues",
  "events",
  "performance",
  "releases",
  "sourcemaps",
  "reports",
  "coverage",
  "ci",
  "apis",
  "doctor",
  "installs",
  "impressions",
  "memory",
] as const;

export type LabTabId = (typeof LAB_TAB_IDS)[number];

const LEGACY_TABS: Record<string, LabTabId> = { quality: "reports" };

export interface LabRoute {
  tab: LabTabId;
  issueId: string | null;
  /** True when path had no tab segment (bare /labs) */
  bare: boolean;
}

export function normalizeLabTab(tab: string | null | undefined): LabTabId {
  const raw = String(tab || "").trim();
  const id = (LEGACY_TABS[raw] || raw) as string;
  return (LAB_TAB_IDS as readonly string[]).includes(id) ? (id as LabTabId) : "overview";
}

export function normalizeLabBasePath(labPath: string | null | undefined): string {
  const raw = String(labPath || "/labs").trim() || "/labs";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/, "") || "/labs";
}

export function parseLabLocation(pathname: string, labPath?: string | null): LabRoute {
  const base = normalizeLabBasePath(labPath);
  const path = String(pathname || "/").split("?")[0].split("#")[0] || "/";
  if (path === base || path === `${base}/`) {
    return { tab: "overview", issueId: null, bare: true };
  }
  if (!path.startsWith(`${base}/`)) {
    return { tab: "overview", issueId: null, bare: true };
  }
  const parts = path
    .slice(base.length + 1)
    .split("/")
    .filter(Boolean)
    .map((p) => {
      try {
        return decodeURIComponent(p);
      } catch {
        return p;
      }
    });
  if (!parts.length) return { tab: "overview", issueId: null, bare: true };
  if (parts[0] === "issues" && parts[1]) {
    return { tab: "issues", issueId: parts[1], bare: false };
  }
  return { tab: normalizeLabTab(parts[0]), issueId: null, bare: false };
}

export function buildLabPath(
  labPath: string | null | undefined,
  tab: string | null | undefined,
  issueId?: string | null,
): string {
  const base = normalizeLabBasePath(labPath);
  const t = normalizeLabTab(tab);
  if (issueId && t === "issues") {
    return `${base}/issues/${encodeURIComponent(issueId)}`;
  }
  if (t === "overview") return `${base}/overview`;
  return `${base}/${t}`;
}

export function isUnauthorizedMessage(message: string | null | undefined): boolean {
  const m = String(message || "").trim().toLowerCase();
  return m === "unauthorized" || m === "401" || m.endsWith("unauthorized");
}
