# DNA intelligence — Cursor commands

**dna-by-humaan** — 127 prompt stem packs (bundled catalog v9) + 48 `/dna-*` CLI commands.

## Prompt stems (`.DNA/stems/<id>/`)

Each stem: **prompt + guidelines + expectations + context + examples**.

| Slash | Stem |
|-------|------|
| `/work-with-dna` | Work with DNA |
| `/load-context` | Load context |
| `/health-check` | Health check |
| `/dna-update` | Keep DNA current |
| `/analyze-project` | Analyze project |
| `/what-next` | What next after analyze? |
| `/scan-project` | Scan project |
| `/stack-hosting` | Stack & hosting |
| `/recommend-stack` | Recommend architecture |
| `/security-audit` | Security audit |
| `/ship-feature` | Ship a feature |
| `/plan-feature` | Plan feature |
| `/plan-rbac` | Plan RBAC |
| `/generate-feature` | Generate feature scaffold |
| `/platform-codegen` | Platform codegen |
| `/quality-gate` | Quality gate |
| `/quality-scan` | Quality scan |
| `/pre-push-review` | Pre-push review |
| `/plan-compliance` | Plan compliance |
| `/compliance-documents` | Compliance documents |
| `/gdpr-engineering` | GDPR engineering checklist |
| `/plan-legal` | Plan legal |
| `/legal-advise` | Legal advise |
| `/legal-list` | Legal catalog |
| `/legal-engineering` | Legal engineering checklist |
| `/debug-issue` | Debug issue |
| `/ai-repair` | AI repair |
| `/runtime-investigate` | Runtime investigate |
| `/dashboard-monitor` | Dashboard monitor |
| `/sync-impressions` | Sync Impressions |
| `/drift-pr` | Impressions drift PR |
| `/document-code` | Document from code |
| `/plan-ivf` | Plan IVF |
| `/ivf-run` | Run IVF |
| `/ivf-shared-library` | IVF shared library |
| `/ivf-execute` | IVF shared library execute |
| `/docker-build` | Docker build |
| `/github-push` | GitHub push |
| `/ci-install` | CI install |
| `/marketplace-search` | Marketplace search |
| `/marketplace-install` | Marketplace install |
| `/memory-export` | Memory export |
| `/memory-import` | Memory import |
| `/memory-sync` | Memory sync |
| `/product-analyst` | Product Analyst |
| `/solution-architect` | Solution Architect |
| `/backend-engineer` | Backend Engineer |
| `/frontend-engineer` | Frontend Engineer |
| `/ux-reviewer` | UX Reviewer |
| `/qa-engineer` | QA Engineer |
| `/code-quality` | Code Quality Analyst |
| `/refactor-reviewer` | Refactor Reviewer |
| `/final-release` | Final Release Reviewer |
| `/agent-loop` | Run full agent loop |
| `/methodology-setup` | Methodology setup |
| `/create-ticket` | Create ticket |
| `/write-spec` | Write spec |
| `/break-down-work` | Break down work |
| `/align-delivery` | Align delivery |
| `/discovery-setup` | Discovery setup |
| `/plan-research` | Plan research |
| `/synthesize-research` | Synthesize research |
| `/prioritize-opportunities` | Prioritize opportunities |
| `/pmf-check` | PMF check |
| `/handoff-to-engineering` | Handoff to engineering |
| `/strategy-ladder` | Strategy ladder |
| `/golden-circle` | Golden Circle |
| `/business-strategy-canvas` | Business strategy canvas |
| `/product-canvas` | Product canvas |
| `/define-initiative` | Define initiative |
| `/define-product` | Define product |
| `/shape-feature` | Shape feature |
| `/roadmap-now-next-later` | Roadmap Now / Next / Later |
| `/north-star-metric` | North Star metric |
| `/define-okrs` | Define OKRs |
| `/define-kpis` | Define KPIs |
| `/goal-cascade` | Goal cascade |
| `/product-diagnose` | Product diagnose |
| `/product-purpose-audit` | Product purpose audit |
| `/product-swot` | Product SWOT |
| `/product-value-proposition` | Product value proposition |
| `/product-kano-scan` | Product Kano scan |
| `/competitor-landscape` | Competitor landscape |
| `/competitor-feature-matrix` | Competitor feature matrix |
| `/competitor-positioning` | Competitor positioning |
| `/upgrade-leverage-map` | Upgrade leverage map |
| `/upgrade-modernization` | Upgrade modernization |
| `/upgrade-recommend` | Upgrade recommend |
| `/plan-admin-portal` | Plan admin portal |
| `/build-analytics-dashboard` | Build analytics dashboard |
| `/design-onboarding` | Design onboarding |
| `/plan-mcp-server` | Plan MCP server |
| `/implement-i18n` | Implement i18n |
| `/plan-fleet-scan` | Plan fleet scan |
| `/ship-tauri-release` | Ship Tauri release |
| `/create-pr` | Create pull request |
| `/ship-preview` | Ship preview |
| `/trunk-based-delivery` | Trunk-based delivery |
| `/a11y-audit` | Accessibility audit |
| `/perf-audit` | Performance audit |
| `/security-patch-deps` | Security patch dependencies |
| `/visual-qa-pass` | Visual QA pass |
| `/incident-postmortem` | Incident postmortem |
| `/write-release-notes` | Write release notes |
| `/expo-architect` | Expo architect |
| `/expo-workflow-decision` | Expo workflow decision |
| `/expo-bff` | Expo backend for frontend |
| `/expo-init` | Expo init |
| `/expo-router-navigation` | Expo Router navigation |
| `/expo-dynamic-builds` | Expo dynamic builds |
| `/expo-eas-build` | Expo EAS Build |
| `/expo-dev-client` | Expo dev client |
| `/expo-app-config` | Expo app config |
| `/expo-ios-ship` | Expo iOS ship |
| `/expo-ios-permissions` | Expo iOS permissions |
| `/expo-android-ship` | Expo Android ship |
| `/expo-android-permissions` | Expo Android permissions |
| `/expo-auth-secure` | Expo auth secure storage |
| `/expo-offline-sync` | Expo offline sync |
| `/expo-perf-mobile` | Expo mobile performance |
| `/expo-a11y-mobile` | Expo mobile accessibility |
| `/expo-testing-mobile` | Expo mobile testing |
| `/expo-notifications` | Expo push notifications |
| `/expo-deep-links` | Expo deep links |
| `/expo-store-submit` | Expo store submit |
| `/expo-ci-eas` | Expo CI EAS |
| `/expo-native-modules` | Expo native modules |

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

Skill: `.cursor/skills/dna-workbench/` · Rule: `.cursor/rules/dna-workbench.mdc`

## CLI slash commands (`/dna-*`)

Power-user wrappers for every `dna` subcommand — skill: `.cursor/skills/dna-cli/`, rule: `.cursor/rules/dna-cli-commands.mdc`.

Regenerate: `npx dna workbench install` or `npx dna commands install`

Remove workbench: `npx dna workbench uninstall` · Remove CLI commands: `npx dna commands uninstall`
