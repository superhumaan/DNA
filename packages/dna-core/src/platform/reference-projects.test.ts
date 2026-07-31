import { describe, it, expect } from "vitest";
import {
  resolveReferenceProjects,
  DNA_REFERENCE_PROJECT_DEFS,
} from "./reference-projects.js";

describe("reference projects", () => {
  it("returns an empty list", async () => {
    expect(DNA_REFERENCE_PROJECT_DEFS).toEqual([]);
    expect(await resolveReferenceProjects()).toEqual([]);
  });
});
