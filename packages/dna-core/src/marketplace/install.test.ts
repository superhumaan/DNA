import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { installKnowledgePackById, checkMarketplaceUpdates } from "./install.js";

describe("marketplace install", () => {
  it("installs a bundled pack into .DNA/knowledge/", async () => {
    const root = join(tmpdir(), `dna-marketplace-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "mp-test" }));

    await runWizard({
      root,
      answers: {
        projectDescription: "test",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "new",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const { pack, files } = await installKnowledgePackById(root, "frameworks/vite");
    expect(pack.id).toBe("frameworks/vite");
    expect(files.length).toBeGreaterThan(0);

    const content = await readFile(
      join(root, ".DNA", "knowledge", "frameworks/vite/positioning.dna.md"),
      "utf-8",
    );
    expect(content).toContain("Vite");

    const updates = await checkMarketplaceUpdates(root);
    expect(updates.installed.some((p) => p.startsWith("frameworks/vite@"))).toBe(true);

    await rm(root, { recursive: true, force: true });
  });

  it("installs retired pack IDs via alias", async () => {
    const root = join(tmpdir(), `dna-marketplace-alias-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "alias-test" }));

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

    const { pack } = await installKnowledgePackById(root, "platforms/humaan-stack");
    expect(pack.id).toBe("platforms/dna-stack");

    await rm(root, { recursive: true, force: true });
  });
});
