import { describe, it, expect } from "vitest";
import { validateProject } from "../src/validator.js";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../src/wizard.js";

describe("validate", () => {
  it("passes on fully initialised project", async () => {
    const root = join(tmpdir(), `dna-validate-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "v-test", scripts: { test: "vitest" } }));

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

    const result = await validateProject(root);
    expect(result.errors.filter((e) => e.severity === "error").length).toBe(0);

    await rm(root, { recursive: true, force: true });
  });

  it("detects duplicate dependencies", async () => {
    const root = join(tmpdir(), `dna-dup-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "dup-test",
        dependencies: { lodash: "^4.17.0" },
        devDependencies: { lodash: "^4.16.0" },
      }),
    );

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

    const result = await validateProject(root);
    expect(result.errors.some((e) => e.code === "DUPLICATE_DEPENDENCY")).toBe(true);

    await rm(root, { recursive: true, force: true });
  });
});
