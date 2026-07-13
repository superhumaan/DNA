import { describe, it, expect } from "vitest";
import {
  DNA_CRITICAL_THINKING_SECTION,
  REASONING_MARKER,
  reasoningBehaviourMarkdown,
} from "./dna-reasoning.js";
import { buildAgentsMd } from "./dna-default-on.js";
import { generateNeuralNetwork } from "./neural-network.js";

describe("dna-reasoning", () => {
  it("exports always-on critical thinking section", () => {
    expect(DNA_CRITICAL_THINKING_SECTION).toContain("system-wide");
    expect(DNA_CRITICAL_THINKING_SECTION).toContain("reasoning.behaviour.md");
    expect(DNA_CRITICAL_THINKING_SECTION).toContain("OODA");
  });

  it("generates comprehensive reasoning behaviour file", () => {
    const md = reasoningBehaviourMarkdown();
    expect(md).toContain(REASONING_MARKER);
    expect(md).toContain("Pattern recognition");
    expect(md).toContain("5 Whys");
    expect(md).toContain("Binary search");
    expect(md).toContain("Solution adaptation");
  });

  it("injects critical thinking into AGENTS.md", () => {
    const agents = buildAgentsMd("Test App");
    expect(agents).toContain("Critical thinking");
    expect(agents).toContain("reasoning.behaviour.md");
  });

  it("adds reasoning behaviour to every neural network intent", () => {
    const network = generateNeuralNetwork({
      version: "0.1.0",
      projectId: "t",
      projectName: "T",
      createdAt: "",
      updatedAt: "",
      stack: {},
      compliance: "none",
      stage: "new",
      aiTools: [],
      autoUpdate: true,
      channel: "stable",
      knowledgePacks: [],
      platformFeatures: [],
    });
    for (const intent of Object.values(network.intents)) {
      expect(intent.requiredBehaviour[0]).toBe("reasoning.behaviour.md");
    }
  });
});
