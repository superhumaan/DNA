import { describe, it, expect } from "vitest";
import { formatAiConnectGuide, isRealAiProvider } from "./ai-connect.js";

describe("ai connect", () => {
  it("identifies real providers", () => {
    expect(isRealAiProvider("openai")).toBe(true);
    expect(isRealAiProvider("anthropic")).toBe(true);
    expect(isRealAiProvider("mock")).toBe(false);
    expect(isRealAiProvider(undefined)).toBe(false);
  });

  it("formats connect guide with supported providers", () => {
    const text = formatAiConnectGuide();
    expect(text).toContain("Supported providers");
    expect(text).toContain("openai");
    expect(text).toContain("anthropic");
    expect(text).toContain("OPENAI_API_KEY");
    expect(text).toContain("ANTHROPIC_API_KEY");
    expect(text).toContain("dna ai connect --provider openai");
  });

  it("shows current config when provided", () => {
    const text = formatAiConnectGuide({ enabled: true, provider: "mock" });
    expect(text).toContain("not connected (mock default)");
  });
});
