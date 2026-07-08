import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
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

  it("generates strict pre-push hook when configured", () => {
    const hook = generatePrePushHook(true);
    expect(hook).toContain("quality report --fail");
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
});
