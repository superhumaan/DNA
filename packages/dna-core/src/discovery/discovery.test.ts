import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeJsonFile } from "../fs.js";
import {
  parseLifecycleInput,
  parseMethodInput,
  parseTeamInput,
  resolveDiscoveryProfile,
  knowledgePackIdsForDiscoveryProfile,
} from "./catalog.js";
import { setDiscoveryProfile, showDiscoveryProfile } from "./profile.js";
import { generateDiscoveryPlan, generateResearchPlan } from "./plan.js";
import { generateDiscoveryContext } from "./context.js";
import { syncDiscoveryFindings } from "./sync.js";
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

describe("discovery profile", () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "dna-discovery-"));
    await writeJsonFile(join(root, ".DNA", "config.dna.json"), baseConfig());
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("parses lifecycle and team aliases", () => {
    expect(parseLifecycleInput("pmf")).toBe("pmf");
    expect(parseLifecycleInput("product-market-fit")).toBe("pmf");
    expect(parseTeamInput("lab")).toBe("innovation-lab");
    expect(parseMethodInput("interviews")).toBe("user-interviews");
  });

  it("resolves default profile when discovery block missing", () => {
    const profile = resolveDiscoveryProfile(baseConfig());
    expect(profile.lifecycleStage).toBe("ideation");
    expect(profile.activeProcesses).toContain("continuous-discovery");
  });

  it("includes foundation packs for any profile", () => {
    const packs = knowledgePackIdsForDiscoveryProfile(resolveDiscoveryProfile(baseConfig()));
    expect(packs).toContain("discovery/overview");
    expect(packs).toContain("discovery/continuous-discovery");
    expect(packs).toContain("discovery/handoff-to-delivery");
  });

  it("sets discovery profile and installs packs", async () => {
    const result = await setDiscoveryProfile({
      root,
      lifecycleStage: "solution-validation",
      teamModel: "discovery-squad",
      methods: "usability-testing,user-interviews",
      events: "research-readout",
    });
    expect(result.profile.lifecycleStage).toBe("solution-validation");
    expect(result.profile.teamModel).toBe("discovery-squad");
    expect(result.knowledgePacks).toContain("discovery/methods/usability-testing");

    const shown = await showDiscoveryProfile(root);
    expect(shown.profile.teamModel).toBe("discovery-squad");
  });

  it("generates discovery plan, research plan, context, and sync", async () => {
    await setDiscoveryProfile({
      root,
      lifecycleStage: "problem-validation",
      methods: "user-interviews",
    });
    const plan = await generateDiscoveryPlan({ root, quote: "Validate checkout pain" });
    expect(plan.context).toContain("Problem validation");
    expect(plan.context).toContain("Validate checkout pain");

    const research = await generateResearchPlan({
      root,
      method: "user-interviews",
      quote: "Why do users abandon cart?",
    });
    expect(research.context).toContain("User interviews");

    const ctx = await generateDiscoveryContext(root);
    expect(ctx).toContain("DNA Discovery Context");

    const sync = await syncDiscoveryFindings({
      root,
      quote: "Users abandon due to unexpected shipping costs",
    });
    expect(sync.updated.length).toBeGreaterThan(0);
  });
});
