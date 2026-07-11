import { describe, it, expect } from "vitest";
import {
  buildSystemsIntegrationsMarkdown,
  getCountrySystemsDnaPackIds,
  getCountrySystemsProfile,
} from "./healthcare-systems-by-country.js";

describe("healthcare systems by country", () => {
  it("US catalog includes Epic, Cerner, Redox with DNA pack links", () => {
    const profile = getCountrySystemsProfile("us");
    const md = buildSystemsIntegrationsMarkdown(profile);
    expect(md).toContain("Epic");
    expect(md).toContain("healthcare/epic");
    expect(md).toContain("healthcare/redox");
    expect(md).toContain("Integration playbook");
  });

  it("AU catalog includes MHR and GP systems", () => {
    const md = buildSystemsIntegrationsMarkdown(getCountrySystemsProfile("au"));
    expect(md).toContain("My Health Record");
    expect(md).toContain("Best Practice");
  });

  it("IN catalog includes ABDM stack", () => {
    const md = buildSystemsIntegrationsMarkdown(getCountrySystemsProfile("in"));
    expect(md).toContain("ABDM");
    expect(md).toContain("ABHA");
  });

  it("fallback profile for unmapped ISO still includes Redox", () => {
    const packs = getCountrySystemsDnaPackIds("zz");
    expect(packs).toContain("healthcare/redox");
  });
});
