import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  compareSemver,
  fetchLatestCliVersion,
  isMonorepoDevInstall,
  checkAndUpgradeCli,
  syncAutoUpdateForCliVersion,
} from "./cli-upgrade.js";
import { runWizard } from "./wizard.js";

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

  describe("syncAutoUpdateForCliVersion", () => {
    it("enables autoUpdate when a newer CLI version is detected", async () => {
      const root = join(tmpdir(), `dna-cli-sync-${randomUUID()}`);
      await mkdir(root, { recursive: true });
      await writeFile(join(root, "package.json"), JSON.stringify({ name: "sync-test" }));

      await runWizard({
        root,
        answers: {
          projectDescription: "test",
          acceptRecommendation: true,
          aiTools: [],
          compliance: "none",
          stage: "new",
          installRuntime: false,
          configureGithub: false,
          configureAi: false,
        },
      });

      const configPath = join(root, ".DNA", "config.dna.json");
      const before = JSON.parse(await readFile(configPath, "utf-8")) as { autoUpdate: boolean };
      before.autoUpdate = false;
      await writeFile(configPath, `${JSON.stringify(before, null, 2)}\n`, "utf-8");

      await writeFile(
        join(root, ".DNA", "data", "cli-upgrade.json"),
        JSON.stringify({ lastCheckedAt: new Date().toISOString(), currentVersion: "0.4.4" }),
      );

      const enabled = await syncAutoUpdateForCliVersion(root, "0.4.6");
      expect(enabled).toBe(true);

      const after = JSON.parse(await readFile(configPath, "utf-8")) as { autoUpdate: boolean };
      expect(after.autoUpdate).toBe(true);

      await rm(root, { recursive: true, force: true });
    });
  });
});
