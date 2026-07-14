import { dirname, join } from "node:path";
import { readFile, rename, writeFile } from "node:fs/promises";
import { DNA_LAB_STORE } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";
import type {
  LabOtpChallenge,
  LabPairingPending,
  LabRelease,
  LabSession,
  LabSourceMapMeta,
  LabStore,
  LabUser,
} from "./types.js";

const STORE_VERSION = 1;

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

function emptyStore(): LabStore {
  return {
    version: STORE_VERSION,
    users: [],
    sessions: [],
    otps: [],
    pairings: [],
    releases: [],
    sourceMaps: [],
  };
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
  if (!(await fileExists(path))) return emptyStore();
  try {
    const raw = await readFile(path, "utf-8");
    if (!raw.trim()) return emptyStore();
    const parsed = JSON.parse(raw) as LabStore;
    if (!parsed || typeof parsed !== "object") {
      await quarantineCorrupt(path, "not an object");
      return emptyStore();
    }
    return {
      version: parsed.version ?? STORE_VERSION,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      otps: Array.isArray(parsed.otps) ? parsed.otps : [],
      pairings: Array.isArray(parsed.pairings) ? parsed.pairings : [],
      releases: Array.isArray(parsed.releases) ? parsed.releases : [],
      sourceMaps: Array.isArray(parsed.sourceMaps) ? parsed.sourceMaps : [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await quarantineCorrupt(path, message);
    return emptyStore();
  }
}

async function saveStoreUnlocked(root: string, store: LabStore): Promise<void> {
  const path = join(root, DNA_LAB_STORE);
  await ensureDir(dirname(path));
  const payload = `${JSON.stringify({ ...store, version: STORE_VERSION }, null, 2)}\n`;
  const tmp = `${path}.tmp.${process.pid}.${Date.now()}`;
  await writeFile(tmp, payload, "utf-8");
  await rename(tmp, path);
}

async function loadStore(root: string): Promise<LabStore> {
  const path = join(root, DNA_LAB_STORE);
  return withStoreLock(path, () => loadStoreUnlocked(root));
}

async function saveStore(root: string, store: LabStore): Promise<void> {
  const path = join(root, DNA_LAB_STORE);
  await withStoreLock(path, async () => {
    await saveStoreUnlocked(root, store);
  });
}

/** Mutating helper — load, transform, save under one lock. */
async function updateStore(root: string, mutator: (store: LabStore) => void): Promise<void> {
  const path = join(root, DNA_LAB_STORE);
  await withStoreLock(path, async () => {
    const store = await loadStoreUnlocked(root);
    mutator(store);
    await saveStoreUnlocked(root, store);
  });
}

export async function ensureLabStore(root: string): Promise<{ path: string; created: boolean }> {
  const path = join(root, DNA_LAB_STORE);
  return withStoreLock(path, async () => {
    const existed = await fileExists(path);
    if (!existed) {
      await saveStoreUnlocked(root, emptyStore());
    } else {
      await loadStoreUnlocked(root);
      if (!(await fileExists(path))) {
        await saveStoreUnlocked(root, emptyStore());
      }
    }
    return { path: DNA_LAB_STORE, created: !existed };
  });
}

export async function readLabStore(root: string): Promise<LabStore> {
  await ensureLabStore(root);
  return loadStore(root);
}

export async function writeLabStore(root: string, store: LabStore): Promise<void> {
  await saveStore(root, store);
}

export async function upsertLabUser(root: string, user: LabUser): Promise<void> {
  await updateStore(root, (store) => {
    const idx = store.users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (idx >= 0) store.users[idx] = user;
    else store.users.push(user);
  });
}

export async function findLabUserByEmail(root: string, email: string): Promise<LabUser | undefined> {
  const store = await loadStore(root);
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findLabUserById(root: string, id: string): Promise<LabUser | undefined> {
  const store = await loadStore(root);
  return store.users.find((u) => u.id === id);
}

export async function saveLabSession(root: string, session: LabSession): Promise<void> {
  await updateStore(root, (store) => {
    store.sessions = store.sessions.filter((s) => s.id !== session.id && s.userId !== session.userId);
    store.sessions.push(session);
  });
}

export async function findLabSession(root: string, sessionId: string): Promise<LabSession | undefined> {
  const store = await loadStore(root);
  return store.sessions.find((s) => s.id === sessionId);
}

export async function deleteLabSession(root: string, sessionId: string): Promise<void> {
  await updateStore(root, (store) => {
    store.sessions = store.sessions.filter((s) => s.id !== sessionId);
  });
}

export async function saveLabOtp(root: string, otp: LabOtpChallenge): Promise<void> {
  await updateStore(root, (store) => {
    store.otps = store.otps.filter((o) => o.email !== otp.email || o.purpose !== otp.purpose);
    store.otps.push(otp);
  });
}

export async function findLabOtp(
  root: string,
  email: string,
  purpose: LabOtpChallenge["purpose"],
): Promise<LabOtpChallenge | undefined> {
  const store = await loadStore(root);
  return store.otps.find((o) => o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose);
}

export async function clearLabOtp(root: string, email: string, purpose: LabOtpChallenge["purpose"]): Promise<void> {
  await updateStore(root, (store) => {
    store.otps = store.otps.filter(
      (o) => !(o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose),
    );
  });
}

export async function saveLabPairing(root: string, pairing: LabPairingPending): Promise<void> {
  await updateStore(root, (store) => {
    store.pairings = store.pairings.filter((p) => p.pairingId !== pairing.pairingId);
    store.pairings.push(pairing);
  });
}

export async function findLabPairing(root: string, pairingId: string): Promise<LabPairingPending | undefined> {
  const store = await loadStore(root);
  return store.pairings.find((p) => p.pairingId === pairingId);
}

export async function listLabReleases(root: string): Promise<LabRelease[]> {
  const store = await loadStore(root);
  return store.releases.sort((a, b) => b.deployedAt.localeCompare(a.deployedAt));
}

export async function upsertLabRelease(root: string, release: LabRelease): Promise<void> {
  await updateStore(root, (store) => {
    const idx = store.releases.findIndex((r) => r.id === release.id);
    if (idx >= 0) store.releases[idx] = release;
    else store.releases.push(release);
  });
}

export async function listSourceMapMeta(root: string): Promise<LabSourceMapMeta[]> {
  const store = await loadStore(root);
  return store.sourceMaps;
}

export async function upsertSourceMapMeta(root: string, meta: LabSourceMapMeta): Promise<void> {
  await updateStore(root, (store) => {
    const idx = store.sourceMaps.findIndex((m) => m.id === meta.id);
    if (idx >= 0) store.sourceMaps[idx] = meta;
    else store.sourceMaps.push(meta);
  });
}
