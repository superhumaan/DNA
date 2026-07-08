import { simpleGit } from "simple-git";

export interface ParsedGitHubRemote {
  owner: string;
  repo: string;
  remoteUrl: string;
}

export function parseGitHubRemoteUrl(url: string): ParsedGitHubRemote | null {
  const ssh = url.match(/git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);
  if (ssh) {
    return { owner: ssh[1], repo: ssh[2], remoteUrl: url };
  }

  const https = url.match(/https?:\/\/github\.com\/([^/]+)\/(.+?)(?:\.git)?$/);
  if (https) {
    return { owner: https[1], repo: https[2], remoteUrl: url };
  }

  return null;
}

export async function detectGitHubRemote(
  root: string,
): Promise<ParsedGitHubRemote | null> {
  const git = simpleGit(root);
  if (!(await git.checkIsRepo())) return null;

  try {
    const remotes = await git.getRemotes(true);
    const origin = remotes.find((r) => r.name === "origin") ?? remotes[0];
    if (!origin?.refs?.fetch) return null;
    return parseGitHubRemoteUrl(origin.refs.fetch);
  } catch {
    return null;
  }
}
