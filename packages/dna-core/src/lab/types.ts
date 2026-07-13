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
