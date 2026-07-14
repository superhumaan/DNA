import { dirname, join } from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { DNA_RUNTIME_DB, type FingerprintRecord } from "@superhumaan/dna-config";

const SCHEMA_VERSION = 2;
const MAX_EVENTS = 2000;
const MAX_ISSUES = 2000;
const MAX_FINGERPRINTS = 2000;

interface RuntimeStoreData {
  version: number;
  events: unknown[];
  issues: unknown[];
  fingerprints: FingerprintRecord[];
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
  return { version: SCHEMA_VERSION, events: [], issues: [], fingerprints: [] };
}

function capStore(store: RuntimeStoreData): RuntimeStoreData {
  if (store.events.length > MAX_EVENTS) store.events = store.events.slice(-MAX_EVENTS);
  if (store.issues.length > MAX_ISSUES) store.issues = store.issues.slice(-MAX_ISSUES);
  if (store.fingerprints.length > MAX_FINGERPRINTS) {
    store.fingerprints = store.fingerprints.slice(-MAX_FINGERPRINTS);
  }
  return store;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path, "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function quarantineCorrupt(dbPath: string, reason: string): Promise<void> {
  try {
    const dest = `${dbPath}.corrupt.${Date.now()}`;
    await rename(dbPath, dest);
    console.error("dna_runtime_db_quarantined", { path: dest, reason });
  } catch {
    // already moved
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
      fingerprints: Array.isArray(parsed.fingerprints) ? parsed.fingerprints : [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await quarantineCorrupt(dbPath, message);
    return emptyStore();
  }
}

async function saveStore(dbPath: string, data: RuntimeStoreData): Promise<void> {
  await mkdir(dirname(dbPath), { recursive: true });
  const payload = `${JSON.stringify(capStore({ ...data, version: SCHEMA_VERSION }), null, 2)}\n`;
  const tmp = `${dbPath}.tmp.${process.pid}.${Date.now()}`;
  await writeFile(tmp, payload, "utf-8");
  await rename(tmp, dbPath);
}

export async function appendRuntimeRecord(
  projectRoot: string,
  table: "events" | "issues",
  record: unknown,
): Promise<void> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  await withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    if (table === "events") store.events.push(record);
    else store.issues.push(record);
    await saveStore(dbPath, store);
  });
}

/**
 * Upsert a classified issue by fingerprint so storms do not append N issue rows.
 * Falls back to append when fingerprint is missing.
 */
export async function upsertRuntimeIssue(
  projectRoot: string,
  issue: { fingerprint?: string; id?: string; [key: string]: unknown },
): Promise<void> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  await withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    const fp = typeof issue.fingerprint === "string" ? issue.fingerprint : undefined;
    if (!fp) {
      store.issues.push(issue);
      await saveStore(dbPath, store);
      return;
    }
    const idx = store.issues.findIndex(
      (row) => (row as { fingerprint?: string }).fingerprint === fp,
    );
    if (idx >= 0) {
      const prev = store.issues[idx] as { id?: string };
      store.issues[idx] = { ...issue, id: prev.id ?? issue.id };
    } else {
      store.issues.push(issue);
    }
    await saveStore(dbPath, store);
  });
}

/** Persist event + upsert issue under one lock (avoids double read/write). */
export async function writeRuntimeOccurrence(
  projectRoot: string,
  options: { event?: unknown; issue: unknown },
): Promise<void> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  await withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    if (options.event) store.events.push(options.event);

    const issue = options.issue as { fingerprint?: string; id?: string; [key: string]: unknown };
    const fp = typeof issue.fingerprint === "string" ? issue.fingerprint : undefined;
    if (!fp) {
      store.issues.push(issue);
    } else {
      const idx = store.issues.findIndex(
        (row) => (row as { fingerprint?: string }).fingerprint === fp,
      );
      if (idx >= 0) {
        const prev = store.issues[idx] as { id?: string };
        store.issues[idx] = { ...issue, id: prev.id ?? issue.id };
      } else {
        store.issues.push(issue);
      }
    }
    await saveStore(dbPath, store);
  });
}

export async function readRuntimeRecords<T>(
  projectRoot: string,
  table: "events" | "issues",
): Promise<T[]> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  if (!(await fileExists(dbPath))) return [];
  return withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    return (table === "events" ? store.events : store.issues) as T[];
  });
}

export async function readFingerprintRecords(projectRoot: string): Promise<FingerprintRecord[]> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  if (!(await fileExists(dbPath))) return [];
  return withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    return store.fingerprints;
  });
}

export async function upsertFingerprintRecord(
  projectRoot: string,
  record: FingerprintRecord,
): Promise<void> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  await withStoreLock(dbPath, async () => {
    const store = await loadStore(dbPath);
    const idx = store.fingerprints.findIndex((r) => r.fingerprint === record.fingerprint);
    if (idx >= 0) store.fingerprints[idx] = record;
    else store.fingerprints.push(record);
    await saveStore(dbPath, store);
  });
}

export async function getBlockerFingerprints(projectRoot: string): Promise<FingerprintRecord[]> {
  const records = await readFingerprintRecords(projectRoot);
  return records.filter((r) => r.isBlocker && r.repairStatus !== "resolved");
}
