import { describe, expect, it } from "vitest";
import { stripInappropriateLanguage } from "./language.js";

describe("stripInappropriateLanguage", () => {
  it("replaces profanity and leaves the surrounding sentence", () => {
    expect(stripInappropriateLanguage("This is fucking broken")).toBe("This is [removed] broken");
  });

  it("replaces obfuscated forms and slurs", () => {
    expect(stripInappropriateLanguage("what the f*ck")).toBe("what the [removed]");
    expect(stripInappropriateLanguage("a nigger in the log")).toBe("a [removed] in the log");
  });

  it("does not strip words that only contain those letters", () => {
    expect(stripInappropriateLanguage("class assignment")).toBe("class assignment");
  });
});
