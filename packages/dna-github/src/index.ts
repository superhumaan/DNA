import type { ClassifiedIssue, GitHubIssuePayload } from "@superhumaan/dna-config";
import {
  createGitHubBranch,
  createGitHubIssue,
  createGitHubIssueComment,
  createGitHubLabel,
  createGitHubPullRequest,
} from "./github-api.js";

export function buildIssuePayload(issue: ClassifiedIssue): GitHubIssuePayload {
  const labels = [
    "dna",
    `severity:${issue.severity}`,
    `category:${issue.category}`,
    `discipline:${issue.discipline}`,
  ];

  const body = [
    "## Summary",
    issue.summary,
    "",
    "## Classification",
    `- **Severity:** ${issue.severity}`,
    `- **Category:** ${issue.category}`,
    `- **Discipline:** ${issue.discipline}`,
    `- **Confidence:** ${(issue.confidence * 100).toFixed(0)}%`,
    `- **Repeated:** ${issue.repeated ? "yes" : "no"}`,
    `- **Behaviour violation:** ${issue.behaviourViolation ? "yes" : "no"}`,
    "",
    issue.endpoint ? `## Impacted Endpoint\n\`${issue.endpoint}\`\n` : "",
    issue.stackTraceSummary
      ? `## Stack Trace Summary\n\`\`\`\n${issue.stackTraceSummary}\n\`\`\`\n`
      : "",
    issue.suspectedCause ? `## Suspected Cause\n${issue.suspectedCause}\n` : "",
    issue.relevantBehaviour.length
      ? `## Relevant Behaviour\n${issue.relevantBehaviour.map((b) => `- ${b}`).join("\n")}\n`
      : "",
    issue.relevantMemory.length
      ? `## Relevant CellularMemory\n${issue.relevantMemory.map((m) => `- ${m}`).join("\n")}\n`
      : "",
    issue.suggestedFix ? `## Suggested Fix\n${issue.suggestedFix}\n` : "",
    issue.testRecommendation ? `## Test Recommendation\n${issue.testRecommendation}\n` : "",
    issue.reproductionNotes ? `## Reproduction\n${issue.reproductionNotes}\n` : "",
    "",
    "---",
    "_Created by [DNA by Humaan](https://github.com/humaan/dna)_",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title: issue.title,
    body,
    labels,
  };
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  token?: string;
}

export interface CreateIssueResult {
  number: number;
  url: string;
}

export async function createIssue(
  config: GitHubConfig,
  issue: ClassifiedIssue,
): Promise<CreateIssueResult | { dryRun: true; payload: GitHubIssuePayload }> {
  const payload = buildIssuePayload(issue);

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

export async function createBranch(
  config: GitHubConfig,
  branchName: string,
  fromRef = "main",
): Promise<void> {
  if (!config.token) throw new Error("GitHub token required. Run `dna github login` or set GITHUB_TOKEN.");
  await createGitHubBranch(config.token, config.owner, config.repo, branchName, fromRef);
}

export async function createPullRequest(
  config: GitHubConfig,
  options: { title: string; body: string; head: string; base?: string; draft?: boolean },
): Promise<{ number: number; url: string }> {
  if (!config.token) throw new Error("GitHub token required. Run `dna github login` or set GITHUB_TOKEN.");
  const pr = await createGitHubPullRequest(config.token, config.owner, config.repo, options);
  return { number: pr.number, url: pr.html_url };
}

export async function commentOnIssue(
  config: GitHubConfig,
  issueNumber: number,
  body: string,
): Promise<void> {
  if (!config.token) throw new Error("GitHub token required. Run `dna github login` or set GITHUB_TOKEN.");
  await createGitHubIssueComment(config.token, config.owner, config.repo, issueNumber, body);
}

export function getTokenFromEnv(): string | undefined {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
}

export {
  loginWithWebFlow,
  resolveGitHubToken,
  requireGitHubToken,
  loadStoredCredentials,
  GITHUB_SCOPES,
  type GitHubCredentials,
  type GitHubLoginResult,
} from "./auth.js";
export { detectGitHubRemote, parseGitHubRemoteUrl, type ParsedGitHubRemote } from "./git-remote.js";
export { pushFeatureToGitHub, type PushFeatureOptions, type PushFeatureResult } from "./push.js";
export { DNA_OAUTH_CLIENT_ID, isPlaceholderClientId } from "./oauth-config.js";
export { git, type Git, type GitStatus } from "./git.js";

export async function linkIssueToPr(
  config: GitHubConfig,
  issueNumber: number,
  prNumber: number,
): Promise<void> {
  if (!config.token) return;
  await createGitHubIssueComment(
    config.token,
    config.owner,
    config.repo,
    issueNumber,
    `Linked PR #${prNumber}`,
  );
}
