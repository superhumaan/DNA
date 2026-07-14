import { describe, expect, it } from "vitest";
import { isBenignRuntimeError, isBenignRuntimeMessage } from "./noise.js";

describe("benign runtime noise", () => {
  it("recognizes EPIPE / ECONNRESET", () => {
    expect(isBenignRuntimeMessage("write EPIPE")).toBe(true);
    expect(isBenignRuntimeError(Object.assign(new Error("write EPIPE"), { code: "EPIPE" }))).toBe(
      true,
    );
    expect(isBenignRuntimeError(Object.assign(new Error("aborted"), { code: "ECONNRESET" }))).toBe(
      true,
    );
    expect(isBenignRuntimeMessage("TypeError: Cannot read properties")).toBe(false);
  });
});
