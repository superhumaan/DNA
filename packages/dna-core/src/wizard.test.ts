import { describe, it, expect } from "vitest";
import { runWizard } from "../src/wizard.js";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileExists } from "../src/fs.js";

async function createTempProject(): Promise<string> {
  const dir = join(tmpdir(), `dna-init-${randomUUID()}`);
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, "package.json"),
    JSON.stringify({ name: "test-project", version: "1.0.0" }),
  );
  return dir;
}

describe("init generation", () => {
  it("creates .DNA and DNA structure", async () => {
    const root = await createTempProject();
    const result = await runWizard({
      root,
      answers: {
        projectDescription: "B2B SaaS platform",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "gdpr",
        stage: "mvp",
        installRuntime: true,
        installFeatureFactory: true,
        installCi: true,
        configureGithub: true,
        configureAi: true,
      },
      nonInteractive: true,
    });

    expect(result.config.projectId).toBe("test-project");
    expect(await fileExists(join(root, ".DNA/config.dna.json"))).toBe(true);
    expect(await fileExists(join(root, ".DNA/neuralNetwork.json"))).toBe(true);
    expect(await fileExists(join(root, ".DNA/behaviour/ai.behaviour.md"))).toBe(true);
    expect(await fileExists(join(root, "DNA/Impressions/product/product-overview.md"))).toBe(
      true,
    );
    expect(await fileExists(join(root, ".DNA/CellularMemory/hippocampus/project-summary.md"))).toBe(
      true,
    );
    expect(await fileExists(join(root, "ai/feature-request.md"))).toBe(true);
    expect(await fileExists(join(root, ".cursor/rules/product-process.mdc"))).toBe(true);
    expect(await fileExists(join(root, ".github/workflows/dna-ci.yml"))).toBe(true);
    expect(await fileExists(join(root, ".github/workflows/dna-security.yml"))).toBe(true);
    expect(await fileExists(join(root, ".DNA/hooks/pre-push"))).toBe(true);
    expect(result.filesCreated.length).toBeGreaterThan(20);
  });
});
