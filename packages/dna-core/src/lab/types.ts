export interface LabUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  pairingId: string;
}

export interface LabSession {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface LabOtpChallenge {
  id: string;
  email: string;
  codeHash: string;
  purpose: "login" | "register";
  expiresAt: string;
  attempts: number;
}

export interface LabPairingPending {
  pairingId: string;
  codeHash: string;
  projectId: string;
  callbackUrl?: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface LabLocalPairing {
  pairingId: string;
  codeHash: string;
  productionUrl: string;
  projectId: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface LabStore {
  version: number;
  users: LabUser[];
  sessions: LabSession[];
  otps: LabOtpChallenge[];
  pairings: LabPairingPending[];
  releases: LabRelease[];
  sourceMaps: LabSourceMapMeta[];
}

/** Reported by Lab health / topology — never includes secrets. */
export type LabStateBackend = "single-instance-file" | "shared-redis";

/**
 * Persistence port for Lab auth/pairing/release state.
 * File is the zero-config default; Redis is optional shared state.
 */
export interface LabStoreAdapter {
  readonly backend: LabStateBackend;
  /** Stable public identifier (relative file path or configured Redis key). */
  readonly location: string;
  ensure(): Promise<{ path: string; created: boolean }>;
  read(): Promise<LabStore>;
  write(store: LabStore): Promise<void>;
  update(mutator: (store: LabStore) => void): Promise<void>;
  /** Connectivity / readiness probe (no secrets in thrown messages). */
  ping(): Promise<void>;
}

export interface LabRelease {
  id: string;
  version: string;
  gitSha?: string;
  environment: string;
  deployedAt: string;
  notes?: string;
}

export interface LabSourceMapMeta {
  id: string;
  releaseId: string;
  file: string;
  uploadedAt: string;
  sizeBytes: number;
}

export interface LabAuthContext {
  authenticated: boolean;
  user?: LabUser;
  localMode: boolean;
}
