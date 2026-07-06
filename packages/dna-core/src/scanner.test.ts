import { describe, it, expect } from "vitest";
import { scanProject } from "../src/scanner.js";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

async function createTempProject(files: Record<string, string>): Promise<string> {
  const dir = join(tmpdir(), `dna-test-${randomUUID()}`);
  await mkdir(dir, { recursive: true });
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(dir, path);
    await mkdir(join(fullPath, ".."), { recursive: true });
    await writeFile(fullPath, content);
  }
  return dir;
}

describe("scanner", () => {
  it("detects React and Express stack", async () => {
    const root = await createTempProject({
      "package.json": JSON.stringify({
        dependencies: { react: "^18.0.0", express: "^4.18.0" },
        devDependencies: { vitest: "^2.0.0" },
        scripts: { test: "vitest" },
      }),
      "pnpm-lock.yaml": "",
    });

    const scan = await scanProject(root);
    expect(scan.frontend).toBe("react");
    expect(scan.backend).toBe("express");
    expect(scan.testFramework).toBe("vitest");
    expect(scan.packageManager).toBe("pnpm");
  });

  it("flags missing env example", async () => {
    const root = await createTempProject({
      "package.json": JSON.stringify({ name: "test" }),
      ".env": "SECRET=abc",
    });

    const scan = await scanProject(root);
    expect(scan.securityRisks.some((r) => r.includes(".env.example"))).toBe(true);
  });
});
