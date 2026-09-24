import { describe, expect, it, vi, beforeEach } from "vitest";

const statusMock = vi.fn();
const checkoutLocalBranchMock = vi.fn();
const addMock = vi.fn();
const commitMock = vi.fn();
const pushMock = vi.fn();
const checkIsRepoMock = vi.fn();

vi.mock("./git.js", () => ({
  git: () => ({
    checkIsRepo: checkIsRepoMock,
    status: statusMock,
    checkoutLocalBranch: checkoutLocalBranchMock,
    add: addMock,
    commit: commitMock,
    push: pushMock,
    pushWithBearer: pushMock,
  }),
}));

vi.mock("./auth.js", () => ({
  requireGitHubToken: vi.fn(async () => "token"),
}));

vi.mock("./git-remote.js", () => ({
  detectGitHubRemote: vi.fn(async () => ({
    remoteUrl: "https://github.com/acme/app.git",
    owner: "acme",
    repo: "app",
  })),
}));

import { pushFeatureToGitHub } from "./push.js";

describe("pushFeatureToGitHub trunk default", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkIsRepoMock.mockResolvedValue(true);
    statusMock.mockResolvedValue({ current: "main", files: [] });
    pushMock.mockResolvedValue(undefined);
  });

  it("stays on main when createBranch is false/undefined (trunk)", async () => {
    const result = await pushFeatureToGitHub({ root: "/tmp/repo", message: "feat: x" });
    expect(result.branch).toBe("main");
    expect(checkoutLocalBranchMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });

  it("skips local add/commit when skipLocalCommit is set", async () => {
    statusMock.mockResolvedValue({ current: "main", files: [{ path: "a.ts" }] });
    const result = await pushFeatureToGitHub({
      root: "/tmp/repo",
      message: "feat: x",
      skipLocalCommit: true,
    });
    expect(result.committed).toBe(false);
    expect(addMock).not.toHaveBeenCalled();
    expect(commitMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });

  it("hops to feature/* only when createBranch is true", async () => {
    const result = await pushFeatureToGitHub({
      root: "/tmp/repo",
      message: "feat: admin dashboard",
      createBranch: true,
    });
    expect(result.branch).toBe("feature/feat-admin-dashboard");
    expect(checkoutLocalBranchMock).toHaveBeenCalledWith("feature/feat-admin-dashboard");
  });
});
