import type { KnowledgePack } from "@superhumaan/dna-config";
import { stemPack } from "./bundled-catalog-helpers.js";

export const STEM_FRAMEWORK_PACKS: KnowledgePack[] = [
  stemPack("frameworks/react", "React", "frameworks", "React 18+ UI patterns — components, hooks, state, accessibility", [
    {
      path: "frameworks/react/positioning.dna.md",
      content: `# React — Positioning

Use React 18+ with function components and hooks. Prefer colocated state; lift only when multiple siblings need it.

## Defaults
- TypeScript for new files
- Server state: TanStack Query or framework-native data fetching (Next.js)
- Client state: useState/useReducer; Zustand only when prop drilling hurts
- Forms: controlled inputs + schema validation (Zod)

## File layout
\`components/\` — presentational + container split where useful
\`hooks/\` — reusable hooks
\`pages/\` or \`routes/\` — route-level composition

Pair with \`frameworks/vite\` or \`frameworks/nextjs\` — do not mix SPA Vite with Next in one app.
`,
    },
    {
      path: "frameworks/react/testing.dna.md",
      content: `# React — Testing

- Unit: Vitest + React Testing Library — test behaviour, not implementation
- Integration: RTL with MSW for API mocks
- E2E: Playwright for critical flows

Avoid snapshot-only tests. Query by role/label, not test IDs unless necessary.
`,
    },
    {
      path: "frameworks/react/anti-patterns.dna.md",
      content: `# React — Anti-patterns

- Do not store derived state — compute in render or useMemo
- Do not use useEffect for data fetching when a data library exists
- Do not bypass React for DOM manipulation except refs for focus/scroll
- Do not put secrets or API keys in client bundles
`,
    },
  ]),
  stemPack("frameworks/express", "Express", "frameworks", "Express 4/5 API patterns — routing, middleware, validation", [
    {
      path: "frameworks/express/positioning.dna.md",
      content: `# Express — Positioning

Schema-first HTTP APIs with explicit middleware chains.

## Structure
\`routes/\` — route modules mounted on app
\`middleware/\` — auth, rate limit, error handler
\`services/\` — business logic (no req/res in services)

## Security baseline
- Helmet, CORS allowlist, rate limits on auth routes
- Validate body/query with Zod or JSON Schema
- Never log passwords, tokens, or full PII payloads
`,
    },
    {
      path: "frameworks/express/testing.dna.md",
      content: `# Express — Testing

- Supertest against app instance (no listen in tests)
- Mock external services at HTTP boundary
- Auth tests: 401 without token, 403 wrong role, 200 correct role
`,
    },
  ]),
  stemPack("frameworks/vue", "Vue 3", "frameworks", "Vue 3 Composition API with Vite", [
    {
      path: "frameworks/vue/positioning.dna.md",
      content: `# Vue 3 — Positioning

Composition API + \`<script setup>\`. Pinia for shared state. Vue Router for SPA routing.

Pair with Vite (\`vue-vite-api\` archetype). Do not add React or Next in the same frontend.
`,
    },
    {
      path: "frameworks/vue/testing.dna.md",
      content: `# Vue 3 — Testing

Vitest + @vue/test-utils. Test emitted events and rendered output. E2E with Playwright.
`,
    },
  ]),
  stemPack("frameworks/svelte", "Svelte", "frameworks", "Svelte 5 / SvelteKit patterns with Vite", [
    {
      path: "frameworks/svelte/positioning.dna.md",
      content: `# Svelte — Positioning

Prefer SvelteKit for routing and SSR when needed; Vite SPA for simple apps.

Reactive by default — avoid unnecessary stores. Use \`$props()\` and runes in Svelte 5.
`,
    },
    {
      path: "frameworks/svelte/testing.dna.md",
      content: `# Svelte — Testing

Vitest + @testing-library/svelte. E2E with Playwright for navigation flows.
`,
    },
  ]),
  stemPack("frameworks/astro", "Astro", "frameworks", "Astro static and content sites — islands, SEO, marketing", [
    {
      path: "frameworks/astro/positioning.dna.md",
      content: `# Astro — Positioning

Content-first sites: marketing, docs, blogs. Ship zero JS by default; hydrate islands only where needed.

## When to use
- Landing pages, documentation, blogs
- Not for authenticated B2B SaaS dashboards — use Next or React SPA + API

## Integrations
- Content: MDX, Content Collections
- Deploy: Vercel, Netlify, static CDN
- Pair with \`platforms/marketing-website\`
`,
    },
    {
      path: "frameworks/astro/seo.dna.md",
      content: `# Astro — SEO

- Per-page \`title\`, \`description\`, canonical URL
- Open Graph + Twitter cards in layout
- Sitemap + robots.txt
- Structured data (JSON-LD) for org/product where relevant
`,
    },
  ]),
  stemPack("frameworks/ghost", "Ghost CMS", "frameworks", "Ghost themes and headless CMS patterns", [
    {
      path: "frameworks/ghost/positioning.dna.md",
      content: `# Ghost — Positioning

Standalone Ghost install — Handlebars themes, not React/Vite in the same repo.

## Modes
- **Hosted theme** — Ghost(Pro) or self-hosted with custom theme
- **Headless** — Ghost Content API + separate frontend (Next/Astro) — document API URL + key in env

Use \`ghost-cms\` archetype. Excludes React SPA in the Ghost core app.
`,
    },
    {
      path: "frameworks/ghost/theming.dna.md",
      content: `# Ghost — Theming

- \`default.hbs\`, \`post.hbs\`, \`page.hbs\`
- \`{{@custom.*}}\` for theme settings
- Asset pipeline via Gulp or CDN — no Vite in theme unless documented exception
`,
    },
  ]),
  stemPack(
    "frameworks/react-native",
    "React Native / Expo",
    "frameworks",
    "Expo and React Native — architecture decisions, BFF, EAS dynamic builds, iOS/Android ship",
    [
      {
        path: "frameworks/react-native/positioning.dna.md",
        content: `# React Native / Expo — Positioning

Mobile-first UI with **Expo** (CNG / managed) unless native modules require owned \`ios/\` \`android/\` trees.

## Stack
- Expo Router for file-based navigation
- Backend: **BFF** (Express/Fastify) or BaaS (Supabase) — not a Next.js HTML app inside the binary
- Auth: \`expo-secure-store\`, never AsyncStorage for tokens
- Updates: EAS Update for JS; EAS Build when native/permissions change

Pair with \`disciplines/mobile-development\`, \`platforms/mobile-ui\`, and \`mobile-expo\` archetype.
Stems: \`/expo-architect\`, \`/expo-bff\`, \`/expo-dynamic-builds\`.
`,
      },
      {
        path: "frameworks/react-native/architecture-decisions.dna.md",
        content: `# Expo — Architecture decisions

Write an ADR before scaffolding. Stems: \`/expo-architect\`, \`/expo-workflow-decision\`.

## Must decide
1. Expo Go vs **dev client** vs bare/CNG-owned native
2. Expo Router vs React Navigation
3. BFF vs direct BaaS vs public API
4. OTA policy (\`runtimeVersion\`) vs store binary
5. iOS vs Android deltas (permissions, back, stores)

## Never
- Use Expo Go for custom native modules or production-like push
- Collapse iOS and Android into one “mobile” checklist
- Invent a second UI kit when \`platforms/mobile-ui\` exists
`,
      },
      {
        path: "frameworks/react-native/bff.dna.md",
        content: `# Expo — Backend for frontend

Mobile clients should not fan-out to many domain services on a 3G radio.

## BFF does
- Aggregate screen payloads (\`/mobile/v1/...\`)
- Exchange tokens; **never** ship service-role keys in the app
- Cursor pagination, image variants, typed error codes
- Feature flags / kill switches for store-review builds

## BFF does not
- Render HTML/RSC for the phone
- Replace RLS on a BaaS when a BFF is not needed (simple CRUD)

Stem: \`/expo-bff\`. HTTPS only (iOS ATS, Android cleartext off).
`,
      },
      {
        path: "frameworks/react-native/eas-builds.dna.md",
        content: `# Expo — EAS Build

Profiles: **development** (dev client), **preview** (internal), **production** (store).

## Rules
- Pin image / resource class; keep SDK aligned
- iOS bundle ID + Android applicationId per flavor (\`app.config.ts\`)
- Credentials live in EAS / CI secrets — **names only** in docs
- Prefer AAB for Play; IPA via EAS Submit / TestFlight

Stems: \`/expo-eas-build\`, \`/expo-dev-client\`, \`/expo-ci-eas\`.
`,
      },
      {
        path: "frameworks/react-native/dynamic-updates.dna.md",
        content: `# Expo — Dynamic builds (EAS Update)

OTA **JS/assets** when \`runtimeVersion\` matches the installed binary.

## OTA allowed
- JS/TS, most update assets, flags that do not need new entitlements

## Binary required (block OTA-only)
- Native modules, config plugins, permissions, splash/icon native resources, SDK bump

Channels: preview vs production. Document rollback. Stem: \`/expo-dynamic-builds\`.
`,
      },
      {
        path: "frameworks/react-native/ios.dna.md",
        content: `# Expo — iOS

- TestFlight then App Store; EAS Submit
- Usage strings + privacy manifest; ATT **only** if tracking
- Associated domains for Universal Links
- Push: APNs key on EAS; request permission in context
- Keychain via expo-secure-store; swipe-back must work

Stems: \`/expo-ios-ship\`, \`/expo-ios-permissions\`, \`/expo-deep-links\`.
`,
      },
      {
        path: "frameworks/react-native/android.dna.md",
        content: `# Expo — Android

- AAB + Play App Signing; internal/closed/production tracks
- Target API per Play; 13+ notification + photo picker policies
- App Links + assetlinks.json; predictive back
- FCM via expo-notifications; POST_NOTIFICATIONS runtime
- Do not request background location without a store-justified product need

Stems: \`/expo-android-ship\`, \`/expo-android-permissions\`.
`,
      },
      {
        path: "frameworks/react-native/distribution.dna.md",
        content: `# React Native — Distribution

## iOS
- Apple Developer account, App Store Connect
- EAS Build + Submit or Xcode archive
- Privacy nutrition labels, ATT if tracking

## Android
- Play Console, signing keystore (EAS manages)
- Target API level per Play policy

## OTA
- expo-updates for JS bundle OTA — not for native module changes
`,
      },
      {
        path: "frameworks/react-native/testing.dna.md",
        content: `# React Native — Testing

- Jest + @testing-library/react-native
- Detox or Maestro for E2E on device/simulator — pick one
- Test deep links and push notification cold start
- Mock expo-secure-store; never commit real tokens

Stem: \`/expo-testing-mobile\`.
`,
      },
    ],
  ),
  stemPack("frameworks/flutter", "Flutter", "frameworks", "Flutter cross-platform mobile — widgets, state, stores", [
    {
      path: "frameworks/flutter/positioning.dna.md",
      content: `# Flutter — Positioning

Dart + Flutter for iOS and Android from one codebase. Use \`flutter-mobile\` archetype.

## Structure
\`lib/\` — features by folder
\`lib/core/\` — theme, routing, DI
State: Riverpod or Bloc — pick one per project

Backend via REST/GraphQL; use \`dio\` or \`http\` with interceptors for auth.
`,
    },
    {
      path: "frameworks/flutter/distribution.dna.md",
      content: `# Flutter — Distribution

- iOS: Xcode archive, App Store Connect, privacy manifest
- Android: app bundle (.aab), Play signing
- Version in \`pubspec.yaml\` — bump build number per release
`,
    },
  ]),
];
