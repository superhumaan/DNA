import type { ClassifiedIssue } from "@superhumaan/dna-config";
import { buildIssuePayload } from "./issue-payload.js";
import {
  commentOnIssue,
  createIssueFromPayload,
  type GitHubConfig,
} from "./issues.js";
import { createGitHubLabel } from "./github-api.js";

function fingerprintLabel(fingerprint: string): string {
  return `dna-fp-${fingerprint}`;
}

export interface RuntimeIssueResult {
  action: "created" | "deduped" | "dry-run";
  number?: number;
  url?: string;
  fingerprint: string;
}

async function searchOpenIssueByFingerprint(
  config: GitHubConfig,
  fingerprint: string,
): Promise<{ number: number; url: string } | null> {
  if (!config.token) return null;

  const label = fingerprintLabel(fingerprint);
  const q = encodeURIComponent(
    `repo:${config.owner}/${config.repo} label:${label} is:issue is:open`,
  );

  const response = await fetch(`https://api.github.com/search/issues?q=${q}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "dna-by-humaan",
    },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    items: Array<{ number: number; html_url: string }>;
  };

  const first = data.items[0];
  return first ? { number: first.number, url: first.html_url } : null;
}

export async function createOrUpdateRuntimeIssue(
  config: GitHubConfig,
  issue: ClassifiedIssue,
  options: { fingerprint: string; repeatCount: number; dedupe: boolean },
): Promise<RuntimeIssueResult> {
  const payload = buildIssuePayload(issue);
  payload.labels.push(fingerprintLabel(options.fingerprint));

  if (!config.token) {
    return { action: "dry-run", fingerprint: options.fingerprint };
  }

  if (options.dedupe) {
    const existing = await searchOpenIssueByFingerprint(config, options.fingerprint);
    if (existing) {
      await commentOnIssue(
        config,
        existing.number,
        [
          `**+${options.repeatCount} occurrence** of this fingerprinted runtime error.`,
          "",
          issue.summary,
          issue.suspectedCause ? `Suspected cause: ${issue.suspectedCause}` : "",
          issue.suggestedFix ? `Suggested fix: ${issue.suggestedFix}` : "",
          options.repeatCount >= 5
            ? "\n⚠️ **BLOCKER** — repeat threshold exceeded. DNA aggressive repair loop engaged."
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
      return {
        action: "deduped",
        number: existing.number,
        url: existing.url,
        fingerprint: options.fingerprint,
      };
    }
  }

  for (const name of payload.labels) {
    await createGitHubLabel(config.token, config.owner, config.repo, name);
  }

  const result = await createIssueFromPayload(config, payload);
  if ("number" in result) {
    return {
      action: "created",
      number: result.number,
      url: result.url,
      fingerprint: options.fingerprint,
    };
  }

  return { action: "dry-run", fingerprint: options.fingerprint };
}
