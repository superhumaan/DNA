import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, afterEach } from "vitest";
import { DNA_LAB_PAIRING_CODE_LENGTH } from "@superhumaan/dna-config";
import {
  initLocalPairing,
  registerPairingOnProduction,
  signPairingCallback,
  verifyPairingCode,
  verifyPairingCallbackSignature,
} from "./pairing.js";

describe("lab pairing", () => {
  let root = "";

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("verifies pairing when code matches hash", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-"));
    const local = await initLocalPairing({
      root,
      productionUrl: "https://example.com",
      projectId: "test-app",
    });

    const reg = await registerPairingOnProduction(root, {
      pairingId: local.pairingId,
      codeHash: local.codeHash,
      projectId: "test-app",
    });
    expect(reg.ok).toBe(true);

    const bad = await verifyPairingCode(root, local.pairingId, "0".repeat(DNA_LAB_PAIRING_CODE_LENGTH));
    expect(bad.ok).toBe(false);

    const good = await verifyPairingCode(root, local.pairingId, local.code);
    expect(good.ok).toBe(true);
  });

  it("verifies pairing from paste alone (no pairing/init)", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-paste-"));
    const local = await initLocalPairing({
      root,
      productionUrl: "https://example.com",
      projectId: "test-app",
    });

    const pasteRoot = await mkdtemp(join(tmpdir(), "dna-lab-prod-"));
    try {
      const missing = await verifyPairingCode(pasteRoot, "not-a-real-id", local.code);
      expect(missing.ok).toBe(false);
      expect(missing.error).toMatch(/Invalid pairing ID/i);

      const short = await verifyPairingCode(pasteRoot, local.pairingId, "123");
      expect(short.ok).toBe(false);
      expect(short.error).toMatch(/Invalid pairing code/i);

      const fromPaste = await verifyPairingCode(pasteRoot, local.pairingId, local.code);
      expect(fromPaste.ok).toBe(true);

      const again = await verifyPairingCode(pasteRoot, local.pairingId, local.code);
      expect(again.ok).toBe(true);

      const wrong = await verifyPairingCode(
        pasteRoot,
        local.pairingId,
        "9".repeat(DNA_LAB_PAIRING_CODE_LENGTH),
      );
      expect(wrong.ok).toBe(false);

      const withSpaces = await verifyPairingCode(
        pasteRoot,
        ` ${local.pairingId} `,
        local.code.match(/.{1,40}/g)!.join("\n"),
      );
      expect(withSpaces.ok).toBe(true);
    } finally {
      await rm(pasteRoot, { recursive: true, force: true });
    }
  });

  it("rejects invalid codeHash on init", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-init-"));
    const bad = await registerPairingOnProduction(root, {
      pairingId: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      codeHash: "not-a-hash",
      projectId: "app",
    });
    expect(bad.ok).toBe(false);
    expect(bad.error).toMatch(/codeHash/i);
  });

  it("authenticates pairing callbacks with a timing-safe HMAC", async () => {
    const codeHash = "a".repeat(64);
    const body = {
      pairingId: "b".repeat(32),
      verified: true,
    };
    const signature = signPairingCallback(codeHash, body);

    expect(verifyPairingCallbackSignature(codeHash, body, signature)).toBe(true);
    expect(verifyPairingCallbackSignature(codeHash, body, "c".repeat(64))).toBe(false);
    expect(
      verifyPairingCallbackSignature(codeHash, { ...body, verified: false }, signature),
    ).toBe(false);
    expect(verifyPairingCallbackSignature(codeHash, body, undefined)).toBe(false);
  });

  it("does not treat auth gateway redirects as successful pairing init", async () => {
    const prev = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response("", {
        status: 302,
        headers: { Location: "https://example.com/_connect/login" },
      })) as typeof fetch;

    const { pushPairingToProduction } = await import("./pairing.js");
    const result = await pushPairingToProduction("https://example.com", {
      pairingId: "p1",
      codeHash: "h1",
      projectId: "app",
    });
    globalThis.fetch = prev;

    expect(result.ok).toBe(false);
    expect(result.status).toBe(302);
    expect(result.error).toMatch(/redirected|pre-notify|Paste/i);
  });
});
