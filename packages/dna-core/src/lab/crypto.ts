import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { DNA_LAB_PAIRING_CODE_LENGTH } from "@superhumaan/dna-config";

export function hashValue(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function generatePairingCode(length = DNA_LAB_PAIRING_CODE_LENGTH): string {
  let code = "";
  while (code.length < length) {
    code += String(randomInt(0, 10));
  }
  return code.slice(0, length);
}

export function generateOtp(length = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += String(randomInt(0, 10));
  }
  return otp;
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt ?? randomBytes(16).toString("hex");
  const hash = scryptSync(password, useSalt, 64).toString("hex");
  return { hash, salt: useSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export function safeEqualHash(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function newId(): string {
  return randomBytes(16).toString("hex");
}
