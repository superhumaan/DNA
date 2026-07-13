import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DNA_RUNTIME_DB } from "@superhumaan/dna-config";
import { mkdir } from "node:fs/promises";

import type { FingerprintRecord } from "@superhumaan/dna-config";

const SCHEMA_VERSION = 2;

interface RuntimeStoreData {
  version: number;
  events: unknown[];
  issues: unknown[];
  fingerprints: FingerprintRecord[];
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path, "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function loadStore(dbPath: string): Promise<RuntimeStoreData> {
  try {
    const raw = await readFile(dbPath, "utf-8");
    const parsed = JSON.parse(raw) as RuntimeStoreData;
    return {
      version: parsed.version ?? SCHEMA_VERSION,
      events: Array.isArray(parsed.events) ? parsed.events : [],
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      fingerprints: Array.isArray(parsed.fingerprints) ? parsed.fingerprints : [],
    };
  } catch {
    return { version: SCHEMA_VERSION, events: [], issues: [], fingerprints: [] };
  }
}

async function saveStore(dbPath: string, data: RuntimeStoreData): Promise<void> {
  await mkdir(join(dbPath, ".."), { recursive: true });
  await writeFile(dbPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function appendRuntimeRecord(
  projectRoot: string,
  table: "events" | "issues",
  record: unknown,
): Promise<void> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  const store = (await fileExists(dbPath))
    ? await loadStore(dbPath)
    : { version: SCHEMA_VERSION, events: [], issues: [], fingerprints: [] };

  if (table === "events") {
    store.events.push(record);
  } else {
    store.issues.push(record);
  }

  await saveStore(dbPath, store);
}

export async function readRuntimeRecords<T>(
  projectRoot: string,
  table: "events" | "issues",
): Promise<T[]> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  if (!(await fileExists(dbPath))) return [];
  const store = await loadStore(dbPath);
  return (table === "events" ? store.events : store.issues) as T[];
}

export async function readFingerprintRecords(projectRoot: string): Promise<FingerprintRecord[]> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  if (!(await fileExists(dbPath))) return [];
  const store = await loadStore(dbPath);
  return store.fingerprints;
}

export async function upsertFingerprintRecord(
  projectRoot: string,
  record: FingerprintRecord,
): Promise<void> {
  const dbPath = join(projectRoot, DNA_RUNTIME_DB);
  const store = (await fileExists(dbPath))
    ? await loadStore(dbPath)
    : { version: SCHEMA_VERSION, events: [], issues: [], fingerprints: [] };

  const idx = store.fingerprints.findIndex((r) => r.fingerprint === record.fingerprint);
  if (idx >= 0) {
    store.fingerprints[idx] = record;
  } else {
    store.fingerprints.push(record);
  }

  store.version = SCHEMA_VERSION;
  await saveStore(dbPath, store);
}

export async function getBlockerFingerprints(projectRoot: string): Promise<FingerprintRecord[]> {
  const records = await readFingerprintRecords(projectRoot);
  return records.filter((r) => r.isBlocker && r.repairStatus !== "resolved");
}
