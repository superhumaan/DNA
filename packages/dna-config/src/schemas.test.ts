import { describe, expect, it } from "vitest";
import { DnaConfigSchema } from "./schemas.js";
import {
  DEFAULT_AGENT_HEARTBEAT_TTL_SECONDS,
  DNA_AGENTS_DB,
  DNA_AGENTS_LOCK,
  DNA_GITIGNORE_ENTRIES,
} from "./constants.js";
import {
  formatRepairBranch,
  formatTaggedCommit,
  formatTaggedPrTitle,
  isIntegrationBranch,
  resolveGitBranchingStrategy,
  resolveIntegrationBranch,
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
    expect(parsed.git?.branchingStrategy).toBe("trunk");
  });

  it("parses git.branchingStrategy feature-branch", () => {
    const parsed = DnaConfigSchema.parse(
      base({
        git: { branchingStrategy: "feature-branch" },
      }),
    );
    expect(parsed.git?.branchingStrategy).toBe("feature-branch");
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

  it("defaults branching strategy to trunk", () => {
    expect(resolveGitBranchingStrategy(undefined)).toBe("trunk");
    expect(resolveGitBranchingStrategy({})).toBe("trunk");
    expect(resolveGitBranchingStrategy({ git: { branchingStrategy: "trunk" } })).toBe("trunk");
    expect(resolveGitBranchingStrategy({ git: { branchingStrategy: "feature-branch" } })).toBe(
      "feature-branch",
    );
  });

  it("parses git.integrationBranch", () => {
    const parsed = DnaConfigSchema.parse(
      base({
        git: { integrationBranch: "develop" },
      }),
    );
    expect(parsed.git?.integrationBranch).toBe("develop");
  });

  it("resolves integration branch and treats main/master as trunk", () => {
    expect(resolveIntegrationBranch(undefined)).toBe("main");
    expect(resolveIntegrationBranch({ git: { integrationBranch: "develop" } })).toBe("develop");
    expect(isIntegrationBranch("main", undefined)).toBe(true);
    expect(isIntegrationBranch("master", undefined)).toBe(true);
    expect(isIntegrationBranch("feature/x", undefined)).toBe(false);
    expect(isIntegrationBranch(null, undefined)).toBe(false);
    expect(isIntegrationBranch("develop", { git: { integrationBranch: "develop" } })).toBe(true);
    expect(isIntegrationBranch("main", { git: { integrationBranch: "develop" } })).toBe(false);
  });
});

describe("agents mesh config", () => {
  it("parses agents.mesh and heartbeat TTL with defaults", () => {
    const parsed = DnaConfigSchema.parse(base({ agents: {} }));
    expect(parsed.agents?.mesh).toBe(true);
    expect(parsed.agents?.heartbeatTtlSeconds).toBe(DEFAULT_AGENT_HEARTBEAT_TTL_SECONDS);
  });

  it("parses explicit agents overrides", () => {
    const parsed = DnaConfigSchema.parse(
      base({
        agents: { mesh: false, heartbeatTtlSeconds: 60 },
      }),
    );
    expect(parsed.agents?.mesh).toBe(false);
    expect(parsed.agents?.heartbeatTtlSeconds).toBe(60);
  });

  it("exports agents db constants and gitignore entries", () => {
    expect(DNA_AGENTS_DB).toBe(".DNA/runtime/agents.db");
    expect(DNA_AGENTS_LOCK).toBe(".DNA/runtime/agents.lock");
    expect(DNA_GITIGNORE_ENTRIES).toContain(".DNA/runtime/agents.db");
    expect(DNA_GITIGNORE_ENTRIES).toContain(".DNA/runtime/agents.lock");
    expect(DNA_GITIGNORE_ENTRIES).toContain(".DNA/runtime/agents.db-wal");
  });
});
