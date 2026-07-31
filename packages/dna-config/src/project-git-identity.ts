/**
 * Per-project git identity for AI commits, PRs, and repair branches.
 * Defaults from projectId / projectName; override via config.git.
 */

import type { DnaConfig } from "./schemas.js";

export interface ProjectGitIdentity {
  /** Display tag in brackets, e.g. MyApp, DNA */
  tag: string;
  /** Lowercase slug for branch prefixes, e.g. myapp, dna */
  branchSlug: string;
}

/** Well-known open-source project IDs → display tags. */
const KNOWN_PROJECT_TAGS: Record<string, string> = {
  dna: "DNA",
  "dna-by-humaan": "DNA",
};

/** Prefer short branch prefixes for known projects. */
const KNOWN_BRANCH_SLUGS: Record<string, string> = {
  dna: "dna",
  "dna-by-humaan": "dna",
};

function slugifyBranch(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "project";
}

function titleCaseFromSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

/**
 * Resolve project tag + branch slug for commits / PRs / AI repair.
 * Override with `git.projectTag` / `git.branchSlug` in `.DNA/config.dna.json`.
 */
export function resolveProjectGitIdentity(
  config: Pick<DnaConfig, "projectId" | "projectName" | "git">,
): ProjectGitIdentity {
  const idKey = config.projectId.trim().toLowerCase();
  const nameKey = config.projectName.trim().toLowerCase();

  const tag =
    config.git?.projectTag?.trim() ||
    KNOWN_PROJECT_TAGS[idKey] ||
    KNOWN_PROJECT_TAGS[nameKey] ||
    titleCaseFromSlug(config.projectName.trim() || config.projectId.trim() || "project");

  const branchSlug =
    config.git?.branchSlug?.trim() ||
    KNOWN_BRANCH_SLUGS[idKey] ||
    KNOWN_BRANCH_SLUGS[nameKey] ||
    slugifyBranch(config.projectId || config.projectName || tag);

  return { tag, branchSlug };
}

export function formatTaggedCommit(
  identity: ProjectGitIdentity,
  type: string,
  summary: string,
  scope?: string,
): string {
  const scopePart = scope ? `(${scope})` : "";
  return `[${identity.tag}] ${type}${scopePart}: ${summary}`;
}

export function formatTaggedPrTitle(
  identity: ProjectGitIdentity,
  typeLabel: string,
  summary: string,
): string {
  return `[${identity.tag}] ${typeLabel}: ${summary}`;
}

export function formatRepairBranch(
  identity: ProjectGitIdentity,
  fingerprintOrId: string,
): string {
  const short = fingerprintOrId.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 48);
  return `${identity.branchSlug}/fix/${short}`;
}

/** Always-on AI section — inject into workbench / AGENTS / delivery. */
export function projectGitNamingSection(identity: ProjectGitIdentity): string {
  return `## Project git naming (mandatory for AI)

**Project tag:** \`${identity.tag}\` · **Branch slug:** \`${identity.branchSlug}\`
(from \`.DNA/config.dna.json\` — override with \`git.projectTag\` / \`git.branchSlug\`)

| Artifact | Format | Example |
|----------|--------|---------|
| Commit | \`[${identity.tag}] type(scope): summary\` | \`[${identity.tag}] fix(admin): dedupe filter\` |
| PR title | \`[${identity.tag}] Type: summary\` | \`[${identity.tag}] Fix: uncaught exception on /api\` |
| Branch | \`${identity.branchSlug}/type/short-id\` | \`${identity.branchSlug}/fix/abc123\` |

### Rules

- **Always** prefix commits and PR titles with \`[${identity.tag}]\`
- Prefer \`fix\` / \`feat\` / \`docs\` / \`test\` / \`refactor\` — use \`chore\` only for deps, version bumps, or pure tooling
- Keep conventional **type** after the tag so semver tools still parse
- Ship / push examples: \`npx dna github push --message "[${identity.tag}] feat: <summary>"\`
- DNA AI repair must use this tag (never hardcode a different project brand)
`;
}
