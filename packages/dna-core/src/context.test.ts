import { describe, it, expect } from "vitest";
import { generateContext } from "../src/context.js";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../src/wizard.js";

describe("context", () => {
  it("throws when .DNA is missing", async () => {
    const root = join(tmpdir(), `dna-ctx-${randomUUID()}`);
    await mkdir(root, { recursive: true });

    await expect(generateContext(root, "cursor")).rejects.toThrow(/No \.DNA\/ directory/);

    await rm(root, { recursive: true, force: true });
  });

  it("generates copilot context with behaviour", async () => {
    const root = join(tmpdir(), `dna-ctx-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "ctx-test" }));

    await runWizard({
      root,
      answers: {
        projectDescription: "test app",
        acceptRecommendation: true,
        aiTools: ["github_copilot"],
        compliance: "none",
        stage: "new",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const ctx = await generateContext(root, "copilot");
    expect(ctx).toContain("DNA Context");
    expect(ctx).toContain("ai.behaviour.md");
    expect(ctx).toContain("neuralNetwork");

    await rm(root, { recursive: true, force: true });
  });
});
