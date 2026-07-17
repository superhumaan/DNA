import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { generatePrePushHook, installGitHooks } from "./git-hooks.js";
import { fileExists } from "../fs.js";

describe("git hooks", () => {
  it("generates advisory pre-push hook by default", () => {
    const hook = generatePrePushHook();
    expect(hook).toContain("#!/bin/sh");
    expect(hook).toContain("quality report");
    expect(hook).not.toContain("--fail");
    expect(hook).toContain("|| true");
  });

  it("generates a strict pre-push hook that actually blocks the push", () => {
    const hook = generatePrePushHook(true);
    expect(hook).toContain("quality report --fail");
    // Must NOT swallow the failure — no `|| true` in strict mode.
    expect(hook).not.toContain("|| true");
    // Must abort the push on a failed gate.
    expect(hook).toContain("exit 1");
    expect(hook).toContain("push blocked");
    expect(hook).toContain("BLOCKS the push");
  });

  it("installs pre-push hook file", async () => {
    const root = join(tmpdir(), `dna-hooks-${randomUUID()}`);
    await mkdir(root, { recursive: true });

    const created = await installGitHooks(root);

    expect(created).toContain(".DNA/hooks/pre-push");
    expect(await fileExists(join(root, ".DNA/hooks/pre-push"))).toBe(true);
    const content = await readFile(join(root, ".DNA/hooks/pre-push"), "utf-8");
    expect(content).toContain("quality report");

    await rm(root, { recursive: true, force: true });
  });

  it("wires git core.hooksPath inside a real repo", async () => {
    const root = join(tmpdir(), `dna-hooks-git-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });

    const created = await installGitHooks(root);

    expect(created).toContain(".DNA/hooks/pre-push");
    expect(created).toContain("git config core.hooksPath=.DNA/hooks");
    const hooksPath = execFileSync("git", ["config", "core.hooksPath"], {
      cwd: root,
    })
      .toString()
      .trim();
    expect(hooksPath).toBe(".DNA/hooks");

    await rm(root, { recursive: true, force: true });
  });

  it("installs a blocking strict hook when ci.strict is enabled", async () => {
    const root = join(tmpdir(), `dna-hooks-strict-${randomUUID()}`);
    await mkdir(root, { recursive: true });

    const config = {
      version: "0.1.0",
      projectId: "hooks-strict",
      projectName: "Hooks Strict",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stack: {},
      compliance: "none" as const,
      stage: "new" as const,
      aiTools: [],
      autoUpdate: true,
      channel: "stable" as const,
      knowledgePacks: [],
      platformFeatures: [],
      ci: {
        enabled: true,
        strict: true,
        perFileCoverage: true,
        owasp: true,
        pushToPreview: false,
        previewProvider: "vercel" as const,
        coverageThreshold: 80,
      },
    };

    await installGitHooks(root, config);
    const content = await readFile(join(root, ".DNA/hooks/pre-push"), "utf-8");
    expect(content).toContain("quality report --fail");
    expect(content).toContain("exit 1");
    expect(content).not.toContain("|| true");

    await rm(root, { recursive: true, force: true });
  });
});
