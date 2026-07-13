import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, afterEach } from "vitest";
import { initLocalPairing, registerPairingOnProduction, verifyPairingCode } from "./pairing.js";

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

    const bad = await verifyPairingCode(root, local.pairingId, "0".repeat(148));
    expect(bad.ok).toBe(false);

    const good = await verifyPairingCode(root, local.pairingId, local.code);
    expect(good.ok).toBe(true);
  });
});
