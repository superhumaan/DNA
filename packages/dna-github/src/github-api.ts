const API = "https://api.github.com";

async function githubRequest<T>(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "User-Agent": "dna-by-humaan",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${text}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function createGitHubLabel(
  token: string,
  owner: string,
  repo: string,
  name: string,
  color = "0E8A16",
): Promise<void> {
  try {
    await githubRequest(token, "POST", `/repos/${owner}/${repo}/labels`, { name, color });
  } catch {
    // Label likely exists
  }
}

export async function createGitHubIssue(
  token: string,
  owner: string,
  repo: string,
  payload: { title: string; body: string; labels: string[] },
): Promise<{ number: number; html_url: string }> {
  const data = await githubRequest<{ number: number; html_url: string }>(
    token,
    "POST",
    `/repos/${owner}/${repo}/issues`,
    payload,
  );
  return data;
}

export async function createGitHubBranch(
  token: string,
  owner: string,
  repo: string,
  branchName: string,
  fromRef = "main",
): Promise<void> {
  const ref = await githubRequest<{ object: { sha: string } }>(
    token,
    "GET",
    `/repos/${owner}/${repo}/git/ref/heads/${fromRef}`,
  );
  await githubRequest(token, "POST", `/repos/${owner}/${repo}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha: ref.object.sha,
  });
}

export async function createGitHubPullRequest(
  token: string,
  owner: string,
  repo: string,
  options: { title: string; body: string; head: string; base?: string; draft?: boolean },
): Promise<{ number: number; html_url: string }> {
  return githubRequest(token, "POST", `/repos/${owner}/${repo}/pulls`, {
    title: options.title,
    body: options.body,
    head: options.head,
    base: options.base ?? "main",
    draft: options.draft ?? false,
  });
}

export async function createGitHubIssueComment(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
): Promise<void> {
  await githubRequest(token, "POST", `/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    body,
  });
}
