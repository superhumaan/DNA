import { dirname, join } from "node:path";
import { readFile, rename, writeFile } from "node:fs/promises";
import { DNA_RUNTIME_DB } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";

const SCHEMA_VERSION = 1;
const MAX_EVENTS = 2000;
const MAX_ISSUES = 2000;

interface RuntimeStoreData {
  version: number;
  events: unknown[];
  issues: unknown[];
}

const locks = new Map<string, Promise<unknown>>();

async function withStoreLock<T>(dbPath: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(dbPath) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const next = prev.then(() => gate);
  locks.set(dbPath, next);

  await prev.catch(() => undefined);
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(dbPath) === next) locks.delete(dbPath);
  }
}

function emptyStore(): RuntimeStoreData {
  return { version: SCHEMA_VERSION, events: [], issues: [] };
}

function capStore(store: RuntimeStoreData): RuntimeStoreData {
  if (store.events.length > MAX_EVENTS) {
    store.events = store.events.slice(-MAX_EVENTS);
  }
  if (store.issues.length > MAX_ISSUES) {
    store.issues = store.issues.slice(-MAX_ISSUES);
  }
  return store;
}

async function quarantineCorrupt(dbPath: string, reason: string): Promise<void> {
  try {
    const dest = `${dbPath}.corrupt.${Date.now()}`;
    await rename(dbPath, dest);
    console.error("dna_runtime_db_quarantined", { path: dest, reason });
  } catch {
    // ignore if already moved
  }
}

async function loadStore(dbPath: string): Promise<RuntimeStoreData> {
  if (!(await fileExists(dbPath))) return emptyStore();

  try {
    const raw = await readFile(dbPath, "utf-8");
    if (!raw.trim()) return emptyStore();

    const parsed = JSON.parse(raw) as RuntimeStoreData;
    if (!parsed || typeof parsed !== "object") {
      await quarantineCorrupt(dbPath, "not an object");
      return emptyStore();
    }

    return capStore({
      version: typeof parsed.version === "number" ? parsed.version : SCHEMA_VERSION,
      events: Array.isArray(parsed.events) ? parsed.events : [],
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await quarantineCorrupt(dbPath, message);
    return emptyStore();
  }
}

async function saveStore(dbPath: string, data: RuntimeStoreData): Promise<void> {
  await ensureDir(dirname(dbPath));
  const payload = `${JSON.stringify(capStore(data), null, 2)}\n`;
  const tmp = `${dbPath}.tmp.${process.pid}.${Date.now()}`;
  await writeFile(tmp, payload, "utf-8");
  await rename(tmp, dbPath);
}

async function migrateJsonl(root: string, dbPath: string): Promise<number> {
  let migrated = 0;
  const store = await loadStore(dbPath);

  for (const file of ["events.jsonl", "issues.jsonl"] as const) {
    const jsonlPath = join(root, ".DNA", "runtime", file);
    if (!(await fileExists(jsonlPath))) continue;

    try {
      const raw = await readFile(jsonlPath, "utf-8");
      const lines = raw.split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const record = JSON.parse(line) as unknown;
          if (file === "events.jsonl") store.events.push(record);
          else store.issues.push(record);
          migrated++;
        } catch {
          // skip corrupt lines
        }
      }
    } catch {
      // skip corrupt files
    }
  }

  if (migrated > 0) {
    await saveStore(dbPath, store);
  }

  return migrated;
}

export async function ensureRuntimeDatabase(
  root: string,
): Promise<{ path: string; created: boolean; migrated: number }> {
  const dbPath = join(root, DNA_RUNTIME_DB);
  await ensureDir(join(root, ".DNA", "data"));

  return withStoreLock(dbPath, async () => {
    const existed = await fileExists(dbPath);
    if (!existed) {
      await saveStore(dbPath, emptyStore());
    } else {
      // Probe for corruption early and reset if needed
      await loadStore(dbPath);
      if (!(await fileExists(dbPath))) {
        await saveStore(dbPath, emptyStore());
      }
    }

    const migrated = await migrateJsonl(root, dbPath);
    return {
      path: DNA_RUNTIME_DB,
      created: !existed,
      migrated,
    };
  });
}

export async function appendRuntimeRecord(
  root: string,
  table: "events" | "issues",
  record: unknown,
): Promise<void> {
  const dbPath = join(root, DNA_RUNTIME_DB);
  await ensureDir(join(root, ".DNA", "data"));

  await withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    if (table === "events") store.events.push(record);
    else store.issues.push(record);
    await saveStore(dbPath, store);
  });
}

export async function readRuntimeRecords<T>(
  root: string,
  table: "events" | "issues",
): Promise<T[]> {
  const dbPath = join(root, DNA_RUNTIME_DB);
  if (!(await fileExists(dbPath))) return [];
  return withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    return (table === "events" ? store.events : store.issues) as T[];
  });
}

/** Repair path: quarantine corrupt store and recreate empty JSON. */
export async function repairRuntimeDatabase(root: string): Promise<{ repaired: boolean; path: string }> {
  const dbPath = join(root, DNA_RUNTIME_DB);
  await ensureDir(join(root, ".DNA", "data"));

  return withStoreLock(dbPath, async () => {
    if (!(await fileExists(dbPath))) {
      await saveStore(dbPath, emptyStore());
      return { repaired: true, path: DNA_RUNTIME_DB };
    }

    try {
      const raw = await readFile(dbPath, "utf-8");
      JSON.parse(raw);
      return { repaired: false, path: DNA_RUNTIME_DB };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await quarantineCorrupt(dbPath, message);
      await saveStore(dbPath, emptyStore());
      return { repaired: true, path: DNA_RUNTIME_DB };
    }
  });
}
