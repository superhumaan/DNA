import type { KnowledgePack } from "@superhumaan/dna-config";
import { stemPack } from "./bundled-catalog-helpers.js";

export const STEM_PLATFORM_PACKS: KnowledgePack[] = [
  stemPack(
    "platforms/pwa",
    "Progressive Web App",
    "platforms",
    "PWA install, offline, push, and iOS/Android quirks",
    [
      {
        path: "platforms/pwa/positioning.dna.md",
        content: `# PWA — Positioning

Web app that installs like a native app: manifest, service worker, HTTPS.

## When to use
- Field apps, kiosks, internal tools where store distribution is optional
- Complement to responsive web — not a replacement for push-heavy native features on iOS

## Stack pairing
- Vite: \`vite-plugin-pwa\` (see \`frameworks/vite/pwa-patterns.dna.md\`)
- Next.js: custom SW or \`@serwist/next\` — document choice in Impressions

Use \`pwa-react-vite\` archetype or set \`stack.platform\` to include \`pwa\`.
`,
      },
      {
        path: "platforms/pwa/offline.dna.md",
        content: `# PWA — Offline & Caching

## Strategies
- **App shell** — cache static assets; network-first for API
- **Stale-while-revalidate** for semi-static JSON
- Version cache on deploy — bump SW on breaking API changes

## Rules
- Never cache authenticated API responses without explicit TTL and scope
- Show offline UI state — do not fail silently
- Test airplane mode and slow 3G
`,
      },
      {
        path: "platforms/pwa/ios-android.dna.md",
        content: `# PWA — iOS & Android Quirks

## iOS Safari
- Add to Home Screen required for standalone display
- Push notifications: limited — verify iOS version support before promising push
- Storage quotas stricter — plan for eviction

## Android Chrome
- install prompt via \`beforeinstallprompt\`
- Full push via FCM when configured
- TWA (Trusted Web Activity) optional for Play Store listing
`,
      },
    ],
  ),
  stemPack(
    "platforms/desktop-cross-platform",
    "Desktop (Electron & Tauri)",
    "platforms",
    "Cross-platform desktop for Windows, macOS, and Linux — Electron or Tauri",
    [
      {
        path: "platforms/desktop-cross-platform/positioning.dna.md",
        content: `# Desktop Cross-Platform — Positioning

One codebase → Windows, macOS, Linux installers.

## Choose framework
| | Electron | Tauri |
|---|----------|-------|
| Runtime | Chromium + Node | System WebView + Rust shell |
| Bundle size | Larger | Smaller |
| Native APIs | Mature | Growing via plugins |
| Team skills | JS/TS only | Rust for native bridges |

Use \`desktop-electron\` or \`desktop-tauri\` archetype. Frontend: React + Vite common to both.
`,
      },
      {
        path: "platforms/desktop-cross-platform/security.dna.md",
        content: `# Desktop — Security

- **Never** enable \`nodeIntegration\` in renderer with remote content
- Use contextBridge + preload scripts for IPC
- Auto-update from signed feeds only (electron-updater / Tauri updater)
- Code signing: Apple notarization, Windows Authenticode, Linux GPG optional
- Store secrets in OS keychain, not plain config files
`,
      },
      {
        path: "platforms/desktop-cross-platform/distribution.dna.md",
        content: `# Desktop — Distribution

## Windows
- NSIS or MSI via electron-builder; MSIX optional
- SmartScreen — EV cert reduces warnings

## macOS
- \`.dmg\` or \`.pkg\`; notarize + staple with Apple credentials
- Universal binary (arm64 + x64) when using Electron 20+

## Linux
- AppImage, deb, rpm via electron-builder; Flatpak/snap if enterprise requires
- Test on Ubuntu LTS minimum
`,
      },
    ],
  ),
  stemPack(
    "platforms/marketing-website",
    "Marketing Website",
    "platforms",
    "Landing pages, SEO, analytics, and conversion — distinct from SaaS app",
    [
      {
        path: "platforms/marketing-website/positioning.dna.md",
        content: `# Marketing Website — Positioning

Public-facing site: positioning, pricing, docs, blog. **Separate deploy** from authenticated app when possible.

## Stack options
- Astro + Content Collections (\`astro-static\` archetype)
- Next.js static export for marketing only
- Ghost for blog (\`frameworks/ghost\`)

## Not for
- Multi-tenant dashboards, RBAC admin — use B2B SaaS archetypes
`,
      },
      {
        path: "platforms/marketing-website/seo-analytics.dna.md",
        content: `# Marketing — SEO & Analytics

- Core Web Vitals budget: LCP < 2.5s, CLS < 0.1
- Consent-gated analytics (GDPR/PECR) — load GA/Plausible after consent
- UTM preservation on CTA links to app signup
- Sitemap, robots, canonical URLs per locale
`,
      },
    ],
  ),
  stemPack(
    "platforms/browser-extension-chrome",
    "Chrome Extension (MV3)",
    "platforms",
    "Manifest V3 extensions for Chrome, Edge, and Chromium browsers",
    [
      {
        path: "platforms/browser-extension-chrome/positioning.dna.md",
        content: `# Chrome Extension — Positioning

Manifest V3 only for new extensions. Service worker background (not persistent background page).

## Structure
\`manifest.json\` — permissions minimal by default
\`service-worker\` — events, messaging
\`content-scripts/\` — DOM injection on matched URLs
\`popup/\` or \`sidepanel/\` — UI (React/Vite build into extension dist)

Use \`browser-extension-chrome\` archetype.
`,
      },
      {
        path: "platforms/browser-extension-chrome/security.dna.md",
        content: `# Chrome Extension — Security

- Request narrow \`host_permissions\` — justify each domain in Impressions
- No remote code execution — all JS bundled and reviewed
- Use \`chrome.storage.session\` for sensitive ephemeral data
- Content scripts: assume hostile page DOM — validate messages
- Chrome Web Store privacy questionnaire must match actual data use
`,
      },
      {
        path: "platforms/browser-extension-chrome/distribution.dna.md",
        content: `# Chrome Extension — Distribution

- Chrome Web Store developer account ($5 one-time)
- Edge Add-ons accepts same MV3 package often
- Version in manifest; incremental rollout via store %
- Enterprise: self-host CRX policy for managed Chrome
`,
      },
    ],
  ),
  stemPack(
    "platforms/browser-extension-safari",
    "Safari Web Extension",
    "platforms",
    "Safari Web Extensions — Xcode wrapper, App Store distribution",
    [
      {
        path: "platforms/browser-extension-safari/positioning.dna.md",
        content: `# Safari Web Extension — Positioning

Safari uses Web Extensions API (similar to MV3) wrapped in native Xcode project.

## Flow
1. Build web extension assets (shared with Chrome where possible)
2. Xcode \`Safari Web Extension\` target
3. Test in Safari Develop menu
4. Distribute via Mac App Store (extension + container app)

Use \`browser-extension-safari\` archetype. Pair with Chrome pack for shared codebase notes.
`,
      },
      {
        path: "platforms/browser-extension-safari/xcode.dna.md",
        content: `# Safari Extension — Xcode

- \`safari-web-extension-converter\` to bootstrap from Chrome build
- App Store requires privacy nutrition labels
- iOS Safari extensions: separate target, stricter review
- Shared Swift shell for settings UI when web popup insufficient
`,
      },
    ],
  ),
  stemPack(
    "platforms/gpt-apps",
    "GPT Apps & Actions",
    "platforms",
    "Custom GPTs, GPT Actions, OpenAI Apps SDK, and ChatGPT integrations",
    [
      {
        path: "platforms/gpt-apps/positioning.dna.md",
        content: `# GPT Apps — Positioning

Products that live inside or beside ChatGPT: Custom GPTs, Actions (OpenAPI), and Apps SDK experiences.

## Surfaces
| Surface | Use |
|---------|-----|
| Custom GPT | Instructions + knowledge files + optional Actions |
| GPT Action | OpenAPI schema → your HTTPS API |
| Apps SDK | Rich UI embedded in ChatGPT (when available) |

Server-proxy all model calls — API keys never in GPT instructions or client bundles.
Pair with \`platforms/aistudio/ai-governance.dna.md\` for production AI guardrails.
`,
      },
      {
        path: "platforms/gpt-apps/actions.dna.md",
        content: `# GPT Actions — API Design

## OpenAPI requirements
- HTTPS only, valid TLS
- OAuth or API key auth documented in schema
- Idempotent where possible; clear error bodies (no stack traces)

## Security
- Verify OpenAI request signatures where supported
- Rate limit per user/session
- Scope Actions to least data necessary
- Log invocations — never log full prompts with PII

Run \`dna context chatgpt\` for behaviour files when editing GPT-facing APIs.
`,
      },
      {
        path: "platforms/gpt-apps/custom-gpt.dna.md",
        content: `# Custom GPT — Authoring

## Instructions
- Role, constraints, refusal rules, output format
- Link to privacy policy if handling user data

## Knowledge uploads
- Scrub secrets; version docs when API changes
- Do not upload credentials or customer data

## Testing
- Red-team prompts: jailbreaks, data exfil, scope creep
- Verify Action calls hit staging before production URL
`,
      },
    ],
  ),
  stemPack(
    "platforms/mcp-server",
    "MCP Server",
    "platforms",
    "Model Context Protocol servers for Cursor, Claude, and AI tooling",
    [
      {
        path: "platforms/mcp-server/positioning.dna.md",
        content: `# MCP Server — Positioning

Expose tools, resources, and prompts to AI clients via Model Context Protocol.

## When to build
- Internal dev tools (Jira, deploy, DB read-only)
- Product feature: user connects their account to an AI assistant

Use \`mcp-server\` archetype. TypeScript SDK common; stdio for local, SSE/HTTP for remote.
`,
      },
      {
        path: "platforms/mcp-server/security.dna.md",
        content: `# MCP Server — Security

- Authenticate every connection — no anonymous production MCP
- Tool inputs: validate with Zod; reject path traversal in file tools
- Scope tokens per user/org; audit tool invocations
- Read-only by default; write tools need explicit confirmation flow in client
- Never return secrets in tool results
`,
      },
      {
        path: "platforms/mcp-server/deployment.dna.md",
        content: `# MCP Server — Deployment

## Local (stdio)
- Cursor/Claude Desktop config points to built binary
- Env via client config — not committed

## Remote (HTTP/SSE)
- TLS, OAuth or API keys
- Rate limits; health endpoint
- Version tools — breaking changes bump server version
`,
      },
    ],
  ),
  stemPack("platforms/ios-swift", "iOS (Swift)", "platforms", "Native iOS with SwiftUI and App Store distribution", [
    {
      path: "platforms/ios-swift/positioning.dna.md",
      content: `# iOS Native — Positioning

Swift + SwiftUI for iPhone/iPad. Use \`ios-native\` archetype when React Native/Flutter are not chosen.

## Structure
- SwiftUI views + @Observable / ObservableObject view models
- URLSession or Alamofire for API — same backend as web when sharing product
- Keychain for tokens; App Groups only when sharing with extensions
`,
    },
    {
      path: "platforms/ios-swift/distribution.dna.md",
      content: `# iOS — Distribution

- Xcode Archive → App Store Connect
- TestFlight before production
- Privacy manifest (\`PrivacyInfo.xcprivacy\`) required
- Sign in with Apple if offering other social OAuth
`,
    },
  ]),
  stemPack(
    "platforms/android-kotlin",
    "Android (Kotlin)",
    "platforms",
    "Native Android with Jetpack Compose and Play Store distribution",
    [
      {
        path: "platforms/android-kotlin/positioning.dna.md",
        content: `# Android Native — Positioning

Kotlin + Jetpack Compose. Use \`android-native\` archetype.

## Structure
- Single-activity + Compose navigation
- Hilt for DI; Retrofit/Ktor for API
- EncryptedSharedPreferences or DataStore for tokens
`,
      },
      {
        path: "platforms/android-kotlin/distribution.dna.md",
        content: `# Android — Distribution

- Play App Signing (recommended)
- Target current API level per Play policy
- Data safety form must match actual collection
- ProGuard/R8 rules for release builds
`,
      },
    ],
  ),
  stemPack(
    "platforms/macos-swift",
    "macOS (Swift)",
    "platforms",
    "Native macOS apps with SwiftUI — Mac App Store and notarized direct distribution",
    [
      {
        path: "platforms/macos-swift/positioning.dna.md",
        content: `# macOS Native — Positioning

SwiftUI for Mac when Tauri/Electron are too heavy or deep OS integration is required.

## Notes
- Menu bar apps: LSUIElement in Info.plist
- Sandboxing for Mac App Store — entitlements per capability
- For cross-platform desktop, prefer \`platforms/desktop-cross-platform\` first
`,
      },
      {
        path: "platforms/macos-swift/distribution.dna.md",
        content: `# macOS — Distribution

- Mac App Store: sandbox + review guidelines
- Direct download: Developer ID + notarization + staple
- Universal binary arm64 + x86_64 when supporting Intel Macs
`,
      },
    ],
  ),
  stemPack(
    "platforms/windows-native",
    "Windows Native",
    "platforms",
    "Windows desktop with WinUI 3 / .NET — Store and MSIX distribution",
    [
      {
        path: "platforms/windows-native/positioning.dna.md",
        content: `# Windows Native — Positioning

WinUI 3 + C# for deep Windows integration (tray, notifications, AD).

For cross-platform UI, use Electron/Tauri instead unless Windows-only is explicit.

## When native
- Enterprise AD/Intune deployment
- Hardware drivers or shell extensions (separate from DNA web patterns)
`,
      },
      {
        path: "platforms/windows-native/distribution.dna.md",
        content: `# Windows Native — Distribution

- MSIX for Microsoft Store
- MSI/EXE with Authenticode signing for enterprise
- Auto-update via Store or custom feed with signature verification
`,
      },
    ],
  ),
  stemPack(
    "platforms/wordpress-headless",
    "WordPress Headless",
    "platforms",
    "Headless WordPress with WPGraphQL or REST and a separate frontend",
    [
      {
        path: "platforms/wordpress-headless/positioning.dna.md",
        content: `# WordPress Headless — Positioning

WordPress as content admin only; public site is Next.js, Astro, or React SPA.

## API
- WPGraphQL or \`/wp-json/wp/v2\`
- Auth: application passwords or JWT plugin — rotate credentials
- Preview: draft preview tokens with short TTL

Use \`wordpress-headless\` archetype.
`,
      },
      {
        path: "platforms/wordpress-headless/security.dna.md",
        content: `# WordPress Headless — Security

- Hide \`/wp-admin\` behind VPN or IP allowlist when possible
- Disable XML-RPC if unused
- Separate DB credentials; no WP on public internet without WAF
- Frontend: static generation where possible; revalidate webhooks secured with HMAC
`,
      },
    ],
  ),
  stemPack(
    "disciplines/mobile-development",
    "Mobile Development",
    "disciplines",
    "Cross-cutting mobile discipline — permissions, offline, stores, accessibility",
    [
      {
        path: "disciplines/mobile-development/positioning.dna.md",
        content: `# Mobile Development — Discipline

Applies to React Native, Flutter, and native iOS/Android.

## Checklist per feature
- [ ] Permission rationale strings (iOS) / runtime permissions (Android)
- [ ] Offline and slow-network UX
- [ ] Deep links and universal links tested
- [ ] Accessibility: Dynamic Type / font scaling
- [ ] No secrets in app binary — use remote config for non-secrets only
- [ ] Crash reporting (Sentry etc.) without PII in breadcrumbs
`,
      },
      {
        path: "disciplines/mobile-development/store-compliance.dna.md",
        content: `# Mobile — Store Compliance

## Both stores
- Privacy policy URL required
- Account deletion flow if accounts exist
- Accurate data collection disclosure

## iOS
- ATT if tracking across apps
- In-app purchase rules if selling digital goods

## Android
- Data safety section matches SDK behaviour
- Foreground service types declared correctly
`,
      },
    ],
  ),
];
