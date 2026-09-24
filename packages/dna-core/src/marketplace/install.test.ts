import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { installKnowledgePackById, checkMarketplaceUpdates } from "./install.js";
import { applyMarketplaceUpdates } from "./apply-updates.js";

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

  it("applyMarketplaceUpdates re-applies installed pack content even when version is unchanged", async () => {
    const root = join(tmpdir(), `dna-marketplace-apply-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "mp-apply" }));

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

    await installKnowledgePackById(root, "frameworks/vite");
    const knowledgePath = join(root, ".DNA", "knowledge", "frameworks/vite/positioning.dna.md");
    await writeFile(knowledgePath, "# corrupted locally\n");

    const checkOnly = await applyMarketplaceUpdates(root, { checkOnly: true });
    expect(checkOnly.applied).toBe(false);
    expect(await readFile(knowledgePath, "utf-8")).toContain("corrupted locally");

    const applied = await applyMarketplaceUpdates(root, { foundation: false });
    expect(applied.applied).toBe(true);
    expect(applied.refreshed).toContain("frameworks/vite");
    expect(await readFile(knowledgePath, "utf-8")).toContain("Vite");
    expect(await readFile(knowledgePath, "utf-8")).not.toContain("corrupted locally");

    await rm(root, { recursive: true, force: true });
  });

  it("applyMarketplaceUpdates refreshes installed purpose-combo AI context", async () => {
    const root = join(tmpdir(), `dna-marketplace-combo-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "mp-combo" }));

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

    await installKnowledgePackById(root, "combo/pmf-check");
    const rulePath = join(root, ".cursor", "rules", "dna-bundle-pmf-check.mdc");
    await writeFile(rulePath, "# stale bundle rule\n");

    const applied = await applyMarketplaceUpdates(root, { foundation: false });
    expect(applied.refreshed).toContain("combo/pmf-check");
    expect(await readFile(rulePath, "utf-8")).toContain("combo/pmf-check");
    expect(await readFile(rulePath, "utf-8")).not.toContain("stale bundle rule");

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
