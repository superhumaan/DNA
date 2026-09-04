import { afterEach, describe, expect, it } from "vitest";
import { mkdir, rm, readFile, chmod, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  AGENT_MESH_HOOK_SCRIPT,
  AGENT_MESH_HOOKS_JSON,
  agentMeshInstallStatus,
  installAgentMesh,
} from "./install.js";

describe("agent mesh install", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("writes executable fail-open hooks and knowledge", async () => {
    root = join(tmpdir(), `dna-mesh-install-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    const written = await installAgentMesh(root);
    expect(written).toContain(AGENT_MESH_HOOKS_JSON);
    expect(written).toContain(AGENT_MESH_HOOK_SCRIPT);

    const hooks = JSON.parse(await readFile(join(root, AGENT_MESH_HOOKS_JSON), "utf-8"));
    expect(hooks.hooks.beforeShellExecution[0].failClosed).toBe(false);
    expect(hooks.hooks.preToolUse[0].failClosed).toBe(false);

    const script = await readFile(join(root, AGENT_MESH_HOOK_SCRIPT), "utf-8");
    expect(script.startsWith("#!/usr/bin/env bash")).toBe(true);
    expect(script).toContain('{"permission":"allow"}');
    expect(script).toContain("fail_open");

    const status = await agentMeshInstallStatus(root);
    expect(status.installed).toBe(true);
    expect(status.hookExecutable).toBe(true);
    expect(status.failOpen).toBe(true);
  });

  it("hook runner fail-opens when dna is missing", async () => {
    root = join(tmpdir(), `dna-mesh-run-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await installAgentMesh(root);
    const script = join(root, AGENT_MESH_HOOK_SCRIPT);
    await chmod(script, 0o755);
    const out = execFileSync("bash", [script], {
      cwd: root,
      input: JSON.stringify({ hook_event_name: "sessionStart" }),
      env: { PATH: "/usr/bin:/bin" },
      encoding: "utf-8",
    });
    expect(JSON.parse(out).permission).toBe("allow");
  });

  it("skips install when mesh is disabled", async () => {
    root = join(tmpdir(), `dna-mesh-off-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    const written = await installAgentMesh(root, { agents: { mesh: false } });
    expect(written).toEqual([]);
  });

  it("detects non-fail-open runners", async () => {
    root = join(tmpdir(), `dna-mesh-bad-${randomUUID()}`);
    await mkdir(join(root, ".cursor", "hooks"), { recursive: true });
    await writeFile(join(root, AGENT_MESH_HOOKS_JSON), "{}");
    await writeFile(join(root, AGENT_MESH_HOOK_SCRIPT), "#!/bin/sh\nexit 1\n", { mode: 0o644 });
    const status = await agentMeshInstallStatus(root);
    expect(status.failOpen).toBe(false);
  });
});
