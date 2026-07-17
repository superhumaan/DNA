import type { LabOtpChallenge, LabPairingPending, LabRelease, LabSession, LabSourceMapMeta, LabStore, LabStoreAdapter, LabUser } from "./types.js";
import { createFileLabStoreAdapter } from "./storage-file.js";
import {
  createRedisLabStoreAdapter,
  LabStateConfigError,
  resolveLabStorageConfig,
  type RedisLabStoreOptions,
} from "./storage-redis.js";

export { emptyLabStore, normalizeLabStore, LAB_STORE_VERSION } from "./storage-normalize.js";
export {
  createFileLabStoreAdapter,
  resetFileLabStoreLocks,
} from "./storage-file.js";
export {
  createRedisLabStoreAdapter,
  resolveLabStorageConfig,
  LabStateConfigError,
  LabStateUnavailableError,
  type LabRedisConfig,
  type LabStorageResolution,
  type RedisLabStoreOptions,
} from "./storage-redis.js";

export type CreateLabStoreAdapterOptions = {
  env?: NodeJS.ProcessEnv;
  /** Injected fetch for Redis adapter tests. */
  fetchImpl?: typeof fetch;
  redis?: Partial<Pick<RedisLabStoreOptions, "lockTtlSeconds" | "lockRetries" | "lockRetryDelayMs">>;
};

/**
 * Build the active Lab store adapter.
 * Default: file. Shared Redis only when explicitly and fully configured.
 */
export function createLabStoreAdapter(
  root: string,
  options: CreateLabStoreAdapterOptions = {},
): LabStoreAdapter {
  const env = options.env ?? process.env;
  const resolved = resolveLabStorageConfig(env);
  if (resolved.kind === "invalid") {
    throw new LabStateConfigError(resolved.reason);
  }
  if (resolved.kind === "redis") {
    return createRedisLabStoreAdapter({
      ...resolved.config,
      fetchImpl: options.fetchImpl,
      ...options.redis,
    });
  }
  return createFileLabStoreAdapter(root);
}

function adapter(root: string): LabStoreAdapter {
  return createLabStoreAdapter(root);
}

export async function ensureLabStore(root: string): Promise<{ path: string; created: boolean }> {
  return adapter(root).ensure();
}

export async function readLabStore(root: string): Promise<LabStore> {
  const store = adapter(root);
  await store.ensure();
  return store.read();
}

export async function writeLabStore(root: string, store: LabStore): Promise<void> {
  await adapter(root).write(store);
}

export async function pingLabStore(root: string, options?: CreateLabStoreAdapterOptions): Promise<void> {
  await createLabStoreAdapter(root, options).ping();
}

export async function upsertLabUser(root: string, user: LabUser): Promise<void> {
  await adapter(root).update((store) => {
    const idx = store.users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (idx >= 0) store.users[idx] = user;
    else store.users.push(user);
  });
}

export async function findLabUserByEmail(root: string, email: string): Promise<LabUser | undefined> {
  const store = await adapter(root).read();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findLabUserById(root: string, id: string): Promise<LabUser | undefined> {
  const store = await adapter(root).read();
  return store.users.find((u) => u.id === id);
}

export async function saveLabSession(root: string, session: LabSession): Promise<void> {
  await adapter(root).update((store) => {
    store.sessions = store.sessions.filter((s) => s.id !== session.id && s.userId !== session.userId);
    store.sessions.push(session);
  });
}

export async function findLabSession(root: string, sessionId: string): Promise<LabSession | undefined> {
  const store = await adapter(root).read();
  return store.sessions.find((s) => s.id === sessionId);
}

export async function deleteLabSession(root: string, sessionId: string): Promise<void> {
  await adapter(root).update((store) => {
    store.sessions = store.sessions.filter((s) => s.id !== sessionId);
  });
}

export async function saveLabOtp(root: string, otp: LabOtpChallenge): Promise<void> {
  await adapter(root).update((store) => {
    store.otps = store.otps.filter((o) => o.email !== otp.email || o.purpose !== otp.purpose);
    store.otps.push(otp);
  });
}

export async function findLabOtp(
  root: string,
  email: string,
  purpose: LabOtpChallenge["purpose"],
): Promise<LabOtpChallenge | undefined> {
  const store = await adapter(root).read();
  return store.otps.find((o) => o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose);
}

export async function clearLabOtp(root: string, email: string, purpose: LabOtpChallenge["purpose"]): Promise<void> {
  await adapter(root).update((store) => {
    store.otps = store.otps.filter(
      (o) => !(o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose),
    );
  });
}

export async function saveLabPairing(root: string, pairing: LabPairingPending): Promise<void> {
  await adapter(root).update((store) => {
    store.pairings = store.pairings.filter((p) => p.pairingId !== pairing.pairingId);
    store.pairings.push(pairing);
  });
}

export async function findLabPairing(root: string, pairingId: string): Promise<LabPairingPending | undefined> {
  const store = await adapter(root).read();
  return store.pairings.find((p) => p.pairingId === pairingId);
}

export async function listLabReleases(root: string): Promise<LabRelease[]> {
  const store = await adapter(root).read();
  return store.releases.sort((a, b) => b.deployedAt.localeCompare(a.deployedAt));
}

export async function upsertLabRelease(root: string, release: LabRelease): Promise<void> {
  await adapter(root).update((store) => {
    const idx = store.releases.findIndex((r) => r.id === release.id);
    if (idx >= 0) store.releases[idx] = release;
    else store.releases.push(release);
  });
}

export async function listSourceMapMeta(root: string): Promise<LabSourceMapMeta[]> {
  const store = await adapter(root).read();
  return store.sourceMaps;
}

export async function upsertSourceMapMeta(root: string, meta: LabSourceMapMeta): Promise<void> {
  await adapter(root).update((store) => {
    const idx = store.sourceMaps.findIndex((m) => m.id === meta.id);
    if (idx >= 0) store.sourceMaps[idx] = meta;
    else store.sourceMaps.push(meta);
  });
}
