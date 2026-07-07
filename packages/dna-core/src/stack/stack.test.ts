import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { resolveArchetype, stackFromArchetype } from "./resolve.js";
import { detectTechnologies } from "./detect.js";
import { validateStackCompatibility } from "./validate.js";
import { getArchetype, STACK_CONFLICTS } from "./catalog.js";
import { runWizard } from "../wizard.js";
import { scanProject } from "../scanner.js";
import { validateProject } from "../validator.js";
import type { ScanResult } from "@superhumaan/dna-config";

function mockScan(deps: string[], overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    packageManager: "npm",
    frontend: undefined,
    backend: undefined,
    database: undefined,
    testFramework: undefined,
    ciCd: [],
    docker: false,
    envFiles: [],
    docs: [],
    aiRules: [],
    securityRisks: [],
    missingDocs: [],
    missingTests: false,
    dependencies: deps,
    scripts: { test: "vitest", build: "vite build", lint: "eslint ." },
    hasDna: false,
    ...overrides,
  };
}

describe("stack archetypes", () => {
  it("resolves react-vite-api from react + vite + express deps", () => {
    const scan = mockScan(["react", "vite", "express"], {
      frontend: "react",
      backend: "express",
      testFramework: "vitest",
    });
    const resolution = resolveArchetype(scan, "B2B dashboard");
    expect(resolution.archetype.id).toBe("react-vite-api");
    const stack = stackFromArchetype(resolution, scan, "B2B dashboard");
    expect(stack.bundler).toBe("vite");
    expect(stack.archetype).toBe("react-vite-api");
  });

  it("resolves next-fullstack when next is present", () => {
    const scan = mockScan(["next", "react"], { frontend: "next" });
    const resolution = resolveArchetype(scan, "marketing site");
    expect(resolution.archetype.id).toBe("next-fullstack");
  });

  it("resolves ghost-cms from ghost dependency", () => {
    const scan = mockScan(["ghost"], { frontend: "ghost" });
    const resolution = resolveArchetype(scan, "company blog");
    expect(resolution.archetype.id).toBe("ghost-cms");
  });

  it("detects next + vite conflict", () => {
    const scan = mockScan(["next", "vite", "react"]);
    const detected = detectTechnologies(scan);
    expect(detected.technologies.has("next")).toBe(true);
    expect(detected.technologies.has("vite")).toBe(true);

    const errors = validateStackCompatibility(
      {
        stack: { archetype: "next-fullstack" },
      } as Parameters<typeof validateStackCompatibility>[0],
      scan,
    );
    expect(errors.some((e) => e.code === "STACK_CONFLICT")).toBe(true);
  });

  it("flags ghost + react conflict", () => {
    const scan = mockScan(["ghost", "react", "vite"]);
    const errors = validateStackCompatibility(
      { stack: { archetype: "ghost-cms" } } as Parameters<typeof validateStackCompatibility>[0],
      scan,
    );
    const conflict = errors.find((e) => e.message.includes("ghost") && e.message.includes("react"));
    expect(conflict ?? errors.find((e) => e.code === "STACK_ARCHETYPE_VIOLATION")).toBeTruthy();
  });

  it("every archetype has excludes and knowledge packs", () => {
    for (const a of [getArchetype("react-vite-api"), getArchetype("next-fullstack")]) {
      expect(a?.excludes.length).toBeGreaterThan(0);
      expect(a?.knowledgePacks.length).toBeGreaterThan(0);
    }
  });

  it("conflict rules are well-formed", () => {
    expect(STACK_CONFLICTS.length).toBeGreaterThan(5);
    for (const c of STACK_CONFLICTS) {
      expect(c.technologies.length).toBeGreaterThanOrEqual(2);
      expect(c.reason.length).toBeGreaterThan(10);
    }
  });
});

describe("stack init integration", () => {
  it("sets archetype on init and validates clean stack", async () => {
    const root = join(tmpdir(), `dna-stack-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "stack-test",
        dependencies: { react: "^18", vite: "^5", express: "^4" },
        devDependencies: { vitest: "^1" },
        scripts: { test: "vitest", build: "vite build", lint: "echo ok" },
      }),
    );

    const result = await runWizard({
      root,
      answers: {
        projectDescription: "Internal ops tool",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "mvp",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    expect(result.config.stack.archetype).toBe("react-vite-api");
    expect(result.config.stack.bundler).toBe("vite");

    const validation = await validateProject(root);
    const stackErrors = validation.errors.filter((e) => e.code.startsWith("STACK_"));
    const stackConflictErrors = stackErrors.filter((e) => e.severity === "error");
    expect(stackConflictErrors).toHaveLength(0);

    await rm(root, { recursive: true, force: true });
  });

  it("dna scan detects stack from real package.json", async () => {
    const root = join(tmpdir(), `dna-scan-stack-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ dependencies: { next: "^14" } }),
    );
    const scan = await scanProject(root);
    expect(scan.frontend).toBe("next");
    await rm(root, { recursive: true, force: true });
  });
});
