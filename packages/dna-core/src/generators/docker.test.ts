import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import {
  generateDockerfile,
  generateDockerCompose,
  generateDockerignore,
  ensureDockerScript,
  installDockerScaffold,
  runDockerBuild,
  isDockerAvailable,
} from "./docker.js";
import { fileExists } from "../fs.js";
import { mockScan } from "../test-helpers.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "docker-test",
    projectName: "Docker Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: [],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

async function tempProject(): Promise<string> {
  const root = join(tmpdir(), `dna-docker-${randomUUID()}`);
  await mkdir(root, { recursive: true });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "t", scripts: {} }, null, 2));
  return root;
}

describe("docker generator", () => {
  it("generates multi-stage Dockerfile with non-root user", () => {
    const dockerfile = generateDockerfile(
      mockScan({
        packageManager: "pnpm",
        scripts: { build: "vite build", start: "node dist/index.js" },
        hasDna: true,
      }),
    );

    expect(dockerfile).toContain("FROM node:22-alpine");
    expect(dockerfile).toContain("USER nodejs");
    expect(dockerfile).toContain("pnpm install");
  });

  it("generates npm and yarn single-package Dockerfiles", () => {
    const npm = generateDockerfile(
      mockScan({ packageManager: "npm", scripts: { build: "tsc" } }),
    );
    expect(npm).toContain("npm ci");
    expect(npm).toContain("npm run build");
    expect(npm).toContain('CMD ["node", "dist/index.js"]');

    const yarn = generateDockerfile(
      mockScan({ packageManager: "yarn", scripts: { start: "node server.js" } }),
    );
    expect(yarn).toContain("yarn install --frozen-lockfile");
    expect(yarn).toContain('CMD ["yarn", "start"]');
  });

  it("generates docker-compose and dockerignore", () => {
    const compose = generateDockerCompose("Docker Test");
    expect(compose).toContain("dna-app:local");
    expect(compose).toContain("NODE_ENV: production");

    const ignore = generateDockerignore();
    expect(ignore).toContain(".DNA/data");
    expect(ignore).toContain("node_modules");
  });

  it("adds docker scripts to package.json", async () => {
    const root = await tempProject();
    const updated = await ensureDockerScript(root, mockScan());
    expect(updated.length).toBeGreaterThan(0);
    const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf-8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["docker:build"]).toContain("docker build");
    expect(pkg.scripts["docker:verify"]).toContain("docker run");
    await rm(root, { recursive: true, force: true });
  });

  it("scaffolds Dockerfile, compose, and ignore into a project", async () => {
    const root = await tempProject();
    const result = await installDockerScaffold({
      root,
      config: testConfig(),
      scan: mockScan({ packageManager: "npm" }),
    });
    expect(result.created).toContain("Dockerfile");
    expect(result.created).toContain("docker-compose.yml");
    expect(result.created).toContain(".dockerignore");
    expect(await fileExists(join(root, "Dockerfile"))).toBe(true);

    // Second run skips the existing Dockerfile.
    const second = await installDockerScaffold({
      root,
      config: testConfig(),
      scan: mockScan({ packageManager: "npm" }),
    });
    expect(second.skipped.some((s) => s.includes("Dockerfile"))).toBe(true);

    await rm(root, { recursive: true, force: true });
  });

  it("skips build gracefully when there is no Dockerfile", async () => {
    const root = join(tmpdir(), `dna-docker-nobuild-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    const result = await runDockerBuild(root);
    expect(result.skipped).toBe(true);
    expect(result.success).toBe(false);
    expect(result.reason).toContain("Dockerfile");
    await rm(root, { recursive: true, force: true });
  });

  it("probes docker availability without throwing", async () => {
    // Exercises the exec wrapper; the boolean depends on the host, but the
    // call must resolve cleanly whether or not docker is installed.
    const available = await isDockerAvailable();
    expect(typeof available).toBe("boolean");
  });
});
