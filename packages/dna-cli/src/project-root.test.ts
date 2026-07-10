import { describe, it, expect, afterEach } from "vitest";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { resolveProjectRoot } from "./project-root.js";

function samePath(a: string, b: string): void {
  expect(realpathSync(a)).toBe(realpathSync(b));
}

describe("resolveProjectRoot", () => {
  let previousCwd: string;
  let projectRoot: string;

  afterEach(async () => {
    process.chdir(previousCwd);
    await rm(projectRoot, { recursive: true, force: true });
  });

  async function setupProject(): Promise<void> {
    previousCwd = process.cwd();
    projectRoot = join(tmpdir(), `dna-root-${randomUUID()}`);
    await mkdir(join(projectRoot, ".DNA"), { recursive: true });
    await writeFile(join(projectRoot, ".DNA", "config.dna.json"), "{}");
    process.chdir(projectRoot);
  }

  it("uses process.cwd when --cwd is omitted", async () => {
    await setupProject();
    samePath(resolveProjectRoot(), projectRoot);
  });

  it("resolves a nested project path from the monorepo root", async () => {
    previousCwd = process.cwd();
    const monorepoRoot = join(tmpdir(), `dna-root-${randomUUID()}`);
    projectRoot = join(monorepoRoot, "packages", "dna-cli");
    await mkdir(join(projectRoot, ".DNA"), { recursive: true });
    await writeFile(join(projectRoot, ".DNA", "config.dna.json"), "{}");
    process.chdir(monorepoRoot);

    samePath(resolveProjectRoot(join("packages", "dna-cli")), projectRoot);
  });

  it("rejects a nested --cwd when the shell is already in a DNA project", async () => {
    await setupProject();
    expect(() => resolveProjectRoot(join("packages", "dna-cli"))).toThrow(/Omit --cwd or use --cwd \./);
  });

  it("rejects a directory without .DNA", async () => {
    await setupProject();
    const empty = join(projectRoot, "empty");
    await mkdir(empty, { recursive: true });
    expect(() => resolveProjectRoot(empty)).toThrow(/No \.DNA\/ directory/);
  });
});
