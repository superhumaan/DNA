import { describe, it, expect } from "vitest";
import type { PromptStemPackDef } from "./types.js";
import { checkStemQualityBaseline, STEM_QUALITY_BASELINE } from "./stem-quality.js";

function baseDef(overrides: Partial<PromptStemPackDef> = {}): PromptStemPackDef {
  return {
    id: "sample-stem",
    name: "Sample",
    category: "quality",
    slash: "sample-stem",
    summary: "Sample stem for quality checks",
    tags: ["quality"],
    copyVariants: ["Sample ask"],
    prompt: `# Sample

## Checklist
- [ ] One

## Artifacts
| A | B |
|---|---|
| x | y |

## Failure modes
| Mode | Response |
|------|----------|
| none | n/a |

${"x".repeat(STEM_QUALITY_BASELINE.minPromptChars)}
`,
    guidelines: {
      must: Array.from({ length: STEM_QUALITY_BASELINE.minMust }, (_, i) => `must-${i}`),
      should: Array.from({ length: STEM_QUALITY_BASELINE.minShould }, (_, i) => `should-${i}`),
      never: ["never-1"],
    },
    expectations: Array.from({ length: STEM_QUALITY_BASELINE.minExpectations }, (_, i) => `exp-${i}`),
    contextLoads: [".DNA/neuralNetwork.json"],
    cliCommands: ["npx dna analyze"],
    examples: [
      { userSays: "one", goodResponse: "ok one" },
      { userSays: "two", goodResponse: "ok two" },
    ],
    ...overrides,
  };
}

describe("stem quality baseline", () => {
  it("exports baseline constants", () => {
    expect(STEM_QUALITY_BASELINE.minExamples).toBe(2);
    expect(STEM_QUALITY_BASELINE.maxExamples).toBe(3);
    expect(STEM_QUALITY_BASELINE.promptMustInclude).toContain("Checklist");
  });

  it("passes a complete stem definition", () => {
    const result = checkStemQualityBaseline(baseDef());
    expect(result.ok).toBe(true);
    expect(result.failures).toEqual([]);
  });

  it("fails when examples are out of range", () => {
    const tooFew = checkStemQualityBaseline(baseDef({ examples: [{ userSays: "a", goodResponse: "b" }] }));
    expect(tooFew.ok).toBe(false);
    expect(tooFew.failures.some((f) => f.includes("examples"))).toBe(true);

    const tooMany = checkStemQualityBaseline(
      baseDef({
        examples: [
          { userSays: "a", goodResponse: "1" },
          { userSays: "b", goodResponse: "2" },
          { userSays: "c", goodResponse: "3" },
          { userSays: "d", goodResponse: "4" },
        ],
      }),
    );
    expect(tooMany.ok).toBe(false);
  });

  it("fails when prompt is short or missing required sections", () => {
    const short = checkStemQualityBaseline(baseDef({ prompt: "## Checklist\n## Artifacts\n## Failure modes\n" }));
    expect(short.ok).toBe(false);
    expect(short.failures.some((f) => f.includes("prompt"))).toBe(true);

    const missing = checkStemQualityBaseline(
      baseDef({ prompt: `${"y".repeat(STEM_QUALITY_BASELINE.minPromptChars + 10)}` }),
    );
    expect(missing.ok).toBe(false);
    expect(missing.failures.some((f) => f.includes("Checklist"))).toBe(true);
  });

  it("fails when guidelines or expectations are too thin", () => {
    const thinMust = checkStemQualityBaseline(
      baseDef({
        guidelines: { must: ["one"], should: ["a", "b"], never: ["n"] },
      }),
    );
    expect(thinMust.ok).toBe(false);
    expect(thinMust.failures.some((f) => f.includes("must"))).toBe(true);

    const thinShould = checkStemQualityBaseline(
      baseDef({
        guidelines: {
          must: Array.from({ length: 6 }, (_, i) => `m${i}`),
          should: ["only-one"],
          never: ["n"],
        },
      }),
    );
    expect(thinShould.ok).toBe(false);
    expect(thinShould.failures.some((f) => f.includes("should"))).toBe(true);

    const thinExp = checkStemQualityBaseline(baseDef({ expectations: ["a", "b"] }));
    expect(thinExp.ok).toBe(false);
    expect(thinExp.failures.some((f) => f.includes("expectations"))).toBe(true);
  });
});
