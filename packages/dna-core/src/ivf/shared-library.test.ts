import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import {
  analyzeSharedLibrary,
  ensureSharedLibrary,
  formatSharedLibrarySummary,
} from "./shared-library.js";

describe("IVF shared library consolidation", () => {
  it("detects duplicate components across monorepo apps", async () => {
    const root = join(tmpdir(), `dna-sl-analyze-${randomUUID()}`);
    await mkdir(join(root, "apps", "web", "src", "components"), { recursive: true });
    await mkdir(join(root, "apps", "admin", "src", "components"), { recursive: true });
    await writeFile(join(root, "pnpm-workspace.yaml"), "packages:\n  - apps/*\n");
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "monorepo-saas", private: true }),
    );
    await writeFile(
      join(root, "apps", "web", "src", "components", "Button.tsx"),
      `export function Button() { return <button>Web</button>; }`,
    );
    await writeFile(
      join(root, "apps", "admin", "src", "components", "Button.tsx"),
      `export function Button() { return <button>Admin</button>; }`,
    );
    await writeFile(
      join(root, "apps", "web", "src", "components", "Card.tsx"),
      `export function Card() { return <div>Card</div>; }`,
    );
    await writeFile(
      join(root, "apps", "admin", "src", "components", "Card.tsx"),
      `export function Card() { return <div>Card</div>; }`,
    );

    const analysis = await analyzeSharedLibrary(root);
    const summary = formatSharedLibrarySummary(analysis);

    expect(analysis.isMonorepo).toBe(true);
    expect(analysis.duplicateCount).toBe(2);
    expect(analysis.duplicateComponents.map((d) => d.name).sort()).toEqual(["Button", "Card"]);
    expect(analysis.health).toBe("critical");
    expect(analysis.recommendedPackagePath).toBe("packages/ui");
    expect(summary).toContain("Duplicates:       2");

    await rm(root, { recursive: true, force: true });
  });

  it("ensureSharedLibrary writes plan and ui-patterns for DNA projects", async () => {
    const root = join(tmpdir(), `dna-sl-ensure-${randomUUID()}`);
    await mkdir(join(root, "src", "components"), { recursive: true });
    await mkdir(join(root, "app", "components"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "dup-ui-app", dependencies: { react: "^18.0.0" } }),
    );
    await writeFile(
      join(root, "src", "components", "Modal.tsx"),
      `export function Modal() { return <div>Modal</div>; }`,
    );
    await writeFile(
      join(root, "app", "components", "Modal.tsx"),
      `export function Modal() { return <div>Modal 2</div>; }`,
    );

    await runWizard({
      root,
      answers: {
        projectDescription: "App with duplicated UI",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "legacy_modernisation",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const result = await ensureSharedLibrary({
      root,
      quote: "Create shared UI library and replace duplicates",
    });

    expect(result.skipped).toBe(false);
    expect(result.planPath).toContain("shared-library-dup-ui-app.md");
    expect(result.context).toContain("Shared Library Consolidation Plan");
    expect(result.context).toContain("Modal");
    expect(result.context).toContain("Replace imports across apps");
    expect(result.analysis.duplicateCount).toBe(1);

    await rm(root, { recursive: true, force: true });
  });
});
