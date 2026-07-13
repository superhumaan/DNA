import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DNA_LAB_STORE } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";
import type { LabOtpChallenge, LabPairingPending, LabRelease, LabSession, LabSourceMapMeta, LabStore, LabUser } from "./types.js";

const STORE_VERSION = 1;

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

async function loadStore(root: string): Promise<LabStore> {
  const path = join(root, DNA_LAB_STORE);
  if (!(await fileExists(path))) return emptyStore();
  try {
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw) as LabStore;
    return {
      version: parsed.version ?? STORE_VERSION,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      otps: Array.isArray(parsed.otps) ? parsed.otps : [],
      pairings: Array.isArray(parsed.pairings) ? parsed.pairings : [],
      releases: Array.isArray(parsed.releases) ? parsed.releases : [],
      sourceMaps: Array.isArray(parsed.sourceMaps) ? parsed.sourceMaps : [],
    };
  } catch {
    return emptyStore();
  }
}

async function saveStore(root: string, store: LabStore): Promise<void> {
  const path = join(root, DNA_LAB_STORE);
  await ensureDir(join(root, ".DNA", "data"));
  await writeFile(path, JSON.stringify(store, null, 2) + "\n", "utf-8");
}

export async function ensureLabStore(root: string): Promise<{ path: string; created: boolean }> {
  const path = join(root, DNA_LAB_STORE);
  const existed = await fileExists(path);
  if (!existed) {
    await saveStore(root, emptyStore());
  }
  return { path: DNA_LAB_STORE, created: !existed };
}

export async function readLabStore(root: string): Promise<LabStore> {
  await ensureLabStore(root);
  return loadStore(root);
}

export async function writeLabStore(root: string, store: LabStore): Promise<void> {
  await saveStore(root, store);
}

export async function upsertLabUser(root: string, user: LabUser): Promise<void> {
  const store = await loadStore(root);
  const idx = store.users.findIndex((u) => u.id === user.id || u.email === user.email);
  if (idx >= 0) store.users[idx] = user;
  else store.users.push(user);
  await saveStore(root, store);
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
  const store = await loadStore(root);
  store.sessions = store.sessions.filter((s) => s.id !== session.id && s.userId !== session.userId);
  store.sessions.push(session);
  await saveStore(root, store);
}

export async function findLabSession(root: string, sessionId: string): Promise<LabSession | undefined> {
  const store = await loadStore(root);
  return store.sessions.find((s) => s.id === sessionId);
}

export async function deleteLabSession(root: string, sessionId: string): Promise<void> {
  const store = await loadStore(root);
  store.sessions = store.sessions.filter((s) => s.id !== sessionId);
  await saveStore(root, store);
}

export async function saveLabOtp(root: string, otp: LabOtpChallenge): Promise<void> {
  const store = await loadStore(root);
  store.otps = store.otps.filter((o) => o.email !== otp.email || o.purpose !== otp.purpose);
  store.otps.push(otp);
  await saveStore(root, store);
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
  const store = await loadStore(root);
  store.otps = store.otps.filter((o) => !(o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose));
  await saveStore(root, store);
}

export async function saveLabPairing(root: string, pairing: LabPairingPending): Promise<void> {
  const store = await loadStore(root);
  store.pairings = store.pairings.filter((p) => p.pairingId !== pairing.pairingId);
  store.pairings.push(pairing);
  await saveStore(root, store);
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
  const store = await loadStore(root);
  const idx = store.releases.findIndex((r) => r.id === release.id);
  if (idx >= 0) store.releases[idx] = release;
  else store.releases.push(release);
  await saveStore(root, store);
}

export async function listSourceMapMeta(root: string): Promise<LabSourceMapMeta[]> {
  const store = await loadStore(root);
  return store.sourceMaps;
}

export async function upsertSourceMapMeta(root: string, meta: LabSourceMapMeta): Promise<void> {
  const store = await loadStore(root);
  const idx = store.sourceMaps.findIndex((m) => m.id === meta.id);
  if (idx >= 0) store.sourceMaps[idx] = meta;
  else store.sourceMaps.push(meta);
  await saveStore(root, store);
}
