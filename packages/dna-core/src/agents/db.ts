import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { open, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { DNA_AGENTS_DB, DNA_AGENTS_LOCK } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";
import {
  isAgentStatus,
  isAgentType,
  type AgentRecord,
  type AgentStatus,
  type AgentType,
} from "./types.js";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  parent_id TEXT,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  task TEXT NOT NULL DEFAULT '',
  started_at TEXT NOT NULL,
  heartbeat_at TEXT NOT NULL,
  branch TEXT,
  worktree TEXT,
  claimed_paths TEXT NOT NULL DEFAULT '[]',
  modified_paths TEXT NOT NULL DEFAULT '[]',
  last_commit TEXT
);
`;

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...params: unknown[]): unknown;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  };
  close(): void;
};

interface AgentsRow {
  id: string;
  parent_id: string | null;
  type: string;
  status: string;
  task: string;
  started_at: string;
  heartbeat_at: string;
  branch: string | null;
  worktree: string | null;
  claimed_paths: string;
  modified_paths: string;
  last_commit: string | null;
}

export interface AgentStore {
  backend: "sqlite" | "fallback";
  dbPath: string;
  lockPath: string;
  upsert(record: AgentRecord): Promise<AgentRecord>;
  get(id: string): Promise<AgentRecord | null>;
  list(): Promise<AgentRecord[]>;
  update(id: string, patch: Partial<AgentRecord>): Promise<AgentRecord | null>;
  close(): void;
}

const processLocks = new Map<string, Promise<unknown>>();
const processLockDepth = new Map<string, number>();

async function withProcessLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const depth = processLockDepth.get(key) ?? 0;
  if (depth > 0) {
    processLockDepth.set(key, depth + 1);
    try {
      return await fn();
    } finally {
      const nextDepth = (processLockDepth.get(key) ?? 1) - 1;
      if (nextDepth <= 0) processLockDepth.delete(key);
      else processLockDepth.set(key, nextDepth);
    }
  }

  const prev = processLocks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = prev.then(() => gate);
  processLocks.set(key, queued);
  await prev.catch(() => undefined);
  processLockDepth.set(key, 1);
  try {
    return await fn();
  } finally {
    processLockDepth.delete(key);
    release();
    if (processLocks.get(key) === queued) processLocks.delete(key);
  }
}

async function acquireExclusiveLock(lockPath: string, timeoutMs = 10_000): Promise<() => Promise<void>> {
  await ensureDir(dirname(lockPath));
  const started = Date.now();
  while (true) {
    try {
      const handle = await open(lockPath, "wx");
      await handle.writeFile(`${process.pid}\n`, "utf-8");
      return async () => {
        await handle.close().catch(() => undefined);
        await unlink(lockPath).catch(() => undefined);
      };
    } catch {
      try {
        const raw = await readFile(lockPath, "utf-8").catch(() => "");
        const pid = Number(raw.trim());
        let alive = false;
        if (Number.isInteger(pid) && pid > 0) {
          try {
            process.kill(pid, 0);
            alive = true;
          } catch (err) {
            alive = (err as NodeJS.ErrnoException).code === "EPERM";
          }
        }
        if (!alive) {
          await unlink(lockPath).catch(() => undefined);
        }
      } catch {
        // lock gone
      }
      if (Date.now() - started > timeoutMs) {
        throw new Error(`Agent mesh lock timeout: ${lockPath}`);
      }
      await new Promise((r) => setTimeout(r, 25));
    }
  }
}

export async function withAgentLock<T>(root: string, fn: () => Promise<T>): Promise<T> {
  const lockPath = join(root, DNA_AGENTS_LOCK);
  const alreadyHeld = (processLockDepth.get(lockPath) ?? 0) > 0;
  return withProcessLock(lockPath, async () => {
    if (alreadyHeld) return fn();
    const release = await acquireExclusiveLock(lockPath);
    try {
      return await fn();
    } finally {
      await release();
    }
  });
}

function parsePaths(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((p): p is string => typeof p === "string");
  }
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === "string") : [];
  } catch {
    return [];
  }
}

function rowToRecord(row: AgentsRow): AgentRecord {
  return {
    id: row.id,
    parent_id: row.parent_id ?? null,
    type: isAgentType(row.type) ? row.type : "primary",
    status: isAgentStatus(row.status) ? row.status : "active",
    task: row.task ?? "",
    started_at: row.started_at,
    heartbeat_at: row.heartbeat_at,
    branch: row.branch ?? null,
    worktree: row.worktree ?? null,
    claimed_paths: parsePaths(row.claimed_paths),
    modified_paths: parsePaths(row.modified_paths),
    last_commit: row.last_commit ?? null,
  };
}

function tryOpenSqlite(dbPath: string): SqliteDatabase | null {
  try {
    const require = createRequire(import.meta.url);
    const sqlite = require("node:sqlite") as {
      DatabaseSync?: new (path: string) => SqliteDatabase;
    };
    if (!sqlite.DatabaseSync) return null;
    const db = new sqlite.DatabaseSync(dbPath);
    db.exec(SCHEMA_SQL);
    return db;
  } catch {
    return null;
  }
}

const sqliteStores = new Map<string, SqliteAgentStore>();

class SqliteAgentStore implements AgentStore {
  readonly backend = "sqlite" as const;

  constructor(
    readonly dbPath: string,
    readonly lockPath: string,
    private readonly db: SqliteDatabase,
  ) {}

  async upsert(record: AgentRecord): Promise<AgentRecord> {
    this.db
      .prepare(
        `INSERT INTO agents (id, parent_id, type, status, task, started_at, heartbeat_at, branch, worktree, claimed_paths, modified_paths, last_commit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           parent_id=excluded.parent_id,
           type=excluded.type,
           status=excluded.status,
           task=excluded.task,
           started_at=excluded.started_at,
           heartbeat_at=excluded.heartbeat_at,
           branch=excluded.branch,
           worktree=excluded.worktree,
           claimed_paths=excluded.claimed_paths,
           modified_paths=excluded.modified_paths,
           last_commit=excluded.last_commit`,
      )
      .run(
        record.id,
        record.parent_id,
        record.type,
        record.status,
        record.task,
        record.started_at,
        record.heartbeat_at,
        record.branch,
        record.worktree,
        JSON.stringify(record.claimed_paths),
        JSON.stringify(record.modified_paths),
        record.last_commit,
      );
    return record;
  }

  async get(id: string): Promise<AgentRecord | null> {
    const row = this.db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as AgentsRow | undefined;
    return row ? rowToRecord(row) : null;
  }

  async list(): Promise<AgentRecord[]> {
    const rows = this.db.prepare("SELECT * FROM agents ORDER BY started_at ASC").all() as AgentsRow[];
    return rows.map(rowToRecord);
  }

  async update(id: string, patch: Partial<AgentRecord>): Promise<AgentRecord | null> {
    const current = await this.get(id);
    if (!current) return null;
    const next: AgentRecord = {
      ...current,
      ...patch,
      id,
      claimed_paths: patch.claimed_paths ?? current.claimed_paths,
      modified_paths: patch.modified_paths ?? current.modified_paths,
    };
    return this.upsert(next);
  }

  close(): void {
    // Keep the process-wide connection open — node:sqlite DatabaseSync
    // cannot be reused after close(), and CLI commands open the store often.
  }

  dispose(): void {
    try {
      this.db.close();
    } catch {
      // already closed
    }
    sqliteStores.delete(this.dbPath);
  }
}

class FallbackAgentStore implements AgentStore {
  readonly backend = "fallback" as const;
  private readonly storePath: string;

  constructor(
    readonly dbPath: string,
    readonly lockPath: string,
  ) {
    this.storePath = join(dirname(dbPath), "agents.json");
  }

  private async readAll(): Promise<AgentRecord[]> {
    if (!(await fileExists(this.storePath))) return [];
    try {
      const raw = await readFile(this.storePath, "utf-8");
      const parsed = JSON.parse(raw) as { agents?: AgentsRow[] };
      const rows = Array.isArray(parsed.agents) ? parsed.agents : [];
      return rows.map(rowToRecord);
    } catch {
      return [];
    }
  }

  private async writeAll(agents: AgentRecord[]): Promise<void> {
    await ensureDir(dirname(this.storePath));
    const payload = {
      version: 1,
      agents: agents.map((a) => ({
        ...a,
        claimed_paths: JSON.stringify(a.claimed_paths),
        modified_paths: JSON.stringify(a.modified_paths),
      })),
    };
    await writeFile(this.storePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  }

  async upsert(record: AgentRecord): Promise<AgentRecord> {
    const agents = await this.readAll();
    const idx = agents.findIndex((a) => a.id === record.id);
    if (idx >= 0) agents[idx] = record;
    else agents.push(record);
    await this.writeAll(agents);
    return record;
  }

  async get(id: string): Promise<AgentRecord | null> {
    return (await this.readAll()).find((a) => a.id === id) ?? null;
  }

  async list(): Promise<AgentRecord[]> {
    return this.readAll();
  }

  async update(id: string, patch: Partial<AgentRecord>): Promise<AgentRecord | null> {
    const current = await this.get(id);
    if (!current) return null;
    const next: AgentRecord = {
      ...current,
      ...patch,
      id,
      claimed_paths: patch.claimed_paths ?? current.claimed_paths,
      modified_paths: patch.modified_paths ?? current.modified_paths,
    };
    return this.upsert(next);
  }

  close(): void {
    // file store
  }
}

export function agentsDbPath(root: string): string {
  return join(root, DNA_AGENTS_DB);
}

export function agentsLockPath(root: string): string {
  return join(root, DNA_AGENTS_LOCK);
}

export async function openAgentStore(
  root: string,
  options: { forceFallback?: boolean } = {},
): Promise<AgentStore> {
  const dbPath = agentsDbPath(root);
  const lockPath = agentsLockPath(root);
  await ensureDir(dirname(dbPath));

  if (!options.forceFallback) {
    const cached = sqliteStores.get(dbPath);
    if (cached) return cached;
    const sqlite = tryOpenSqlite(dbPath);
    if (sqlite) {
      const store = new SqliteAgentStore(dbPath, lockPath, sqlite);
      sqliteStores.set(dbPath, store);
      return store;
    }
  }

  return new FallbackAgentStore(dbPath, lockPath);
}

export function newAgentId(): string {
  return randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function createAgentRecord(input: {
  id?: string;
  parent_id?: string | null;
  type?: AgentType;
  status?: AgentStatus;
  task?: string;
  branch?: string | null;
  worktree?: string | null;
  claimed_paths?: string[];
  modified_paths?: string[];
  last_commit?: string | null;
}): AgentRecord {
  const ts = nowIso();
  return {
    id: input.id ?? newAgentId(),
    parent_id: input.parent_id ?? null,
    type: input.type ?? "primary",
    status: input.status ?? "active",
    task: input.task ?? "",
    started_at: ts,
    heartbeat_at: ts,
    branch: input.branch ?? null,
    worktree: input.worktree ?? null,
    claimed_paths: input.claimed_paths ?? [],
    modified_paths: input.modified_paths ?? [],
    last_commit: input.last_commit ?? null,
  };
}
