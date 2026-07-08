import type { ClassifiedIssue, GitHubIssuePayload } from "@superhumaan/dna-config";

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

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: config.token });

  await ensureLabels(octokit, config.owner, config.repo, payload.labels);

  const response = await octokit.issues.create({
    owner: config.owner,
    repo: config.repo,
    title: payload.title,
    body: payload.body,
    labels: payload.labels,
  });

  return {
    number: response.data.number,
    url: response.data.html_url,
  };
}

async function ensureLabels(
  octokit: InstanceType<typeof import("@octokit/rest").Octokit>,
  owner: string,
  repo: string,
  labels: string[],
): Promise<void> {
  for (const name of labels) {
    try {
      await octokit.issues.createLabel({ owner, repo, name, color: "0E8A16" });
    } catch {
      // Label likely exists
    }
  }
}

export async function createBranch(
  config: GitHubConfig,
  branchName: string,
  fromRef = "main",
): Promise<void> {
  if (!config.token) throw new Error("GitHub token required. Set GITHUB_TOKEN env var.");

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: config.token });

  const { data: ref } = await octokit.git.getRef({
    owner: config.owner,
    repo: config.repo,
    ref: `heads/${fromRef}`,
  });

  await octokit.git.createRef({
    owner: config.owner,
    repo: config.repo,
    ref: `refs/heads/${branchName}`,
    sha: ref.object.sha,
  });
}

export async function createPullRequest(
  config: GitHubConfig,
  options: { title: string; body: string; head: string; base?: string },
): Promise<{ number: number; url: string }> {
  if (!config.token) throw new Error("GitHub token required. Set GITHUB_TOKEN env var.");

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: config.token });

  const response = await octokit.pulls.create({
    owner: config.owner,
    repo: config.repo,
    title: options.title,
    body: options.body,
    head: options.head,
    base: options.base ?? "main",
  });

  return { number: response.data.number, url: response.data.html_url };
}

export async function commentOnIssue(
  config: GitHubConfig,
  issueNumber: number,
  body: string,
): Promise<void> {
  if (!config.token) throw new Error("GitHub token required. Set GITHUB_TOKEN env var.");

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: config.token });

  await octokit.issues.createComment({
    owner: config.owner,
    repo: config.repo,
    issue_number: issueNumber,
    body,
  });
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

export async function linkIssueToPr(
  config: GitHubConfig,
  issueNumber: number,
  prNumber: number,
): Promise<void> {
  if (!config.token) return;

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: config.token });

  await octokit.issues.createComment({
    owner: config.owner,
    repo: config.repo,
    issue_number: issueNumber,
    body: `Linked PR #${prNumber}`,
  });
}
