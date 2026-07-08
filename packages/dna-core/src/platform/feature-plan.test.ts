import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { generateFeaturePlan, formatPlatformCatalog } from "./feature-plan.js";
import { getFeature } from "./catalog.js";

describe("platform feature plan", () => {
  it("lists features in catalog", () => {
    const catalog = formatPlatformCatalog();
    expect(catalog).toContain("admin-portal");
    expect(catalog).toContain("azure-deploy");
    expect(getFeature("sso-bridge")).toBeDefined();
  });

  it("generates feature plan with knowledge references", async () => {
    const root = join(tmpdir(), `dna-platform-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "platform-test", dependencies: { react: "^18", express: "^4" } }),
    );

    await runWizard({
      root,
      answers: {
        projectDescription: "Humaan-style ops platform",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "mvp",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const result = await generateFeaturePlan({
      root,
      featureId: "admin-portal",
      quote: "Build admin portal with Google directory sync",
      referenceProject: "humaan",
    });

    expect(result.context).toContain("Admin Portal");
    expect(result.context).toContain("DNA production reference");
    expect(result.context).toContain("platforms/dna/admin-portal.dna.md");
    expect(result.planPath).toContain("feature-admin-portal.md");

    await rm(root, { recursive: true, force: true });
  });
});
