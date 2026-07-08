import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DNA_RUNTIME_DB } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";

const SCHEMA_VERSION = 1;

interface RuntimeStoreData {
  version: number;
  events: unknown[];
  issues: unknown[];
}

async function loadStore(dbPath: string): Promise<RuntimeStoreData> {
  try {
    const raw = await readFile(dbPath, "utf-8");
    const parsed = JSON.parse(raw) as RuntimeStoreData;
    return {
      version: parsed.version ?? SCHEMA_VERSION,
      events: Array.isArray(parsed.events) ? parsed.events : [],
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    };
  } catch {
    return { version: SCHEMA_VERSION, events: [], issues: [] };
  }
}

async function saveStore(dbPath: string, data: RuntimeStoreData): Promise<void> {
  await writeFile(dbPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
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
        const record = JSON.parse(line) as unknown;
        if (file === "events.jsonl") {
          store.events.push(record);
        } else {
          store.issues.push(record);
        }
        migrated++;
      }
    } catch {
      // skip corrupt lines
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

  const existed = await fileExists(dbPath);
  if (!existed) {
    await saveStore(dbPath, { version: SCHEMA_VERSION, events: [], issues: [] });
  }

  const migrated = await migrateJsonl(root, dbPath);

  return {
    path: DNA_RUNTIME_DB,
    created: !existed,
    migrated,
  };
}

export async function appendRuntimeRecord(
  root: string,
  table: "events" | "issues",
  record: unknown,
): Promise<void> {
  const dbPath = join(root, DNA_RUNTIME_DB);
  await ensureRuntimeDatabase(root);
  const store = await loadStore(dbPath);

  if (table === "events") {
    store.events.push(record);
  } else {
    store.issues.push(record);
  }

  await saveStore(dbPath, store);
}

export async function readRuntimeRecords<T>(
  root: string,
  table: "events" | "issues",
): Promise<T[]> {
  const dbPath = join(root, DNA_RUNTIME_DB);
  if (!(await fileExists(dbPath))) return [];
  const store = await loadStore(dbPath);
  return (table === "events" ? store.events : store.issues) as T[];
}
