import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DNA_RUNTIME_DB } from "@superhumaan/dna-config";
import { mkdir } from "node:fs/promises";

const SCHEMA_VERSION = 1;

interface RuntimeStoreData {
  version: number;
  events: unknown[];
  issues: unknown[];
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
    };
  } catch {
    return { version: SCHEMA_VERSION, events: [], issues: [] };
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
    : { version: SCHEMA_VERSION, events: [], issues: [] };

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
