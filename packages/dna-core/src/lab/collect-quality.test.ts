import { describe, expect, it } from "vitest";
import {
  classifyCiFailure,
  durationMs,
  summarizeCiBillingBlocker,
  type LabCiRun,
} from "./collect-quality.js";

describe("CI billing classification", () => {
  it("classifies annotation text as billing", () => {
    expect(
      classifyCiFailure({
        conclusion: "failure",
        createdAt: "2026-07-14T04:34:28Z",
        updatedAt: "2026-07-14T04:34:35Z",
        annotationText:
          "The job was not started because recent account payments have failed or your spending limit needs to be increased.",
      }),
    ).toBe("billing");
  });

  it("classifies empty-step short failures as billing", () => {
    expect(
      classifyCiFailure({
        conclusion: "failure",
        createdAt: "2026-07-14T04:34:28Z",
        updatedAt: "2026-07-14T04:34:30Z",
        jobsWithEmptySteps: true,
      }),
    ).toBe("billing");
  });

  it("classifies longer failures without annotation as code", () => {
    expect(
      classifyCiFailure({
        conclusion: "failure",
        createdAt: "2026-07-14T04:00:00Z",
        updatedAt: "2026-07-14T04:08:00Z",
      }),
    ).toBe("code");
  });

  it("returns unknown for successful runs", () => {
    expect(classifyCiFailure({ conclusion: "success" })).toBe("unknown");
  });

  it("computes duration", () => {
    expect(durationMs("2026-07-14T04:34:28Z", "2026-07-14T04:34:35Z")).toBe(7000);
    expect(durationMs(undefined, "2026-07-14T04:34:35Z")).toBeNull();
  });

  it("summarizes billing blocker from classified runs", () => {
    const runs: LabCiRun[] = [
      {
        displayTitle: "CI",
        status: "completed",
        conclusion: "failure",
        failureKind: "billing",
        failureMessage: "spending limit needs to be increased",
      },
      {
        displayTitle: "ok",
        status: "completed",
        conclusion: "success",
      },
    ];
    const blocker = summarizeCiBillingBlocker(runs);
    expect(blocker).toMatchObject({
      active: true,
      affectedRuns: 1,
      billingUrl: "https://github.com/settings/billing",
    });
    expect(blocker?.sampleMessage).toContain("spending limit");
  });

  it("returns null when no billing failures", () => {
    expect(
      summarizeCiBillingBlocker([
        { displayTitle: "CI", status: "completed", conclusion: "failure", failureKind: "code" },
      ]),
    ).toBeNull();
  });
});
