import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

function browserPack(
  id: string,
  name: string,
  engine: string,
  notes: string,
): KnowledgePack {
  return catalogPack(
    `browsers/${id}`,
    name,
    "platforms",
    `${name} — testing, APIs, and compatibility for DNA web projects`,
    [
      {
        path: `browsers/${id}/positioning.dna.md`,
        content: `# ${name} — Browser Target

Engine: **${engine}**

${notes}

Pair with \`browsers/cross-browser\` for CI matrix and support policy.
`,
      },
      {
        path: `browsers/${id}/testing.dna.md`,
        content: `# ${name} — Testing

- Include in Playwright project config
- Test latest stable + one previous major where enterprise SLA requires
- Verify install/PWA flows on real device for mobile ${name} where applicable
- Capture trace on failure (\`trace: on-first-retry\`)
`,
      },
    ],
    ["browser", id],
  );
}

export const BROWSER_PACKS: KnowledgePack[] = [
  browserPack(
    "chrome",
    "Google Chrome",
    "Blink / V8",
    `Primary development browser. Manifest V3 extensions, DevTools, Lighthouse CI baseline.

## Enterprise
- Managed Chrome policies may block extensions — document IT requirements
- Chrome Web Store for extension distribution`,
  ),
  browserPack(
    "firefox",
    "Mozilla Firefox",
    "Gecko",
    `Test Firefox for CSS layout, privacy features, and extension parity (MV3 subset).

## Notes
- \`layout.css\` quirks differ from Chromium — check flex/grid
- Facebook container / ETP may block third-party cookies in tests`,
  ),
  browserPack(
    "safari",
    "Apple Safari",
    "WebKit",
    `**Mandatory** for iOS/macOS audiences. ITP, date input, PWA limitations, 100vh bugs.

## Rules
- Test on real iPhone — Simulator insufficient for PWA install
- \`-webkit-\` prefixes only when standards track requires
- Cookie \`SameSite=None; Secure\` for cross-site embeds`,
  ),
  browserPack(
    "edge",
    "Microsoft Edge",
    "Blink (Chromium)",
    `Enterprise default on Windows. Align with Chrome for Chromium features; test SSO (Entra ID) flows.

## Notes
- IE mode not supported — document end-of-IE policy
- Edge Add-ons store for extensions`,
  ),
  browserPack(
    "brave",
    "Brave",
    "Blink",
    `Chromium fork with aggressive blocking. Verify analytics/consent and wallet/Web3 features if applicable.

Shields may break embedded widgets — test with shields up and down.`,
  ),
  catalogPack(
    "browsers/cross-browser",
    "Cross-Browser Engineering",
    "platforms",
    "Support matrix, polyfills policy, and Playwright multi-browser CI",
    [
      {
        path: "browsers/cross-browser/positioning.dna.md",
        content: `# Cross-Browser — Positioning

Define **supported browsers** in Impressions (\`product/supported-clients.md\`).

## Default DNA matrix (B2B SaaS)
| Browser | Support |
|---------|---------|
| Chrome (last 2) | Full |
| Firefox (last 2) | Full |
| Safari (last 2) | Full |
| Edge (last 2) | Full |
| IE11 | **Not supported** |

Mobile: Safari iOS + Chrome Android mandatory for responsive apps.
`,
      },
      {
        path: "browsers/cross-browser/polyfills.dna.md",
        content: `# Cross-Browser — Polyfills Policy

- Target browserslist in package.json — CI enforces
- Prefer baseline widely available features (2024 baseline)
- Polyfill only what usage analytics prove necessary
- \`@vitejs/plugin-legacy\` only when contractually required — adds bundle cost
`,
      },
      {
        path: "browsers/cross-browser/playwright.dna.md",
        content: `# Cross-Browser — Playwright Matrix

\`\`\`ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
]
\`\`\`

Run smoke on all; full suite on chromium + webkit minimum.
`,
      },
    ],
    ["browser", "cross-browser"],
  ),
];
