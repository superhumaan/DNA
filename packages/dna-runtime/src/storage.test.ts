import { describe, it, expect } from "vitest";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  appendRuntimeRecord,
  readFingerprintRecords,
  readRuntimeRecords,
  upsertFingerprintRecord,
} from "../src/storage.js";
import type { FingerprintRecord } from "@superhumaan/dna-config";

describe("runtime storage hardening", () => {
  it("preserves fingerprints across event/issue writes and quarantine recovery", async () => {
    const root = join(tmpdir(), `dna-storage-${randomUUID()}`);
    await mkdir(join(root, ".DNA", "data"), { recursive: true });

    const fp: FingerprintRecord = {
      fingerprint: "fp-1",
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      repeatCount: 2,
      isBlocker: false,
      repairStatus: "pending",
      repairAttempts: 0,
      message: "test",
      category: "runtime",
    };
    await upsertFingerprintRecord(root, fp);
    await appendRuntimeRecord(root, "events", { id: "e1", message: "hi" });
    await appendRuntimeRecord(root, "issues", { id: "i1", summary: "boom" });

    const fingerprints = await readFingerprintRecords(root);
    expect(fingerprints).toHaveLength(1);
    expect(fingerprints[0]?.fingerprint).toBe("fp-1");
    expect((await readRuntimeRecords(root, "events")).length).toBe(1);
    expect((await readRuntimeRecords(root, "issues")).length).toBe(1);

    // Concurrent appends must not corrupt JSON
    await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        appendRuntimeRecord(root, "events", { id: `e-${i}`, message: `m-${i}` }),
      ),
    );
    const events = await readRuntimeRecords(root, "events");
    expect(events.length).toBe(21);
    const raw = await readFile(join(root, ".DNA", "data", "runtime.db"), "utf-8");
    expect(() => JSON.parse(raw)).not.toThrow();
    expect(JSON.parse(raw).fingerprints).toHaveLength(1);

    await rm(root, { recursive: true, force: true });
  });

  it("quarantines corrupt runtime.db and returns empty store", async () => {
    const root = join(tmpdir(), `dna-storage-corrupt-${randomUUID()}`);
    const dbPath = join(root, ".DNA", "data", "runtime.db");
    await mkdir(join(root, ".DNA", "data"), { recursive: true });
    await writeFile(dbPath, "{not-json", "utf-8");

    const events = await readRuntimeRecords(root, "events");
    expect(events).toEqual([]);

    const listing = await import("node:fs/promises").then((fs) => fs.readdir(join(root, ".DNA", "data")));
    expect(listing.some((f) => f.startsWith("runtime.db.corrupt."))).toBe(true);

    await rm(root, { recursive: true, force: true });
  });
});
