import { describe, it, expect } from "vitest";
import {
  isAdminPortalRequest,
  appendAdminPortalRequirements,
  ADMIN_PORTAL_DEFAULT_PATH,
} from "./pattern.js";

describe("admin portal pattern", () => {
  it("detects admin and backoffice mentions", () => {
    expect(isAdminPortalRequest("Build an admin portal")).toBe(true);
    expect(isAdminPortalRequest("We need a backoffice for moderators")).toBe(true);
    expect(isAdminPortalRequest("back office user management")).toBe(true);
    expect(isAdminPortalRequest("record phone calls")).toBe(false);
  });

  it("appends admin requirements to feature request", () => {
    const md = appendAdminPortalRequirements("# Feature\n\n> admin users");
    expect(md).toContain(ADMIN_PORTAL_DEFAULT_PATH);
    expect(md).toContain("new tab");
    expect(md).toContain("requireAdmin");
  });
});
