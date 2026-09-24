import type { PromptStemPackDef, StemGuidelines } from "./types.js";

/**
 * Generic surface stems. Workflows only — no product names, hosts, brands,
 * colours, or scripts copied from any one repository.
 */
const GROUND: StemGuidelines = {
  must: [
    "Run real `npx dna` commands in shell — never invent CLI output",
    "Load `.DNA/neuralNetwork.json`, matching behaviour, and listed contextLoads before acting",
    "Respond in plain English; lead with outcome, then evidence paths",
    "Reuse the repository's existing packaging, publish, theme, and API patterns",
    "Write named artifacts to the paths this stem specifies (or state why deferred)",
    "Cover failure modes listed in the prompt — do not skip the unhappy path",
    "Cite concrete evidence (paths, CLI output, configs) for every material claim",
    "If the required surface is absent, stop and say so — do not invent a second product",
  ],
  never: [
    "Skip reading this stem's guidelines, expectations, and context",
    "Force-push main/master",
    "Commit or echo secrets, signing keys, or credentials",
    "Name or copy another repository's product, host, brand, palette, or script",
    "Invent metrics or ship status without measurement or an assumption label",
    "Leave work with no artifact path and no explicit deferral reason",
  ],
  should: [
    "Hand off to `ship-feature` when implementation needs the agent loop",
    "Label unverified claims as **assumption**",
    "End with the next stem and open questions",
  ],
};

const EVIDENCE = `## Evidence bootstrap (run first)

\`\`\`bash
npx dna analyze
npx dna scan
\`\`\`

Load \`.DNA/neuralNetwork.json\`, relevant \`.DNA/behaviour/\`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.`;

const FAILURE_COMMON = `## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |`;

export const SURFACE_STEM_IDS = [
  "ship-macos-menubar",
  "macos-background-agent",
  "publish-internal-app",
  "wiki",
  "governed-ai-fleet",
  "companion-client",
] as const;

export const SURFACE_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "ship-macos-menubar",
    name: "Ship macOS menu bar",
    category: "delivery",
    slash: "ship-macos-menubar",
    summary: "Package and ship a native macOS menu-bar app using the repo's existing Swift package layout.",
    tags: ["delivery", "macos", "menubar", "swift"],
    copyVariants: [
      "Ship the macOS menu-bar app",
      "Package the menu-bar utility for release",
      "Prepare a signed macOS menu-bar build",
    ],
    prompt: `# Ship macOS menu bar

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Confirm a native macOS menu-bar target already exists (Swift package or Xcode project with a menu-bar UI). If it does not, **stop**. Do not introduce a desktop shell, browser wrapper, or a second app architecture.

## Checklist

- [ ] Menu-bar target present; library and executable split matches the repo
- [ ] Version in the package manifest and any app metadata agree
- [ ] Use the repo's existing package script — do not add a new packager
- [ ] Signing identity present for a production ship (names only; never print secrets)
- [ ] Notarize and staple when the user asked for a distributable macOS build
- [ ] Smoke: launches into the menu bar, quits cleanly, survives relaunch
- [ ] No telemetry, account, or network call added unless the product already has one and the user asked
- [ ] Hand release notes to \`write-release-notes\`

## Artifacts

| Artifact | Path |
|----------|------|
| Release matrix | \`.DNA/plans/macos-menubar-release.md\` |
| Release notes | via \`write-release-notes\` |

## Failure modes

| Mode | Response |
|------|----------|
| No menu-bar target | Stop |
| Missing signing identity | Block production ship; list required secret names only |
| Tests fail | Do not package; report the failing suite |

${FAILURE_COMMON}`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Ship only the menu-bar target that already exists in this repository",
        "Keep signing material out of git and out of the reply",
        "Record signed, notarized, and smoke status in the release matrix",
      ],
      never: [
        ...GROUND.never,
        "Replace a native menu-bar app with a cross-platform shell",
        "Ship an unsigned production build when signing was requested",
      ],
    },
    expectations: [
      "Menu-bar target confirmed or stop",
      "Version alignment stated",
      "Package script used (path cited)",
      "Sign and notarize status",
      "Smoke result",
      "Release matrix path",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      ".DNA/behaviour/delivery.behaviour.md",
      "CHANGELOG.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna quality report --feature"],
    examples: [
      {
        userSays: "Ship the menu-bar app 1.4.0, signed",
        goodResponse:
          "Menu-bar target found. 1.4.0 aligned. Used the existing package script. Signed and notarized. Smoke passed. Matrix at .DNA/plans/macos-menubar-release.md. Release notes next?",
      },
      {
        userSays: "Local unsigned smoke only",
        goodResponse:
          "Unsigned local package. Notarize skipped. Matrix marks this non-production. Smoke: menu bar item appears and quits cleanly.",
      },
      {
        userSays: "There is no Mac app yet — invent one and ship it",
        goodResponse:
          "Stopped. No menu-bar target in the repo. Say if you want a plan to add one; I will not scaffold a second desktop stack in this stem.",
      },
    ],
    workflow: ["write-release-notes", "quality-gate", "create-pr"],
  },
  {
    id: "macos-background-agent",
    name: "macOS background agent",
    category: "delivery",
    slash: "macos-background-agent",
    summary: "Add or ship a macOS login-item agent that stays quiet, local, and separate from the menu-bar UI.",
    tags: ["delivery", "macos", "agent", "launch-item"],
    copyVariants: [
      "Ship the macOS background agent",
      "Register a quiet login-item agent",
      "Check the menu-bar app's background helper",
    ],
    prompt: `# macOS background agent

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Confirm the repo already has a native macOS app that is allowed to run a helper. If there is no Mac target, **stop**.

The helper is a login item. It must not steal focus, show windows, or open a network connection unless that behaviour already exists and the user asked to keep it.

## Checklist

- [ ] Helper target is separate from the menu-bar UI target
- [ ] Registration uses the platform login-item API already chosen in this repo
- [ ] Agent starts at login only when the user enabled it
- [ ] Failure to register is visible in logs the app already uses — no new telemetry channel
- [ ] Uninstall or quit removes the login item
- [ ] Smoke: enable, relaunch the session or simulate it, confirm the helper is running, disable, confirm it is gone
- [ ] No credentials in arguments, plists, or logs

## Artifacts

| Artifact | Path |
|----------|------|
| Agent notes | \`.DNA/plans/macos-background-agent.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No Mac target | Stop |
| Login-item API missing from the OS baseline the repo supports | Stop and name the minimum OS |
| Helper would need a new entitlement | List the entitlement; do not invent a provisioning profile |

${FAILURE_COMMON}`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Keep the helper headless: no focus steal, no extra UI",
        "Make enable and disable reversible in the same session",
        "Document registration, smoke, and removal in the agent notes",
      ],
      never: [
        ...GROUND.never,
        "Add analytics or a remote call just so the helper can check in",
        "Hide the helper so the user cannot turn it off",
      ],
    },
    expectations: [
      "Mac target confirmed or stop",
      "Helper vs menu-bar split stated",
      "Login-item register and remove path",
      "Smoke result for enable and disable",
      "Agent notes path",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      ".DNA/behaviour/delivery.behaviour.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna quality report --feature"],
    examples: [
      {
        userSays: "The helper should start at login and stay invisible",
        goodResponse:
          "Helper target is separate from the menu-bar app. Login item registers on enable and is removed on disable. Smoke: process present after enable, gone after disable. Notes in macos-background-agent.md.",
      },
      {
        userSays: "Phone home on a timer so we know it is alive",
        goodResponse:
          "Refused a new network check-in. The helper stays local. Liveness is the existing local log. Say if the product already has an approved telemetry channel to reuse.",
      },
      {
        userSays: "We only have a website",
        goodResponse:
          "Stopped. No native macOS target. This stem does not add a desktop app.",
      },
    ],
    workflow: ["ship-macos-menubar", "quality-gate"],
  },
  {
    id: "publish-internal-app",
    name: "Publish internal app",
    category: "delivery",
    slash: "publish-internal-app",
    summary: "Publish an internal app with the repository's existing publish script and a dry run first.",
    tags: ["delivery", "publish", "internal"],
    copyVariants: [
      "Publish this internal app",
      "Dry-run the internal publish, then ship",
      "Use the repo publish script for the internal host",
    ],
    prompt: `# Publish internal app

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Find the publish script and host config **already in this repository** (package scripts, docs, or deploy config). If none exist, **stop**. Do not invent a host name, a new script, or a second deploy path.

## Checklist

- [ ] Publish command cited by path or script name from this repo
- [ ] Dry run first; paste the dry-run result, not a guessed success
- [ ] Target environment comes from this repo's config or the user's argument
- [ ] Env values come from the example file; real secrets stay out of git and out of the reply
- [ ] Build artifact matches what the script expects
- [ ] After a real publish, record the URL or release id the script printed
- [ ] Rollback is the script's existing rollback, or "none" if the repo has no rollback

## Artifacts

| Artifact | Path |
|----------|------|
| Publish record | \`.DNA/plans/internal-publish.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No publish script | Stop |
| Dry run fails | Do not run the real publish |
| Secret missing | Name the variable; stop |

${FAILURE_COMMON}`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Dry-run before any real publish",
        "Use only the publish entrypoint this repository already documents",
        "Record target, dry-run result, and live result in the publish record",
      ],
      never: [
        ...GROUND.never,
        "Hard-code a host, project id, or URL from memory of another product",
        "Skip the dry run because a previous publish worked",
      ],
    },
    expectations: [
      "Publish script path cited or stop",
      "Dry-run output summarized",
      "Live publish result or explicit stop",
      "URL or release id from the tool, if published",
      "Publish record path",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      ".DNA/config.dna.json",
      ".DNA/behaviour/delivery.behaviour.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna doctor"],
    examples: [
      {
        userSays: "Publish the internal app",
        goodResponse:
          "Found npm script publish:internal. Dry run succeeded for the environment in .env.example. Live publish printed the release URL. Recorded in .DNA/plans/internal-publish.md.",
      },
      {
        userSays: "Skip the dry run, just push it",
        goodResponse:
          "Dry run still runs first. If it fails I will not publish. No host was assumed.",
      },
      {
        userSays: "Deploy wherever we deployed the other product",
        goodResponse:
          "Stopped. This repo has no publish script, and I will not copy another product's host. Add a script here or point me at one.",
      },
    ],
    workflow: ["quality-gate", "write-release-notes"],
  },
  {
    id: "wiki",
    name: "Wiki",
    category: "docs",
    slash: "wiki",
    summary: "Write or extend the wiki already in the repo, using its theme and information architecture.",
    tags: ["docs", "wiki"],
    copyVariants: [
      "Add a wiki page for this workflow",
      "Extend the existing wiki",
      "Write a wiki page, not an engineering dump",
    ],
    prompt: `# Wiki

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Find the wiki already in this repository (docs site config, sidebars, existing pages). If none exist and the user did not ask to create one, **stop**. If they asked to create one, reuse the docs tool and visual theme already used elsewhere in the repo — do not invent a new brand.

## Checklist

- [ ] Page lives in the existing sidebar or nav
- [ ] Steps match the product's real screens and labels
- [ ] Theme, type, and layout tokens come from the existing wiki — no new palette
- [ ] Screenshots only via the repo's screenshot script, if it has one
- [ ] No internal hostnames, customer names, or secrets
- [ ] A reader can finish the task without reading source code

## Artifacts

| Artifact | Path |
|----------|------|
| Wiki page | path inside the existing docs tree |
| Outline | \`.DNA/plans/wiki.md\` when more than one page |

## Failure modes

| Mode | Response |
|------|----------|
| No wiki and user did not ask to start one | Stop |
| Screen label unknown | Mark **assumption** or ask once |
| Engineering-only detail | Move it out of the wiki page |

${FAILURE_COMMON}`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Write the task in order: real labels, what done looks like",
        "Stay inside the existing wiki theme and navigation",
        "Keep customer data, secrets, and internal-only URLs out of the page",
      ],
      never: [
        ...GROUND.never,
        "Paste API handlers or file trees as the wiki page",
        "Invent a visual system when the wiki already has one",
      ],
    },
    expectations: [
      "Wiki located or a new one only if the user asked",
      "Page path in the existing wiki",
      "Steps tied to real UI labels",
      "Theme reused, not redesigned",
      "Outline path when the change spans pages",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      "DNA/Impressions/product/product-overview.md",
    ],
    cliCommands: ["npx dna document --from-code", "npx dna analyze"],
    examples: [
      {
        userSays: "Document how to close the weekly run",
        goodResponse:
          "Page added under the existing sidebar. Steps use the button labels from the app. Same theme as the current wiki. No secrets. Outline not needed for one page.",
      },
      {
        userSays: "Make the wiki look like a different brand",
        goodResponse:
          "Refused a new palette. The page uses the wiki theme already in the repo. Content-only change.",
      },
      {
        userSays: "Put the database schema in the wiki",
        goodResponse:
          "Left the schema out. The wiki page says what to click and what the reader should see. Schema stays in engineering docs.",
      },
    ],
    workflow: ["document-from-code", "sync-impressions"],
  },
  {
    id: "governed-ai-fleet",
    name: "Governed AI fleet",
    category: "features",
    slash: "governed-ai-fleet",
    summary: "Plan a governed assistant fleet: one site app, an optional group console, and an optional operator console, with one model path.",
    tags: ["features", "ai", "governance", "multi-app"],
    copyVariants: [
      "Plan the governed AI fleet",
      "Keep every model call on the governed path",
      "Split site, group, and operator consoles without duplicating the assistant",
    ],
    prompt: `# Governed AI fleet

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Read how this repo routes model calls today. If there is no assistant, **stop** unless the user asked to plan one.

A fleet has at most three apps. Add an app only when this repo or the user already distinguishes that role:

1. **Site app** — one tenant talks to the assistant; admins manage people, knowledge, safety rules, and usage.
2. **Group console** — manages many site apps (preferences, templates, guides, usage). It does not replace the site app.
3. **Operator console** — health, versions, and updates across the fleet. It does not replace the group console or the site app.

## Checklist

- [ ] Every live model call goes through the existing governed gateway — no direct vendor calls from a new UI
- [ ] Safety rules, knowledge scope, and usage stay on the site that owns them
- [ ] Missing roles stay missing — do not scaffold a console the user did not ask for
- [ ] Tenant isolation is the isolation model already in the repo
- [ ] Admin actions require the existing admin check on the API, not a hidden button
- [ ] Plan lists files and stops for approval before code (\`ship-feature\`)
- [ ] Regulated data: hand off to \`plan-legal\` / \`plan-compliance\` before build

## Artifacts

| Artifact | Path |
|----------|------|
| Fleet plan | \`.DNA/plans/governed-ai-fleet.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No assistant and no request to add one | Stop |
| UI wants to call a model vendor directly | Refuse; route through the gateway |
| User asks for an industry workflow this repo does not have | Treat it as a new product decision; do not invent the domain |

${FAILURE_COMMON}`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Keep one governed path for live model calls",
        "Describe only the fleet roles this repo or the user actually has",
        "Stop after the plan until the user approves implementation",
      ],
      never: [
        ...GROUND.never,
        "Bypass safety rules for a faster demo",
        "Copy another product's tenant model, prompts, or policy text into this plan",
      ],
    },
    expectations: [
      "Current model path cited or stop",
      "Roles in scope vs explicitly out of scope",
      "Gateway rule for live calls",
      "Admin API enforcement noted",
      "Fleet plan path",
      "Approval gate before code",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      ".DNA/behaviour/reasoning.behaviour.md",
      ".DNA/knowledge/ai/",
    ],
    cliCommands: ["npx dna analyze", "npx dna context ai", "npx dna plan compliance"],
    examples: [
      {
        userSays: "We have a site assistant. Add a group console that does not replace it",
        goodResponse:
          "Site app keeps the assistant and tenant admin. Group console is usage, templates, and guides across sites. Model calls stay on the current gateway. Plan in governed-ai-fleet.md. Approve before code?",
      },
      {
        userSays: "Let the new screen call the model vendor directly",
        goodResponse:
          "Refused. The new screen calls the existing governed gateway. Direct vendor access is a failure mode, not a shortcut.",
      },
      {
        userSays: "Also build the operator console and a second product domain",
        goodResponse:
          "Operator console only if you confirm that role. I will not invent a new domain. Plan lists site + group only until you say otherwise.",
      },
    ],
    workflow: ["plan-legal", "plan-compliance", "ship-feature"],
  },
  {
    id: "companion-client",
    name: "Companion client",
    category: "features",
    slash: "companion-client",
    summary: "Add a satellite client (menu bar, extension, tracker panel, or mobile) that reads and writes the existing source-of-truth app.",
    tags: ["features", "companion", "client", "api"],
    copyVariants: [
      "Add a companion client that does not own the data",
      "Plan a menu-bar or extension satellite",
      "Keep settings on the main app",
    ],
    prompt: `# Companion client

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Identify the source-of-truth app and the API or contract companions must use. If that contract does not exist, **stop**. Do not invent a second database or a second settings product.

Satellites may be a menu-bar app, a browser extension, an issue-tracker panel, or a mobile client. Build only the one the user named.

## Checklist

- [ ] Source of truth named (which app owns settings, billing, and reports)
- [ ] Companion calls that API; it does not fork persistence
- [ ] Credentials travel in headers or the platform's secure store — never on a query string or in a page URL
- [ ] If the platform cannot set headers on a long-lived stream, pull on open instead of streaming with a token in the URL
- [ ] Settings, invoices, and admin stay on the source-of-truth app
- [ ] Offline behaviour matches what the API already allows
- [ ] Plan stops for approval before code when this is a new client

## Artifacts

| Artifact | Path |
|----------|------|
| Companion plan | \`.DNA/plans/companion-client.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No source-of-truth API | Stop |
| Design puts a device token in the query string | Reject the design |
| Companion needs its own user directory | Refuse; use the main app's auth |

${FAILURE_COMMON}`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Keep one source of truth for settings and records",
        "Keep credentials out of URLs, logs, and screenshots",
        "Limit the plan to the satellite the user asked for",
      ],
      never: [
        ...GROUND.never,
        "Open a long-lived connection with a secret in the query string",
        "Copy another product's companion UI or token format",
      ],
    },
    expectations: [
      "Source-of-truth app and API cited or stop",
      "Satellite type named",
      "Auth placement (header or secure store)",
      "What stays on the main app",
      "Companion plan path",
      "Approval gate before a new client is built",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      ".DNA/behaviour/reasoning.behaviour.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna context api"],
    examples: [
      {
        userSays: "Add a menu-bar companion for the existing web app",
        goodResponse:
          "Web app remains source of truth for settings and reports. Menu-bar client uses the existing API with the auth header. Plan in companion-client.md. Approve before code?",
      },
      {
        userSays: "The extension cannot set headers on the event stream, so put the token in the URL",
        goodResponse:
          "Rejected. No credential on the query string. Pull status when the extension opens instead of a long-lived stream.",
      },
      {
        userSays: "Give the companion its own settings database",
        goodResponse:
          "Refused. Settings stay on the main app. The companion reads and writes through that API only.",
      },
    ],
    workflow: ["ship-macos-menubar", "ship-feature", "quality-gate"],
  },
];
