import { describe, expect, it } from "vitest";
import {
  activeAgents,
  agentHoldsPath,
  findClaimConflict,
  isAgentFresh,
  mergeUniquePaths,
  normalizeClaimPath,
  pathsOverlap,
} from "./claims.js";
import { createAgentRecord } from "./db.js";

describe("agent path claims", () => {
  it("normalizes and overlaps nested paths", () => {
    expect(normalizeClaimPath("./src/foo.ts")).toBe("src/foo.ts");
    expect(pathsOverlap("src/foo.ts", "src/foo.ts")).toBe(true);
    expect(pathsOverlap("src", "src/foo.ts")).toBe(true);
    expect(pathsOverlap("src/foo.ts", "src")).toBe(true);
    expect(pathsOverlap("src/a.ts", "src/b.ts")).toBe(false);
  });

  it("detects foreign claim conflicts for active agents only", () => {
    const holder = createAgentRecord({
      id: "agent-a",
      task: "edit api",
      claimed_paths: ["packages/dna-core/src/index.ts"],
    });
    const idle = createAgentRecord({
      id: "agent-b",
      status: "completed",
      claimed_paths: ["README.md"],
    });
    expect(agentHoldsPath(holder, "packages/dna-core/src/index.ts")).toBe(true);
    const hit = findClaimConflict([holder, idle], "packages/dna-core/src/index.ts", "agent-c");
    expect(hit?.agent.id).toBe("agent-a");
    expect(hit?.message).toContain("DNA CONFLICT");
    expect(hit?.message).toContain("agent-a");
    expect(findClaimConflict([holder], "packages/dna-core/src/index.ts", "agent-a")).toBeNull();
    expect(findClaimConflict([idle], "README.md", "agent-c")).toBeNull();
  });

  it("merges unique paths and expires stale heartbeats", () => {
    expect(mergeUniquePaths(["src/a.ts"], ["./src/a.ts", "src/b.ts"])).toEqual(["src/a.ts", "src/b.ts"]);
    const fresh = createAgentRecord({ id: "live" });
    const stale = createAgentRecord({ id: "old" });
    stale.heartbeat_at = new Date(Date.now() - 4000_000).toISOString();
    expect(isAgentFresh(fresh, 1800)).toBe(true);
    expect(isAgentFresh(stale, 1800)).toBe(false);
    expect(activeAgents([fresh, stale], 1800).map((a) => a.id)).toEqual(["live"]);
  });
});
