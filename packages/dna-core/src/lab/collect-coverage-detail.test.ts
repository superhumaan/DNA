import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectLabCoverageDetail } from "./collect-coverage-detail.js";
import { probeIsFresh } from "./collect-probe.js";

describe("collectLabCoverageDetail", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
    root = "";
  });

  it("parses per-file coverage summary", async () => {
    root = mkdtempSync(join(tmpdir(), "dna-cov-"));
    mkdirSync(join(root, "coverage"), { recursive: true });
    writeFileSync(
      join(root, "coverage", "coverage-summary.json"),
      JSON.stringify({
        total: {
          lines: { total: 10, covered: 8, pct: 80 },
          statements: { total: 10, covered: 8, pct: 80 },
          functions: { total: 2, covered: 2, pct: 100 },
          branches: { total: 4, covered: 2, pct: 50 },
        },
        "/x/packages/a/src/f.ts": {
          lines: { total: 10, covered: 5, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
          functions: { total: 1, covered: 1, pct: 100 },
          branches: { total: 2, covered: 1, pct: 50 },
        },
      }),
    );
    const detail = await collectLabCoverageDetail(root);
    expect(detail?.summary.lines.pct).toBe(80);
    expect(detail?.files.length).toBe(1);
    expect(detail?.distribution[1]?.count).toBe(1); // 50% → 50–80% bucket
  });
});

describe("probeIsFresh", () => {
  it("respects ttl hours", () => {
    expect(probeIsFresh(null, 5)).toBe(false);
    expect(probeIsFresh(new Date().toISOString(), 5)).toBe(true);
    expect(probeIsFresh(new Date(Date.now() - 6 * 3600_000).toISOString(), 5)).toBe(false);
  });
});
