import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  appendRuntimeRecord,
  readRuntimeRecords,
  repairRuntimeDatabase,
} from "./runtime-db.js";

describe("runtime-db", () => {
  let root = "";

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("quarantines corrupt JSON and recreates an empty store", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-rt-"));
    const dbPath = join(root, ".DNA", "data", "runtime.db");
    await writeFile(join(root, ".DNA", "data", "placeholder"), "", "utf-8").catch(async () => {
      const { mkdir } = await import("node:fs/promises");
      await mkdir(join(root, ".DNA", "data"), { recursive: true });
    });
    await writeFile(dbPath, "{ not-json", "utf-8");

    const result = await repairRuntimeDatabase(root);
    expect(result.repaired).toBe(true);

    const raw = await readFile(dbPath, "utf-8");
    const parsed = JSON.parse(raw) as { events: unknown[]; issues: unknown[] };
    expect(parsed.events).toEqual([]);
    expect(parsed.issues).toEqual([]);
  });

  it("appends under lock without corrupting concurrent writers", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-rt-"));
    await Promise.all(
      Array.from({ length: 40 }, (_, i) =>
        appendRuntimeRecord(root, "events", { id: String(i), timestamp: new Date().toISOString() }),
      ),
    );
    const events = await readRuntimeRecords<{ id: string }>(root, "events");
    expect(events).toHaveLength(40);
  });
});
