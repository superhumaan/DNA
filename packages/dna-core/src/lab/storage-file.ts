import { dirname, join } from "node:path";
import { readFile, rename, writeFile } from "node:fs/promises";
import { DNA_LAB_STORE } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";
import type { LabStore, LabStoreAdapter } from "./types.js";
import { emptyLabStore, normalizeLabStore, serializeLabStore, LAB_STORE_VERSION } from "./storage-normalize.js";

const locks = new Map<string, Promise<unknown>>();

async function withStoreLock<T>(path: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(path) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const next = prev.then(() => gate);
  locks.set(path, next);

  await prev.catch(() => undefined);
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(path) === next) locks.delete(path);
  }
}

async function quarantineCorrupt(path: string, reason: string): Promise<void> {
  try {
    const dest = `${path}.corrupt.${Date.now()}`;
    await rename(path, dest);
    console.error("dna_lab_store_quarantined", { path: dest, reason });
  } catch {
    // already moved
  }
}

async function loadStoreUnlocked(root: string): Promise<LabStore> {
  const path = join(root, DNA_LAB_STORE);
  if (!(await fileExists(path))) return emptyLabStore();
  try {
    const raw = await readFile(path, "utf-8");
    if (!raw.trim()) return emptyLabStore();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      await quarantineCorrupt(path, "not an object");
      return emptyLabStore();
    }
    return normalizeLabStore(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await quarantineCorrupt(path, message);
    return emptyLabStore();
  }
}

async function saveStoreUnlocked(root: string, store: LabStore): Promise<void> {
  const path = join(root, DNA_LAB_STORE);
  await ensureDir(dirname(path));
  const payload = `${serializeLabStore({ ...store, version: LAB_STORE_VERSION })}\n`;
  const tmp = `${path}.tmp.${process.pid}.${Date.now()}`;
  await writeFile(tmp, payload, "utf-8");
  await rename(tmp, path);
}

/** Process-local atomic file adapter — default zero-config Lab state. */
export function createFileLabStoreAdapter(root: string): LabStoreAdapter {
  const path = join(root, DNA_LAB_STORE);
  return {
    backend: "single-instance-file",
    location: DNA_LAB_STORE,
    async ensure() {
      return withStoreLock(path, async () => {
        const existed = await fileExists(path);
        if (!existed) {
          await saveStoreUnlocked(root, emptyLabStore());
        } else {
          await loadStoreUnlocked(root);
          if (!(await fileExists(path))) {
            await saveStoreUnlocked(root, emptyLabStore());
          }
        }
        return { path: DNA_LAB_STORE, created: !existed };
      });
    },
    async read() {
      return withStoreLock(path, () => loadStoreUnlocked(root));
    },
    async write(store) {
      await withStoreLock(path, async () => {
        await saveStoreUnlocked(root, store);
      });
    },
    async update(mutator) {
      await withStoreLock(path, async () => {
        const store = await loadStoreUnlocked(root);
        mutator(store);
        await saveStoreUnlocked(root, store);
      });
    },
    async ping() {
      await ensureDir(dirname(path));
    },
  };
}

/** Test helper — clear in-process mutexes. */
export function resetFileLabStoreLocks(): void {
  locks.clear();
}
