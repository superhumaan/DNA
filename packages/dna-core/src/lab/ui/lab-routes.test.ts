import { describe, expect, it } from "vitest";
import {
  buildLabPath,
  isUnauthorizedMessage,
  normalizeLabBasePath,
  normalizeLabTab,
  parseLabLocation,
} from "./lab-routes.js";

describe("lab-routes", () => {
  it("normalizes base path", () => {
    expect(normalizeLabBasePath("/labs")).toBe("/labs");
    expect(normalizeLabBasePath("/labs/")).toBe("/labs");
    expect(normalizeLabBasePath("labs")).toBe("/labs");
    expect(normalizeLabBasePath("/dna-lab")).toBe("/dna-lab");
  });

  it("normalizes tabs and legacy aliases", () => {
    expect(normalizeLabTab("coverage")).toBe("coverage");
    expect(normalizeLabTab("quality")).toBe("reports");
    expect(normalizeLabTab("nope")).toBe("overview");
  });

  it("parses bare lab path as overview + bare", () => {
    expect(parseLabLocation("/labs", "/labs")).toEqual({
      tab: "overview",
      issueId: null,
      bare: true,
    });
    expect(parseLabLocation("/labs/", "/labs")).toEqual({
      tab: "overview",
      issueId: null,
      bare: true,
    });
  });

  it("parses tab and issue deep links", () => {
    expect(parseLabLocation("/labs/coverage", "/labs")).toEqual({
      tab: "coverage",
      issueId: null,
      bare: false,
    });
    expect(parseLabLocation("/labs/issues/abc%2Fdef", "/labs")).toEqual({
      tab: "issues",
      issueId: "abc/def",
      bare: false,
    });
    expect(parseLabLocation("/labs/overview", "/labs")).toEqual({
      tab: "overview",
      issueId: null,
      bare: false,
    });
  });

  it("builds stable paths for tabs and issues", () => {
    expect(buildLabPath("/labs", "overview")).toBe("/labs/overview");
    expect(buildLabPath("/labs", "coverage")).toBe("/labs/coverage");
    expect(buildLabPath("/labs/", "issues", "id-1")).toBe("/labs/issues/id-1");
  });

  it("detects unauthorized messages", () => {
    expect(isUnauthorizedMessage("Unauthorized")).toBe(true);
    expect(isUnauthorizedMessage("unauthorized")).toBe(true);
    expect(isUnauthorizedMessage("Not found")).toBe(false);
  });
});

describe("LAB_CLIENT_JS routing markers", () => {
  it("embeds path routing and unauthorized handling", async () => {
    const { LAB_CLIENT_JS } = await import("./dashboard.js");
    expect(LAB_CLIENT_JS).toContain("parseLabLocation");
    expect(LAB_CLIENT_JS).toContain("syncLabUrl");
    expect(LAB_CLIENT_JS).toContain("handleUnauthorized");
    expect(LAB_CLIENT_JS).toContain("popstate");
    expect(LAB_CLIENT_JS).toContain("dna_lab_route");
  });
});
