import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  compareSemver,
  fetchLatestCliVersion,
  isMonorepoDevInstall,
  checkAndUpgradeCli,
} from "./cli-upgrade.js";

describe("cli-upgrade", () => {
  describe("compareSemver", () => {
    it("orders semantic versions", () => {
      expect(compareSemver("0.4.5", "0.4.4")).toBe(1);
      expect(compareSemver("0.4.4", "0.4.5")).toBe(-1);
      expect(compareSemver("1.0.0", "1.0.0")).toBe(0);
      expect(compareSemver("v2.0.1", "2.0.0")).toBe(1);
    });
  });

  describe("isMonorepoDevInstall", () => {
    it("detects local monorepo builds", () => {
      expect(isMonorepoDevInstall("/Users/dev/DNA/packages/dna-cli/dist/index.js")).toBe(true);
      expect(
        isMonorepoDevInstall("/Users/dev/project/node_modules/@superhumaan/dna-by-humaan/dist/index.js"),
      ).toBe(false);
    });
  });

  describe("fetchLatestCliVersion", () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      globalThis.fetch = vi.fn(async () => ({
        ok: true,
        json: async () => ({ "dist-tags": { latest: "9.9.9", beta: "9.9.9-beta.1" } }),
      })) as typeof fetch;
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it("reads npm dist-tags", async () => {
      await expect(fetchLatestCliVersion("stable")).resolves.toBe("9.9.9");
      await expect(fetchLatestCliVersion("beta")).resolves.toBe("9.9.9-beta.1");
    });
  });

  describe("checkAndUpgradeCli", () => {
    it("skips monorepo development installs", async () => {
      const result = await checkAndUpgradeCli({
        root: process.cwd(),
        currentVersion: "0.1.0",
        cliEntryPath: "/repo/packages/dna-cli/dist/index.js",
        force: true,
        install: true,
      });
      expect(result.skipped).toBe(true);
      expect(result.skipReason).toBe("monorepo development build");
    });
  });
});
