import type { PromptStemPackDef, StemGuidelines } from "./types.js";

/**
 * Baseline stem quality for Skeletor / DNA day-to-day operator stems.
 * Every stem: checklist + artifacts + failure modes, dense guidelines, 2–3 examples.
 * See stem-quality.ts — this is the default bar for all new stems.
 */
const DAY_GROUND: StemGuidelines = {
  must: [
    "Run real `npx dna` commands in shell — never invent CLI output",
    "Load `.DNA/neuralNetwork.json`, matching behaviour, and listed contextLoads before acting",
    "Respond in plain English; lead with outcome, then evidence paths",
    "Reuse existing DNA patterns, rules, and knowledge — do not invent parallel workflows",
    "Write named artifacts to the paths this stem specifies (or state why deferred)",
    "Cover failure modes listed in the prompt — do not skip the unhappy path",
    "Cite concrete evidence (paths, CLI output, configs) for every material claim",
    "Provide 2–3 example-quality responses in spirit: specific, scoped, next-step clear",
  ],
  never: [
    "Skip reading this stem's guidelines, expectations, and context",
    "Force-push main/master",
    "Commit or echo secrets from env, signing keys, or CLI output",
    "Invent metrics, scan results, or audit scores without measurement or assumption labels",
    "Implement product features when this stem is plan-only or audit-only",
    "Leave work with no artifact path and no explicit deferral reason",
  ],
  should: [
    "If a surface (Tauri, fleet, Lab, admin, i18n) is missing, say so and degrade gracefully",
    "Hand off to `ship-feature` / agent-loop when implementation is required after a plan/audit",
    "Label unverified claims as **assumption**",
    "End with next stem + open questions",
  ],
};

const FEATURE_GATES: StemGuidelines = {
  must: [
    ...DAY_GROUND.must,
    "Stop after Solution Architect plan — wait for explicit user approval before code",
    "Run `npx dna quality report --feature` until PASS before marking complete when shipping",
  ],
  never: [
    ...DAY_GROUND.never,
    "Implement before plan approval",
    "Skip docker build or github push on feature close-out when the user asked to ship",
  ],
  should: DAY_GROUND.should,
};

const EVIDENCE = `## Evidence bootstrap (run first)

\`\`\`bash
npx dna analyze
npx dna scan
\`\`\`

Load \`.DNA/neuralNetwork.json\`, relevant \`.DNA/behaviour/\`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.`;

const FAILURE_COMMON = `## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |`;

/**
 * Day-to-day Skeletor / DNA operator stems — baseline stem quality.
 * Complements factory/strategy stems; does not replace `ship-feature`.
 */
export const DAY_TO_DAY_STEM_DEFS: PromptStemPackDef[] = [
  // ─── Features ────────────────────────────────────────────────────────────
  {
    id: "plan-admin-portal",
    name: "Plan admin portal",
    category: "features",
    slash: "plan-admin-portal",
    summary: "Plan /admin as a new-tab route tree with RBAC-wrapped link, route guards, and requireAdmin APIs.",
    tags: ["features", "admin", "rbac", "backoffice"],
    copyVariants: [
      "Plan an admin portal for support staff",
      "Add a backoffice in a new tab with RBAC",
      "Design /admin with requireAdmin on APIs",
    ],
    prompt: `# Plan admin portal

Scope: $ARGUMENTS

${EVIDENCE}

## Mandatory loads

1. \`.cursor/rules/admin-portal.mdc\`
2. \`.DNA/knowledge/platforms/dna/admin-portal.dna.md\`
3. \`.DNA/knowledge/platforms/dna/rbac-patterns.dna.md\` (if present)
4. Existing auth / capability issuance in the repo

Optional: \`npx dna plan rbac "<admin roles>"\` · \`npx dna context security\`

## Checklist

- [ ] Path: \`/admin\` (or \`/app/admin\` if app shell requires)
- [ ] Entry: \`AdminPortalLink\` → \`null\` without capability; \`target="_blank"\` + \`rel="noopener noreferrer"\`
- [ ] Route guard: unauthorized blocked (no admin chrome flash)
- [ ] API: \`requireAdmin\` on all \`/api/**/admin/**\`
- [ ] Screens MVP: users/directory, audit log, settings — map to existing components
- [ ] Tests: non-admin no link / route / API 403; admin happy path
- [ ] Approval gate before any code

## Artifacts

| Artifact | Path |
|----------|------|
| Plan | \`.DNA/plans/admin-portal.md\` or \`DNA/Impressions/architecture/admin-portal-plan.md\` |
| RBAC matrix | Include in plan (roles × link × route × API) |
| Feature request | \`ai/feature-request.md\` (update) |

## Failure modes

| Mode | Response |
|------|----------|
| No auth system | Plan capability issuance first; do not fake client-only roles |
| Admin already exists | Diff against pattern; extend — do not duplicate route trees |
| Same-tab requested | Note exception; still keep RBAC three-layer |

${FAILURE_COMMON}

## Output

Architect plan only → **STOP for approval** → hand off \`ship-feature\`.`,
    guidelines: {
      ...FEATURE_GATES,
      must: [
        ...FEATURE_GATES.must,
        "Enforce three layers: hide link, guard routes, requireAdmin APIs — UI-only security is incomplete",
        "Write admin portal plan artifact with RBAC matrix before asking for approval",
      ],
      never: [
        ...FEATURE_GATES.never,
        "Show a disabled admin link to non-admins",
        "Open admin in the same tab unless the user explicitly asks",
        "Rely on hiding buttons while leaving routes or APIs public",
      ],
    },
    expectations: [
      "Evidence bootstrap summarized",
      "Plan artifact path written or proposed",
      "RBAC matrix (admin vs non-admin) for link, route, API",
      "MVP screens + test matrix listed",
      "Stopped for approval — no code",
      "Next stem: ship-feature",
    ],
    contextLoads: [
      ".cursor/rules/admin-portal.mdc",
      ".DNA/knowledge/platforms/dna/admin-portal.dna.md",
      ".DNA/knowledge/platforms/dna/rbac-patterns.dna.md",
      "ai/agent-loop.md",
      "ai/feature-request.md",
      ".DNA/behaviour/security.behaviour.md",
    ],
    cliCommands: ["npx dna plan rbac", "npx dna context security", "npx dna analyze"],
    examples: [
      {
        userSays: "We need a backoffice for moderators",
        goodResponse:
          "Loaded admin-portal rule + knowledge. Plan: /admin new tab, AdminPortalLink on admin capability, AdminRouteGuard, requireAdmin on /api/admin/*. Screens: users, moderation queue, audit. Wrote .DNA/plans/admin-portal.md. Approve before implement?",
      },
      {
        userSays: "Admin already at /settings/admin — make it DNA-correct",
        goodResponse:
          "Found /settings/admin without new-tab or API gate. Gap matrix: move to /admin, wrap link, add requireAdmin. Diff plan in admin-portal.md — no duplicate shell. Approve migration?",
      },
      {
        userSays: "Just hide the Admin button for non-admins",
        goodResponse:
          "That is UI-only — incomplete. Need route guard + requireAdmin too. Plan covers all three layers. Approve full RBAC plan?",
      },
    ],
    workflow: ["plan-rbac", "ship-feature", "quality-gate"],
  },
  {
    id: "build-analytics-dashboard",
    name: "Build analytics dashboard",
    category: "features",
    slash: "build-analytics-dashboard",
    summary: "Plan/build a KPI grid with panels and hot lists — Issues/Projects style density.",
    tags: ["features", "analytics", "dashboard", "kpi"],
    copyVariants: [
      "Build a KPI dashboard with hot lists",
      "Add analytics panels like Issues and Projects",
      "Design an ops dashboard with KPI grid",
    ],
    prompt: `# Build analytics dashboard

Scope: $ARGUMENTS

${EVIDENCE}

## Pattern (Issues / Projects / Lab density)

1. **KPI grid** — 3–6 headline metrics (value, delta, health)
2. **Panels** — one job each (trend, distribution, status)
3. **Hot lists** — ranked actionable rows (errors, open items, care signals)
4. **States** — empty / loading / error per surface
5. **Permissions** — who sees which metrics

## Checklist

- [ ] Inventory existing dashboard/table/KPI primitives in-repo
- [ ] Data sources named (API, runtime DB, GitHub, store) — no parallel analytics DB unless justified
- [ ] KPI definitions (numerator/denominator, refresh)
- [ ] Hot-list sort + deep-link targets
- [ ] Mobile/responsive behaviour if shell has mobile chrome
- [ ] feature-request.md + architect plan → **STOP** → implement → quality

## Artifacts

| Artifact | Path |
|----------|------|
| Feature request | \`ai/feature-request.md\` |
| Dashboard plan | \`.DNA/plans/analytics-dashboard.md\` |
| Optional Impression | \`DNA/Impressions/product/analytics-dashboard.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No data API | Plan read-model / probe endpoints first |
| Metric undefined | Refuse vanity KPIs; require definition or mark assumption |
| Design-system cards | Prefer existing Lab density — avoid generic card grids unless DS requires |

${FAILURE_COMMON}

## Output

Plan with KPI table + panel map + hot lists → approval → \`ship-feature\`.`,
    guidelines: FEATURE_GATES,
    expectations: [
      "Evidence + existing UI primitives listed",
      "KPI table with definitions",
      "Panels and hot lists mapped to data sources",
      "Plan artifact written",
      "Approval before code; quality PASS if shipping",
    ],
    contextLoads: [
      "ai/agent-loop.md",
      "ai/feature-request.md",
      ".DNA/CellularMemory/occipitalLobe/ui-patterns.md",
      "DNA/Impressions/product/feature-map.md",
      ".DNA/CellularMemory/parietalLobe/system-map.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna quality report --feature", "npx dna lab serve --port 3200"],
    examples: [
      {
        userSays: "Add an analytics page with open bugs and velocity",
        goodResponse:
          "Plan: KPIs open/critical/MTTR; panel 7d trend; hot list top fingerprints → /labs/issues/:id. Reuse Lab table primitives. Wrote analytics-dashboard.md. Approve?",
      },
      {
        userSays: "Mirror GitHub Projects density for care signals",
        goodResponse:
          "KPI row (blockers, drift, stale Impressions); panel care-by-project; hot list P1 paths. Data: runtime.db + doctor. No new store. Approve?",
      },
      {
        userSays: "Just put some charts on a card grid",
        goodResponse:
          "Rejected vanity layout. Need KPI definitions + hot lists that deep-link to action. Drafted plan with 4 KPIs — define velocity formula or I label assumption.",
      },
    ],
    workflow: ["plan-feature", "ship-feature", "visual-qa-pass", "quality-gate"],
  },
  {
    id: "design-onboarding",
    name: "Design onboarding",
    category: "features",
    slash: "design-onboarding",
    summary: "Design first-run, kit install, and Continue-to-dashboard onboarding flows.",
    tags: ["features", "onboarding", "first-run", "ux"],
    copyVariants: [
      "Design first-run onboarding for kit install",
      "Plan Continue-to-dashboard after setup",
      "Shape the new-user onboarding flow",
    ],
    prompt: `# Design onboarding

Scope: $ARGUMENTS

${EVIDENCE}

## Goals

1. **First-run** — must-complete before product is useful
2. **Kit / DNA install** — doctor, marketplace packs, or product kits
3. **Continue-to-dashboard** — clear exit into main app (no dead-end wizard)
4. **Skip / resume** — returning users skip completed steps

## Checklist

- [ ] Step map (screen → exit criteria → persistence key)
- [ ] Copy outline (headline + one sentence per step — no walls)
- [ ] Failure paths: install fail, offline, auth expired
- [ ] Analytics/events if product already tracks funnels (reuse — do not invent stack)
- [ ] Existing setup screens inventoried before new ones
- [ ] Plan → approval → \`ship-feature\`

## Artifacts

| Artifact | Path |
|----------|------|
| Onboarding plan | \`.DNA/plans/onboarding.md\` or \`DNA/Impressions/product/onboarding.md\` |
| Feature request | \`ai/feature-request.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No kit concept | Map to \`dna doctor\` / marketplace install or product-equivalent |
| Forced tutorial | Prefer progressive disclosure; allow skip when safe |
| Dashboard missing | Define "home" surface that exists in code |

${FAILURE_COMMON}`,
    guidelines: FEATURE_GATES,
    expectations: [
      "Step map with Continue-to-dashboard exit",
      "Persistence / resume keys defined",
      "Failure paths covered",
      "Plan artifact written",
      "Approval before code",
    ],
    contextLoads: [
      "DNA/Impressions/product/product-overview.md",
      ".DNA/CellularMemory/occipitalLobe/ui-patterns.md",
      "ai/agent-loop.md",
      "ai/feature-request.md",
    ],
    cliCommands: ["npx dna doctor", "npx dna analyze", "npx dna marketplace list"],
    examples: [
      {
        userSays: "New users should install a kit then land on the dashboard",
        goodResponse:
          "3 steps: welcome → kit install (doctor/marketplace) → Continue to dashboard. Resume skips completed. Wrote onboarding.md. Approve?",
      },
      {
        userSays: "First-run for Skeletor desktop",
        goodResponse:
          "Steps: permissions → kit select → DNA health check → Continue to Dashboard. Offline: cached kit data + retry. Plan artifact ready.",
      },
      {
        userSays: "Make them watch a 5-step product tour",
        goodResponse:
          "Tour is optional after Continue. Must-complete is kit install only. Revised plan avoids forced tour. Approve?",
      },
    ],
    workflow: ["shape-feature", "ship-feature", "a11y-audit"],
  },
  {
    id: "plan-mcp-server",
    name: "Plan MCP server",
    category: "features",
    slash: "plan-mcp-server",
    summary: "Plan an MCP server for Cursor/Claude — tools, security, and client wiring.",
    tags: ["features", "mcp", "ai", "cursor", "claude"],
    copyVariants: [
      "Plan an MCP server for this project",
      "Design MCP tools for Cursor",
      "Scope a Model Context Protocol server",
    ],
    prompt: `# Plan MCP server

Scope: $ARGUMENTS

${EVIDENCE}

## Loads

- \`.DNA/knowledge/platforms/mcp-server/\` (positioning, security, architecture, checklist, anti-patterns)
- Neural intent \`build_mcp_server\`

## Checklist

- [ ] Purpose: what AI clients can do
- [ ] Tool list: name, input schema, side effects, authz
- [ ] Security: secrets, path sandbox, deny-by-default, audit
- [ ] Transport: stdio / SSE; Cursor + Claude host config sketch
- [ ] Tests: contract + security negatives
- [ ] Boundary: DNA CLI vs MCP (no duplicate unbounded shell)
- [ ] Plan only → approval → \`ship-feature\`

## Artifacts

| Artifact | Path |
|----------|------|
| MCP plan | \`.DNA/plans/mcp-server.md\` |
| Tool matrix | Inside plan (tool × side-effect × auth) |
| Client config sketch | \`mcp.json\` / Claude config snippet in plan (no secrets) |

## Failure modes

| Mode | Response |
|------|----------|
| User wants unrestricted shell | Refuse; propose allowlisted tools |
| Secrets in tool output | Design redaction; never return env dumps |
| Overlap with DNA CLI | Prefer thin MCP wrappers over reimplementing CLI |

${FAILURE_COMMON}`,
    guidelines: {
      ...FEATURE_GATES,
      must: [
        ...FEATURE_GATES.must,
        "Load MCP security knowledge before proposing tools with filesystem or network side effects",
        "Document side effects and auth for every tool in the matrix",
      ],
      never: [
        ...FEATURE_GATES.never,
        "Expose unrestricted shell or secret-bearing env through MCP tools",
        "Ship MCP plan without deny-by-default security notes",
      ],
    },
    expectations: [
      "Tool inventory with schemas and side effects",
      "Security model documented",
      "Cursor/Claude config sketch (no secrets)",
      "Plan artifact written",
      "Approval before code",
    ],
    contextLoads: [
      ".DNA/knowledge/platforms/mcp-server/positioning.dna.md",
      ".DNA/knowledge/platforms/mcp-server/security.dna.md",
      ".DNA/knowledge/platforms/mcp-server/architecture.dna.md",
      ".DNA/knowledge/platforms/mcp-server/checklist.dna.md",
      ".DNA/knowledge/platforms/mcp-server/anti-patterns.dna.md",
      ".DNA/behaviour/security.behaviour.md",
    ],
    cliCommands: ["npx dna context security", "npx dna analyze"],
    examples: [
      {
        userSays: "Expose DNA quality and analyze as MCP tools",
        goodResponse:
          "Tools: dna_quality_report, dna_analyze — read-only, cwd sandboxed. No shell. Wrote mcp-server.md + Cursor mcp.json sketch. Approve?",
      },
      {
        userSays: "MCP that can edit any file and run bash",
        goodResponse:
          "Rejected unrestricted shell/file write. Counter-plan: allowlisted write paths + explicit tools. Security matrix in plan. Approve constrained design?",
      },
      {
        userSays: "MCP for fleet scan status only",
        goodResponse:
          "Single tool fleet_scan_summary → cached care signals JSON. No network egress beyond local DNA. Plan ready.",
      },
    ],
    workflow: ["ship-feature", "security-audit", "quality-gate"],
  },
  {
    id: "implement-i18n",
    name: "Implement i18n",
    category: "features",
    slash: "implement-i18n",
    summary: "Add locales, RTL, and copy — locale routing, translation files, fallback locale.",
    tags: ["features", "i18n", "l10n", "rtl", "locales"],
    copyVariants: [
      "Add i18n with English and Thai",
      "Implement RTL and locale routing",
      "Localise UI copy for this app",
    ],
    prompt: `# Implement i18n

Scope: $ARGUMENTS

${EVIDENCE}

## Loads

- Neural intent \`implement_multilingual\`
- \`.DNA/knowledge/languages/stem-bridge/\`
- Existing framework i18n in-repo

## Checklist

- [ ] Locales + fallback
- [ ] Routing strategy (path / domain / cookie) matching stack
- [ ] Message file layout + missing-key policy
- [ ] RTL: \`dir\` + layout for RTL locales
- [ ] Extract hard-coded strings; preserve technical terms
- [ ] Tests: switch, fallback, RTL smoke
- [ ] Plan → **STOP** → implement → quality → optional \`a11y-audit\`

## Artifacts

| Artifact | Path |
|----------|------|
| i18n plan | \`.DNA/plans/i18n.md\` |
| Feature request | \`ai/feature-request.md\` |
| Locale files | Per stack (e.g. \`locales/\`, \`messages/\`) — listed in plan |

## Failure modes

| Mode | Response |
|------|----------|
| No i18n lib chosen | Prefer existing stack convention; otherwise recommend one with rationale |
| Partial strings | Phase 1 critical paths; backlog remainder |
| RTL ignored for ar/he/fa | Block ship of those locales until RTL plan exists |

${FAILURE_COMMON}`,
    guidelines: FEATURE_GATES,
    expectations: [
      "Locale list + fallback defined",
      "RTL plan when any RTL locale in scope",
      "Message layout + key conventions",
      "Plan artifact written",
      "Tests for switch + fallback when implementing",
    ],
    contextLoads: [
      ".DNA/knowledge/languages/stem-bridge/positioning.dna.md",
      ".DNA/knowledge/languages/stem-bridge/documentation.dna.md",
      ".DNA/knowledge/languages/stem-bridge/outbound.dna.md",
      "ai/agent-loop.md",
      "ai/feature-request.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna quality report --feature"],
    examples: [
      {
        userSays: "Support en and ar with RTL",
        goodResponse:
          "Plan: existing i18n lib or next-intl; locales en/ar; fallback en; dir=rtl for ar; extract nav+settings. Wrote i18n.md. Approve?",
      },
      {
        userSays: "Thai + English for Lab only",
        goodResponse:
          "Scope Lab surfaces only. Fallback en. No RTL. Message files under lab locales. Phased string extract. Approve?",
      },
      {
        userSays: "Just translate the README",
        goodResponse:
          "That's docs localisation (translate_documentation intent), not app i18n. Offer stem-bridge docs path — or expand to UI if you meant product strings.",
      },
    ],
    workflow: ["plan-feature", "ship-feature", "a11y-audit", "quality-gate"],
  },

  // ─── Analysis ────────────────────────────────────────────────────────────
  {
    id: "plan-fleet-scan",
    name: "Plan fleet scan",
    category: "analysis",
    slash: "plan-fleet-scan",
    summary: "Plan multi-project scan with cache, care signals, and kit/DNA health across a portfolio.",
    tags: ["analysis", "fleet", "scan", "portfolio", "health"],
    copyVariants: [
      "Plan a fleet scan across all products",
      "Multi-project DNA health and care signals",
      "Scan the portfolio with cache and kit status",
    ],
    prompt: `# Plan fleet scan

Scope: $ARGUMENTS

${EVIDENCE}

## Intent

Multi-project (portfolio / parent-folder) scan — not a single-repo \`dna scan\`.

## Checklist

- [ ] Inventory projects (paths, DNA present?)
- [ ] Cache strategy (what, TTL, invalidation)
- [ ] Care signals: blockers, drift, runtime fingerprints, stale Impressions
- [ ] Kit / DNA health: doctor gaps, pack versions, workbench currency
- [ ] Roll-up summary + per-project P1
- [ ] Prioritized next repair target
- [ ] Plan vs execute: plan by default; execute only if user asks

## Commands (per project / root)

\`\`\`bash
npx dna scan
npx dna doctor
npx dna analyze
npx dna platform projects
\`\`\`

## Artifacts

| Artifact | Path |
|----------|------|
| Fleet plan / report | \`.DNA/plans/fleet-scan.md\` or \`.DNA/reports/fleet-scan.md\` |
| Care roll-up | Table inside report |

## Failure modes

| Mode | Response |
|------|----------|
| Single repo only | Say so; still emit mini fleet of 1 + cache notes |
| No platform API | Fall back to directory walk for \`.DNA/\` |
| Stale cache | Document TTL; offer force refresh |

${FAILURE_COMMON}`,
    guidelines: DAY_GROUND,
    expectations: [
      "Project inventory with DNA presence",
      "Cache strategy documented",
      "Care signals ranked",
      "Kit/DNA health summary",
      "Report artifact path",
      "Prioritized next project",
    ],
    contextLoads: [
      ".DNA/CellularMemory/parietalLobe/system-map.md",
      ".DNA/CellularMemory/amygdala/blockers.md",
      ".DNA/CellularMemory/amygdala/repeated-failures.md",
      ".DNA/config.dna.json",
    ],
    cliCommands: ["npx dna scan", "npx dna doctor", "npx dna analyze", "npx dna platform projects"],
    examples: [
      {
        userSays: "Scan all products under this folder for DNA health",
        goodResponse:
          "4 apps with .DNA/. Care: 2 doctor gaps, 1 open blocker. Cache 1h. Recommend the highest-risk lab first. Wrote fleet-scan.md. Execute scans?",
      },
      {
        userSays: "Fleet care signals only — no full analyze",
        goodResponse:
          "Scoped: doctor + blockers + runtime fingerprints. Skipped deep analyze. Roll-up in fleet-scan.md. P1: Skeletor runtime fingerprint X.",
      },
      {
        userSays: "This is just one repo",
        goodResponse:
          "Fleet of 1. Still documented cache + care template for when siblings appear. Mini report written.",
      },
    ],
    workflow: ["health-check", "analyze-project", "ai-repair", "incident-postmortem"],
  },

  // ─── Delivery ────────────────────────────────────────────────────────────
  {
    id: "ship-tauri-release",
    name: "Ship Tauri release",
    category: "delivery",
    slash: "ship-tauri-release",
    summary: "Desktop packaging, notarization, auto-update, and signed builds for Tauri apps.",
    tags: ["delivery", "tauri", "desktop", "release", "signing"],
    copyVariants: [
      "Ship a signed Tauri release",
      "Package desktop app with notarization and auto-update",
      "Prepare Tauri release builds",
    ],
    prompt: `# Ship Tauri release

Scope: $ARGUMENTS

${EVIDENCE}

## Preconditions

Confirm Tauri / desktop surface exists. If missing — **stop**.

Load desktop-cross-platform + any tauri packs present.

## Checklist

- [ ] Version bump (app + Tauri config) consistent
- [ ] Targets: macOS / Windows / Linux as requested
- [ ] Signing identity present (never print secrets)
- [ ] macOS notarize + staple when shipping macOS
- [ ] Auto-update: endpoint, signature, channel
- [ ] Smoke: cold start, updater check, critical path
- [ ] Notes: hand off \`write-release-notes\`

## Artifacts

| Artifact | Path |
|----------|------|
| Release matrix | \`.DNA/plans/tauri-release.md\` or \`.DNA/reports/tauri-release.md\` |
| Release notes | via \`write-release-notes\` |

## Failure modes

| Mode | Response |
|------|----------|
| No Tauri project | Stop; do not invent desktop packaging |
| Missing certs | List required secrets by name only; block signed ship |
| Updater unsigned | Block auto-update enablement |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      must: [
        ...DAY_GROUND.must,
        "Never commit or echo signing certificates, API keys, or notarization credentials",
        "Verify Tauri project exists before running package commands",
        "Fill release matrix OS × signed × notarized × updater",
      ],
      never: [
        ...DAY_GROUND.never,
        "Ship unsigned production builds when signing is required",
        "Skip updater signature verification when auto-update is enabled",
      ],
    },
    expectations: [
      "Tauri presence confirmed or stop",
      "Version bump plan",
      "Per-OS build/sign/notarize status",
      "Auto-update channel notes",
      "Smoke checklist results",
      "Release matrix artifact",
    ],
    contextLoads: [
      ".DNA/knowledge/platforms/desktop-cross-platform/positioning.dna.md",
      "DNA/Impressions/release-notes/",
      ".DNA/behaviour/delivery.behaviour.md",
      "CHANGELOG.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna quality report --feature"],
    examples: [
      {
        userSays: "Ship Skeletor desktop 1.2.0 signed with auto-update",
        goodResponse:
          "Tauri present. 1.2.0 set. macOS signed+notarized; Windows signed; updater stable. Matrix in tauri-release.md. Release notes next?",
      },
      {
        userSays: "Unsigned local smoke build only",
        goodResponse:
          "Dev/smoke path: unsigned debug build, updater off. Documented as non-production in matrix. OK to proceed.",
      },
      {
        userSays: "Ship but we have no Apple notarization credentials",
        goodResponse:
          "Blocked macOS production ship. Windows/Linux can proceed if requested. Listed env vars needed (names only). Matrix marked notarize=blocked.",
      },
    ],
    workflow: ["write-release-notes", "quality-gate", "create-pr"],
  },
  {
    id: "create-pr",
    name: "Create pull request",
    category: "delivery",
    slash: "create-pr",
    summary: "Summarize the branch, draft a test plan, and open a PR with gh pr create.",
    tags: ["delivery", "github", "pr", "review"],
    copyVariants: [
      "Open a PR for this branch",
      "Create a pull request with a test plan",
      "Draft PR summary from our commits",
    ],
    prompt: `# Create pull request

Scope: $ARGUMENTS

${EVIDENCE}

## Gather (parallel)

\`\`\`bash
git status
git diff
git diff <base>...HEAD
git log <base>..HEAD --oneline
\`\`\`

Base: main/master (detect). Push \`-u\` if needed. Neural intent: \`create_pr\`.

## Checklist

- [ ] All commits since base reflected in summary (not tip-only)
- [ ] No secrets in diff or PR body
- [ ] Summary 1–3 bullets (why)
- [ ] Test plan checklist
- [ ] \`gh pr create\` → return URL

## Artifacts

| Artifact | Path |
|----------|------|
| PR | GitHub PR URL |
| Optional body draft | \`.DNA/plans/pr-body.md\` if review-before-create requested |

## Failure modes

| Mode | Response |
|------|----------|
| Nothing to push | Report clean/empty; do not open empty PR |
| gh auth missing | Instruct \`dna github login\` / \`gh auth login\` — do not invent token |
| Protected branch force needed | Refuse force-push main/master |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      must: [
        ...DAY_GROUND.must,
        "Include ALL commits since divergence from base in the summary",
        "Push the branch before creating the PR when remote is missing or behind",
        "Include a test plan checklist in the PR body",
      ],
      never: [
        ...DAY_GROUND.never,
        "Force-push main/master",
        "Open a PR with empty summary or no test plan",
        "Paste secrets or .env contents into the PR",
      ],
    },
    expectations: [
      "Branch pushed if needed",
      "PR URL returned",
      "Summary covers full branch diff",
      "Test plan checklist included",
      "Secret scan of diff clean",
    ],
    contextLoads: [
      ".DNA/CellularMemory/hippocampus/recent-changes.md",
      "DNA/Impressions/release-notes/initial-release-notes.md",
      "CHANGELOG.md",
    ],
    cliCommands: ["gh pr create", "git log", "git diff", "gh auth status"],
    examples: [
      {
        userSays: "Create a PR for the fleet scan stems",
        goodResponse:
          "Pushed feat/day-to-day-stems. PR #412 — summary covers 3 commits + test plan (vitest stems, workbench install). URL: …",
      },
      {
        userSays: "PR but don't push yet — draft only",
        goodResponse:
          "Wrote .DNA/plans/pr-body.md with summary + test plan. No gh create until you say push.",
      },
      {
        userSays: "Open PR to main with our local WIP including .env",
        goodResponse:
          "Blocked: .env in diff. Unstage secrets first. Draft summary ready without secrets.",
      },
    ],
    workflow: ["pre-push-review", "quality-gate"],
  },
  {
    id: "ship-preview",
    name: "Ship preview",
    category: "delivery",
    slash: "ship-preview",
    summary: "Quality → docker → preview push — lighter close-out than full ship-feature.",
    tags: ["delivery", "preview", "ci", "push"],
    copyVariants: [
      "Push this to preview",
      "Quality gate then preview deploy",
      "Ship a preview build without full feature factory",
    ],
    prompt: `# Ship preview

Scope: $ARGUMENTS

Use when work is **already implemented** and needs preview — not a substitute for \`ship-feature\` when building new scope.

${EVIDENCE}

## Close-out (order)

1. \`npx dna quality report --feature\` — PASS
2. \`npx dna docker build\` — success when Dockerfile present
3. Push **preview / feature branch** (CI deploys preview)

\`\`\`bash
npx dna quality report --feature
npx dna docker build
npx dna github push --message "[ProjectTag] chore: preview <summary>"
\`\`\`

## Checklist

- [ ] Quality PASS (report path noted)
- [ ] Docker status
- [ ] Branch pushed (not force main)
- [ ] CI/preview URL if available
- [ ] No unplanned feature factory

## Artifacts

| Artifact | Path |
|----------|------|
| Quality report | \`.DNA/reports/quality/\` (latest feature report) |
| Push notes | Branch URL + CI link in reply |

## Failure modes

| Mode | Response |
|------|----------|
| Quality FAIL | Fix or stop — never "just push" |
| No Dockerfile | Skip docker with explicit note |
| User asks for new feature mid-flight | Redirect to \`ship-feature\` |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      must: [
        ...DAY_GROUND.must,
        "Quality PASS before push",
        "Push preview/feature branch — never force-push main/master",
        "Report quality path + docker + branch URL",
      ],
      never: [
        ...DAY_GROUND.never,
        "Skip quality gate to get it on preview",
        "Treat ship-preview as approval to implement unplanned features",
      ],
    },
    expectations: [
      "Quality PASS with report path",
      "Docker build status (or skip reason)",
      "Preview branch pushed",
      "CI/preview URL if available",
    ],
    contextLoads: [
      ".DNA/behaviour/testing.behaviour.md",
      ".DNA/hooks/pre-push",
      ".github/workflows/dna-preview.yml",
    ],
    cliCommands: [
      "npx dna quality report --feature",
      "npx dna docker build",
      "npx dna github push",
    ],
    examples: [
      {
        userSays: "Get this Lab CSS fix on preview",
        goodResponse: "Quality PASS (.DNA/reports/quality/…). Docker OK. Pushed preview/lab-mobile. CI running.",
      },
      {
        userSays: "Preview even though quality failed",
        goodResponse: "Refused. 2 blockers in quality report. Fix first or explicitly override — not default.",
      },
      {
        userSays: "Also add a new billing page while previewing",
        goodResponse: "Out of scope for ship-preview. Use /ship-feature for billing. Preview push stays CSS-only.",
      },
    ],
    workflow: ["quality-gate", "docker-build", "github-push"],
  },

  // ─── Quality ─────────────────────────────────────────────────────────────
  {
    id: "a11y-audit",
    name: "Accessibility audit",
    category: "quality",
    slash: "a11y-audit",
    summary: "Audit keyboard access, labels, contrast, and prefers-reduced-motion.",
    tags: ["quality", "a11y", "accessibility", "ux"],
    copyVariants: [
      "Run an a11y audit on the dashboard",
      "Check keyboard and contrast for Lab",
      "Audit reduced-motion and labels",
    ],
    prompt: `# Accessibility audit

Scope: $ARGUMENTS

${EVIDENCE}

## Checklist

- [ ] **Keyboard** — reachable controls, visible focus, no traps
- [ ] **Labels** — accessible names; icons not nameless
- [ ] **Contrast** — WCAG AA where feasible
- [ ] **Motion** — \`prefers-reduced-motion\`
- [ ] **Semantics** — headings, landmarks, live regions
- [ ] Tooling: axe / jsx-a11y / Playwright a11y when present

## Artifacts

| Artifact | Path |
|----------|------|
| A11y report | \`.DNA/reports/a11y-audit.md\` or \`DNA/Impressions/qa/a11y-audit.md\` |

Findings ranked: blocker / major / minor — each with path + fix hint.

## Failure modes

| Mode | Response |
|------|----------|
| No UI in scope | Stop; ask for route/surface |
| Can't run axe | Manual checklist still required; label tooling gap |
| Contrast subjective | Cite token/CSS values; mark assumption if unmeasured |

${FAILURE_COMMON}

Hand off remediations to \`ship-feature\`.`,
    guidelines: DAY_GROUND,
    expectations: [
      "All four pillars covered (keyboard, labels, contrast, motion)",
      "Findings ranked with file paths",
      "Report artifact written",
      "Remediation handoff noted",
    ],
    contextLoads: [
      ".DNA/CellularMemory/occipitalLobe/ui-patterns.md",
      ".DNA/knowledge/disciplines/design-systems/",
      ".DNA/behaviour/testing.behaviour.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna quality scan --feature"],
    examples: [
      {
        userSays: "A11y pass on /labs",
        goodResponse:
          "3 majors: menu button name, focus trap in drawer, motion not reduced. Wrote a11y-audit.md. Fix via ship-feature?",
      },
      {
        userSays: "Only keyboard for Settings",
        goodResponse:
          "Scoped keyboard: 1 trap in modal, 2 controls not tabbable. Still noted labels/contrast as not run. Report updated.",
      },
      {
        userSays: "We're fine — skip reduced motion",
        goodResponse:
          "Motion is in-scope for this stem. Found CSS transitions without prefers-reduced-motion on Lab refresh spinner. Logged as major.",
      },
    ],
    workflow: ["ship-feature", "visual-qa-pass", "quality-gate"],
  },
  {
    id: "perf-audit",
    name: "Performance audit",
    category: "quality",
    slash: "perf-audit",
    summary: "Core Web Vitals, Tauri cold start, and scan/jank budgets.",
    tags: ["quality", "performance", "cwv", "tauri", "jank"],
    copyVariants: [
      "Audit Core Web Vitals for the dashboard",
      "Check Tauri cold start and jank",
      "Perf budget for fleet scan UI",
    ],
    prompt: `# Performance audit

Scope: $ARGUMENTS

${EVIDENCE}

## Surfaces (as applicable)

1. **Web** — LCP, INP, CLS; bundle; waterfalls
2. **Tauri** — cold start → interactive; window show; updater cost
3. **Scan / Lab** — jank for large tables, scan loops, charts

## Checklist

- [ ] Budget table: metric → target → observed → status
- [ ] Measurement method named (Lighthouse, bench, Instruments, Performance panel)
- [ ] Unmeasured rows labeled **assumption**
- [ ] Top 3 fixes by impact
- [ ] Artifact written

## Artifacts

| Artifact | Path |
|----------|------|
| Perf report | \`.DNA/reports/perf-audit.md\` or \`DNA/Impressions/qa/perf-audit.md\` |

## Failure modes

| Mode | Response |
|------|----------|
| No tooling | Qualitative jank notes + assumed budgets; do not invent Lighthouse scores |
| Tauri absent | Skip desktop rows; note N/A |
| Micro-optimizations only | Prefer architectural fixes tied to evidence |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      never: [
        ...DAY_GROUND.never,
        "Invent numeric CWV scores without measurement or clear assumption labels",
      ],
      must: [
        ...DAY_GROUND.must,
        "Produce a budget table for every in-scope surface",
        "Label unmeasured metrics as assumptions",
      ],
    },
    expectations: [
      "Budget table for relevant surfaces",
      "Measurement method stated",
      "Top fixes ranked",
      "Report artifact written",
      "Handoff to ship-feature for remediations",
    ],
    contextLoads: [
      ".DNA/CellularMemory/parietalLobe/system-map.md",
      "DNA/Impressions/architecture/solution-architecture.md",
      ".DNA/behaviour/testing.behaviour.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Is Lab janky on large runtime tables?",
        goodResponse:
          "Budget table paint <100ms. No virtualization → jank ~5k rows (observed DevTools). Fix: windowing. Wrote perf-audit.md. Ship-feature?",
      },
      {
        userSays: "Tauri cold start budget",
        goodResponse:
          "Target <2s to interactive. Observed ~2.8s (assumption: local debug). Culprit: eager plugin init. Ranked fixes in report.",
      },
      {
        userSays: "Lighthouse 100 everything",
        goodResponse:
          "No run yet — will not claim 100. Scheduled Lighthouse on Dashboard; until then rows marked assumption.",
      },
    ],
    workflow: ["ship-feature", "quality-gate"],
  },
  {
    id: "security-patch-deps",
    name: "Security patch dependencies",
    category: "quality",
    slash: "security-patch-deps",
    summary: "OWASP/dependency audit triage with minimal safe upgrades.",
    tags: ["quality", "security", "owasp", "dependencies"],
    copyVariants: [
      "Triage npm audit and patch safely",
      "OWASP dependency audit — minimal upgrades",
      "Fix high vulnerabilities with smallest bumps",
    ],
    prompt: `# Security patch dependencies

Scope: $ARGUMENTS

${EVIDENCE}

## Checklist

- [ ] Run audit (pnpm/npm audit, DNA OWASP gate, CI security workflow)
- [ ] Triage critical/high first; document ignored noise
- [ ] Minimal upgrades — smallest remediating version; prefer lockfile-only
- [ ] Breakage: typecheck/tests for touched packages
- [ ] Before/after advisory table
- [ ] Hand off \`create-pr\` when done

## Artifacts

| Artifact | Path |
|----------|------|
| Triage report | \`.DNA/reports/security-deps.md\` |
| Lockfile / package bumps | As applied |

## Failure modes

| Mode | Response |
|------|----------|
| Only major bump fixes | Stop for approval before majors |
| Dev-only advisory | Downgrade severity with rationale |
| Audit tool unavailable | Use CI logs / lockfile review; state gap |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      must: [
        ...DAY_GROUND.must,
        "Prefer minimal version bumps that clear the advisory",
        "Re-run tests after lockfile changes",
        "Write triage report with before/after",
      ],
      never: [
        ...DAY_GROUND.never,
        "Major-bump the whole monorepo to clear one advisory without user approval",
        "Dismiss high/critical findings without documented acceptance",
      ],
    },
    expectations: [
      "Advisory triage table",
      "Minimal upgrade set applied or proposed",
      "Test results after changes",
      "Remaining accepted risks listed",
      "Report artifact written",
    ],
    contextLoads: [
      ".DNA/behaviour/security.behaviour.md",
      ".github/workflows/",
      "package.json",
      "pnpm-lock.yaml",
    ],
    cliCommands: ["pnpm audit", "npx dna quality report --feature", "npx dna analyze"],
    examples: [
      {
        userSays: "CI failed OWASP high on lodash",
        goodResponse:
          "1 high via transitive lodash. Bumped parent to patched range. Audit clean. Tests pass. Wrote security-deps.md. Create PR?",
      },
      {
        userSays: "Upgrade everything to latest",
        goodResponse:
          "Out of scope — this stem is minimal safe upgrades. Triaged 3 highs only. Broad upgrade needs explicit approval.",
      },
      {
        userSays: "Accept the high for now",
        goodResponse:
          "Documented accepted risk in security-deps.md with owner + revisit date. No lockfile change. Confirm?",
      },
    ],
    workflow: ["security-audit", "quality-gate", "create-pr"],
  },
  {
    id: "visual-qa-pass",
    name: "Visual QA pass",
    category: "quality",
    slash: "visual-qa-pass",
    summary: "Screenshot/layout consistency across Dashboard, Lab, and Settings.",
    tags: ["quality", "visual", "qa", "ui", "regression"],
    copyVariants: [
      "Visual QA across Dashboard Lab Settings",
      "Check layout consistency on main shells",
      "Screenshot pass for the three primary surfaces",
    ],
    prompt: `# Visual QA pass

Scope: $ARGUMENTS

${EVIDENCE}

## Surfaces (default — adapt to repo)

1. Dashboard / home shell
2. Lab (\`/labs\` or \`dna lab serve\`)
3. Settings

## Checklist

- [ ] Spacing / typography / density consistency
- [ ] Responsive breakpoints (mobile chrome)
- [ ] Empty / loading / error states
- [ ] Dark/light if both exist
- [ ] No overlap/clip
- [ ] Screenshots or Playwright captures when tooling exists

## Artifacts

| Artifact | Path |
|----------|------|
| Visual QA report | \`.DNA/reports/visual-qa.md\` or \`DNA/Impressions/qa/visual-qa.md\` |
| Screenshots | \`.DNA/reports/visual-qa/\` (if captured) |

## Failure modes

| Mode | Response |
|------|----------|
| Surface missing | N/A row; do not invent UI |
| No screenshot tool | Structured manual notes still required |
| Brand-new design asked | Out of scope — consistency pass only |

${FAILURE_COMMON}`,
    guidelines: DAY_GROUND,
    expectations: [
      "Per-surface pass/fail notes",
      "Cross-surface inconsistencies listed",
      "Mobile/desktop called out when relevant",
      "Report artifact written",
      "Remediation handoff",
    ],
    contextLoads: [
      ".DNA/CellularMemory/occipitalLobe/ui-patterns.md",
      "DNA/Impressions/architecture/solution-architecture.md",
    ],
    cliCommands: ["npx dna lab serve --port 3200", "npx dna analyze"],
    examples: [
      {
        userSays: "Visual pass before release",
        goodResponse:
          "Dashboard OK. Lab header actions wrap inconsistently vs Settings. Wrote visual-qa.md. Fix Lab header?",
      },
      {
        userSays: "Mobile only for Lab",
        goodResponse:
          "≤900px: hamburger OK; table horizontal scroll OK; page actions wrap issue. Desktop N/A this run. Report updated.",
      },
      {
        userSays: "Redesign Settings while you're at it",
        goodResponse:
          "Out of scope for visual-qa-pass. Logged consistency findings only. Use ship-feature for redesign.",
      },
    ],
    workflow: ["a11y-audit", "ship-feature", "quality-gate"],
  },

  // ─── Debug ───────────────────────────────────────────────────────────────
  {
    id: "incident-postmortem",
    name: "Incident postmortem",
    category: "debug",
    slash: "incident-postmortem",
    summary: "Runtime fingerprint → root cause → fix → regression test → push.",
    tags: ["debug", "incident", "postmortem", "runtime", "repair"],
    copyVariants: [
      "Postmortem this production error",
      "Runtime fingerprint to fix and regression",
      "Close the incident with root cause and push",
    ],
    prompt: `# Incident postmortem

Incident / symptom: $ARGUMENTS

${EVIDENCE}

## Loop (mandatory)

1. **Observe** — \`.DNA/data/runtime.db\`, Lab, CI, recent changes
2. **Orient** — blast radius; load blockers + repeated-failures + previous-solutions
3. **Root cause** — falsifiable hypothesis; fix cause not symptoms
4. **Regression** — test that fails without the fix
5. **Quality** — \`npx dna quality report --feature\` PASS
6. **Push** — preview/feature branch; never auto-merge AI repair PRs
7. **Write-up** — timeline, impact, cause, fix, follow-ups

\`\`\`bash
npx dna lab serve --port 3200
npx dna ai repair --dry-run
npx dna quality report --feature
\`\`\`

## Checklist

- [ ] Fingerprint / issue linked (dedupe — comment on existing)
- [ ] Root cause stated with evidence
- [ ] Fix + regression test
- [ ] Quality PASS
- [ ] Push
- [ ] Postmortem artifact

## Artifacts

| Artifact | Path |
|----------|------|
| Postmortem | \`.DNA/reports/incidents/<fingerprint-or-date>.md\` or \`DNA/Impressions/qa/incident-postmortem.md\` |
| CellularMemory | Update \`temporalLobe/previous-solutions.md\` / amygdala as appropriate |

## Failure modes

| Mode | Response |
|------|----------|
| Cannot reproduce | Document attempts; do not fake root cause |
| Duplicate issue | Comment on existing; do not open second |
| Gateway 502/503/504 | Check origin/deploy/health — not only app try/catch |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      must: [
        ...DAY_GROUND.must,
        "Load amygdala/repeated-failures and temporalLobe/previous-solutions before fixing",
        "Add or update a regression test for the root cause",
        "Write postmortem artifact with timeline and follow-ups",
      ],
      never: [
        ...DAY_GROUND.never,
        "Create duplicate GitHub issues for the same fingerprint",
        "Auto-merge AI repair PRs",
        "Patch only the UI message while leaving the failing path broken",
      ],
    },
    expectations: [
      "Fingerprint / issue linked",
      "Root cause with evidence",
      "Fix + regression test",
      "Quality PASS + push",
      "Postmortem artifact path",
    ],
    contextLoads: [
      ".DNA/behaviour/reasoning.behaviour.md",
      ".DNA/CellularMemory/amygdala/blockers.md",
      ".DNA/CellularMemory/amygdala/repeated-failures.md",
      ".DNA/CellularMemory/temporalLobe/previous-solutions.md",
      ".DNA/CellularMemory/hippocampus/recent-changes.md",
    ],
    cliCommands: [
      "npx dna lab serve --port 3200",
      "npx dna ai repair",
      "npx dna quality report --feature",
      "npx dna github push",
    ],
    examples: [
      {
        userSays: "502s on /api/admin/users since yesterday",
        goodResponse:
          "Fingerprint matches #88. Cause: requireAdmin NPE on missing session. Fix + test. Quality PASS. Pushed preview. Postmortem at .DNA/reports/incidents/….md.",
      },
      {
        userSays: "Same error as last week",
        goodResponse:
          "Matched repeated-failures.md entry. Reopened pattern — fix was incomplete. Extended regression. Commented on existing issue #88 — no duplicate.",
      },
      {
        userSays: "Just silence the toast",
        goodResponse:
          "Refused symptom-only patch. Root cause still 502 from origin. Investigating /health + deploy config per gateway guidance.",
      },
    ],
    workflow: ["debug-issue", "ai-repair", "quality-gate", "ship-preview"],
  },

  // ─── Docs ────────────────────────────────────────────────────────────────
  {
    id: "write-release-notes",
    name: "Write release notes",
    category: "docs",
    slash: "write-release-notes",
    summary: "User-facing changelog from commits and Impressions — not raw commit dumps.",
    tags: ["docs", "release", "changelog", "impressions"],
    copyVariants: [
      "Write release notes for 1.2.0",
      "Draft user-facing changelog from commits",
      "Release notes from Impressions and git log",
    ],
    prompt: `# Write release notes

Version / scope: $ARGUMENTS

${EVIDENCE}

## Sources

1. \`git log\` / tags since previous release
2. \`CHANGELOG.md\` Unreleased
3. \`DNA/Impressions/release-notes/\` + product Impressions (skip stubs)
4. Shipped roadmap rows when relevant

## Checklist

- [ ] Version / range stated
- [ ] Sections: New / Improved / Fixed / Security (omit empty)
- [ ] Plain language — no internal stem IDs unless user-facing
- [ ] Breaking changes + migration
- [ ] Update CHANGELOG and/or Impressions release notes

## Artifacts

| Artifact | Path |
|----------|------|
| User-facing notes | \`DNA/Impressions/release-notes/<version>.md\` |
| Changelog | \`CHANGELOG.md\` (Unreleased or version section) |

## Failure modes

| Mode | Response |
|------|----------|
| Empty commit range | Say so; do not invent features |
| Stub Impressions only | Ground in git log + CHANGELOG |
| Internal-only commits | Fold into user benefit or omit |

${FAILURE_COMMON}`,
    guidelines: {
      ...DAY_GROUND,
      must: [
        ...DAY_GROUND.must,
        "Prefer user impact over implementation detail",
        "Call out breaking changes explicitly",
        "Write notes artifact to Impressions and/or CHANGELOG",
      ],
      never: [
        ...DAY_GROUND.never,
        "Paste raw conventional-commit lists as the only release notes",
        "Invent features that are not in commits or Impressions",
      ],
    },
    expectations: [
      "Grouped user-facing sections",
      "Version / range stated",
      "Breaking changes called out",
      "CHANGELOG and/or Impressions updated",
    ],
    contextLoads: [
      "CHANGELOG.md",
      "DNA/Impressions/release-notes/",
      "DNA/Impressions/product/product-overview.md",
      "README.md",
    ],
    cliCommands: ["git log", "git tag", "npx dna document --from-code"],
    examples: [
      {
        userSays: "Notes for 0.5.0",
        goodResponse:
          "### New — 15 day-to-day stems… ### Fixed — … Wrote Impressions/release-notes/0.5.0.md and moved CHANGELOG Unreleased → 0.5.0.",
      },
      {
        userSays: "Just dump git log",
        goodResponse:
          "Refused raw dump. Grouped 14 commits into New/Fixed for users. Draft in release-notes/unreleased.md — review?",
      },
      {
        userSays: "Notes but Impressions release file is stub",
        goodResponse:
          "STUB ignored. Grounded in git log + CHANGELOG only. Replaced stub with real 0.5.0 notes.",
      },
    ],
    workflow: ["sync-impressions", "create-pr", "ship-tauri-release"],
  },
];
