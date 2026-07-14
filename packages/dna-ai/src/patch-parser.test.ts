import { describe, it, expect } from "vitest";
import { parseRepairResponse, applyPatches } from "../src/patch-parser.js";
import { mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

describe("parseRepairResponse", () => {
  it("parses JSON repair plan", () => {
    const content = JSON.stringify({
      diagnosis: "missing null check",
      proposedChanges: [{ file: "src/a.ts", description: "fix", search: "foo", replace: "bar" }],
    });

    const parsed = parseRepairResponse(content);
    expect(parsed?.diagnosis).toBe("missing null check");
    expect(parsed?.proposedChanges?.[0]?.search).toBe("foo");
  });
});

describe("applyPatches", () => {
  it("applies search/replace patches", async () => {
    const root = join(tmpdir(), `dna-patch-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await import("node:fs/promises").then(({ writeFile }) =>
      writeFile(join(root, "src", "a.ts"), "const foo = 1;\n", "utf-8"),
    );

    const modified = await applyPatches(root, [
      {
        file: "src/a.ts",
        description: "rename",
        search: "foo",
        replace: "bar",
      },
    ]);

    expect(modified).toEqual(["src/a.ts"]);
    const content = await readFile(join(root, "src", "a.ts"), "utf-8");
    expect(content).toContain("bar");

    await rm(root, { recursive: true, force: true });
  });

  it("rejects placeholder DNA-suggested-fix junk and does not invent files", async () => {
    const root = join(tmpdir(), `dna-patch-junk-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });

    const modified = await applyPatches(root, [
      {
        file: "src/index.ts",
        description: "junk",
        patch: `// DNA suggested fix for: CRITICAL: write EPIPE
try {
  // existing code
} catch (error) {
  logger.error({ err: error }, 'unknown');
  throw error;
}`,
      },
      {
        file: "src/index.ts",
        description: "junk2",
        search: "export",
        replace: "// DNA suggested fix for: boom\nexport",
      },
    ]);

    expect(modified).toEqual([]);
    await expect(readFile(join(root, "src", "index.ts"), "utf-8")).rejects.toThrow();

    await rm(root, { recursive: true, force: true });
  });
});
