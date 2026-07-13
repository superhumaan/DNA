import {
  createGitHubBranch,
  createGitHubPullRequest,
  createGitHubIssueComment,
} from "./github-api.js";

export { buildIssuePayload } from "./issue-payload.js";
export {
  createIssue,
  createIssueFromPayload,
  commentOnIssue,
  type GitHubConfig,
  type CreateIssueResult,
} from "./issues.js";

export async function createBranch(
  config: import("./issues.js").GitHubConfig,
  branchName: string,
  fromRef = "main",
): Promise<void> {
  if (!config.token) throw new Error("GitHub token required. Run `dna github login` or set GITHUB_TOKEN.");
  await createGitHubBranch(config.token, config.owner, config.repo, branchName, fromRef);
}

export async function createPullRequest(
  config: import("./issues.js").GitHubConfig,
  options: { title: string; body: string; head: string; base?: string; draft?: boolean },
): Promise<{ number: number; url: string }> {
  if (!config.token) throw new Error("GitHub token required. Run `dna github login` or set GITHUB_TOKEN.");
  const pr = await createGitHubPullRequest(config.token, config.owner, config.repo, options);
  return { number: pr.number, url: pr.html_url };
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
export {
  createOrUpdateRuntimeIssue,
  type RuntimeIssueResult,
} from "./issue-dedup.js";

export async function linkIssueToPr(
  config: import("./issues.js").GitHubConfig,
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
