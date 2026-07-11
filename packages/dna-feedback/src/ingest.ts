import type { FeedbackPayload } from "@superhumaan/dna-config";
import { DNA_UPSTREAM_REPO } from "@superhumaan/dna-config";
import {
  commentOnIssue,
  createIssueFromPayload,
  type GitHubConfig,
} from "@superhumaan/dna-github";
import { buildUpstreamIssuePayload, fingerprintLabel } from "./upstream-issue.js";

export interface IngestFeedbackResult {
  action: "created" | "deduped" | "dry-run";
  issueNumber?: number;
  issueUrl?: string;
  fingerprint: string;
}

async function searchOpenIssueByFingerprint(
  config: GitHubConfig,
  fingerprint: string,
): Promise<{ number: number; url: string } | null> {
  if (!config.token) return null;

  const label = fingerprintLabel(fingerprint);
  const q = encodeURIComponent(
    `repo:${DNA_UPSTREAM_REPO.owner}/${DNA_UPSTREAM_REPO.repo} label:${label} is:issue is:open`,
  );

  const response = await fetch(`https://api.github.com/search/issues?q=${q}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "dna-by-humaan-feedback",
    },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    items: Array<{ number: number; html_url: string }>;
  };

  const first = data.items[0];
  return first ? { number: first.number, url: first.html_url } : null;
}

export async function ingestFeedback(
  payload: FeedbackPayload,
  options: { token?: string; dryRun?: boolean } = {},
): Promise<IngestFeedbackResult> {
  const ghConfig: GitHubConfig = {
    owner: DNA_UPSTREAM_REPO.owner,
    repo: DNA_UPSTREAM_REPO.repo,
    token: options.token ?? process.env.DNA_FEEDBACK_TOKEN,
  };

  const issuePayload = buildUpstreamIssuePayload(payload);

  if (options.dryRun || !ghConfig.token) {
    return {
      action: "dry-run",
      fingerprint: payload.fingerprint,
    };
  }

  const existing = await searchOpenIssueByFingerprint(ghConfig, payload.fingerprint);

  if (existing) {
    await commentOnIssue(
      ghConfig,
      existing.number,
      [
        `**+1 occurrence** from install \`${payload.installId.slice(0, 8)}…\` (project \`${payload.projectId}\`)`,
        "",
        payload.command ? `Command: \`${payload.command}\`` : "",
        payload.suggestedFix ? `Suggested fix: ${payload.suggestedFix}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );

    return {
      action: "deduped",
      issueNumber: existing.number,
      issueUrl: existing.url,
      fingerprint: payload.fingerprint,
    };
  }

  const created = await createIssueFromPayload(ghConfig, issuePayload);

  if ("dryRun" in created) {
    return { action: "dry-run", fingerprint: payload.fingerprint };
  }

  return {
    action: "created",
    issueNumber: created.number,
    issueUrl: created.url,
    fingerprint: payload.fingerprint,
  };
}
