import { afterEach, describe, expect, it } from "vitest";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { formatLiveCoordination } from "./context.js";
import { claimPaths, registerAgent } from "./registry.js";
import { LIVE_COORDINATION_HEADING } from "./types.js";

describe("agent mesh context", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("renders DNA LIVE COORDINATION with live claims", async () => {
    root = join(tmpdir(), `dna-ctx-mesh-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await registerAgent({ root, id: "alpha", task: "hooks" });
    await claimPaths(root, "alpha", ["src/hooks.ts"]);
    const md = await formatLiveCoordination(root, { git: { integrationBranch: "main" } });
    expect(md).toContain(LIVE_COORDINATION_HEADING);
    expect(md).toContain("alpha");
    expect(md).toContain("src/hooks.ts");
    expect(md).toContain("Never `git add .`");
  });
});
