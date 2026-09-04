import { afterEach, describe, expect, it } from "vitest";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { createAgentRecord, openAgentStore, withAgentLock } from "./db.js";

describe("agent store", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  async function makeRoot(): Promise<string> {
    root = join(tmpdir(), `dna-agents-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    return root;
  }

  it("persists agents via sqlite when available", async () => {
    await makeRoot();
    const store = await openAgentStore(root);
    const record = createAgentRecord({
      task: "ship mesh",
      claimed_paths: ["src/a.ts"],
    });
    await store.upsert(record);
    const loaded = await store.get(record.id);
    expect(loaded?.task).toBe("ship mesh");
    expect(loaded?.claimed_paths).toEqual(["src/a.ts"]);
    const listed = await store.list();
    expect(listed).toHaveLength(1);
    await store.update(record.id, { status: "completed", last_commit: "abc123" });
    expect((await store.get(record.id))?.last_commit).toBe("abc123");
    store.close();
  });

  it("falls back to exclusive lockfile + JSON store", async () => {
    await makeRoot();
    const store = await openAgentStore(root, { forceFallback: true });
    expect(store.backend).toBe("fallback");
    const record = createAgentRecord({ id: "fallback-1", task: "json" });
    await store.upsert(record);
    expect((await store.get("fallback-1"))?.task).toBe("json");
    store.close();

    const again = await openAgentStore(root, { forceFallback: true });
    expect((await again.get("fallback-1"))?.task).toBe("json");
    again.close();
  });

  it("serializes exclusive lockfile access", async () => {
    await makeRoot();
    const order: number[] = [];
    await Promise.all([
      withAgentLock(root, async () => {
        order.push(1);
        await new Promise((r) => setTimeout(r, 30));
        order.push(2);
      }),
      withAgentLock(root, async () => {
        order.push(3);
      }),
    ]);
    expect(order).toEqual([1, 2, 3]);
  });
});
