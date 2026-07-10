import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pkgRoot = dirname(fileURLToPath(import.meta.url));
const preloadPath = join(pkgRoot, "dist/runtime-preload.js");
const runtimePath = join(pkgRoot, "dist/runtime.js");

describe("runtime preload bundle", () => {
  it("does not inline CJS npm dependencies", () => {
    expect(existsSync(preloadPath)).toBe(true);
    expect(existsSync(runtimePath)).toBe(true);

    for (const bundlePath of [preloadPath, runtimePath]) {
      const bundle = readFileSync(bundlePath, "utf-8");
      expect(bundle).not.toContain("@kwsites/file-exists");
      expect(bundle).not.toContain('Dynamic require of "fs"');
    }
  });

  it("loads under Node ESM --import", () => {
    execSync('node -e "console.log(\'ok\')"', {
      env: { ...process.env, NODE_OPTIONS: `--import ${preloadPath}` },
      stdio: "pipe",
    });
  });
});
