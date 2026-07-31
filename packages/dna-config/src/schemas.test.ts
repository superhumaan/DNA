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
        projectId: "myapp",
        projectName: "myapp",
        git: { projectTag: "MyApp", branchSlug: "myapp" },
      }),
    );
    expect(parsed.git?.projectTag).toBe("MyApp");
    expect(parsed.git?.branchSlug).toBe("myapp");
  });

  it("resolves tags from projectId (DNA known; others title-cased)", () => {
    expect(resolveProjectGitIdentity(base({ projectId: "myapp", projectName: "myapp" }))).toEqual({
      tag: "Myapp",
      branchSlug: "myapp",
    });
    expect(resolveProjectGitIdentity(base({ projectId: "dna-by-humaan", projectName: "dna-by-humaan" }))).toEqual({
      tag: "DNA",
      branchSlug: "dna",
    });
    expect(resolveProjectGitIdentity(base({ projectId: "acme-web", projectName: "acme-web" })).tag).toBe(
      "AcmeWeb",
    );
  });

  it("honours explicit overrides", () => {
    const id = resolveProjectGitIdentity(
      base({
        projectId: "myapp",
        projectName: "myapp",
        git: { projectTag: "MyApp", branchSlug: "myapp" },
      }),
    );
    expect(id).toEqual({ tag: "MyApp", branchSlug: "myapp" });
  });

  it("formats commit, PR, and branch names", () => {
    const id = { tag: "MyApp", branchSlug: "myapp" };
    expect(formatTaggedCommit(id, "fix", "dedupe filter", "admin")).toBe(
      "[MyApp] fix(admin): dedupe filter",
    );
    expect(formatTaggedPrTitle(id, "Fix", "uncaught exception")).toBe(
      "[MyApp] Fix: uncaught exception",
    );
    expect(formatRepairBranch(id, "abc-123")).toBe("myapp/fix/abc-123");
  });
});
