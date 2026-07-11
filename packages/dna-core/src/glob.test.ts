import { describe, it, expect } from "vitest";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { glob } from "./glob.js";

describe("glob ignore", () => {
  it("skips nested node_modules directories", async () => {
    const root = join(tmpdir(), `dna-glob-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await mkdir(join(root, "apps", "demo", "node_modules", "pkg"), { recursive: true });
    await writeFile(join(root, "src", "index.ts"), "export {}");
    await writeFile(join(root, "apps", "demo", "node_modules", "pkg", "index.js"), "module.exports = {}");

    const files = await glob(["**/*.{ts,js}"], {
      cwd: root,
      ignore: ["**/node_modules/**", "**/dist/**"],
      onlyFiles: true,
    });

    expect(files).toEqual(["src/index.ts"]);
    await rm(root, { recursive: true, force: true });
  });
});
