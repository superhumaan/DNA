import { describe, expect, it } from "vitest";
import {
  evaluateGitGuardian,
  isBranchCreateCommand,
  isDnaCommitCommand,
  isDnaGithubPushCommand,
  isGitAddAll,
  isRawGitAdd,
  isRawGitCommit,
  isResetHard,
  isCleanForce,
} from "./guardian.js";
import { GIT_GUARDIAN_DENIED } from "./types.js";

const trunk = { currentBranch: "main", branchKnown: true };
const unknown = { currentBranch: null, branchKnown: false };
const feature = { currentBranch: "feature/x", branchKnown: true };

describe("git guardian classifiers", () => {
  it("detects branch create, add-all, raw commit, reset, clean", () => {
    expect(isBranchCreateCommand("git checkout -b foo")).toBe(true);
    expect(isBranchCreateCommand("git switch -c foo")).toBe(true);
    expect(isBranchCreateCommand("git branch new-one")).toBe(true);
    expect(isBranchCreateCommand("git branch -d old")).toBe(false);
    expect(isBranchCreateCommand("git worktree add ../wt")).toBe(true);
    expect(isGitAddAll("git add .")).toBe(true);
    expect(isGitAddAll("git add -A")).toBe(true);
    expect(isGitAddAll("git add --all")).toBe(true);
    expect(isRawGitAdd("git add src/foo.ts")).toBe(true);
    expect(isRawGitCommit("git commit -m x")).toBe(true);
    expect(isRawGitCommit("dna commit -m x")).toBe(false);
    expect(isDnaCommitCommand("npx dna commit -m x")).toBe(true);
    expect(isDnaGithubPushCommand("dna github push")).toBe(true);
    expect(isResetHard("git reset --hard HEAD")).toBe(true);
    expect(isCleanForce("git clean -fd")).toBe(true);
  });
});

describe("evaluateGitGuardian", () => {
  it("denies trunk branch create and raw git writes", () => {
    for (const cmd of [
      "git checkout -b topic",
      "git checkout feature/x",
      "git switch -c topic",
      "git switch feature/x",
      "git push --force",
      "git push --force-with-lease",
      "git branch topic",
      "git worktree add ../x",
      "git stash",
      "git add .",
      "git add -A",
      "git add src/a.ts",
      "git commit -m x",
      "git reset --hard",
      "git clean -f",
    ]) {
      const decision = evaluateGitGuardian(cmd, trunk);
      expect(decision.permission, cmd).toBe("deny");
      expect(decision.user_message).toContain("DENIED BY DNA GIT GUARDIAN");
    }
  });

  it("allows dna commit, status/diff/log, and github push", () => {
    for (const cmd of ["dna commit -m x", "git status", "git diff", "git log -1", "dna github push"]) {
      expect(evaluateGitGuardian(cmd, trunk).permission, cmd).toBe("allow");
    }
  });

  it("relaxes branch create when feature-branch is configured", () => {
    const ctx = {
      ...trunk,
      config: { git: { branchingStrategy: "feature-branch" as const } },
    };
    expect(evaluateGitGuardian("git checkout -b topic", ctx).permission).toBe("allow");
    expect(evaluateGitGuardian("git push --force", ctx).permission).toBe("deny");
    expect(evaluateGitGuardian("git add .", ctx).permission).toBe("deny");
  });

  it("denies writes when the branch is unknown and allows staying on trunk", () => {
    expect(evaluateGitGuardian("git add src/a.ts", feature).permission).toBe("deny");
    expect(evaluateGitGuardian("git add src/a.ts", unknown).permission).toBe("deny");
    expect(evaluateGitGuardian("git checkout -b x", unknown).permission).toBe("deny");
    expect(evaluateGitGuardian("git checkout main", trunk).permission).toBe("allow");
    expect(GIT_GUARDIAN_DENIED).toContain("do not create/switch feature branches");
  });
});
