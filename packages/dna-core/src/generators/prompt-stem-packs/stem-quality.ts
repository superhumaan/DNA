import type { PromptStemPackDef } from "./types.js";

/**
 * Baseline quality for every prompt stem pack.
 * This is the default bar — not an "advanced" tier. New stems must meet it.
 */
export const STEM_QUALITY_BASELINE = {
  /** Standard pack files (workflow.md optional → 6 or 7). */
  requiredFiles: [
    "README.md",
    "prompt.md",
    "guidelines.md",
    "expectations.md",
    "context.md",
    "examples.md",
  ] as const,
  minExamples: 2,
  maxExamples: 3,
  minPromptChars: 1200,
  minMust: 6,
  minShould: 2,
  minExpectations: 4,
  promptMustInclude: ["Checklist", "Artifacts", "Failure modes"] as const,
} as const;

export type StemQualityResult = {
  ok: boolean;
  failures: string[];
};

/** Validate a stem definition against the baseline quality bar. */
export function checkStemQualityBaseline(def: PromptStemPackDef): StemQualityResult {
  const failures: string[] = [];
  const { minExamples, maxExamples, minPromptChars, minMust, minShould, minExpectations } =
    STEM_QUALITY_BASELINE;

  if (def.examples.length < minExamples || def.examples.length > maxExamples) {
    failures.push(`examples ${def.examples.length} (need ${minExamples}–${maxExamples})`);
  }
  if (def.prompt.length < minPromptChars) {
    failures.push(`prompt ${def.prompt.length} chars (need ≥${minPromptChars})`);
  }
  for (const needle of STEM_QUALITY_BASELINE.promptMustInclude) {
    if (!def.prompt.includes(needle)) {
      failures.push(`prompt missing "${needle}"`);
    }
  }
  if (def.guidelines.must.length < minMust) {
    failures.push(`must ${def.guidelines.must.length} (need ≥${minMust})`);
  }
  if ((def.guidelines.should?.length ?? 0) < minShould) {
    failures.push(`should ${def.guidelines.should?.length ?? 0} (need ≥${minShould})`);
  }
  if (def.expectations.length < minExpectations) {
    failures.push(`expectations ${def.expectations.length} (need ≥${minExpectations})`);
  }

  return { ok: failures.length === 0, failures };
}
