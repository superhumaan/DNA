import { git } from "./git.js";
import { requireGitHubToken } from "./auth.js";
import { detectGitHubRemote } from "./git-remote.js";

export interface PushFeatureOptions {
  root: string;
  message?: string;
  branch?: string;
  /**
   * When true (legacy feature-branch mode), hop off main onto feature/*.
   * Default / trunk mode: false — push stays on the current branch.
   */
  createBranch?: boolean;
  /**
   * When true, skip local `git add` / `git commit` (Agent Mesh already ran `dna commit`).
   */
  skipLocalCommit?: boolean;
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

  // Default createBranch is false (trunk). Only hop off main when explicitly requested.
  if (options.createBranch === true && (branch === "main" || branch === "master")) {
    branch = slugifyBranch(message);
    await g.checkoutLocalBranch(branch);
  }

  let committed = false;
  if (status.files.length > 0 && !options.skipLocalCommit) {
    await g.add(status.files.map((f) => f.path));
    await g.commit(message);
    committed = true;
  }

  if (token && !remote.remoteUrl.startsWith("git@")) {
    await g.pushWithBearer(remote.remoteUrl, branch, token);
  } else {
    await g.push(remote.remoteUrl, branch, ["--set-upstream"]);
  }

  return {
    branch,
    pushed: true,
    committed,
    remoteUrl: remote.remoteUrl,
    owner: remote.owner,
    repo: remote.repo,
  };
}
