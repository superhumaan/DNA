import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHmac, timingSafeEqual } from "node:crypto";
import { DNA_LAB_PAIRING_CODE_LENGTH, DNA_LAB_PAIRING_FILE } from "@superhumaan/dna-config";
import { ensureDir, fileExists } from "../fs.js";
import { generatePairingCode, hashValue, newId } from "./crypto.js";
import type { LabLocalPairing } from "./types.js";
import { findLabPairing, saveLabPairing } from "./storage.js";

const PAIRING_TTL_MS = 15 * 60 * 1000;
const PAIRING_ID_RE = /^[a-f0-9]{32}$/i;
const PAIRING_CODE_HASH_RE = /^[a-f0-9]{64}$/i;
const PAIRING_CODE_RE = new RegExp(`^\\d{${DNA_LAB_PAIRING_CODE_LENGTH}}$`);

/** CLI pairing IDs are 32-char hex from newId(). */
export function isValidPairingId(pairingId: string): boolean {
  return PAIRING_ID_RE.test(pairingId.trim());
}

/** SHA-256 hex of the 148-digit code — stored on production; plaintext never is. */
export function isValidPairingCodeHash(codeHash: string): boolean {
  return PAIRING_CODE_HASH_RE.test(codeHash.trim());
}

/** Pairing codes are fixed-length digit strings (ignore whitespace from paste). */
export function normalizePairingCode(code: string): string {
  return code.replace(/\s+/g, "");
}

export function isValidPairingCode(code: string): boolean {
  return PAIRING_CODE_RE.test(normalizePairingCode(code));
}

export interface InitLocalPairingOptions {
  root: string;
  productionUrl: string;
  projectId: string;
  callbackPort?: number;
}

export interface InitLocalPairingResult {
  pairingId: string;
  code: string;
  codeHash: string;
  expiresAt: string;
  pairingFile: string;
  callbackUrl?: string;
}

export async function initLocalPairing(options: InitLocalPairingOptions): Promise<InitLocalPairingResult> {
  const pairingId = newId();
  const code = generatePairingCode();
  const codeHash = hashValue(code);
  const now = Date.now();
  const expiresAt = new Date(now + PAIRING_TTL_MS).toISOString();
  const callbackUrl =
    options.callbackPort !== undefined
      ? `http://127.0.0.1:${options.callbackPort}/api/dna/labs/pairing/callback`
      : undefined;

  const record: LabLocalPairing = {
    pairingId,
    codeHash,
    productionUrl: options.productionUrl.replace(/\/$/, ""),
    projectId: options.projectId,
    createdAt: new Date(now).toISOString(),
    expiresAt,
    verified: false,
  };

  const pairingPath = join(options.root, DNA_LAB_PAIRING_FILE);
  await ensureDir(join(options.root, ".DNA", "lab"));
  await writeFile(pairingPath, JSON.stringify(record, null, 2) + "\n", "utf-8");

  return {
    pairingId,
    code,
    codeHash,
    expiresAt,
    pairingFile: DNA_LAB_PAIRING_FILE,
    callbackUrl,
  };
}

export async function readLocalPairing(root: string): Promise<LabLocalPairing | null> {
  const path = join(root, DNA_LAB_PAIRING_FILE);
  if (!(await fileExists(path))) return null;
  try {
    return JSON.parse(await readFile(path, "utf-8")) as LabLocalPairing;
  } catch {
    return null;
  }
}

export async function markLocalPairingVerified(root: string): Promise<void> {
  const record = await readLocalPairing(root);
  if (!record) return;
  record.verified = true;
  record.verifiedAt = new Date().toISOString();
  const path = join(root, DNA_LAB_PAIRING_FILE);
  await writeFile(path, JSON.stringify(record, null, 2) + "\n", "utf-8");
}

export async function registerPairingOnProduction(
  root: string,
  input: {
    pairingId: string;
    codeHash: string;
    projectId: string;
    callbackUrl?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const pairingId = input.pairingId.trim();
  const codeHash = input.codeHash.trim().toLowerCase();

  if (!isValidPairingId(pairingId)) {
    return { ok: false, error: "Invalid pairing ID — expected 32-char hex from dna register lab" };
  }
  if (!isValidPairingCodeHash(codeHash)) {
    return { ok: false, error: "Invalid codeHash — expected SHA-256 hex (64 chars)" };
  }

  const existing = await findLabPairing(root, pairingId);
  if (existing?.verified) {
    return { ok: false, error: "Pairing already verified" };
  }

  const now = Date.now();
  await saveLabPairing(root, {
    pairingId,
    codeHash,
    projectId: input.projectId || "app",
    callbackUrl: input.callbackUrl,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + PAIRING_TTL_MS).toISOString(),
    verified: false,
  });

  return { ok: true };
}

/**
 * Paste-verify: /labs accepts a valid Pairing ID + 148-digit code from `dna register lab`.
 * If POST /pairing/init never reached the server, invent the store row from the paste
 * (code possession is the secret — no gateway allowlist required).
 */
export async function verifyPairingCode(
  root: string,
  pairingId: string,
  code: string,
): Promise<{ ok: boolean; error?: string; callbackUrl?: string; callbackCodeHash?: string }> {
  const id = pairingId.trim();
  const trimmedCode = normalizePairingCode(code);

  if (!isValidPairingId(id)) {
    return { ok: false, error: "Invalid pairing ID — paste the Pairing ID from dna register lab" };
  }
  if (!isValidPairingCode(trimmedCode)) {
    return {
      ok: false,
      error: `Invalid pairing code — paste the full ${DNA_LAB_PAIRING_CODE_LENGTH}-digit code from dna register lab`,
    };
  }

  const codeHash = hashValue(trimmedCode);
  let pairing = await findLabPairing(root, id);

  if (!pairing) {
    const now = Date.now();
    pairing = {
      pairingId: id,
      codeHash,
      projectId: "app",
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + PAIRING_TTL_MS).toISOString(),
      verified: true,
      verifiedAt: new Date(now).toISOString(),
    };
    await saveLabPairing(root, pairing);
    return { ok: true };
  }

  if (pairing.verified) {
    if (codeHash !== pairing.codeHash) {
      return { ok: false, error: "Invalid pairing code" };
    }
    return {
      ok: true,
      callbackUrl: pairing.callbackUrl,
      callbackCodeHash: pairing.callbackUrl ? pairing.codeHash : undefined,
    };
  }
  if (new Date(pairing.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "Pairing expired — run npx dna register lab again" };
  }

  if (codeHash !== pairing.codeHash) {
    return { ok: false, error: "Invalid pairing code" };
  }

  pairing.verified = true;
  pairing.verifiedAt = new Date().toISOString();
  await saveLabPairing(root, pairing);

  return {
    ok: true,
    callbackUrl: pairing.callbackUrl,
    callbackCodeHash: pairing.callbackUrl ? pairing.codeHash : undefined,
  };
}

export interface PairingCallbackBody {
  pairingId: string;
  verified: boolean;
}

function pairingCallbackPayload(body: PairingCallbackBody): string {
  return `${body.pairingId}:${body.verified ? "1" : "0"}`;
}

/**
 * Sign the loopback callback with the pairing code hash already shared during
 * pairing init. This avoids adding another secret while preventing arbitrary
 * local processes or web pages from forging a successful callback.
 */
export function signPairingCallback(codeHash: string, body: PairingCallbackBody): string {
  return createHmac("sha256", codeHash).update(pairingCallbackPayload(body)).digest("hex");
}

export function verifyPairingCallbackSignature(
  codeHash: string,
  body: PairingCallbackBody,
  signature: string | undefined,
): boolean {
  if (!isValidPairingCodeHash(codeHash) || !PAIRING_CODE_HASH_RE.test(signature ?? "")) {
    return false;
  }
  const expected = Buffer.from(signPairingCallback(codeHash, body), "hex");
  const supplied = Buffer.from(signature!, "hex");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export async function postPairingCallback(
  callbackUrl: string,
  body: PairingCallbackBody,
  codeHash: string,
): Promise<boolean> {
  try {
    const res = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DNA-Lab-Signature": signPairingCallback(codeHash, body),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function pushPairingToProduction(
  productionUrl: string,
  body: {
    pairingId: string;
    codeHash: string;
    projectId: string;
    callbackUrl?: string;
  },
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const base = productionUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/api/dna/labs/pairing/init`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location") ?? "";
      return {
        ok: false,
        status: res.status,
        error: [
          `Pairing init redirected (${res.status}) — optional pre-notify blocked.`,
          location ? `Location: ${location}` : "",
          "Paste Pairing ID + code at /labs instead.",
        ]
          .filter(Boolean)
          .join(" "),
      };
    }

    const contentType = res.headers.get("content-type") ?? "";
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return { ok: false, status: res.status, error: text || res.statusText };
    }
    if (!contentType.includes("application/json")) {
      return {
        ok: false,
        status: res.status,
        error:
          "Pairing init returned non-JSON (likely an edge login page). DNA Lab pairing API was not reached.",
      };
    }
    try {
      const parsed = JSON.parse(text) as { ok?: boolean; error?: string };
      if (parsed.ok === false) {
        return { ok: false, status: res.status, error: parsed.error ?? "Pairing init rejected" };
      }
    } catch {
      return { ok: false, status: res.status, error: "Invalid JSON from pairing init" };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function pollPairingStatus(
  productionUrl: string,
  pairingId: string,
): Promise<{ verified: boolean }> {
  const base = productionUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/api/dna/labs/pairing/status/${pairingId}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { verified: false };
    const data = (await res.json()) as { verified?: boolean };
    return { verified: Boolean(data.verified) };
  } catch {
    return { verified: false };
  }
}
