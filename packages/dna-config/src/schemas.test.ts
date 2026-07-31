import { describe, expect, it } from "vitest";
import { DnaConfigSchema } from "./schemas.js";
import {
  formatRepairBranch,
  formatTaggedCommit,
  formatTaggedPrTitle,
  resolveProjectGitIdentity,
} from "./project-git-identity.js";

function base(overrides: Record<string, unknown> = {}) {
  return {
    version: "0.1.0",
    projectId: "config-test",
    projectName: "Config Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: [],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
    ...overrides,
  };
}

describe("DnaConfig runtime storage", () => {
  it("defaults to the truthful atomic JSON storage name", () => {
    expect(DnaConfigSchema.parse(base({ runtime: { enabled: true } })).runtime?.storage).toBe(
      "json",
    );
  });

  it("normalizes the historical sqlite label without breaking old configs", () => {
    expect(
      DnaConfigSchema.parse(base({ runtime: { enabled: true, storage: "sqlite" } })).runtime
        ?.storage,
    ).toBe("json");
  });
});

describe("git project identity config", () => {
  it("parses git.projectTag and git.branchSlug", () => {
    const parsed = DnaConfigSchema.parse(
      base({
        projectId: "colorparty",
        projectName: "colorparty",
        git: { projectTag: "ColorParty", branchSlug: "colorparty" },
      }),
    );
    expect(parsed.git?.projectTag).toBe("ColorParty");
    expect(parsed.git?.branchSlug).toBe("colorparty");
  });

  it("resolves known lab tags from projectId", () => {
    expect(resolveProjectGitIdentity(base({ projectId: "colorparty", projectName: "colorparty" }))).toEqual({
      tag: "ColorParty",
      branchSlug: "colorparty",
    });
    expect(resolveProjectGitIdentity(base({ projectId: "dna-by-humaan", projectName: "dna-by-humaan" }))).toEqual({
      tag: "DNA",
      branchSlug: "dna",
    });
    expect(resolveProjectGitIdentity(base({ projectId: "ai-studio", projectName: "ai-studio" })).tag).toBe(
      "AIStudio",
    );
  });

  it("honours explicit overrides", () => {
    const id = resolveProjectGitIdentity(
      base({
        projectId: "colorparty",
        projectName: "colorparty",
        git: { projectTag: "CP", branchSlug: "cp" },
      }),
    );
    expect(id).toEqual({ tag: "CP", branchSlug: "cp" });
  });

  it("formats commit, PR, and branch names", () => {
    const id = { tag: "ColorParty", branchSlug: "colorparty" };
    expect(formatTaggedCommit(id, "fix", "dedupe filter", "admin")).toBe(
      "[ColorParty] fix(admin): dedupe filter",
    );
    expect(formatTaggedPrTitle(id, "Fix", "uncaught exception")).toBe(
      "[ColorParty] Fix: uncaught exception",
    );
    expect(formatRepairBranch(id, "abc-123")).toBe("colorparty/fix/abc-123");
  });
});
