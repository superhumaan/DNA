import { afterEach, describe, expect, it } from "vitest";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { commitAgentWork, filesForAgentCommit, resolveAgentId } from "./commit.js";
import { claimPaths, getAgent, registerAgent } from "./registry.js";

describe("dna commit", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("stages only this agent's files and records the SHA", async () => {
    root = join(tmpdir(), `dna-commit-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["config", "user.email", "dna@test"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["config", "user.name", "DNA"], { cwd: root, stdio: "ignore" });
    await writeFile(join(root, "mine.ts"), "a\n");
    await writeFile(join(root, "theirs.ts"), "b\n");
    execFileSync("git", ["add", "mine.ts", "theirs.ts"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["commit", "-m", "base"], { cwd: root, stdio: "ignore" });
    await writeFile(join(root, "mine.ts"), "a2\n");
    await writeFile(join(root, "theirs.ts"), "b2\n");

    await registerAgent({ root, id: "me", task: "mine" });
    await claimPaths(root, "me", ["mine.ts"]);

    const result = await commitAgentWork({
      root,
      agentId: "me",
      message: "[DNA] feat(agents): test commit",
    });
    expect(result.committed).toBe(true);
    expect(result.staged).toEqual(["mine.ts"]);
    expect(result.skipped).toContain("theirs.ts");
    expect(result.sha).toBeTruthy();
    expect((await getAgent(root, "me"))?.last_commit).toBe(result.sha);
  });

  it("refuses to commit a file claimed by another live agent", async () => {
    root = join(tmpdir(), `dna-commit-conflict-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["config", "user.email", "dna@test"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["config", "user.name", "DNA"], { cwd: root, stdio: "ignore" });
    await writeFile(join(root, "shared.ts"), "1\n");
    execFileSync("git", ["add", "shared.ts"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["commit", "-m", "base"], { cwd: root, stdio: "ignore" });
    await writeFile(join(root, "shared.ts"), "2\n");

    await registerAgent({ root, id: "owner", task: "hold" });
    await claimPaths(root, "owner", ["shared.ts"]);
    await registerAgent({ root, id: "thief", task: "steal" });
    const { recordModifiedPaths } = await import("./registry.js");
    await recordModifiedPaths(root, "thief", ["shared.ts"]);

    await expect(
      commitAgentWork({ root, agentId: "thief", message: "nope" }),
    ).rejects.toThrow(/DNA CONFLICT/);
  });

  it("selects only owned dirty files and reads DNA_AGENT_ID", () => {
    expect(filesForAgentCommit(["a.ts"], ["b.ts"], ["a.ts", "c.ts"])).toEqual(["a.ts"]);
    const prev = process.env.DNA_AGENT_ID;
    process.env.DNA_AGENT_ID = "env-agent";
    expect(resolveAgentId()).toBe("env-agent");
    expect(resolveAgentId("explicit")).toBe("explicit");
    if (prev === undefined) delete process.env.DNA_AGENT_ID;
    else process.env.DNA_AGENT_ID = prev;
  });
});
