import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  createLabStoreAdapter,
  createRedisLabStoreAdapter,
  ensureLabStore,
  findLabSession,
  LabStateConfigError,
  LabStateUnavailableError,
  readLabStore,
  resetFileLabStoreLocks,
  resolveLabStorageConfig,
  saveLabSession,
  upsertLabUser,
} from "./storage.js";
import type { LabStore } from "./types.js";

afterEach(() => {
  resetFileLabStoreLocks();
});

describe("lab storage config", () => {
  it("defaults to file with zero config", () => {
    expect(resolveLabStorageConfig({})).toEqual({ kind: "file" });
    expect(resolveLabStorageConfig({ DNA_LAB_STATE_BACKEND: "file" })).toEqual({ kind: "file" });
  });

  it("fails closed when redis backend is incomplete", () => {
    const missing = resolveLabStorageConfig({
      DNA_LAB_STATE_BACKEND: "redis",
      DNA_LAB_REDIS_URL: "https://example.upstash.io",
    });
    expect(missing.kind).toBe("invalid");
    if (missing.kind !== "invalid") throw new Error("expected invalid");
    expect(missing.backend).toBe("shared-redis");
    expect(missing.reason).toMatch(/DNA_LAB_REDIS_TOKEN/);
    expect(missing.reason).toMatch(/DNA_LAB_REDIS_KEY/);
    expect(missing.reason).not.toMatch(/Bearer |password=/i);
  });

  it("fails closed for malformed redis URL", () => {
    const bad = resolveLabStorageConfig({
      DNA_LAB_STATE_BACKEND: "redis",
      DNA_LAB_REDIS_URL: "not-a-url",
      DNA_LAB_REDIS_TOKEN: "secret-token-value",
      DNA_LAB_REDIS_KEY: "dna:lab",
    });
    expect(bad.kind).toBe("invalid");
    if (bad.kind !== "invalid") throw new Error("expected invalid");
    expect(bad.reason).not.toContain("secret-token-value");
  });

  it("accepts fully configured redis", () => {
    expect(
      resolveLabStorageConfig({
        DNA_LAB_STATE_BACKEND: "redis",
        DNA_LAB_REDIS_URL: "https://example.upstash.io",
        DNA_LAB_REDIS_TOKEN: "tok",
        DNA_LAB_REDIS_KEY: "dna:lab:store",
      }),
    ).toEqual({
      kind: "redis",
      config: {
        url: "https://example.upstash.io",
        token: "tok",
        key: "dna:lab:store",
      },
    });
  });
});

describe("file lab store adapter", () => {
  let root = "";

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("persists users and sessions under a process lock", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-file-"));
    const created = await ensureLabStore(root);
    expect(created.created).toBe(true);
    expect(created.path).toBe(".DNA/data/lab-store.json");

    await upsertLabUser(root, {
      id: "u1",
      name: "Ada",
      email: "ada@example.com",
      passwordHash: "h",
      passwordSalt: "s",
      createdAt: "2026-01-01T00:00:00.000Z",
      pairingId: "p1",
    });

    await Promise.all([
      saveLabSession(root, {
        id: "s1",
        userId: "u1",
        createdAt: "2026-01-01T00:00:00.000Z",
        expiresAt: "2026-01-02T00:00:00.000Z",
      }),
      saveLabSession(root, {
        id: "s2",
        userId: "u1",
        createdAt: "2026-01-01T01:00:00.000Z",
        expiresAt: "2026-01-02T01:00:00.000Z",
      }),
    ]);

    const store = await readLabStore(root);
    expect(store.users).toHaveLength(1);
    expect(store.sessions).toHaveLength(1);
    expect(store.sessions[0]?.id).toBe("s2");
    expect(await findLabSession(root, "s2")).toBeDefined();
    expect(createLabStoreAdapter(root).backend).toBe("single-instance-file");
  });
});

type MockRedisState = {
  values: Map<string, string>;
  lockHolders: string[];
  commands: unknown[][];
};

function createMockRedisFetch(state: MockRedisState): typeof fetch {
  return (async (_input: string | URL | Request, init?: RequestInit) => {
    const body = typeof init?.body === "string" ? init.body : "";
    const commands = JSON.parse(body || "[]") as unknown[][];
    state.commands.push(...commands);
    const auth = String((init?.headers as Record<string, string> | undefined)?.Authorization ?? "");
    if (!auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify([{ error: "Unauthorized" }]), { status: 401 });
    }

    const results: Array<{ result: unknown }> = [];
    for (const cmd of commands) {
      const op = String(cmd[0]).toUpperCase();
      if (op === "PING") {
        results.push({ result: "PONG" });
        continue;
      }
      if (op === "GET") {
        const key = String(cmd[1]);
        results.push({ result: state.values.has(key) ? state.values.get(key)! : null });
        continue;
      }
      if (op === "SET") {
        const key = String(cmd[1]);
        const value = String(cmd[2]);
        const flags = cmd.slice(3).map(String);
        const nx = flags.includes("NX");
        if (nx && state.values.has(key)) {
          results.push({ result: null });
        } else {
          state.values.set(key, value);
          if (key.endsWith(":lock")) state.lockHolders.push(value);
          results.push({ result: "OK" });
        }
        continue;
      }
      if (op === "EVAL") {
        const lockKey = String(cmd[3]);
        const token = String(cmd[4]);
        const current = state.values.get(lockKey);
        if (current === token) {
          state.values.delete(lockKey);
          results.push({ result: 1 });
        } else {
          results.push({ result: 0 });
        }
        continue;
      }
      results.push({ result: null });
    }
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

describe("redis lab store adapter", () => {
  const baseConfig = {
    url: "https://example.upstash.io",
    token: "super-secret-token",
    key: "dna:lab:store",
  };

  it("reads and updates through distributed lock with token-safe release", async () => {
    const state: MockRedisState = { values: new Map(), lockHolders: [], commands: [] };
    const adapter = createRedisLabStoreAdapter({
      ...baseConfig,
      fetchImpl: createMockRedisFetch(state),
      lockRetries: 5,
      lockRetryDelayMs: 1,
    });

    expect(adapter.backend).toBe("shared-redis");
    const ensured = await adapter.ensure();
    expect(ensured.created).toBe(true);
    expect(ensured.path).toBe("dna:lab:store");

    await adapter.update((store) => {
      store.users.push({
        id: "u1",
        name: "Ada",
        email: "ada@example.com",
        passwordHash: "h",
        passwordSalt: "s",
        createdAt: "2026-01-01T00:00:00.000Z",
        pairingId: "p1",
      });
    });

    const read = await adapter.read();
    expect(read.users).toHaveLength(1);

    const lockOps = state.commands.filter((c) => String(c[0]).toUpperCase() === "SET" && String(c[1]).endsWith(":lock"));
    expect(lockOps.length).toBeGreaterThan(0);
    expect(lockOps[0]?.slice(3)).toEqual(["NX", "EX", "5"]);

    const evalOps = state.commands.filter((c) => String(c[0]).toUpperCase() === "EVAL");
    expect(evalOps.length).toBeGreaterThan(0);
    expect(String(evalOps[0]?.[1])).toMatch(/redis\.call\('get'/);
    expect(evalOps[0]?.[4]).toBe(state.lockHolders[0]);

    const serialized = JSON.stringify(state.commands);
    expect(serialized).not.toContain("super-secret-token");
  });

  it("serializes concurrent updates with lock contention", async () => {
    const state: MockRedisState = { values: new Map(), lockHolders: [], commands: [] };
    let held = false;
    const contendingFetch: typeof fetch = (async (input, init) => {
      const body = typeof init?.body === "string" ? init.body : "";
      const commands = JSON.parse(body || "[]") as unknown[][];
      const isLockSet =
        commands.length === 1 &&
        String(commands[0]?.[0]).toUpperCase() === "SET" &&
        String(commands[0]?.[1]).endsWith(":lock") &&
        commands[0]?.includes("NX");

      if (isLockSet && held) {
        return new Response(JSON.stringify([{ result: null }]), { status: 200 });
      }
      if (isLockSet) held = true;
      const response = await createMockRedisFetch(state)(input, init);
      const isUnlock = commands.some((c) => String(c[0]).toUpperCase() === "EVAL");
      if (isUnlock) held = false;
      return response;
    }) as typeof fetch;

    const a = createRedisLabStoreAdapter({
      ...baseConfig,
      fetchImpl: contendingFetch,
      lockRetries: 30,
      lockRetryDelayMs: 2,
    });
    const b = createRedisLabStoreAdapter({
      ...baseConfig,
      fetchImpl: contendingFetch,
      lockRetries: 30,
      lockRetryDelayMs: 2,
    });

    await a.ensure();
    await Promise.all([
      a.update((store) => {
        store.sessions.push({
          id: "s-a",
          userId: "u1",
          createdAt: "2026-01-01T00:00:00.000Z",
          expiresAt: "2026-01-02T00:00:00.000Z",
        });
      }),
      b.update((store) => {
        store.sessions.push({
          id: "s-b",
          userId: "u2",
          createdAt: "2026-01-01T00:00:00.000Z",
          expiresAt: "2026-01-02T00:00:00.000Z",
        });
      }),
    ]);

    const finalStore = JSON.parse(state.values.get("dna:lab:store") ?? "{}") as LabStore;
    expect(finalStore.sessions.map((s) => s.id).sort()).toEqual(["s-a", "s-b"]);
  });

  it("does not release a lock owned by another token", async () => {
    const state: MockRedisState = {
      values: new Map([["dna:lab:store:lock", "other-token"]]),
      lockHolders: [],
      commands: [],
    };
    const adapter = createRedisLabStoreAdapter({
      ...baseConfig,
      fetchImpl: createMockRedisFetch(state),
      lockRetries: 3,
      lockRetryDelayMs: 1,
    });

    await expect(adapter.update((store) => {
      store.users.push({
        id: "u1",
        name: "Ada",
        email: "ada@example.com",
        passwordHash: "h",
        passwordSalt: "s",
        createdAt: "2026-01-01T00:00:00.000Z",
        pairingId: "p1",
      });
    })).rejects.toBeInstanceOf(LabStateUnavailableError);

    expect(state.values.get("dna:lab:store:lock")).toBe("other-token");
  });

  it("fails closed when redis is unreachable without leaking the token", async () => {
    const adapter = createRedisLabStoreAdapter({
      ...baseConfig,
      fetchImpl: (async () => {
        throw new Error("connect ECONNREFUSED secret-in-stack super-secret-token");
      }) as typeof fetch,
    });

    await expect(adapter.ping()).rejects.toBeInstanceOf(LabStateUnavailableError);
    await expect(adapter.ping()).rejects.toThrow(/unreachable/i);
    try {
      await adapter.ping();
    } catch (err) {
      expect(String(err)).not.toContain("super-secret-token");
    }
  });

  it("createLabStoreAdapter throws config errors without secrets", () => {
    expect(() =>
      createLabStoreAdapter("/tmp", {
        env: {
          DNA_LAB_STATE_BACKEND: "redis",
          DNA_LAB_REDIS_URL: "https://example.upstash.io",
          DNA_LAB_REDIS_TOKEN: "super-secret-token",
        },
      }),
    ).toThrow(LabStateConfigError);

    try {
      createLabStoreAdapter("/tmp", {
        env: {
          DNA_LAB_STATE_BACKEND: "redis",
          DNA_LAB_REDIS_URL: "https://example.upstash.io",
          DNA_LAB_REDIS_TOKEN: "super-secret-token",
        },
      });
    } catch (err) {
      expect(String(err)).not.toContain("super-secret-token");
    }
  });
});
