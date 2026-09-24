# DNA Prompt Stem Packs

**dna-by-humaan** — 133 prompt stem packs installed by DNA Workbench.

Each stem pack is a **copy-paste prompt** plus **guidelines, expectations, context, and examples** so the AI sticks to the workflow.

## Files in this stem pack

| File | Purpose |
|------|---------|
| `prompt.md` | Full agent prompt — copy-paste or slash command body |
| `guidelines.md` | MUST / NEVER / SHOULD — non-negotiable behaviour |
| `expectations.md` | Output format and definition of done |
| `context.md` | DNA files and CLI commands |
| `examples.md` | Sample exchanges |

## Baseline quality (required for every new stem)

- `prompt.md` includes **Checklist**, **Artifacts** (paths), and **Failure modes**
- Dense MUST / SHOULD / NEVER in `guidelines.md`
- **2–3** examples in `examples.md`
- See `stem-quality.ts` (`STEM_QUALITY_BASELINE`)

## Catalog

### session
- `work-with-dna` — Work with DNA
- `load-context` — Load context
- `health-check` — Health check
- `keep-dna-current` — Keep DNA current

### analysis
- `analyze-project` — Analyze project
- `what-next-after-analyze` — What next after analyze?
- `scan-project` — Scan project
- `stack-hosting` — Stack & hosting
- `recommend-architecture` — Recommend architecture
- `security-audit` — Security audit
- `plan-fleet-scan` — Plan fleet scan
- `expo-architect` — Expo architect
- `expo-workflow-decision` — Expo workflow decision
- `expo-native-modules` — Expo native modules

### features
- `ship-feature` — Ship a feature
- `plan-feature` — Plan feature
- `plan-rbac` — Plan RBAC
- `generate-feature` — Generate feature scaffold
- `platform-codegen` — Platform codegen
- `plan-admin-portal` — Plan admin portal
- `build-analytics-dashboard` — Build analytics dashboard
- `design-onboarding` — Design onboarding
- `plan-mcp-server` — Plan MCP server
- `implement-i18n` — Implement i18n
- `expo-bff` — Expo backend for frontend
- `expo-init` — Expo init
- `expo-router-navigation` — Expo Router navigation
- `expo-app-config` — Expo app config
- `expo-ios-permissions` — Expo iOS permissions
- `expo-android-permissions` — Expo Android permissions
- `expo-auth-secure` — Expo auth secure storage
- `expo-offline-sync` — Expo offline sync
- `expo-notifications` — Expo push notifications
- `expo-deep-links` — Expo deep links
- `governed-ai-fleet` — Governed AI fleet
- `companion-client` — Companion client

### quality
- `quality-gate` — Quality gate
- `quality-scan` — Quality scan
- `pre-push-review` — Pre-push review
- `a11y-audit` — Accessibility audit
- `perf-audit` — Performance audit
- `security-patch-deps` — Security patch dependencies
- `visual-qa-pass` — Visual QA pass
- `expo-perf-mobile` — Expo mobile performance
- `expo-a11y-mobile` — Expo mobile accessibility
- `expo-testing-mobile` — Expo mobile testing

### compliance
- `plan-compliance` — Plan compliance
- `compliance-documents` — Compliance documents
- `gdpr-engineering` — GDPR engineering checklist

### legal
- `plan-legal` — Plan legal
- `legal-advise` — Legal advise
- `legal-list` — Legal catalog
- `legal-engineering` — Legal engineering checklist

### debug
- `debug-issue` — Debug issue
- `ai-repair` — AI repair
- `runtime-investigate` — Runtime investigate
- `dashboard-monitor` — Dashboard monitor
- `incident-postmortem` — Incident postmortem

### docs
- `sync-impressions` — Sync Impressions
- `impressions-drift-pr` — Impressions drift PR
- `document-from-code` — Document from code
- `write-release-notes` — Write release notes
- `wiki` — Wiki

### ivf
- `plan-ivf` — Plan IVF
- `ivf-run` — Run IVF
- `ivf-shared-library` — IVF shared library
- `ivf-shared-library-execute` — IVF shared library execute

### delivery
- `docker-build` — Docker build
- `github-push` — GitHub push
- `ci-install` — CI install
- `ship-tauri-release` — Ship Tauri release
- `create-pr` — Create pull request
- `ship-preview` — Ship preview
- `trunk-based-delivery` — Trunk-based delivery
- `expo-dynamic-builds` — Expo dynamic builds
- `expo-eas-build` — Expo EAS Build
- `expo-dev-client` — Expo dev client
- `expo-ios-ship` — Expo iOS ship
- `expo-android-ship` — Expo Android ship
- `expo-store-submit` — Expo store submit
- `expo-ci-eas` — Expo CI EAS
- `ship-macos-menubar` — Ship macOS menu bar
- `macos-background-agent` — macOS background agent
- `publish-internal-app` — Publish internal app

### marketplace
- `marketplace-search` — Marketplace search
- `marketplace-install` — Marketplace install

### memory
- `memory-export` — Memory export
- `memory-import` — Memory import
- `memory-sync` — Memory sync

### agent-loop
- `role-product-analyst` — Product Analyst
- `role-solution-architect` — Solution Architect
- `role-backend-engineer` — Backend Engineer
- `role-frontend-engineer` — Frontend Engineer
- `role-ux-reviewer` — UX Reviewer
- `role-qa-engineer` — QA Engineer
- `role-code-quality` — Code Quality Analyst
- `role-refactor-reviewer` — Refactor Reviewer
- `role-final-release` — Final Release Reviewer
- `agent-loop-full` — Run full agent loop

### methodology
- `methodology-setup` — Methodology setup
- `create-ticket` — Create ticket
- `write-spec` — Write spec
- `break-down-work` — Break down work
- `align-delivery` — Align delivery

### discovery
- `discovery-setup` — Discovery setup
- `plan-research` — Plan research
- `synthesize-research` — Synthesize research
- `prioritize-opportunities` — Prioritize opportunities
- `pmf-check` — PMF check
- `handoff-to-engineering` — Handoff to engineering

### strategy
- `strategy-ladder` — Strategy ladder
- `golden-circle` — Golden Circle
- `business-strategy-canvas` — Business strategy canvas
- `product-canvas` — Product canvas
- `define-initiative` — Define initiative
- `define-product` — Define product
- `shape-feature` — Shape feature
- `roadmap-now-next-later` — Roadmap Now / Next / Later
- `north-star-metric` — North Star metric
- `define-okrs` — Define OKRs
- `define-kpis` — Define KPIs
- `goal-cascade` — Goal cascade
- `product-diagnose` — Product diagnose
- `product-purpose-audit` — Product purpose audit
- `product-swot` — Product SWOT
- `product-value-proposition` — Product value proposition
- `product-kano-scan` — Product Kano scan
- `competitor-landscape` — Competitor landscape
- `competitor-feature-matrix` — Competitor feature matrix
- `competitor-positioning` — Competitor positioning
- `upgrade-leverage-map` — Upgrade leverage map
- `upgrade-modernization` — Upgrade modernization
- `upgrade-recommend` — Upgrade recommend

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

Refresh: `npx dna workbench install` or `npx dna stems install`
