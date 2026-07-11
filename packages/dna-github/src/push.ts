import { git } from "./git.js";
import { requireGitHubToken } from "./auth.js";
import { detectGitHubRemote } from "./git-remote.js";

export interface PushFeatureOptions {
  root: string;
  message?: string;
  branch?: string;
  /** Create branch from current HEAD if not on a feature branch */
  createBranch?: boolean;
}

export interface PushFeatureResult {
  branch: string;
  pushed: boolean;
  committed: boolean;
  remoteUrl: string;
  owner: string;
  repo: string;
}

function slugifyBranch(text: string): string {
  return (
    "feature/" +
    (text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "dna-update")
  );
}

function tokenRemoteUrl(remoteUrl: string, token: string): string {
  if (remoteUrl.startsWith("git@")) {
    return remoteUrl;
  }
  const parsed = remoteUrl.match(/https?:\/\/github\.com\/(.+)/);
  if (parsed) {
    return `https://x-access-token:${token}@github.com/${parsed[1]}`;
  }
  return remoteUrl;
}

export async function pushFeatureToGitHub(
  options: PushFeatureOptions,
): Promise<PushFeatureResult> {
  const { root, message = "feat: DNA feature factory delivery" } = options;
  const g = git(root);

  if (!(await g.checkIsRepo())) {
    throw new Error("Not a git repository — run `git init` first");
  }

  const remote = await detectGitHubRemote(root);
  if (!remote) {
    throw new Error(
      "No GitHub remote found — add origin: git remote add origin git@github.com:owner/repo.git",
    );
  }

  const token = await requireGitHubToken();
  const status = await g.status();
  let branch = options.branch ?? status.current ?? "main";

  if (options.createBranch && (branch === "main" || branch === "master")) {
    branch = slugifyBranch(message);
    await g.checkoutLocalBranch(branch);
  }

  let committed = false;
  if (status.files.length > 0) {
    await g.add(status.files.map((f) => f.path));
    await g.commit(message);
    committed = true;
  }

  const pushUrl = tokenRemoteUrl(remote.remoteUrl, token);
  await g.push(pushUrl, branch, ["--set-upstream"]);

  return {
    branch,
    pushed: true,
    committed,
    remoteUrl: remote.remoteUrl,
    owner: remote.owner,
    repo: remote.repo,
  };
}
