import { generateOtp, hashPassword, hashValue, newId, verifyPassword } from "./crypto.js";
import {
  clearLabOtp,
  deleteLabSession,
  findLabOtp,
  findLabSession,
  findLabUserByEmail,
  findLabUserById,
  findLabPairing,
  saveLabOtp,
  saveLabSession,
  upsertLabUser,
} from "./storage.js";
import type { LabAuthContext, LabUser } from "./types.js";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

export const LAB_SESSION_COOKIE = "dna_lab_session";

/**
 * Short-lived cache for resolved sessions. Auth runs on every Lab request —
 * including the high-frequency `/data` poll — and each miss reads the lab
 * store twice (session + user) under a global mutex, serialising all
 * concurrent pollers. Caching a resolved context for a few seconds collapses
 * that to roughly one store read per session per window without meaningfully
 * extending a revoked session's lifetime.
 */
const SESSION_CACHE_TTL_MS = 5000;
const sessionCache = new Map<string, { at: number; ctx: LabAuthContext }>();

/** Invalidate a cached session (e.g. on logout). Clears all when no id given. */
export function invalidateSessionCache(sessionId?: string): void {
  if (sessionId) sessionCache.delete(sessionId);
  else sessionCache.clear();
}

export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}

export function sessionCookieHeader(sessionId: string, secure: boolean): string {
  const flags = [
    `${LAB_SESSION_COOKIE}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (secure) flags.push("Secure");
  return flags.join("; ");
}

export function clearSessionCookie(secure: boolean): string {
  const flags = [`${LAB_SESSION_COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (secure) flags.push("Secure");
  return flags.join("; ");
}

export async function resolveLabAuth(
  root: string,
  req: { headers?: Record<string, string | string[] | undefined> },
  localMode: boolean,
): Promise<LabAuthContext> {
  if (localMode) {
    return { authenticated: true, localMode: true };
  }

  const cookies = parseCookies(
    Array.isArray(req.headers?.cookie) ? req.headers?.cookie[0] : req.headers?.cookie,
  );
  const sessionId = cookies[LAB_SESSION_COOKIE];
  if (!sessionId) return { authenticated: false, localMode: false };

  const cached = sessionCache.get(sessionId);
  if (cached && Date.now() - cached.at < SESSION_CACHE_TTL_MS) {
    return cached.ctx;
  }

  const session = await findLabSession(root, sessionId);
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) {
    if (session) await deleteLabSession(root, session.id);
    sessionCache.delete(sessionId);
    return { authenticated: false, localMode: false };
  }

  const user = await findLabUserById(root, session.userId);
  if (!user) {
    sessionCache.delete(sessionId);
    return { authenticated: false, localMode: false };
  }

  const ctx: LabAuthContext = { authenticated: true, user, localMode: false };
  sessionCache.set(sessionId, { at: Date.now(), ctx });
  return ctx;
}

export async function startLoginOtp(root: string, email: string): Promise<{ otp: string; error?: string }> {
  const user = await findLabUserByEmail(root, email);
  if (!user) return { otp: "", error: "No account for this email" };

  const otp = generateOtp();
  await saveLabOtp(root, {
    id: newId(),
    email: user.email,
    codeHash: hashValue(otp),
    purpose: "login",
    expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    attempts: 0,
  });

  return { otp };
}

export async function completeLogin(
  root: string,
  email: string,
  password: string,
  otp: string,
): Promise<{ ok: boolean; sessionId?: string; error?: string }> {
  const user = await findLabUserByEmail(root, email);
  if (!user) return { ok: false, error: "Invalid credentials" };

  if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return { ok: false, error: "Invalid credentials" };
  }

  const challenge = await findLabOtp(root, email, "login");
  if (!challenge || new Date(challenge.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "OTP expired — request a new code" };
  }
  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    return { ok: false, error: "Too many OTP attempts" };
  }
  if (hashValue(otp) !== challenge.codeHash) {
    challenge.attempts += 1;
    await saveLabOtp(root, challenge);
    return { ok: false, error: "Invalid OTP" };
  }

  await clearLabOtp(root, email, "login");

  const sessionId = newId();
  await saveLabSession(root, {
    id: sessionId,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });

  return { ok: true, sessionId };
}

export async function completeRegistration(
  root: string,
  input: {
    pairingId: string;
    name: string;
    email: string;
    password: string;
    otp: string;
  },
): Promise<{ ok: boolean; sessionId?: string; error?: string }> {
  const pairing = await findLabPairing(root, input.pairingId);
  if (!pairing?.verified) {
    return { ok: false, error: "Complete local pairing before creating your account" };
  }

  const existing = await findLabUserByEmail(root, input.email);
  if (existing) return { ok: false, error: "Email already registered" };

  const challenge = await findLabOtp(root, input.email, "register");
  if (!challenge || hashValue(input.otp) !== challenge.codeHash) {
    return { ok: false, error: "Invalid or expired OTP" };
  }

  const { hash, salt } = hashPassword(input.password);
  const user: LabUser = {
    id: newId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    pairingId: input.pairingId,
  };
  await upsertLabUser(root, user);
  await clearLabOtp(root, input.email, "register");

  const sessionId = newId();
  await saveLabSession(root, {
    id: sessionId,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });

  return { ok: true, sessionId };
}

export async function startRegisterOtp(root: string, email: string): Promise<{ otp: string }> {
  const otp = generateOtp();
  await saveLabOtp(root, {
    id: newId(),
    email: email.trim().toLowerCase(),
    codeHash: hashValue(otp),
    purpose: "register",
    expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    attempts: 0,
  });
  return { otp };
}
