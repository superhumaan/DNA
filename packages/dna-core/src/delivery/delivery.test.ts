import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeJsonFile } from "../fs.js";
import {
  parseMethodologyInput,
  parseArchetypeInput,
  resolveDeliveryProfile,
  knowledgePackIdsForProfile,
} from "./catalog.js";
import { setDeliveryProfile, showDeliveryProfile } from "./profile.js";
import { generateMethodologyPlan } from "./plan.js";
import { generateMethodologyContext } from "./context.js";
import type { DnaConfig } from "@superhumaan/dna-config";

function baseConfig(overrides: Partial<DnaConfig> = {}): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "test",
    projectName: "test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "scaling",
    aiTools: ["cursor"],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
    ...overrides,
  };
}

describe("delivery profile", () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "dna-delivery-"));
    await writeJsonFile(join(root, ".DNA", "config.dna.json"), baseConfig());
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("parses methodology aliases", () => {
    expect(parseMethodologyInput("tribes")).toBe("spotify-model");
    expect(() => parseMethodologyInput("agoda")).toThrow();
    expect(parseArchetypeInput("agoda")).toBe("travel-scale-up");
    expect(parseArchetypeInput("openai")).toBe("research-lab");
  });

  it("resolves default profile when delivery block missing", () => {
    const profile = resolveDeliveryProfile(baseConfig());
    expect(profile.methodology).toBe("dna-default");
    expect(profile.ticketSystem).toBe("github");
  });

  it("resolves scrum profile with jira packs", () => {
    const profile = resolveDeliveryProfile(
      baseConfig({
        delivery: {
          methodology: "scrum",
          companyArchetype: "travel-scale-up",
          ticketSystem: "jira",
          docSystem: "confluence",
          hierarchy: ["epic", "story", "subtask"],
          ceremonies: ["sprint-planning"],
        },
      }),
    );
    const packs = knowledgePackIdsForProfile(profile);
    expect(packs).toContain("methodologies/scrum");
    expect(packs).toContain("companies/travel-scale-up");
    expect(packs).toContain("integrations/jira");
  });

  it("sets delivery profile and installs packs", async () => {
    const result = await setDeliveryProfile({
      root,
      methodology: "spotify-model",
      companyArchetype: "travel-scale-up",
      ticketSystem: "jira",
      docSystem: "confluence",
    });
    expect(result.profile.methodology).toBe("spotify-model");
    expect(result.profile.companyArchetype).toBe("travel-scale-up");
    expect(result.knowledgePacks).toContain("methodologies/spotify-model");

    const shown = await showDeliveryProfile(root);
    expect(shown.profile.methodology).toBe("spotify-model");
  });

  it("generates methodology plan and context", async () => {
    await setDeliveryProfile({
      root,
      methodology: "scrum",
      companyArchetype: "none",
    });
    const plan = await generateMethodologyPlan({ root, quote: "Write sprint stories" });
    expect(plan.context).toContain("Scrum");
    expect(plan.context).toContain("Write sprint stories");

    const ctx = await generateMethodologyContext(root);
    expect(ctx).toContain("DNA Methodology Context");
    expect(ctx).toContain("scrum");
  });
});
