import { afterEach, describe, expect, it } from "vitest";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { handleAgentHook, parseHookPayload } from "./hooks.js";
import { claimPaths, registerAgent } from "./registry.js";
import { COMMIT_GATE_FAILED, LIVE_COORDINATION_HEADING } from "./types.js";

describe("agent hooks", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  async function scratch(): Promise<string> {
    root = join(tmpdir(), `dna-hook-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    return root;
  }

  it("parses empty or invalid payload as empty object", () => {
    expect(parseHookPayload("")).toEqual({});
    expect(parseHookPayload("not-json")).toEqual({});
  });

  it("sessionStart registers and returns live coordination", async () => {
    await scratch();
    const decision = await handleAgentHook({
      root,
      payload: {
        hook_event_name: "sessionStart",
        conversation_id: "sess-1",
        composer_mode: "agent",
      },
    });
    expect(decision.permission).toBe("allow");
    expect(decision.additional_context).toContain(LIVE_COORDINATION_HEADING);
  });

  it("denies isolated coding subagents and allows explore", async () => {
    await scratch();
    const denied = await handleAgentHook({
      root,
      payload: {
        hook_event_name: "subagentStart",
        subagent_type: "generalPurpose",
        is_isolated: true,
        git_branch: "main",
      },
    });
    expect(denied.permission).toBe("deny");

    const explore = await handleAgentHook({
      root,
      payload: {
        hook_event_name: "subagentStart",
        subagent_type: "explore",
        is_isolated: true,
        git_branch: "main",
      },
    });
    expect(explore.permission).toBe("allow");
  });

  it("denies git branch create and foreign claims", async () => {
    await scratch();
    await registerAgent({ root, id: "holder", task: "own file" });
    await claimPaths(root, "holder", ["src/secret.ts"]);

    const branch = await handleAgentHook({
      root,
      payload: { hook_event_name: "beforeShellExecution", command: "git checkout -b topic" },
      config: { git: { branchingStrategy: "trunk" } },
    });
    expect(branch.permission).toBe("deny");

    const allowed = await handleAgentHook({
      root,
      payload: { hook_event_name: "beforeShellExecution", command: "dna commit -m x" },
    });
    expect(allowed.permission).toBe("allow");

    const conflict = await handleAgentHook({
      root,
      payload: {
        hook_event_name: "preToolUse",
        tool_name: "Write",
        conversation_id: "other",
        tool_input: { path: "src/secret.ts" },
      },
    });
    expect(conflict.permission).toBe("deny");
    expect(conflict.user_message).toContain("DNA CONFLICT");
  });

  it("stop emits commit gate when the tree is dirty", async () => {
    await scratch();
    execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["config", "user.email", "dna@test"], { cwd: root, stdio: "ignore" });
    execFileSync("git", ["config", "user.name", "DNA"], { cwd: root, stdio: "ignore" });
    await writeFile(join(root, "dirty.txt"), "x\n");
    const decision = await handleAgentHook({
      root,
      payload: { hook_event_name: "stop" },
    });
    expect(decision.followup_message).toBe(COMMIT_GATE_FAILED);
  });

  it("fail-opens on thrown errors", async () => {
    const decision = await handleAgentHook({
      root: "/definitely/missing/" + randomUUID(),
      payload: { hook_event_name: "sessionStart" },
    });
    expect(decision.permission).toBe("allow");
  });
});
