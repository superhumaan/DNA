import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  resolvePackIdsForKnowledgePaths,
  resolvePackIdsForIntents,
  resetKnowledgePathIndex,
} from "./resolve.js";
import { ensureKnowledgeInstalled } from "./ensure.js";
import { resolveFoundationPackIds } from "./foundation.js";
import { resolveFeaturePlanPackIds } from "../platform/knowledge.js";
import { getFeature } from "../platform/catalog.js";
import { generateNeuralNetwork } from "../generators/neural-network.js";
import { runWizard } from "../wizard.js";
import { generateFeaturePlan } from "../platform/feature-plan.js";
import { generateContext } from "../context.js";
import type { DnaConfig } from "@superhumaan/dna-config";

describe("knowledge resolve", () => {
  it("maps knowledge paths to marketplace pack IDs", () => {
    resetKnowledgePathIndex();
    const packs = resolvePackIdsForKnowledgePaths([
      "security/rbac-fundamentals.dna.md",
      "platforms/dna/admin-portal.dna.md",
    ]);
    expect(packs).toContain("security/rbac-zero-trust");
    expect(packs).toContain("platforms/dna-stack");
  });

  it("resolves pack IDs from neural network intents", () => {
    resetKnowledgePathIndex();
    const neural = generateNeuralNetwork({} as DnaConfig);
    const packs = resolvePackIdsForIntents(["implement_rbac"], neural);
    expect(packs).toContain("security/rbac-zero-trust");
  });

  it("resolves feature plan packs with transitive dependencies", () => {
    resetKnowledgePathIndex();
    const feature = getFeature("admin-portal");
    expect(feature).toBeDefined();
    const packs = resolveFeaturePlanPackIds(feature!);
    expect(packs).toContain("platforms/dna-stack");
    expect(packs).toContain("security/rbac-zero-trust");
  });
});

describe("knowledge foundation", () => {
  it("includes stack and compliance packs for B2B SaaS init", () => {
    const config = {
      description: "B2B SaaS platform",
      stack: { frontend: "next", backend: "fastify", platform: "B2B SaaS" },
      compliance: "gdpr",
      autoUpdate: true,
      channel: "stable",
    } as DnaConfig;

    const packs = resolveFoundationPackIds(config);
    expect(packs).toContain("disciplines/security");
    expect(packs).toContain("compliance/tiered-standards");
    expect(packs).toContain("frameworks/nextjs");
    expect(packs).toContain("frameworks/fastify");
    expect(packs).toContain("platforms/b2b-saas");
    expect(packs).toContain("security/rbac-zero-trust");
    expect(packs).toContain("compliance/gdpr");
  });
});

describe("knowledge install layers", () => {
  it("installs foundation on init and prefetches on plan + context", async () => {
    resetKnowledgePathIndex();
    const root = join(tmpdir(), `dna-knowledge-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "knowledge-test", dependencies: { react: "^18", next: "^14" } }),
    );

    const { config } = await runWizard({
      root,
      answers: {
        projectDescription: "B2B SaaS dashboard",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "gdpr",
        stage: "mvp",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    expect(config.knowledgePacks.length).toBeGreaterThan(0);

    const rbacContent = await readFile(
      join(root, ".DNA", "knowledge", "security/rbac-fundamentals.dna.md"),
      "utf-8",
    );
    expect(rbacContent).toContain("RBAC Fundamentals");

    const plan = await generateFeaturePlan({
      root,
      featureId: "sso-bridge",
      quote: "Cross-app SSO between subdomains",
    });
    expect(plan.context).toContain("Installed knowledge packs");

    const ssoContent = await readFile(
      join(root, ".DNA", "knowledge", "integrations/sso-bridge.dna.md"),
      "utf-8",
    );
    expect(ssoContent.length).toBeGreaterThan(50);

    const ctx = await generateContext(root, "security");
    expect(ctx).toContain("security/rbac-fundamentals");

    await rm(root, { recursive: true, force: true });
  }, 15_000);

  it("ensureKnowledgeInstalled is idempotent", async () => {
    resetKnowledgePathIndex();
    const root = join(tmpdir(), `dna-ensure-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "ensure-test" }));

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

    const first = await ensureKnowledgeInstalled(root, ["frameworks/nestjs"]);
    expect(first.installed.length + first.refreshed.length).toBeGreaterThan(0);

    const second = await ensureKnowledgeInstalled(root, ["frameworks/nestjs"]);
    expect(second.refreshed).toContain("frameworks/nestjs");
    expect(second.installed).toHaveLength(0);

    await rm(root, { recursive: true, force: true });
  });
});
