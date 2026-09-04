import { afterEach, describe, expect, it } from "vitest";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { claimPaths, formatAgentStatus, listLiveAgents, registerAgent, releaseAgent } from "./registry.js";
import { resolveHeartbeatTtl } from "./registry.js";

describe("agent registry", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("registers, claims, conflicts, and releases", async () => {
    root = join(tmpdir(), `dna-reg-${randomUUID()}`);
    await mkdir(root, { recursive: true });

    const primary = await registerAgent({ root, type: "primary", task: "api", id: "primary-1" });
    expect(primary.id).toBe("primary-1");
    const claimed = await claimPaths(root, "primary-1", ["src/api.ts"]);
    expect(claimed.conflicts).toHaveLength(0);
    expect(claimed.agent.claimed_paths).toContain("src/api.ts");

    await registerAgent({ root, type: "subagent", id: "sub-1", parentId: "primary-1", task: "other" });
    const conflict = await claimPaths(root, "sub-1", ["src/api.ts"]);
    expect(conflict.conflicts).toHaveLength(1);
    expect(conflict.conflicts[0].message).toContain("DNA CONFLICT");

    await releaseAgent(root, "primary-1", "completed");
    const after = await claimPaths(root, "sub-1", ["src/api.ts"]);
    expect(after.conflicts).toHaveLength(0);

    const live = await listLiveAgents(root);
    expect(live.some((a) => a.id === "sub-1")).toBe(true);
    expect(formatAgentStatus(live, resolveHeartbeatTtl())).toContain("sub-1");
  });
});
