import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, afterEach } from "vitest";
import { DNA_LAB_PAIRING_CODE_LENGTH } from "@superhumaan/dna-config";
import {
  initLocalPairing,
  registerPairingOnProduction,
  verifyPairingCode,
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

  it("verifies paste without prior pairing/init (gateway-safe path)", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-paste-"));
    const local = await initLocalPairing({
      root,
      productionUrl: "https://example.com",
      projectId: "test-app",
    });

    // Simulate production store with no init record — only the browser paste arrives
    const pasteRoot = await mkdtemp(join(tmpdir(), "dna-lab-prod-"));
    try {
      const missing = await verifyPairingCode(pasteRoot, "not-a-real-id", local.code);
      expect(missing.ok).toBe(false);
      expect(missing.error).toMatch(/Invalid pairing ID/i);

      const short = await verifyPairingCode(pasteRoot, local.pairingId, "123");
      expect(short.ok).toBe(false);
      expect(short.error).toMatch(/Invalid pairing code/i);

      const good = await verifyPairingCode(pasteRoot, local.pairingId, local.code);
      expect(good.ok).toBe(true);

      const again = await verifyPairingCode(pasteRoot, local.pairingId, local.code);
      expect(again.ok).toBe(true);

      const wrong = await verifyPairingCode(
        pasteRoot,
        local.pairingId,
        "9".repeat(DNA_LAB_PAIRING_CODE_LENGTH),
      );
      expect(wrong.ok).toBe(false);
      expect(wrong.error).toMatch(/Invalid pairing code/i);
    } finally {
      await rm(pasteRoot, { recursive: true, force: true });
    }
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
    expect(result.error).toMatch(/paste|redirected/i);
  });
});
