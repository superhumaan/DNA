import { randomBytes } from "node:crypto";
import type { LabStore, LabStoreAdapter } from "./types.js";
import { emptyLabStore, normalizeLabStore, serializeLabStore } from "./storage-normalize.js";

export interface LabRedisConfig {
  url: string;
  token: string;
  key: string;
}

export interface RedisLabStoreOptions extends LabRedisConfig {
  fetchImpl?: typeof fetch;
  lockTtlSeconds?: number;
  lockRetries?: number;
  lockRetryDelayMs?: number;
}

export class LabStateUnavailableError extends Error {
  readonly code = "LAB_STATE_UNAVAILABLE";
  constructor(message: string) {
    super(message);
    this.name = "LabStateUnavailableError";
  }
}

export class LabStateConfigError extends Error {
  readonly code = "LAB_STATE_CONFIG";
  constructor(message: string) {
    super(message);
    this.name = "LabStateConfigError";
  }
}

const LOCK_SCRIPT =
  "if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end";

type RedisResult = { result?: unknown; error?: string };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeRedisUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new LabStateConfigError("DNA Lab shared state URL is malformed.");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new LabStateConfigError("DNA Lab shared state URL must be http(s).");
  }
  return trimmed;
}

/**
 * Redis-compatible shared Lab store via Upstash-style REST (`fetch` only).
 * Atomic updates use SET NX EX lock + token-safe EVAL release.
 */
export function createRedisLabStoreAdapter(options: RedisLabStoreOptions): LabStoreAdapter {
  const baseUrl = sanitizeRedisUrl(options.url);
  const key = options.key.trim();
  if (!key) throw new LabStateConfigError("DNA Lab shared state key is empty.");
  const lockKey = `${key}:lock`;
  const lockTtlSeconds = options.lockTtlSeconds ?? 5;
  const lockRetries = options.lockRetries ?? 40;
  const lockRetryDelayMs = options.lockRetryDelayMs ?? 25;
  const fetchImpl = options.fetchImpl ?? fetch;
  const authHeader = `Bearer ${options.token}`;

  async function pipeline(commands: unknown[][]): Promise<RedisResult[]> {
    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      });
    } catch {
      throw new LabStateUnavailableError("DNA Lab shared state backend is unreachable.");
    }
    if (!response.ok) {
      throw new LabStateUnavailableError(
        `DNA Lab shared state backend returned HTTP ${response.status}.`,
      );
    }
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new LabStateUnavailableError("DNA Lab shared state backend returned invalid JSON.");
    }
    if (!Array.isArray(payload)) {
      throw new LabStateUnavailableError("DNA Lab shared state backend returned an unexpected payload.");
    }
    const rows = payload as RedisResult[];
    for (const row of rows) {
      if (row && typeof row === "object" && typeof row.error === "string" && row.error) {
        throw new LabStateUnavailableError("DNA Lab shared state backend rejected a command.");
      }
    }
    return rows;
  }

  async function getStore(): Promise<LabStore> {
    const [row] = await pipeline([["GET", key]]);
    const raw = row?.result;
    if (raw == null || raw === "") return emptyLabStore();
    if (typeof raw !== "string") {
      throw new LabStateUnavailableError("DNA Lab shared state value has an unexpected type.");
    }
    try {
      return normalizeLabStore(JSON.parse(raw) as unknown);
    } catch {
      throw new LabStateUnavailableError("DNA Lab shared state value is corrupt.");
    }
  }

  async function setStore(store: LabStore): Promise<void> {
    await pipeline([["SET", key, serializeLabStore(store)]]);
  }

  async function acquireLock(): Promise<string> {
    const token = randomBytes(16).toString("hex");
    for (let attempt = 0; attempt < lockRetries; attempt++) {
      const [row] = await pipeline([["SET", lockKey, token, "NX", "EX", String(lockTtlSeconds)]]);
      if (row?.result === "OK") return token;
      await sleep(lockRetryDelayMs);
    }
    throw new LabStateUnavailableError("DNA Lab shared state lock could not be acquired.");
  }

  async function releaseLock(token: string): Promise<void> {
    await pipeline([["EVAL", LOCK_SCRIPT, "1", lockKey, token]]);
  }

  return {
    backend: "shared-redis",
    location: key,
    async ensure() {
      const [row] = await pipeline([["GET", key]]);
      const existed = row?.result != null && row.result !== "";
      if (!existed) {
        await setStore(emptyLabStore());
      }
      return { path: key, created: !existed };
    },
    async read() {
      return getStore();
    },
    async write(store) {
      const token = await acquireLock();
      try {
        await setStore(store);
      } finally {
        await releaseLock(token);
      }
    },
    async update(mutator) {
      const token = await acquireLock();
      try {
        const store = await getStore();
        mutator(store);
        await setStore(store);
      } finally {
        await releaseLock(token);
      }
    },
    async ping() {
      await pipeline([["PING"]]);
    },
  };
}

export type LabStorageResolution =
  | { kind: "file" }
  | { kind: "redis"; config: LabRedisConfig }
  | { kind: "invalid"; reason: string; backend: "shared-redis" };

/**
 * Resolve Lab persistence from env.
 * Shared Redis requires explicit backend + url + token + key (fail closed otherwise).
 */
export function resolveLabStorageConfig(
  env: NodeJS.ProcessEnv = process.env,
): LabStorageResolution {
  const rawBackend = (env.DNA_LAB_STATE_BACKEND ?? "file").trim().toLowerCase();
  if (!rawBackend || rawBackend === "file") {
    return { kind: "file" };
  }
  if (rawBackend !== "redis" && rawBackend !== "shared-redis") {
    return {
      kind: "invalid",
      backend: "shared-redis",
      reason: `DNA Lab state backend "${rawBackend}" is not supported. Use "file" or "redis".`,
    };
  }

  const url = env.DNA_LAB_REDIS_URL?.trim() ?? "";
  const token = env.DNA_LAB_REDIS_TOKEN?.trim() ?? "";
  const key = env.DNA_LAB_REDIS_KEY?.trim() ?? "";
  const missing: string[] = [];
  if (!url) missing.push("DNA_LAB_REDIS_URL");
  if (!token) missing.push("DNA_LAB_REDIS_TOKEN");
  if (!key) missing.push("DNA_LAB_REDIS_KEY");
  if (missing.length > 0) {
    return {
      kind: "invalid",
      backend: "shared-redis",
      reason: `DNA Lab shared state is misconfigured (missing ${missing.join(", ")}).`,
    };
  }

  try {
    sanitizeRedisUrl(url);
  } catch (err) {
    return {
      kind: "invalid",
      backend: "shared-redis",
      reason: err instanceof Error ? err.message : "DNA Lab shared state URL is malformed.",
    };
  }

  return { kind: "redis", config: { url, token, key } };
}
