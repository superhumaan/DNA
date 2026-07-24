import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { loadDnaConfig } from "../validator.js";
import type { LabRelease } from "./types.js";

const execFileAsync = promisify(execFile);

export interface GitHubReleaseRow extends LabRelease {
  url?: string;
  author?: string;
  prerelease?: boolean;
  source: "github";
}

/** Pull GitHub Releases via `gh api` using DNA GitHub credentials. */
export async function fetchGitHubReleases(root: string, limit = 30): Promise<GitHubReleaseRow[]> {
  const config = await loadDnaConfig(root);
  const owner = config?.github?.owner;
  const repo = config?.github?.repo;
  if (!owner || !repo) return [];

  try {
    const { stdout } = await execFileAsync(
      "gh",
      ["api", `repos/${owner}/${repo}/releases?per_page=${Math.min(100, Math.max(1, limit))}`],
      { cwd: root, timeout: 20_000, maxBuffer: 4 * 1024 * 1024 },
    );
    const arr = JSON.parse(stdout) as Array<Record<string, unknown>>;
    if (!Array.isArray(arr)) return [];
    return arr.map((raw, i) => {
      const authorObj = raw.author as { login?: string } | undefined;
      return {
        id: String(raw.id ?? i),
        version: String(raw.tag_name || raw.name || "unknown"),
        environment: raw.prerelease ? "prerelease" : "production",
        deployedAt: String(raw.published_at || new Date(0).toISOString()),
        notes: String(raw.body || "").slice(0, 500) || undefined,
        gitSha: undefined,
        url: typeof raw.html_url === "string" ? raw.html_url : undefined,
        author: authorObj?.login,
        prerelease: Boolean(raw.prerelease),
        source: "github" as const,
      };
    });
  } catch {
    return [];
  }
}
