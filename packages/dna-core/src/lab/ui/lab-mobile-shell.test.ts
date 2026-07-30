import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const dashboardSource = readFileSync(join(here, "dashboard.ts"), "utf8");
const stylesSource = readFileSync(join(here, "styles.ts"), "utf8");

describe("Lab mobile shell (ColorParty admin parity)", () => {
  it("defines the 900px mobile shell breakpoint", () => {
    expect(dashboardSource).toMatch(/LAB_MOBILE_SHELL_MQ\s*=\s*"\(max-width: 900px\)"/);
  });

  it("wires collapsible mobile chrome + off-canvas nav", () => {
    expect(dashboardSource).toMatch(/settings-mobile-chrome/);
    expect(dashboardSource).toMatch(/settings-nav-backdrop/);
    expect(dashboardSource).toMatch(/settings-shell--nav-open/);
    expect(dashboardSource).toMatch(/data-action="nav-toggle"/);
    expect(dashboardSource).toMatch(/data-action="nav-close"/);
    expect(dashboardSource).toMatch(/aria-controls="lab-settings-nav"/);
    expect(dashboardSource).toMatch(/aria-expanded="/);
    expect(dashboardSource).toMatch(/event\.key !== "Escape"/);
    expect(dashboardSource).toMatch(/closeMobileNav\(\)/);
  });

  it("closes the drawer when navigating tabs", () => {
    expect(dashboardSource).toMatch(/closeMobileNav\(\);\s*\n\s*ensureNavGroupOpen/);
  });
});

describe("Lab mobile responsive CSS", () => {
  it("collapses the shell and scrolls tables under 900px", () => {
    expect(stylesSource).toMatch(/@media \(max-width: 900px\)/);
    expect(stylesSource).toMatch(/\.settings-shell--nav-open \.settings-nav/);
    expect(stylesSource).toMatch(/\.settings-mobile-chrome/);
    expect(stylesSource).toMatch(/min-width:\s*640px/);
    expect(stylesSource).toMatch(/-webkit-overflow-scrolling:\s*touch/);
    expect(stylesSource).toMatch(
      /\.soli-administration-page-header__actions\s*\{[^}]*width:\s*100%/s,
    );
  });

  it("stacks mobile nav above content with backdrop z-index", () => {
    expect(stylesSource).toMatch(/\.settings-nav-backdrop\s*\{[^}]*z-index:\s*1100;/s);
    expect(stylesSource).toMatch(
      /@media \(max-width: 900px\)[\s\S]*?\.settings-nav\s*\{[^}]*z-index:\s*1200;/s,
    );
    expect(stylesSource).toMatch(/\.settings-mobile-chrome\s*\{[^}]*z-index:\s*1050;/s);
  });

  it("hides mobile chrome on desktop", () => {
    expect(stylesSource).toMatch(
      /\.settings-nav-backdrop,\s*\.settings-mobile-chrome,\s*\.settings-nav-close\s*\{\s*display:\s*none;/,
    );
  });
});
