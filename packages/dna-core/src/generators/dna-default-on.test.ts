import { describe, it, expect } from "vitest";
import type { DnaConfig } from "@superhumaan/dna-config";
import { generateAiToolFiles } from "./ai-tools.js";
import { generateAiWorkbenchCoreFiles } from "./ai-workbench.js";
import { buildAgentsMd } from "./dna-default-on.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "test",
    projectName: "Test App",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: ["cursor"],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

const wizardAnswers = {
  projectDescription: "Test",
  acceptRecommendation: true,
  platformFeatures: [] as string[],
  aiTools: ["cursor"] as const,
  compliance: "none" as const,
  stage: "new" as const,
  installRuntime: true,
  installFeatureFactory: true,
  installCi: true,
  configureGithub: true,
  configureAi: true,
};

describe("dna default-on", () => {
  it("generates AGENTS.md with intent routing and 9-role agent flow", () => {
    const agents = buildAgentsMd("Test App");

    expect(agents).toContain("Intent routing");
    expect(agents).toContain("9 roles");
    expect(agents).toContain("ai/agent-loop.md");
    expect(agents).toContain("product-process.mdc");
    expect(agents).toContain("No code");
    expect(agents).toContain("Engineering work");
    expect(agents).toContain("Q&A");
  });

  it("generates AGENTS.md and always-on rules on init", () => {
    const files = generateAiToolFiles(testConfig(), { ...wizardAnswers, aiTools: ["cursor"] }, true);

    expect(files["AGENTS.md"]).toContain("Agent flow");
    expect(files["AGENTS.md"]).toContain("Product Analyst");
    expect(files["AGENTS.md"]).toContain("Claude Code");
    expect(files[".cursor/rules/dna.mdc"]).toContain("Intent routing");
    expect(files[".cursor/rules/dna.mdc"]).toContain("ai/agent-loop.md");
  });

  it("workbench rule and skill enforce agent loop for engineering work", () => {
    const files = generateAiWorkbenchCoreFiles(testConfig());

    expect(files[".cursor/rules/dna-workbench.mdc"]).toContain("Classify intent");
    expect(files[".cursor/rules/dna-workbench.mdc"]).toContain("mandatory for engineering work");
    expect(files[".cursor/skills/dna-workbench/SKILL.md"]).toContain("AGENTS.md");
    expect(files[".cursor/skills/dna-workbench/SKILL.md"]).toContain("9 roles");
    expect(files[".claude/skills/dna-workbench/SKILL.md"]).toContain("ai/agent-loop.md");
    expect(files[".claude/skills/dna-workbench/dna-session-flow.md"]).toContain("mandatory agent loop");
  });

  it("generates Claude-first CLAUDE.md with agent flow when feature factory enabled", () => {
    const files = generateAiToolFiles(
      testConfig(),
      { ...wizardAnswers, aiTools: ["claude_code"] },
      true,
    );

    expect(files["CLAUDE.md"]).toContain("Intent routing");
    expect(files["CLAUDE.md"]).toContain("Solution Architect");
    expect(files["CLAUDE.md"]).toContain(".claude/skills/dna-workbench");
  });
});
