import type { LabStore } from "./types.js";

export const LAB_STORE_VERSION = 1;

export function emptyLabStore(): LabStore {
  return {
    version: LAB_STORE_VERSION,
    users: [],
    sessions: [],
    otps: [],
    pairings: [],
    releases: [],
    sourceMaps: [],
  };
}

export function normalizeLabStore(parsed: unknown): LabStore {
  if (!parsed || typeof parsed !== "object") return emptyLabStore();
  const store = parsed as Partial<LabStore>;
  return {
    version: store.version ?? LAB_STORE_VERSION,
    users: Array.isArray(store.users) ? store.users : [],
    sessions: Array.isArray(store.sessions) ? store.sessions : [],
    otps: Array.isArray(store.otps) ? store.otps : [],
    pairings: Array.isArray(store.pairings) ? store.pairings : [],
    releases: Array.isArray(store.releases) ? store.releases : [],
    sourceMaps: Array.isArray(store.sourceMaps) ? store.sourceMaps : [],
  };
}

export function serializeLabStore(store: LabStore): string {
  return JSON.stringify({ ...store, version: LAB_STORE_VERSION }, null, 2);
}
