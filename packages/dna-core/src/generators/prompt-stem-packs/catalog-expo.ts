import type { PromptStemPackDef, StemGuidelines } from "./types.js";

/**
 * React Native / Expo stem packs — iOS + Android, architecture decisions, BFF,
 * EAS dynamic builds (OTA), store ship, and mobile best practices.
 * Baseline quality: checklist + artifacts + failure modes, 2–3 examples.
 */

const EXPO_GROUND: StemGuidelines = {
  must: [
    "Run real `npx dna` commands in shell — never invent CLI output",
    "Load `.DNA/neuralNetwork.json`, matching behaviour, and listed contextLoads before acting",
    "Confirm Expo / React Native surface exists (package.json expo | react-native) — if missing, stop unless the user asked to scaffold",
    "Treat iOS and Android as separate platforms in every decision (permissions, signing, stores, back/gesture nav)",
    "Write named artifacts to the paths this stem specifies (or state why deferred)",
    "Cover failure modes listed in the prompt — do not skip the unhappy path",
    "Cite concrete evidence (app.json/app.config, eas.json, app.json plugins, store listings) for every material claim",
    "Never print signing certs, keystores, EXPO_TOKEN, ASC keys, or Play JSON — names of env vars only",
  ],
  never: [
    "Skip reading this stem's guidelines, expectations, and context",
    "Force-push main/master",
    "Commit or echo secrets from env, credentials JSON, or CLI output",
    "Use Expo Go for production, custom native modules, or config plugins that require a dev client",
    "Ship EAS Update (OTA) when native code, permissions, or runtimeVersion must change — require a new binary",
    "Store tokens in AsyncStorage / plaintext MMKV — use expo-secure-store (or equivalent) for secrets",
    "Point the mobile app at unbounded domain APIs when a BFF is the agreed pattern — do not skip aggregation/auth exchange",
    "Invent App Store / Play Console status, crash-free rates, or build URLs without evidence",
    "Leave work with no artifact path and no explicit deferral reason",
  ],
  should: [
    "Prefer Expo CNG (prebuild) + EAS over long-lived checked-in ios/ android/ unless the repo already owns native trees",
    "Match existing navigation, theme, and list-screen patterns from `platforms/mobile-ui` and sibling screens",
    "Label unverified claims as **assumption**",
    "Hand off to `ship-feature` / agent-loop when implementation is required after a plan/audit",
    "End with next stem + open questions",
  ],
};

const EVIDENCE = `## Evidence bootstrap (run first)

\`\`\`bash
npx dna analyze
npx dna scan
npx dna stack show
\`\`\`

Load \`.DNA/neuralNetwork.json\`, \`.DNA/behaviour/\`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: \`app.json\` / \`app.config.ts\`, \`eas.json\`, \`expo-router\`, \`expo-updates\`, \`ios/\`, \`android/\`. Mark stub Impressions as STUB — do not cite as truth.`;

const FAILURE_COMMON = `## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (\`expo-init\`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |`;

const EXPO_CONTEXT = [
  ".DNA/knowledge/frameworks/react-native/positioning.dna.md",
  ".DNA/knowledge/frameworks/react-native/architecture-decisions.dna.md",
  ".DNA/knowledge/frameworks/react-native/bff.dna.md",
  ".DNA/knowledge/frameworks/react-native/eas-builds.dna.md",
  ".DNA/knowledge/frameworks/react-native/dynamic-updates.dna.md",
  ".DNA/knowledge/frameworks/react-native/ios.dna.md",
  ".DNA/knowledge/frameworks/react-native/android.dna.md",
  ".DNA/knowledge/disciplines/mobile-development/positioning.dna.md",
  ".DNA/knowledge/platforms/mobile-ui/theming.dna.md",
  ".DNA/behaviour/coding.behaviour.md",
];

const EXPO_CLI = ["npx dna analyze", "npx dna scan", "npx dna stack show", "npx dna quality report --feature"];

function prompt(title: string, body: string): string {
  return `# ${title}

Scope: $ARGUMENTS

${EVIDENCE}

${body}

${FAILURE_COMMON}`;
}

export const EXPO_STEM_IDS = [
  "expo-architect",
  "expo-workflow-decision",
  "expo-bff",
  "expo-init",
  "expo-router-navigation",
  "expo-dynamic-builds",
  "expo-eas-build",
  "expo-dev-client",
  "expo-app-config",
  "expo-ios-ship",
  "expo-ios-permissions",
  "expo-android-ship",
  "expo-android-permissions",
  "expo-auth-secure",
  "expo-offline-sync",
  "expo-perf-mobile",
  "expo-a11y-mobile",
  "expo-testing-mobile",
  "expo-notifications",
  "expo-deep-links",
  "expo-store-submit",
  "expo-ci-eas",
  "expo-native-modules",
] as const;

export const EXPO_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "expo-architect",
    name: "Expo architect",
    category: "analysis",
    slash: "expo-architect",
    summary:
      "Architecture decision record for Expo iOS/Android — workflow, Router, BFF, state, auth storage, and what must stay native.",
    tags: ["expo", "react-native", "mobile", "architecture", "decision"],
    copyVariants: [
      "Architect this Expo app for iOS and Android",
      "Decide Expo vs bare, BFF, and navigation before we code",
      "Write an ADR for our React Native architecture",
    ],
    prompt: prompt(
      "Expo architect",
      `Produce a **decision record**, not code. Stop after the ADR unless the user already approved implementation.

## Decision questions (must answer)

1. **Surface** — Expo managed / CNG prebuild / checked-in native trees / RN CLI. Why.
2. **Runtime** — Expo Go vs **dev client** vs production binary. Why (native modules, config plugins).
3. **Navigation** — Expo Router (file-based) vs React Navigation only. Deep links / universal links.
4. **BFF** — mobile Backend-for-Frontend vs direct BaaS vs existing public API. Payload shaping, auth exchange, versioning.
5. **State** — server state (Query) vs client (Zustand/context). Offline queue yes/no.
6. **Auth secrets** — expo-secure-store + biometric gate; never AsyncStorage for tokens.
7. **UI** — existing \`platforms/mobile-ui\` theme; do not invent a second design system.
8. **Updates** — EAS Update channels vs store binary. \`runtimeVersion\` policy.
9. **iOS vs Android deltas** — permissions, back button, predictive back, adaptive icons, ATT.

## Checklist

- [ ] Repo evidence: expo SDK version, router, eas.json, plugins
- [ ] ADR: options considered + chosen + rejected (with why)
- [ ] BFF boundary sketched (client → BFF → domain services)
- [ ] Native-vs-JS split: what can OTA vs what needs EAS Build
- [ ] iOS + Android constraints listed separately
- [ ] Out of scope explicit
- [ ] Approval gate before scaffold/code

## Artifacts

| Artifact | Path |
|----------|------|
| ADR | \`.DNA/plans/expo-architecture.md\` |
| Decision echo | \`.DNA/CellularMemory/prefrontalCortex/decisions.md\` (append) |
| Feature request | \`ai/feature-request.md\` if this becomes a build |

## Failure modes

| Mode | Response |
|------|----------|
| Web React only, no mobile | Stop; recommend-stack if they want mobile |
| Conflicting plugins / SDK | Record blockers; do not guess compatibility |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "ADR with chosen options and rejected alternatives",
      "BFF / no-BFF decision with blast radius",
      "OTA vs native rebuild policy",
      "iOS and Android deltas called out",
      "Artifact path written",
      "Explicit stop for approval before code",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Architect our new Expo consumer app — we have an existing Fastify API",
        goodResponse:
          "ADR: Expo SDK + Router + CNG. Dev client (not Go) because we need secure-store + notifications. BFF in front of Fastify for aggregation and token exchange. OTA for JS; native rebuild for plugins. Wrote expo-architecture.md. Approve before init?",
      },
      {
        userSays: "We already use Expo Router and Supabase directly",
        goodResponse:
          "Recorded as-is: no new BFF unless product needs aggregation/offline. Flag: tokens must not live in AsyncStorage; RLS is not a substitute for secure storage. ADR updated with ‘keep direct Supabase’ + risks.",
      },
      {
        userSays: "Should we use Flutter instead?",
        goodResponse:
          "In-scope: Expo vs Flutter decision. Compared hiring, Expo OTA, store cadence. Recommendation: Expo if the team is React; Flutter only if you already have Dart. ADR lists the fork. No scaffold until you pick.",
      },
    ],
    workflow: ["expo-workflow-decision", "expo-bff", "expo-init", "ship-feature"],
  },
  {
    id: "expo-workflow-decision",
    name: "Expo workflow decision",
    category: "analysis",
    slash: "expo-workflow-decision",
    summary:
      "Choose Expo Go vs development build vs CNG prebuild vs bare — and when a native rebuild is mandatory.",
    tags: ["expo", "react-native", "mobile", "decision", "dev-client"],
    copyVariants: [
      "Should we use Expo Go or a dev client?",
      "Do we need prebuild / bare workflow?",
      "When must we leave Expo Go?",
    ],
    prompt: prompt(
      "Expo workflow decision",
      `Decide the **developer and release workflow**. Do not mix Expo Go constraints with production native capabilities.

## Decision tree

- **Expo Go** — JS-only, Expo SDK modules already in Go. Never for custom native code, custom fonts via native, or non-Go config plugins.
- **Development build (dev client)** — default for real apps. \`eas build --profile development\`. Supports config plugins + local native.
- **CNG / prebuild** — \`npx expo prebuild\` generates ios/android when needed; prefer **not** committing them unless you must.
- **Bare / checked-in native** — only if you already own native trees or need native code Expo cannot generate.

## Checklist

- [ ] Inventory: expo plugins, native modules, permissions, push, IAP, bluetooth, etc.
- [ ] Go-compatible? If any plugin requires native — **dev client**
- [ ] eas.json profiles: development / preview / production exist or planned
- [ ] CI: who builds what (local vs EAS)
- [ ] Upgrade path documented (SDK bump + prebuild)
- [ ] ADR snippet written

## Artifacts

| Artifact | Path |
|----------|------|
| Workflow decision | \`.DNA/plans/expo-workflow.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Team already on Go + needs notifications | Switch to dev client; do not patch Go |
| ios/ and android/ already committed | Document ownership; do not delete without approval |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Clear Go vs dev client vs bare recommendation",
      "Plugin/native inventory",
      "eas.json profile plan",
      "Artifact written",
      "Next stem named",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "We're on Expo Go but need bluetooth",
        goodResponse:
          "Go cannot ship custom native BLE. Decision: expo-dev-client + EAS development profile. OTA still OK after first binary. Wrote expo-workflow.md.",
      },
      {
        userSays: "Keep managed workflow, never check in native folders",
        goodResponse:
          "CNG: prebuild on EAS only. Local: npx expo run:ios against a dev client. Documented as policy in expo-workflow.md.",
      },
      {
        userSays: "We have a forked react-native-maps",
        goodResponse:
          "Bare/CNG with a config plugin or autolinking. Dev client required. Flag: OTA cannot update the native maps fork — binary bump on each native change.",
      },
    ],
    workflow: ["expo-dev-client", "expo-eas-build", "expo-dynamic-builds"],
  },
  {
    id: "expo-bff",
    name: "Expo backend for frontend",
    category: "features",
    slash: "expo-bff",
    summary:
      "Plan a mobile Backend-for-Frontend — aggregation, auth token exchange, payload shaping, versioning, and offline-friendly APIs.",
    tags: ["expo", "react-native", "mobile", "bff", "backend", "architecture"],
    copyVariants: [
      "Design a BFF for our Expo app",
      "Don't let the phone talk to six microservices",
      "Plan backend-for-frontend for iOS and Android",
    ],
    prompt: prompt(
      "Expo backend for frontend",
      `Plan a **BFF** for the Expo client. Mobile is not a browser: high latency, spotty networks, certificate pinning later, and OS background limits.

## Why a BFF (must justify)

- Aggregate 2+ domain services into one screen payload
- Hide service-to-service tokens; issue **short-lived** client tokens
- Shape DTOs for lists (cursor pagination, image variants) — not raw domain graphs
- Version \`/mobile/v1\` independently of web
- Centralize feature flags and kill-switches for store-review builds

## Checklist

- [ ] Client today: direct APIs / Supabase / GraphQL? Evidence from repo
- [ ] BFF host: existing Express/Fastify vs new \`apps/mobile-bff\`
- [ ] Auth: how refresh works; where refresh token lives on device (secure-store)
- [ ] Endpoints per primary screens (list/detail) — not 1:1 with microservices
- [ ] Error contract: typed codes, retryable vs fatal, offline queue hints
- [ ] Pagination: cursor, not offset, for infinite lists
- [ ] PII: minimize fields; no PHI/secrets in logs
- [ ] iOS ATS / Android cleartext: HTTPS only
- [ ] Tests: contract tests for mobile DTOs
- [ ] Plan only — wait for approval before code

## Artifacts

| Artifact | Path |
|----------|------|
| BFF plan | \`.DNA/plans/expo-bff.md\` |
| API sketch | include OpenAPI/paths in the plan |

## Failure modes

| Mode | Response |
|------|----------|
| Single BaaS already fits | Recommend **no BFF**; document why; still secure tokens |
| BFF would duplicate an existing GraphQL gateway | Reuse gateway; add mobile schema slice, do not fork |`,
    ),
    guidelines: {
      ...EXPO_GROUND,
      must: [
        ...EXPO_GROUND.must,
        "Stop after the BFF plan — wait for explicit user approval before scaffolding routes",
        "Never put service-role or partner API keys in the Expo binary",
      ],
    },
    expectations: [
      "BFF vs no-BFF recommendation with reasons",
      "Screen → endpoint map",
      "Auth/token flow",
      "Error and pagination contracts",
      "Security notes (no secrets in the app)",
      "Plan artifact path",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "The home screen hits 4 services and times out on 3G",
        goodResponse:
          "BFF GET /mobile/v1/home aggregates those 4. Cursor pagination + image widths for device pixel ratio. Tokens exchanged server-side. Plan in expo-bff.md. Approve then ship-feature?",
      },
      {
        userSays: "We only use Supabase",
        goodResponse:
          "No BFF required for v1. Still: Edge functions for privileged writes; never service role in the app. Documented ‘BFF later if we add payments + search’.",
      },
      {
        userSays: "Add a BFF in Next.js API routes",
        goodResponse:
          "Allowed if the repo already is Next. Warn: mobile BFF should not couple to HTML RSC. Prefer a dedicated Fastify/Express BFF or Route Handlers that return mobile DTOs only. Plan lists the split.",
      },
    ],
    workflow: ["expo-architect", "plan-feature", "ship-feature"],
  },
  {
    id: "expo-init",
    name: "Expo init",
    category: "features",
    slash: "expo-init",
    summary: "Scaffold or repair an Expo app — TypeScript, Expo Router, EAS, theme, and DNA mobile UI patterns.",
    tags: ["expo", "react-native", "mobile", "scaffold", "init"],
    copyVariants: [
      "Scaffold an Expo app with Router",
      "Init React Native Expo TypeScript",
      "Create the iOS and Android Expo project",
    ],
    prompt: prompt(
      "Expo init",
      `Scaffold or repair Expo **only after** architect/workflow decisions exist (or capture them now in a short ADR).

## Defaults (unless the repo already chose otherwise)

- \`npx create-expo-app\` (latest SDK) + TypeScript
- Expo Router file-based routes
- \`expo-secure-store\`, \`expo-system-ui\`, safe-area
- Theme from \`platforms/mobile-ui\` (Paper/MD3 or the repo's existing system — do not add a second)
- \`eas.json\` with development / preview / production
- No checked-in \`ios/\` \`android/\` unless workflow decision says so

## Checklist

- [ ] ADR or expo-architect notes loaded
- [ ] App name, slug, scheme, bundle IDs (iOS) + applicationId (Android) planned — do not invent brands
- [ ] TS paths, lint, tests (Jest + RNTL or project's runner)
- [ ] \`.env\` example with public keys only (\`EXPO_PUBLIC_*\`)
- [ ] Gitignore: native build artifacts, credentials
- [ ] DNA: load mobile knowledge; do not copy web CSS layout 1:1
- [ ] Approval before running create-expo-app if the folder is not empty

## Artifacts

| Artifact | Path |
|----------|------|
| Init notes | \`.DNA/plans/expo-init.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Repo already has Expo | Repair/align; do not create a second app |
| User wanted Flutter | Stop; do not init Expo |`,
    ),
    guidelines: {
      ...EXPO_GROUND,
      must: [...EXPO_GROUND.must, "Wait for approval if scaffolding a new app into a non-empty repo"],
    },
    expectations: [
      "Scaffold vs repair decided",
      "Router + TypeScript present or planned",
      "eas.json profiles listed",
      "No secrets in repo",
      "Init notes artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Create an Expo app in apps/mobile",
        goodResponse:
          "Plan: create-expo-app in apps/mobile, Router, Paper theme matching DNA mobile-ui. eas.json three profiles. Bundle IDs TBD — need your Apple/Play ids. Approve?",
      },
      {
        userSays: "Fix our half-finished Expo folder",
        goodResponse:
          "Repair path: add Router entry, eas.json, secure-store. Did not wipe existing screens. Notes in expo-init.md.",
      },
      {
        userSays: "Init with native ios/ android checked in",
        goodResponse:
          "Matches bare/CNG-owned trees. Documented prebuild freeze. Still added eas.json. Warned: OTA policy in expo-dynamic-builds next.",
      },
    ],
    workflow: ["expo-architect", "expo-router-navigation", "expo-eas-build"],
  },
  {
    id: "expo-router-navigation",
    name: "Expo Router navigation",
    category: "features",
    slash: "expo-router-navigation",
    summary: "File-based Expo Router — groups, auth gates, tabs, stacks, deep links, and iOS/Android back behaviour.",
    tags: ["expo", "react-native", "mobile", "navigation", "router"],
    copyVariants: [
      "Set up Expo Router with auth groups",
      "Fix our mobile navigation and deep links",
      "Plan tabs vs stacks for iOS and Android",
    ],
    prompt: prompt(
      "Expo Router navigation",
      `Design or repair **Expo Router**. Match existing screens — do not invent a new IA.

## Rules

- File-based routes under \`app/\` (or the project's Router root)
- Groups: \`(auth)\`, \`(app)\` — unauthenticated users never see app chrome
- Tabs: only for top-level IA that already exists in product
- Android hardware/predictive back must pop the stack; do not hijack BackHandler unless required
- Deep links: \`scheme\` + associated domains / App Links (hand off \`expo-deep-links\`)
- Loading/error: \`loading.tsx\` / error boundaries per segment

## Checklist

- [ ] Current route tree mapped from files
- [ ] Auth gate: redirect vs replace (no flash of protected UI)
- [ ] iOS swipe-back vs Android back tested in plan
- [ ] Shared layouts vs duplicated headers
- [ ] Params typed; no secrets in URLs
- [ ] Tests for auth redirect

## Artifacts

| Artifact | Path |
|----------|------|
| Route map | \`.DNA/plans/expo-router.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| React Navigation without Router | Do not migrate unless asked; document dual stacks as a risk |
| Protected routes visible before auth | Block; treat as P1 |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Route tree documented",
      "Auth gating described",
      "iOS vs Android back behaviour",
      "Deep link handoff noted",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Add a logged-in tab bar",
        goodResponse:
          "Plan: app/(app)/_layout tabs wrapping existing screens only. Auth group stays outside. Android back from tab root exits or goes to first tab per current product — asked which. Wrote expo-router.md.",
      },
      {
        userSays: "Users see the dashboard for 200ms then login",
        goodResponse:
          "P1: splash/auth gate before rendering (app) group. Use splash + secure-store hydrate. No dashboard import in the unauthenticated layout.",
      },
      {
        userSays: "We use React Navigation 6 still",
        goodResponse:
          "No forced Router migration. Documented stay-on-RN-nav. Deep links still need a single linking config. Next: expo-deep-links.",
      },
    ],
    workflow: ["expo-deep-links", "expo-auth-secure", "ship-feature"],
  },
  {
    id: "expo-dynamic-builds",
    name: "Expo dynamic builds",
    category: "delivery",
    slash: "expo-dynamic-builds",
    summary:
      "EAS Update / OTA dynamic builds — channels, runtimeVersion, what may ship over the air vs what needs a new iOS/Android binary.",
    tags: ["expo", "react-native", "mobile", "eas", "ota", "dynamic-builds", "updates"],
    copyVariants: [
      "Set up EAS Update dynamic builds",
      "OTA JS updates for iOS and Android",
      "When do we need a new binary vs an Expo update?",
    ],
    prompt: prompt(
      "Expo dynamic builds",
      `Configure **dynamic JS updates** (EAS Update / \`expo-updates\`). This is **not** a substitute for EAS Build when native changes.

## What MAY go over the air

- JS/TS, Metro bundle, most assets declared as update assets
- Feature flags that do not require new native entitlements

## What MUST be a new binary (block OTA-only)

- Native modules, config plugins, permissions, ATS exceptions
- Splash/icon/name that require native resources
- \`runtimeVersion\` / SDK bump
- Privacy manifests / Gradle target SDK that stores reject

## Checklist

- [ ] \`expo-updates\` + \`eas.json\` submit/update config present or planned
- [ ] \`runtimeVersion\` policy: \`appVersion\` vs fingerprint vs nativeVersion
- [ ] Channels: production / preview / staging mapped to EAS profiles
- [ ] Rollout: percentage, rollback command documented
- [ ] iOS + Android both receive the same channel policy (call out exceptions)
- [ ] Native compatibility check in CI (fingerprint)
- [ ] Never force users onto a broken update — fatal fallback
- [ ] Secrets: update URL/channel in config, tokens in EAS secrets

## Artifacts

| Artifact | Path |
|----------|------|
| Update policy | \`.DNA/plans/expo-dynamic-builds.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Native diff since last binary | Block OTA; run expo-eas-build |
| Missing runtimeVersion | Do not enable updates in production |`,
    ),
    guidelines: {
      ...EXPO_GROUND,
      must: [
        ...EXPO_GROUND.must,
        "Explicitly classify the change as OTA-safe vs binary-required before recommending eas update",
        "Document rollback: how to publish the previous update or disable updates",
      ],
    },
    expectations: [
      "OTA-safe vs binary-required classification",
      "runtimeVersion + channel map",
      "Rollback steps",
      "iOS and Android both covered",
      "Policy artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Push a hotfix to production without the stores",
        goodResponse:
          "If JS-only and runtimeVersion matches production binaries: EAS Update to production channel + monitor. If you added a permission — blocked. Policy in expo-dynamic-builds.md.",
      },
      {
        userSays: "Enable updates on a brand-new app",
        goodResponse:
          "Plan: fingerprint runtimeVersion, channels preview+production, disable updates until first store binary exists. Then OTA is allowed.",
      },
      {
        userSays: "Android got the update, iOS didn't",
        goodResponse:
          "Debug: channel, runtimeVersion, and binary age per platform. Do not ‘fix’ by shipping a different JS bundle per OS unless native diverged. Documented investigation steps.",
      },
    ],
    workflow: ["expo-eas-build", "expo-ci-eas", "write-release-notes"],
  },
  {
    id: "expo-eas-build",
    name: "Expo EAS Build",
    category: "delivery",
    slash: "expo-eas-build",
    summary: "EAS Build profiles for development, preview, and production iOS/Android binaries — credentials named, never printed.",
    tags: ["expo", "react-native", "mobile", "eas", "build", "ios", "android"],
    copyVariants: [
      "Configure EAS Build for iOS and Android",
      "Make development, preview, and production profiles",
      "Run EAS builds for TestFlight and Play internal",
    ],
    prompt: prompt(
      "Expo EAS Build",
      `Plan or run **EAS Build**. Profiles: **development** (dev client), **preview** (internal distribution), **production** (store).

## Checklist

- [ ] \`eas.json\` profiles: development / preview / production
- [ ] Resource class / image pinned; SDK aligned
- [ ] iOS: bundle identifier, entitlements, provisioning via EAS credentials (names only)
- [ ] Android: applicationId, Play App Signing, keystore on EAS
- [ ] Env: \`EXPO_PUBLIC_*\` vs secret EAS env
- [ ] Native directories: CNG vs committed
- [ ] Build numbers / versionCode auto-increment strategy
- [ ] Artifact: who downloads .ipa / .aab
- [ ] Never log credentials

## Artifacts

| Artifact | Path |
|----------|------|
| Build matrix | \`.DNA/plans/expo-eas-build.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Missing Apple/Play account | List required roles; do not fake a build URL |
| Build failed on EAS | Quote error class (signing, Gradle, CocoaPods) + next probe |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Profile matrix iOS × Android",
      "Credential names (not values)",
      "Versioning strategy",
      "Build matrix artifact",
      "Next: submit or updates",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "We need TestFlight and Play internal testing",
        goodResponse:
          "preview profile: iOS ad-hoc/TestFlight, Android internal track AAB. production reserved for store. Matrix in expo-eas-build.md. EXPO_TOKEN stays in CI secrets.",
      },
      {
        userSays: "Local release builds only",
        goodResponse:
          "Documented: eas build --local as optional; still need signing. Not the default. Production store path remains EAS.",
      },
      {
        userSays: "iOS build fails code signing",
        goodResponse:
          "Did not print certs. Next: eas credentials (names), match bundle ID, regenerate profile. Matrix marked iOS=blocked.",
      },
    ],
    workflow: ["expo-dev-client", "expo-store-submit", "expo-dynamic-builds"],
  },
  {
    id: "expo-dev-client",
    name: "Expo dev client",
    category: "delivery",
    slash: "expo-dev-client",
    summary: "Custom development builds — expo-dev-client, internal distribution, and why Expo Go is not enough.",
    tags: ["expo", "react-native", "mobile", "dev-client", "eas"],
    copyVariants: [
      "Create an Expo development build",
      "Install expo-dev-client for the team",
      "Replace Expo Go with a custom dev client",
    ],
    prompt: prompt(
      "Expo dev client",
      `Install and distribute a **custom development client** so native modules and config plugins work on device.

## Checklist

- [ ] \`expo-dev-client\` dependency
- [ ] eas.json development profile (\`developmentClient: true\`)
- [ ] iOS: register devices / internal dist; Android: install APK/AAB
- [ ] Launch: \`npx expo start --dev-client\`
- [ ] Team onboarding: how to install the binary once, then OTA JS
- [ ] Do not tell the team to use Expo Go if plugins require native

## Artifacts

| Artifact | Path |
|----------|------|
| Dev client notes | \`.DNA/plans/expo-dev-client.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Simulator-only team | Still produce Android path; do not drop Android |
| Go QR habits | Retrain: scan/open the **dev client**, not Go |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Dev client vs Go decision executed",
      "Install path for iOS and Android",
      "Start command documented",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Bluetooth plugin, still using Expo Go",
        goodResponse:
          "Blocked Go. Added expo-dev-client + development EAS profile. Team installs once. JS reloads after that. Notes in expo-dev-client.md.",
      },
      {
        userSays: "Can designers stay on Go?",
        goodResponse:
          "Only if they never hit native-only screens. Otherwise same dev client. Do not maintain two incompatible runtimes.",
      },
      {
        userSays: "Dev client build succeeded but Metro won't connect",
        goodResponse:
          "Check same LAN / tunnel, app scheme, and that they opened the **project** in the client. No secrets. Documented probes.",
      },
    ],
    workflow: ["expo-eas-build", "expo-workflow-decision"],
  },
  {
    id: "expo-app-config",
    name: "Expo app config",
    category: "features",
    slash: "expo-app-config",
    summary:
      "Dynamic app.config.ts — per-flavor names, bundle IDs, plugins, and env. No secrets in the config that ships to the client.",
    tags: ["expo", "react-native", "mobile", "app-config", "dynamic-builds"],
    copyVariants: [
      "Set up dynamic Expo app.config",
      "Different bundle IDs for preview vs production",
      "Configure Expo plugins in app.config.ts",
    ],
    prompt: prompt(
      "Expo app config",
      `Design **dynamic** \`app.config.ts\` (or \`app.config.js\`) for flavors: development / preview / production.

## Rules

- \`EXPO_PUBLIC_*\` only in the client bundle
- Bundle ID / applicationId suffixes for preview (\`.preview\`) so TestFlight and prod can coexist
- Plugins listed explicitly; order matters
- Icons/splash per flavor if product requires — do not invent marketing slogans
- \`updates.url\` / runtimeVersion aligned with expo-dynamic-builds

## Checklist

- [ ] Static app.json vs dynamic config — pick one source of truth
- [ ] Scheme, associated domains placeholders
- [ ] iOS infoPlist + Android permissions mirrored in config plugins
- [ ] New Architecture / edge-to-edge flags documented
- [ ] No API secrets in extra that get baked into the binary

## Artifacts

| Artifact | Path |
|----------|------|
| Config map | \`.DNA/plans/expo-app-config.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Secret in extra | Remove; rotate if already shipped |
| Duplicate app.json + app.config | Consolidate |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Flavor map (name, ids, scheme)",
      "Plugin list",
      "Public vs secret env split",
      "Config artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Preview and prod both called the same on my phone",
        goodResponse:
          "Suffix applicationId/bundleIdentifier + display name for preview. Dynamic app.config. Plan in expo-app-config.md.",
      },
      {
        userSays: "Put STRIPE_SECRET in extra for convenience",
        goodResponse:
          "Never. Client extra is public. BFF holds Stripe secret. Flag as P1 if already committed — rotate.",
      },
      {
        userSays: "We only have app.json",
        goodResponse:
          "OK until flavors exist. When preview ids diverge, migrate to app.config.ts. Documented trigger.",
      },
    ],
    workflow: ["expo-eas-build", "expo-dynamic-builds", "expo-ios-permissions"],
  },
  {
    id: "expo-ios-ship",
    name: "Expo iOS ship",
    category: "delivery",
    slash: "expo-ios-ship",
    summary: "Ship Expo to TestFlight and App Store — signing, privacy nutrition, review notes, and iOS-only gates.",
    tags: ["expo", "react-native", "mobile", "ios", "app-store", "testflight"],
    copyVariants: [
      "Ship the Expo app to TestFlight",
      "Prepare App Store submission for our React Native app",
      "iOS release checklist for Expo",
    ],
    prompt: prompt(
      "Expo iOS ship",
      `Ship **iOS only** (use expo-android-ship for Play). EAS Submit or Transporter.

## Checklist

- [ ] Version + build number vs App Store Connect
- [ ] Signing via EAS credentials (names only)
- [ ] Privacy nutrition labels + privacy manifest (PrivacyInfo.xcprivacy)
- [ ] ATT only if tracking; usage strings present
- [ ] Encryption / export compliance answered truthfully
- [ ] Review notes: demo login, no production PII in screenshots
- [ ] TestFlight groups
- [ ] Universal links associated domains
- [ ] Push: APNs key on EAS
- [ ] Hand off release notes

## Artifacts

| Artifact | Path |
|----------|------|
| iOS ship matrix | \`.DNA/plans/expo-ios-ship.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Missing usage string | Block submit; add Info.plist / plugin |
| Review rejection | Record reason; do not guess a resubmit without a fix |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "TestFlight vs App Store path",
      "Privacy/ATT status",
      "Signing status without secrets",
      "iOS ship artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Get a build on TestFlight today",
        goodResponse:
          "EAS production/preview iOS → Submit TestFlight. Listed missing privacy items. Did not print ASC API key. Matrix in expo-ios-ship.md.",
      },
      {
        userSays: "Apple rejected for tracking without ATT",
        goodResponse:
          "If you use IDFA/analytics that require ATT: add ATT prompt + nutrition. If not tracking: remove the SDK. Plan only — no fake 'we don't track' if PostHog session replay is on.",
      },
      {
        userSays: "Also ship Android in this stem",
        goodResponse:
          "iOS stem stays iOS. Android → /expo-android-ship. Shared version bump noted in both matrices.",
      },
    ],
    workflow: ["expo-ios-permissions", "expo-store-submit", "write-release-notes"],
  },
  {
    id: "expo-ios-permissions",
    name: "Expo iOS permissions",
    category: "features",
    slash: "expo-ios-permissions",
    summary: "iOS permission usage strings, privacy manifest, ATT, and config plugins — rationale before request.",
    tags: ["expo", "react-native", "mobile", "ios", "permissions", "privacy"],
    copyVariants: [
      "Add iOS camera and photos permission strings",
      "Fix App Store privacy manifest for Expo",
      "Do we need App Tracking Transparency?",
    ],
    prompt: prompt(
      "Expo iOS permissions",
      `Audit **iOS** permissions. Every key needs a **user-facing rationale** that matches real UX. Do not request camera “just in case”.

## Checklist

- [ ] Inventory plugins: camera, photos, location, mic, contacts, bluetooth, tracking
- [ ] NS*UsageDescription strings in config plugin / Info.plist
- [ ] Privacy manifest third-party SDKs
- [ ] ATT: only if tracking; otherwise omit
- [ ] Request **in context** (after tap), not on first launch
- [ ] Denied UX: settings deep link, no crash loop
- [ ] Android counterpart listed but not implemented here (expo-android-permissions)

## Artifacts

| Artifact | Path |
|----------|------|
| iOS permission matrix | \`.DNA/plans/expo-ios-permissions.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Generic “we need this” copy | Rewrite to product-specific rationale |
| Permission unused | Remove plugin — stores reject unused sensitive access |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Permission × usage-string × when-requested matrix",
      "ATT yes/no with reason",
      "Denied-state UX",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Add photo upload",
        goodResponse:
          "NSPhotoLibraryUsageDescription tied to ‘attach a photo to your report’. Request on attach tap. Limited Photos iOS 14+. Matrix written. Android counterpart flagged.",
      },
      {
        userSays: "Request all permissions on launch",
        goodResponse:
          "Rejected. iOS HIG + review risk. In-context only. Plan shows per-feature prompts.",
      },
      {
        userSays: "Firebase Analytics — ATT?",
        goodResponse:
          "Depends on IDFA/use of data. If analytics is first-party only, maybe no ATT. If you use advertising identifier — ATT + nutrition. Assumption labelled; counsel if ads.",
      },
    ],
    workflow: ["expo-android-permissions", "expo-ios-ship"],
  },
  {
    id: "expo-android-ship",
    name: "Expo Android ship",
    category: "delivery",
    slash: "expo-android-ship",
    summary: "Ship Expo to Play Console — AAB, Play App Signing, tracks, target SDK, and Android-only policy.",
    tags: ["expo", "react-native", "mobile", "android", "play-store"],
    copyVariants: [
      "Ship the Expo app to Play internal testing",
      "Play Console checklist for React Native",
      "Android AAB and target SDK for Expo",
    ],
    prompt: prompt(
      "Expo Android ship",
      `Ship **Android only**. Prefer **AAB** to Play. EAS Submit.

## Checklist

- [ ] applicationId + versionCode
- [ ] Play App Signing (EAS keystore names only)
- [ ] Tracks: internal / closed / production
- [ ] Target API level per current Play policy
- [ ] Data safety form matches SDKs
- [ ] 16 KB page size / 64-bit as required by current Play rules
- [ ] Predictive back / edge-to-edge if targeting new SDKs
- [ ] Proguard/R8 mapping for crash symbolication
- [ ] Review: demo account, screenshots without PII

## Artifacts

| Artifact | Path |
|----------|------|
| Android ship matrix | \`.DNA/plans/expo-android-ship.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| APK uploaded when AAB required | Stop; produce AAB |
| Target SDK too old | Block production track; bump via Expo SDK / gradle |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Track + AAB plan",
      "Target SDK called out",
      "Data safety notes",
      "Android ship artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Internal testers on Play",
        goodResponse:
          "EAS Android preview → AAB → internal track. versionCode bump. Keystore stays on EAS. Matrix in expo-android-ship.md.",
      },
      {
        userSays: "Play rejected target API",
        goodResponse:
          "Bump Expo SDK / android target in app config. Native rebuild required — not OTA. Then resubmit.",
      },
      {
        userSays: "Use APK sideload for leadership",
        goodResponse:
          "OK for preview profile / internal dist. Not a substitute for Play production. Documented as non-store.",
      },
    ],
    workflow: ["expo-android-permissions", "expo-store-submit", "write-release-notes"],
  },
  {
    id: "expo-android-permissions",
    name: "Expo Android permissions",
    category: "features",
    slash: "expo-android-permissions",
    summary: "Android runtime permissions, 13+ notifications/photos, Play policy, and in-context requests.",
    tags: ["expo", "react-native", "mobile", "android", "permissions"],
    copyVariants: [
      "Add Android 13 notification permission",
      "Fix Play photo permission for Expo",
      "Runtime permissions checklist for Android",
    ],
    prompt: prompt(
      "Expo Android permissions",
      `Audit **Android** permissions. Runtime request in context. Match Play Photo/Video/Notifications policies (13+).

## Checklist

- [ ] Manifest permissions vs actually used
- [ ] Notifications: POST_NOTIFICATIONS on 13+
- [ ] Photos: partial access / photo picker vs READ_MEDIA_*
- [ ] Location: foreground vs background (background is a store minefield)
- [ ] Exact alarms / foreground services — justify
- [ ] Denied UX + settings intent
- [ ] iOS twin listed (expo-ios-permissions) — do not copy iOS strings blindly

## Artifacts

| Artifact | Path |
|----------|------|
| Android permission matrix | \`.DNA/plans/expo-android-permissions.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Background location without product need | Remove; Play will reject |
| Permissions in manifest unused | Strip plugins |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Permission × API-level × when-requested matrix",
      "Play policy notes",
      "Denied UX",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Push notifications on Android 14",
        goodResponse:
          "POST_NOTIFICATIONS runtime on first meaningful event, not app start. FCM via expo-notifications. Matrix written.",
      },
      {
        userSays: "We need location always on",
        goodResponse:
          "Challenge: background location needs a strong Play justification. Recommend foreground-only unless the product is tracking-as-a-feature. Block ‘always’ by default.",
      },
      {
        userSays: "Reuse the iOS camera copy",
        goodResponse:
          "Rationale can match product, but Android uses runtime dialogs + possibly photo picker. Separate strings in the Android matrix.",
      },
    ],
    workflow: ["expo-ios-permissions", "expo-android-ship", "expo-notifications"],
  },
  {
    id: "expo-auth-secure",
    name: "Expo auth secure storage",
    category: "features",
    slash: "expo-auth-secure",
    summary: "Mobile auth — secure token storage, biometric lock, refresh, and logout on both iOS and Android.",
    tags: ["expo", "react-native", "mobile", "auth", "security"],
    copyVariants: [
      "Store JWT in expo-secure-store",
      "Add biometric unlock to the Expo app",
      "Fix tokens in AsyncStorage",
    ],
    prompt: prompt(
      "Expo auth secure storage",
      `Harden **auth on device**. Tokens are secrets.

## Rules

- Access/refresh tokens: \`expo-secure-store\` (or Keychain/Keystore wrappers). **Never AsyncStorage**
- Prefer BFF cookie+refresh or short-lived access tokens
- Biometric: optional gate to unlock the session, not a replacement for server auth
- Logout: delete secure items + query cache
- Certificate pinning: only if the org already has a pinning programme — do not invent pins

## Checklist

- [ ] Find current token storage (grep AsyncStorage, MMKV, secure-store)
- [ ] Refresh race: single-flight
- [ ] 401 → logout vs retry
- [ ] iOS Keychain accessibility when device locked
- [ ] Android: avoid backup of secrets
- [ ] Tests: mock secure-store; never real tokens in fixtures

## Artifacts

| Artifact | Path |
|----------|------|
| Auth storage plan | \`.DNA/plans/expo-auth.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Tokens in AsyncStorage | P1 migrate; treat as leaked if this shipped |
| Service role in extra | P0 rotate |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Current storage identified",
      "Target secure-store design",
      "Refresh/logout behaviour",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "We put the JWT in AsyncStorage",
        goodResponse:
          "P1. Migrate to expo-secure-store, clear old keys, rotate refresh tokens if this reached production. Plan in expo-auth.md.",
      },
      {
        userSays: "Face ID to open the app",
        goodResponse:
          "Optional local gate after secure-store hydrate. Server session still required. Fallback passcode. iOS + Android biometry APIs via expo-local-authentication.",
      },
      {
        userSays: "Keep tokens in memory only",
        goodResponse:
          "OK for access token; refresh still needs secure storage or user re-login every cold start. Documented trade-off.",
      },
    ],
    workflow: ["expo-bff", "security-audit", "ship-feature"],
  },
  {
    id: "expo-offline-sync",
    name: "Expo offline sync",
    category: "features",
    slash: "expo-offline-sync",
    summary: "Offline-first Expo — NetInfo, durable queues, conflict policy, and honest UX on iOS and Android.",
    tags: ["expo", "react-native", "mobile", "offline", "sync"],
    copyVariants: [
      "Make the Expo app work offline",
      "Queue API writes when the phone is offline",
      "Conflict policy for mobile sync",
    ],
    prompt: prompt(
      "Expo offline sync",
      `Plan **offline**. Do not fake an always-online SPA.

## Checklist

- [ ] Which screens are read-offline vs write-offline
- [ ] Persistence: SQLite / Watermelon / persist Query — pick one already in repo if present
- [ ] Outbox queue: idempotency keys
- [ ] Conflicts: last-write-wins vs server-wins vs user prompt
- [ ] NetInfo + UX banners (existing patterns, no invented slogans)
- [ ] Background fetch: iOS vs Android limits — do not promise web-like workers
- [ ] Sensitive data at rest encrypted if required

## Artifacts

| Artifact | Path |
|----------|------|
| Offline plan | \`.DNA/plans/expo-offline.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| “Sync later” with no queue | Block; that is data loss |
| Background sync promised like a server | Correct the product copy |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Read vs write offline map",
      "Queue + conflict policy",
      "OS background limits stated",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Field staff have no signal",
        goodResponse:
          "Read cache + outbox for report submits. Idempotency keys. Conflict: server-wins on profile, user prompt on reports. Plan in expo-offline.md.",
      },
      {
        userSays: "Just use TanStack persist",
        goodResponse:
          "OK for reads. Writes still need an outbox. Documented gap if persist-only.",
      },
      {
        userSays: "Sync every 15 minutes in background",
        goodResponse:
          "Not guaranteed on iOS. Use opportunistic NetInfo + user-open sync. Background fetch as best-effort only.",
      },
    ],
    workflow: ["expo-bff", "expo-perf-mobile", "ship-feature"],
  },
  {
    id: "expo-perf-mobile",
    name: "Expo mobile performance",
    category: "quality",
    slash: "expo-perf-mobile",
    summary: "Mobile perf — FlashList/FlatList, images, Reanimated UI thread, JS jank, and iOS/Android profiling.",
    tags: ["expo", "react-native", "mobile", "performance"],
    copyVariants: [
      "Fix jank on our Expo list screens",
      "React Native performance audit",
      "Why is the Android app slow?",
    ],
    prompt: prompt(
      "Expo mobile performance",
      `Profile **before** rewriting. iOS and Android can disagree.

## Checklist

- [ ] Reproduce device class (low-end Android vs iPhone)
- [ ] Lists: FlashList/FlatList windowing; no map() of 1k Views
- [ ] Images: expo-image, size to screen, cache
- [ ] Reanimated worklets vs JS-thread animations
- [ ] Avoid anonymous inline components in hot lists
- [ ] Hermes; bundle size; debug vs release (never profile only in debug)
- [ ] TTI, scroll FPS notes as **measured** or labelled assumption

## Artifacts

| Artifact | Path |
|----------|------|
| Perf notes | \`.DNA/reports/expo-perf.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Debug-only slowness | Re-measure release |
| Premature Recoil/Zustand rewrite | Reject unless evidence |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Measured vs assumed labelled",
      "List/image/animation findings",
      "iOS vs Android if they differ",
      "Report path",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Scrolling the feed stutters on Android",
        goodResponse:
          "Release profile on a mid-tier Android. Likely: unvirtualized list + decode-full images. Plan FlashList + expo-image. Report in expo-perf.md.",
      },
      {
        userSays: "Use memo everywhere",
        goodResponse:
          "No blanket memo. Target list rows + heavy screens after profiling.",
      },
      {
        userSays: "iOS is fine",
        goodResponse:
          "Document Android-only. Do not ‘optimize iOS’ for symmetry. Next: images + list windowing on Android.",
      },
    ],
    workflow: ["visual-qa-pass", "expo-testing-mobile"],
  },
  {
    id: "expo-a11y-mobile",
    name: "Expo mobile accessibility",
    category: "quality",
    slash: "expo-a11y-mobile",
    summary: "VoiceOver, TalkBack, hit targets, Dynamic Type / font scaling, and labels on iOS and Android.",
    tags: ["expo", "react-native", "mobile", "a11y", "accessibility"],
    copyVariants: [
      "Accessibility pass on the Expo app",
      "VoiceOver and TalkBack audit",
      "Fix tiny hit targets on mobile",
    ],
    prompt: prompt(
      "Expo mobile accessibility",
      `Audit **iOS VoiceOver** and **Android TalkBack** separately. Web a11y stems do not replace this.

## Checklist

- [ ] accessibilityLabel / Role on tappable non-text
- [ ] Hit target ≥ 44×44 (iOS) / 48×48 (Android) — existing UI system
- [ ] Font scaling: don't clip; test large text
- [ ] Contrast on theme tokens (mobile-ui)
- [ ] Reduce motion if you add Reanimated flourishes
- [ ] Form errors announced
- [ ] Do not invent extra header slogans for “clarity”

## Artifacts

| Artifact | Path |
|----------|------|
| A11y report | \`.DNA/reports/expo-a11y.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Web-only eslint jsx-a11y | Insufficient; device pass required |
| Unlabelled icon tabs | P1 |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "VoiceOver + TalkBack notes",
      "Hit target / type issues",
      "Report path",
      "P1 list",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "A11y the tab bar",
        goodResponse:
          "Each tab: label matching visible text, selected state. Android TalkBack + iOS VoiceOver. Report in expo-a11y.md.",
      },
      {
        userSays: "Disable font scaling so layout doesn't break",
        goodResponse:
          "Rejected as default. Fix layout. allowFontScaling true unless a regulated exception.",
      },
      {
        userSays: "We already ran /a11y-audit",
        goodResponse:
          "Web stem is not enough. This stem is device a11y. I'll still reuse token contrast notes.",
      },
    ],
    workflow: ["a11y-audit", "visual-qa-pass"],
  },
  {
    id: "expo-testing-mobile",
    name: "Expo mobile testing",
    category: "quality",
    slash: "expo-testing-mobile",
    summary: "Jest + RNTL unit tests, Maestro/Detox E2E, and device checks for deep links, push cold start, and permissions.",
    tags: ["expo", "react-native", "mobile", "testing", "maestro", "detox"],
    copyVariants: [
      "Add React Native Testing Library tests",
      "Maestro flows for Expo iOS and Android",
      "E2E the login and deep link on device",
    ],
    prompt: prompt(
      "Expo mobile testing",
      `Plan tests that **run**. Prefer the repo's existing runner.

## Layers

- Unit/component: Jest + @testing-library/react-native
- E2E: Maestro (simple YAML) or Detox if already adopted — do not add both
- Manual: permission deny, airplane mode, cold start from push / universal link

## Checklist

- [ ] Existing test script detected
- [ ] Secure-store + NetInfo mocked
- [ ] No real tokens in fixtures
- [ ] E2E smoke: launch, login, one critical path × iOS and Android
- [ ] Deep link + push cold start on the critical path
- [ ] CI: who runs simulators (EAS / GH macOS / local)

## Artifacts

| Artifact | Path |
|----------|------|
| Test plan | \`.DNA/plans/expo-testing.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Detox + Maestro both new | Pick Maestro unless Detox already exists |
| E2E only on iOS sim | Call out Android gap |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Unit vs E2E split",
      "Mocks for native modules",
      "iOS and Android smoke",
      "Plan artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "We have zero mobile tests",
        goodResponse:
          "Add RNTL for auth gate + list empty states. Maestro smoke login on iOS sim + Android emulator. Plan in expo-testing.md.",
      },
      {
        userSays: "Detox is already in CI",
        goodResponse:
          "Keep Detox. Do not add Maestro. Extend the existing smoke for Android if missing.",
      },
      {
        userSays: "Skip Android E2E",
        goodResponse:
          "Recorded as accepted risk in the plan — not ‘done’. iOS-only is a gap.",
      },
    ],
    workflow: ["quality-gate", "expo-ci-eas"],
  },
  {
    id: "expo-notifications",
    name: "Expo push notifications",
    category: "features",
    slash: "expo-notifications",
    summary: "expo-notifications — APNs + FCM, permissions, channels, cold start, and no PII in payloads.",
    tags: ["expo", "react-native", "mobile", "push", "notifications", "ios", "android"],
    copyVariants: [
      "Add push notifications to Expo",
      "Fix FCM and APNs for our React Native app",
      "Notification tap should open the right screen",
    ],
    prompt: prompt(
      "Expo push notifications",
      `Implement or repair **push**. iOS = APNs, Android = FCM (via Expo push or your server).

## Checklist

- [ ] Dev client required (not Expo Go for production-quality push)
- [ ] Permission: iOS prompt + Android 13 POST_NOTIFICATIONS
- [ ] Android channels
- [ ] Token registration → **your backend/BFF**, not only Expo's service if you need control
- [ ] Cold start: last notification response → Router
- [ ] Payload: no PII/PHI; ids only
- [ ] Foreground handling — don't spam
- [ ] EAS credentials: APNs key, FCM google-services (names / files in secrets)

## Artifacts

| Artifact | Path |
|----------|------|
| Push plan | \`.DNA/plans/expo-notifications.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Token in app logs | Remove; treat as leak |
| Go-only testing | Not production-representative |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "APNs + FCM path",
      "Permission timing",
      "Deep link on tap",
      "PII rules",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Notify when a job is assigned",
        goodResponse:
          "BFF sends Expo/FCM message with jobId only. Client opens /jobs/[id]. Android channel ‘jobs’. Plan in expo-notifications.md.",
      },
      {
        userSays: "Include patient name in the push",
        goodResponse:
          "No. Title/body generic; fetch PHI in-app after auth. Healthcare legal stem if needed.",
      },
      {
        userSays: "Works in Expo Go",
        goodResponse:
          "Go has limited push. Production needs a dev/prod binary + credentials. Next: expo-dev-client.",
      },
    ],
    workflow: ["expo-dev-client", "expo-deep-links", "expo-ios-permissions"],
  },
  {
    id: "expo-deep-links",
    name: "Expo deep links",
    category: "features",
    slash: "expo-deep-links",
    summary: "Universal Links (iOS) and App Links (Android) plus custom schemes — Expo Router linking and verified domains.",
    tags: ["expo", "react-native", "mobile", "deeplink", "ios", "android"],
    copyVariants: [
      "Set up Universal Links for Expo",
      "Android App Links + iOS associated domains",
      "Open https://app.example.com/jobs/1 in the Expo app",
    ],
    prompt: prompt(
      "Expo deep links",
      `Configure **verified HTTPS links** (preferred) plus a custom scheme for dev.

## Checklist

- [ ] \`scheme\` in app config
- [ ] iOS associatedDomains + AASA file on the web host
- [ ] Android intentFilters + Digital Asset Links
- [ ] Expo Router: path vs screen map
- [ ] Auth: unauthenticated deep link stored then replayed
- [ ] Cold start vs warm
- [ ] Preview vs prod domains (flavor config)

## Artifacts

| Artifact | Path |
|----------|------|
| Linking plan | \`.DNA/plans/expo-deeplinks.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Scheme-only in production | Weak; add verified HTTPS |
| AASA 404 | Block claiming Universal Links work |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "iOS AASA + Android assetlinks plan",
      "Router map",
      "Auth replay",
      "Artifact written",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Emails should open the invoice screen",
        goodResponse:
          "https://app.example.com/invoices/:id + AASA/assetlinks. Router file invoices/[id]. Unauth → login → replay. Plan in expo-deeplinks.md.",
      },
      {
        userSays: "Use myapp:// everywhere",
        goodResponse:
          "OK for local/dev. Production still needs HTTPS app links for email/SMS. Documented split.",
      },
      {
        userSays: "Links open Safari not the app",
        goodResponse:
          "Verify AASA JSON, associatedDomains, team ID. Android: sha256 fingerprints in assetlinks. Do not guess live DNS — check evidence.",
      },
    ],
    workflow: ["expo-router-navigation", "expo-app-config", "expo-testing-mobile"],
  },
  {
    id: "expo-store-submit",
    name: "Expo store submit",
    category: "delivery",
    slash: "expo-store-submit",
    summary: "EAS Submit to App Store Connect and Play Console — both stores, metadata, and no secret leakage.",
    tags: ["expo", "react-native", "mobile", "eas", "app-store", "play-store"],
    copyVariants: [
      "eas submit iOS and Android",
      "Upload our Expo binaries to both stores",
      "Store metadata checklist for Expo",
    ],
    prompt: prompt(
      "Expo store submit",
      `Submit **both stores** (or the one in $ARGUMENTS). Pair with expo-ios-ship / expo-android-ship checklists.

## Checklist

- [ ] Binaries from expo-eas-build exist
- [ ] eas.json submit profiles
- [ ] Metadata: screenshots, privacy, ratings — match existing brand; no invented slogans
- [ ] Review accounts
- [ ] Phased release optional
- [ ] Same marketing version on both OS unless argued

## Artifacts

| Artifact | Path |
|----------|------|
| Submit matrix | \`.DNA/plans/expo-store-submit.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| Binary missing | Run expo-eas-build first |
| Metadata mismatch vs in-app permissions | Align before submit |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "iOS + Android submit status",
      "Metadata/privacy alignment",
      "Binary source (EAS Build) confirmed or blocked",
      "Matrix artifact",
      "Next stem named (release notes or CI)",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Submit 2.4.0 to both stores",
        goodResponse:
          "Confirm 2.4.0 binaries. eas submit ios + android. Privacy forms already matching SDKs? Matrix in expo-store-submit.md.",
      },
      {
        userSays: "iOS only this week",
        goodResponse:
          "Scoped iOS. Android remains unreleased — noted. Did not silently skip Play.",
      },
      {
        userSays: "Auto-submit from CI on main",
        goodResponse:
          "Allowed with EXPO_TOKEN in GH secrets and a production profile. Still need human store metadata. See expo-ci-eas.",
      },
    ],
    workflow: ["expo-eas-build", "expo-ios-ship", "expo-android-ship", "write-release-notes"],
  },
  {
    id: "expo-ci-eas",
    name: "Expo CI EAS",
    category: "delivery",
    slash: "expo-ci-eas",
    summary: "GitHub Actions + EAS — PR JS checks, fingerprint native diffs, preview updates, and production submit gates.",
    tags: ["expo", "react-native", "mobile", "ci", "eas", "github-actions"],
    copyVariants: [
      "Add EAS to GitHub Actions",
      "CI for Expo preview updates",
      "Fingerprint native changes on PRs",
    ],
    prompt: prompt(
      "Expo CI EAS",
      `Wire **CI** that respects OTA vs binary.

## Recommended pipeline

- PR: lint, typecheck, unit tests (no full EAS unless native fingerprint changed)
- Fingerprint / \`npx expo-updates\` compatibility: fail OTA job if native changed
- Main: EAS Update to preview channel; production binary on tag/release
- Secrets: EXPO_TOKEN, not in logs

## Checklist

- [ ] Existing dna-ci.yml — extend, don't fork a parallel mobile CI without reason
- [ ] Cache node modules
- [ ] Who pays EAS minutes
- [ ] Maestro in CI optional (macOS runners cost)

## Artifacts

| Artifact | Path |
|----------|------|
| CI plan | \`.DNA/plans/expo-ci.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| eas build on every JS PR | Too slow/costly; use fingerprint |
| Token in workflow YAML | Block |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "PR vs main vs tag jobs",
      "OTA vs build split",
      "Secret names",
      "CI plan artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: [...EXPO_CLI, "npx dna ci install"],
    examples: [
      {
        userSays: "PRs should publish a preview update",
        goodResponse:
          "If fingerprint matches last preview binary: eas update --branch preview. Else comment ‘native change — needs EAS Build’. Plan in expo-ci.md.",
      },
      {
        userSays: "Build iOS on every commit",
        goodResponse:
          "Rejected as default. Fingerprint gate. Nightly or label-triggered EAS Build instead.",
      },
      {
        userSays: "We already have dna-ci.yml",
        goodResponse:
          "Add a mobile job; keep lint/test. Do not replace DNA CI. EXPO_TOKEN as GH secret.",
      },
    ],
    workflow: ["ci-install", "expo-dynamic-builds", "expo-eas-build"],
  },
  {
    id: "expo-native-modules",
    name: "Expo native modules",
    category: "analysis",
    slash: "expo-native-modules",
    summary:
      "When to add a config plugin or custom native module — autolinking, CNG, and the binary/OTA impact.",
    tags: ["expo", "react-native", "mobile", "native-modules", "config-plugins"],
    copyVariants: [
      "Do we need a config plugin for this SDK?",
      "Add a custom native module to Expo",
      "Why Expo Go broke after we added this library",
    ],
    prompt: prompt(
      "Expo native modules",
      `Decide how to integrate **native** code.

## Options (pick with evidence)

1. Expo SDK module already in the runtime
2. Config plugin + autolinking (preferred for third-party)
3. Local CNG native code (ios/ android) — last resort
4. Reject the library; find an Expo-compatible alternative

## Checklist

- [ ] Does it require custom native? (readme, expo plugin)
- [ ] Dev client required after add
- [ ] OTA: **blocked** until a new binary
- [ ] Permissions stems if the module accesses sensors/PII
- [ ] New Architecture compatibility
- [ ] Who owns upgrades on SDK bumps

## Artifacts

| Artifact | Path |
|----------|------|
| Native impact ADR | \`.DNA/plans/expo-native-modules.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| npm install then Expo Go | Will crash; require dev client |
| Patching node_modules native | Forbidden; plugin or fork with a path |`,
    ),
    guidelines: EXPO_GROUND,
    expectations: [
      "Plugin vs custom native vs reject",
      "Dev client + binary bump called out",
      "Permission follow-ups",
      "ADR artifact",
    ],
    contextLoads: EXPO_CONTEXT,
    cliCommands: EXPO_CLI,
    examples: [
      {
        userSays: "Add react-native-foo that needs a Gradle tweak",
        goodResponse:
          "Write a config plugin; don't edit generated android/ if CNG. Dev client + EAS Build. OTA insufficient. ADR in expo-native-modules.md.",
      },
      {
        userSays: "It's JS-only",
        goodResponse:
          "No native. Expo Go OK. OTA OK. Still scan for accidental native deps.",
      },
      {
        userSays: "We forked a native SDK in patches/",
        goodResponse:
          "Record upgrade risk. Prefer a maintained plugin. Binary every patch change.",
      },
    ],
    workflow: ["expo-workflow-decision", "expo-dev-client", "expo-eas-build"],
  },
];
