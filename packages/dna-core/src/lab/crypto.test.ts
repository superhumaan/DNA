import { describe, expect, it } from "vitest";
import { generatePairingCode, hashPassword, hashValue, verifyPassword } from "./crypto.js";
import { DNA_LAB_PAIRING_CODE_LENGTH } from "@superhumaan/dna-config";

describe("lab crypto", () => {
  it("generates 148-digit pairing codes", () => {
    const code = generatePairingCode();
    expect(code).toHaveLength(DNA_LAB_PAIRING_CODE_LENGTH);
    expect(/^\d+$/.test(code)).toBe(true);
  });

  it("hashes pairing codes deterministically", () => {
    const a = hashValue("123");
    const b = hashValue("123");
    expect(a).toBe(b);
    expect(a).not.toBe(hashValue("124"));
  });

  it("verifies password hashes", () => {
    const { hash, salt } = hashPassword("secret");
    expect(verifyPassword("secret", hash, salt)).toBe(true);
    expect(verifyPassword("wrong", hash, salt)).toBe(false);
  });
});
