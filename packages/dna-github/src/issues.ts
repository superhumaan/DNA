import type { ClassifiedIssue, GitHubIssuePayload } from "@superhumaan/dna-config";
import { buildIssuePayload } from "./issue-payload.js";
import {
  createGitHubIssue,
  createGitHubIssueComment,
  createGitHubLabel,
} from "./github-api.js";

export interface GitHubConfig {
  owner: string;
  repo: string;
  token?: string;
}

export interface CreateIssueResult {
  number: number;
  url: string;
}

export async function createIssueFromPayload(
  config: GitHubConfig,
  payload: GitHubIssuePayload,
): Promise<CreateIssueResult | { dryRun: true; payload: GitHubIssuePayload }> {
  if (!config.token) {
    return { dryRun: true, payload };
  }

  for (const name of payload.labels) {
    await createGitHubLabel(config.token, config.owner, config.repo, name);
  }

  const response = await createGitHubIssue(config.token, config.owner, config.repo, payload);

  return {
    number: response.number,
    url: response.html_url,
  };
}

export async function createIssue(
  config: GitHubConfig,
  issue: ClassifiedIssue,
): Promise<CreateIssueResult | { dryRun: true; payload: GitHubIssuePayload }> {
  return createIssueFromPayload(config, buildIssuePayload(issue));
}

export async function commentOnIssue(
  config: GitHubConfig,
  issueNumber: number,
  body: string,
): Promise<void> {
  if (!config.token) throw new Error("GitHub token required. Run `dna github login` or set GITHUB_TOKEN.");
  await createGitHubIssueComment(config.token, config.owner, config.repo, issueNumber, body);
}
