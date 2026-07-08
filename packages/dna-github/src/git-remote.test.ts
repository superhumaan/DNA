import { describe, it, expect } from "vitest";
import { parseGitHubRemoteUrl } from "./git-remote.js";

describe("git remote parser", () => {
  it("parses SSH remotes", () => {
    const r = parseGitHubRemoteUrl("git@github.com:humaan/dna.git");
    expect(r).toEqual({
      owner: "humaan",
      repo: "dna",
      remoteUrl: "git@github.com:humaan/dna.git",
    });
  });

  it("parses HTTPS remotes", () => {
    const r = parseGitHubRemoteUrl("https://github.com/humaan/dna");
    expect(r?.owner).toBe("humaan");
    expect(r?.repo).toBe("dna");
  });

  it("returns null for non-GitHub remotes", () => {
    expect(parseGitHubRemoteUrl("git@gitlab.com:org/repo.git")).toBeNull();
  });
});
