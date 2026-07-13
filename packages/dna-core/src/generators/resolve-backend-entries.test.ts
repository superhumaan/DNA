import { describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ensureLabAssets } from "../lab/server.js";
import { fileExists } from "../fs.js";
import { resolveBackendEntryCandidates } from "./resolve-backend-entries.js";

describe("resolveBackendEntryCandidates", () => {
  it("includes monorepo app server entries", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-entries-"));
    try {
      const appEntry = join(root, "apps", "examples", "node-express-app", "src", "index.ts");
      await import("node:fs/promises").then(({ mkdir, writeFile }) =>
        mkdir(join(root, "apps", "examples", "node-express-app", "src"), { recursive: true }).then(() =>
          writeFile(appEntry, "import express from 'express';\nconst app = express();\n"),
        ),
      );

      const candidates = await resolveBackendEntryCandidates(root);
      expect(candidates).toContain("apps/examples/node-express-app/src/index.ts");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe("ensureLabAssets", () => {
  it("creates lab store and install snippet", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-lab-assets-"));
    try {
      const created = await ensureLabAssets(root);
      expect(created).toContain(".DNA/data/lab-store.json");
      expect(created).toContain(".DNA/lab/install-snippet.ts");
      expect(await fileExists(join(root, ".DNA", "data", "lab-store.json"))).toBe(true);
      expect(await fileExists(join(root, ".DNA", "lab", "install-snippet.ts"))).toBe(true);

      const again = await ensureLabAssets(root);
      expect(again).toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
