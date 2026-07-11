# Changelog

All notable changes to DNA are documented here.

## [Unreleased]

### Added

- **7 new prompt stem packs** (50 total) — `keep-dna-current` (`/dna-update`), `platform-codegen`, `ivf-shared-library-execute` (`/ivf-execute`), `impressions-drift-pr` (`/drift-pr`), `memory-sync`, `dashboard-monitor`, `stack-hosting`.
- **Stem pack refresh** — existing stems updated for v0.4.6–0.4.8 features: `scan --open-pr`, drift thresholds, `ivf shared-library --execute`, `memory sync` / `--on-conflict`, live dashboard feed, hosting-aware preview CI.
- **Install activation** — `dna init`, `dna doctor`, and `dna update` now install **workbench + stems + `/dna-*` CLI slash commands** (not stems-only). Intelligence catalog scenarios bumped to 10.

### Fixed

- **Workflow cleanup** — `cleanup-failed-runs.yml` sweeps all failed/cancelled runs (not just the triggering run) so backlog does not linger. Removed duplicate legacy `ci.yml` (DNA CI is canonical). DNA Preview now runs after DNA CI completes instead of in parallel on every push. Fixed invalid workflow YAML, added `pnpm/action-setup`, and expanded cleanup triggers.

## [0.4.8] - 2026-07-11

### Added

- **`@superhumaan/dna-feedback`** — upstream reporting package: sanitize secrets/paths, fingerprint dedup, offline queue (`.DNA/data/feedback-queue.jsonl`), POST to `https://dna.humaan.app/api/v1/feedback`.
- **`dna feedback`** — `report`, `sync`, `status`, and maintainer `ingest` commands.
- **`feedback` config block** — enabled by default on init/doctor; `autoReport: "dna-only"` filters to DNA-platform failures (CLI, doctor, `@superhumaan/*` stack frames).
- **Runtime auto-report** — DNA-platform runtime errors are reported upstream after local classification.
- **Maintainer ingest** — `dna feedback ingest` and `scripts/feedback-ingest.mjs` create deduped issues on `superhumaan/DNA` via `DNA_FEEDBACK_TOKEN` (fingerprint labels + `+1 occurrence` comments).
- **DNA platform classifier** (`dna-immune`) — `isDnaPlatformIssue()` separates DNA bugs from user app bugs.

### Fixed

- **Upstream defaults** — projects without a `feedback` block in `config.dna.json` still get DNA-only upstream reporting (defaults applied in submit path).

## [0.4.7] - 2026-07-11

### Added

- **CLI auto-upgrade** — `dna doctor` and startup check npm for newer `@superhumaan/dna-by-humaan`; `dna update` installs CLI + refreshes knowledge packs.

## [0.4.6] - 2026-07-11

### Fixed

- **`dna doctor` / workbench install on npm** — bundled CLI resolves `assets/intelligence-catalog.json` from `dist/../assets` (published package layout). v0.4.5 failed with “Missing assets/intelligence-catalog.json” on `npx @superhumaan/dna-by-humaan doctor`.
- **`dna doctor` bootstrap** — doctor and `dna ivf run` no longer require a pre-existing `.DNA/` directory; they scaffold on first run like `dna init`.
- **Stack auto-detect** — `database` and `hosting` are no longer guessed as `postgresql` / `vercel` when scan finds no signals; `dna-preview.yml` is only scaffolded for Vercel/Netlify hosting.

### Added

- **Platform codegen** — `dna generate feature` supports `sso`, `multi-tenant`, `feature-flags`, and `gradual-rollout` scaffolds.
- **IVF shared library `--execute`** — copies duplicate components, rewires imports, validates tests, rolls back on failure.
- **Impressions drift automation** — configurable thresholds in `config.dna.json`; `dna scan --open-pr` opens a draft GitHub PR with sync plan.
- **CellularMemory team sync** — `dna memory import --on-conflict`, `dna memory sync` from team registry path.
- **Dashboard live feed** — 5s auto-refresh via `/api/data` and quality trend chart.
- **GitHub OAuth** — device flow reads `github.oauthClientId` from project config; maintainer script `scripts/setup-github-oauth-app.sh` patches the shipped client ID.

## [0.4.5] - 2026-07-11

### Changed

- **Zero npm dependencies** — `@superhumaan/dna-by-humaan` ships with **no production `dependencies`**. Former third-party libraries (`commander`, `zod`, `fast-glob`, `simple-git`, `@octokit/rest`, `pino`, `chokidar`) are replaced by internal modules bundled into `dist/`. Optional framework **peer** deps (`express`, `fastify`, `@nestjs/common`) remain for runtime adapters only.
- **Supply chain** — smaller install graph for security scanners; npm package page shows zero dependency count. See [SECURITY.md](./SECURITY.md#supply-chain-transparency-socketdev--security-scanners).

### Added

- Internal utilities: `dna-config/validate`, `dna-github/git` + `github-api`, `dna-core/glob`, `dna-cli/cli` (argument parser).

## [0.4.4] - 2026-07-11

### Fixed

- **Supply chain (Socket.dev)** — removed erroneous self-dependency on `@superhumaan/dna-by-humaan` that nested an older package copy at install time.
- **False-positive security alerts** — SAST `eval` detection pattern no longer embeds `eval(` literals; CI coverage template uses `readFileSync` instead of dynamic `require`.
- **Next.js peer dependency** — removed optional `next` peer dep; obfuscated-code alerts on Socket were from Vercel's precompiled RSC bundles, not DNA. Next adapter uses duck-typed interfaces; consumer apps provide `next`.
- **Published tarball hygiene** — clean `dist/` before each build; marketplace and intelligence catalogs ship as JSON assets instead of inlined bundle strings (smaller, auditable `dist/index.js`).

### Added

- **Supply-chain transparency** — `SECURITY.md` documents network endpoints, scanner expectations, and npm provenance verification.
- **npm provenance** — publish script enables `--provenance` for install attestation.

## [0.4.3] - 2026-07-10

### Fixed

- **`dna init` on fresh projects** — init no longer requires an existing `.DNA/` directory; `resolveTargetDirectory()` resolves the project path before scaffolding.

## [0.4.2] - 2026-07-10

### Added

- **Smart `dna init`** — detects empty folder vs greenfield vs existing codebase; skips fake stack on non-code folders.
- **Full init analysis** — existing projects get all 14 IVF verticals, platform feature detection, `document --from-code`, gap matrix, and IVF plan on init.
- **Monorepo scanner** — reads `backend/`, `apps/*`, and `packages/*` for stack detection (fixes React + Express repos like Humaan).

### Changed

- Init uses `package.json` description and folder-aware messaging instead of generic "Demo project" output.
- CLI logs silent by default (`DNA_LOG_LEVEL` to enable).

## [0.4.1] - 2026-07-10

### Added

- **Remote prompt stem sync** — `dna update` and `dna doctor` download the latest stem catalog from [dna.humaan.app/intelligence/api/v1/catalog](https://dna.humaan.app/intelligence/api/v1/catalog) (bundled fallback when offline).
- **Default install** — new projects get all prompt stems on `init` / `doctor`; `config.dna.json` records `aiWorkbench.lastSyncAt`, `catalogVersion`, and `stemSource`.

### Changed

- Stem packs install via `syncPromptStemPacks()` instead of CLI-only bundled files — always refreshed on update.

## [0.4.0] - 2026-07-10

### Added

- **43 prompt stem packs** — copy-paste Cursor and Claude prompt engineering installed to `.DNA/stems/<id>/`. Each stem includes `prompt.md`, `guidelines.md` (MUST/NEVER), `expectations.md`, `context.md`, and `examples.md` so agents stick to the workflow per prompt.
- **Agent-loop role stems** (10) — `/product-analyst`, `/solution-architect`, `/backend-engineer`, `/frontend-engineer`, `/ux-reviewer`, `/qa-engineer`, `/code-quality`, `/refactor-reviewer`, `/final-release`, plus `/agent-loop` orchestrator.
- **`dna stems`** — `list`, `show <id>`, `install` for prompt stem packs.
- **[dna.humaan.app/intelligence](https://dna.humaan.app/intelligence)** — copy-paste stem library with guidelines preview (catalog v4). Replaces CLI-first command grid.

### Changed

- **DNA Workbench** now installs all stem packs and slash commands by default on `init`, `doctor`, and `update` (was 9 prompts; now 43+ stems with full engineering data).

### Fixed

- **`dna context` with `--cwd`** — bad relative `--cwd` paths no longer return empty Behaviour/CellularMemory sections. DNA validates that `.DNA/` exists at the resolved path and explains when to omit `--cwd` (already inside the project) or pass it from the monorepo root.

## [0.3.9] - 2026-07-10

### Fixed

- **Build rules from existing structure** — IVF build rules now scan monorepo workspaces and detect domain module patterns (`packages/*/src/{module}/`) even when no MUI list/report pages exist. `dna analyze` reports captured structure instead of "No build rules captured", and `feature-building-rules.md` instructs AI to clone the reference module layout.
- **JSX list pages (Humaan and similar)** — build rules now detect `.jsx` list/report pages and project shells (`ListPageShell`, `HumaanPageShell`, `ListPageFilter`). Humaan-style apps capture `SurveysListPage.jsx` as the reference list page.
- **`--cwd` validation** — DNA now resolves `--cwd` to an absolute path and prints a clear error when the directory does not exist.

## [0.3.8] - 2026-07-10

### Added

- **DNA Workbench** — prompt-first Cursor/Claude package installed by default on `init`, `doctor`, and `update`. Users work in plain language; agents run `npx dna` and load `.DNA/` context. Slash prompts: `/work-with-dna`, `/ship-feature`, `/analyze-project`, `/health-check`, `/quality-gate`, and more. Opt out: `dna workbench uninstall`.

## [0.3.7] - 2026-07-10

### Added

- **`dna workbench`** — prompt-first Cursor/Claude package (default on `init`, `doctor`, `update`): `/work-with-dna`, `/ship-feature`, `/analyze-project`, skills, and always-on co-pilot rule. Opt out: `dna workbench uninstall`.

## [0.3.6] - 2026-07-10

### Added

- **`dna commands` packages** — full **Cursor** (`.cursor/skills/dna-cli/`, obedience rule, 44 detailed slash commands) and **Claude Code** (`.claude/skills/dna-cli/`, 44 commands with frontmatter) packages. Each command includes purpose, when to use/not use, **MUST/NEVER** obedience rules, output interpretation, exit codes, workflows, and examples.
- **`dna commands`** — install, list, export-catalog, and uninstall (v0.3.6 baseline; packages expanded in 0.3.7).
- Commands scaffold automatically on **`dna init`**, **`dna feature-factory install`**, and **`dna doctor`**.
- **`pnpm intelligence:sync`** — sync command catalog JSON to [DNA-Web](https://github.com/superhumaan/DNA-Web) for [dna.humaan.app/intelligence](https://dna.humaan.app/intelligence).
- DNA-Web **`/intelligence`** page — browse all Cursor and Claude commands with CLI equivalents.

## [0.3.5] - 2026-07-10

### Fixed

- **GitHub login:** DNA now automatically adopts an existing GitHub CLI (`gh`) session — no browser step or manual credential copy when `gh auth token` already works. `dna github login`, `dna doctor`, and runtime GitHub automation persist the CLI token to `~/.config/dna/github-credentials.json`. Interactive `gh auth login` now inherits your terminal so the browser can open when a fresh sign-in is required.

## [0.3.4] - 2026-07-10

### Fixed

- **Runtime preload (`NODE_OPTIONS='--import @superhumaan/dna-by-humaan/runtime/preload'`):** no longer crashes with `Dynamic require of "fs" is not supported` on Node 20+. `tsup` now sets `skipNodeModulesBundle: true` for `runtime`, `runtime-preload`, and `@superhumaan/dna-runtime` so CommonJS npm deps (`simple-git`, `@kwsites/file-exists`, etc.) stay external and use Node's native `require` under ESM `--import`.

## [0.3.3] - 2026-07-10

### Fixed

- **CLI startup (`npx @superhumaan/dna-by-humaan doctor`):** bundle config updated to inline only `@superhumaan/*` workspace code (runtime preload fix completed in 0.3.4).
- **`dna feature-factory` commands:** `install` and `uninstall` register under one `feature-factory` command group (fixes duplicate-command crash at CLI startup).

### Added

- **`dna dashboard`** — local read-only dashboard for runtime issues, quality reports, doctor health, Impressions, and CellularMemory ([#12](https://github.com/superhumaan/DNA/issues/12)).
- **`dna memory export` / `dna memory import`** — share CellularMemory segments across DNA-enabled projects ([#13](https://github.com/superhumaan/DNA/issues/13)).
- **`dna plan impressions-sync`** and **Impressions drift score in `dna scan`** — detect doc/code divergence and generate sync plans ([#14](https://github.com/superhumaan/DNA/issues/14)).
- **`disciplines/gradual-rollout` knowledge pack** — tenant-scoped rollout patterns ([#15](https://github.com/superhumaan/DNA/issues/15)).
- **`dna ivf shared-library --dry-run` / `--scaffold`** — shared library extraction foundation ([#16](https://github.com/superhumaan/DNA/issues/16)).
- **`dna generate feature audit-logging`** — platform feature codegen scaffold ([#17](https://github.com/superhumaan/DNA/issues/17)).
- **`scripts/setup-github-oauth-app.sh`** — maintainer script to register the first-party OAuth app and ship client ID ([#11](https://github.com/superhumaan/DNA/issues/11)).

## [0.3.2] - 2026-07-10

### Added

- **Sponsors & commercial services:** public sponsor ledger ([`sponsors.json`](./sponsors.json)), `pnpm sponsors:sync`, `.github/FUNDING.yml` (GitHub **Sponsor** button), `dna credits`, bundled `CREDITS.md` / `SPONSORS.md`, npm `funding` + `contributors`. DNA-Web `/sponsors` and `/services` pages with monthly homepage logo rotation for company sponsors.
- **Doctor preview checks:** `dna doctor` reports preview workflow status and setup hints when `pushToPreview` is enabled.
- `DNA_REFERENCE_ROOT` environment variable for locating DNA reference repos on your machine. See [integrations.md](./docs/integrations.md).
- `DNA_GDPR_SOURCE_DOCS` environment variable for GDPR doc ingest (`pnpm gdpr:ingest`).
- [Naming conventions](./docs/naming.md) — how **Humaan** (company), **DNA** (product), and pack IDs relate.
- **Backward-compatible aliases** — `platforms/humaan-stack` and `platforms/humaan/*` knowledge paths resolve to `platforms/dna-stack` / `platforms/dna/*` automatically.

### Fixed

- **Runtime observer:** auto-creates `.DNA/data/runtime.db` on `dna init`, `dna runtime install`, and `dna doctor`; migrates legacy JSONL records; runtime pipeline uses stored/`gh` GitHub tokens (not env-only) for auto-issues; **`dna doctor` auto-wires runtime** for Next.js (`middleware.ts`), Express, and Fastify entry files, with `NODE_OPTIONS` preload fallback for other stacks.
- **GitHub integration:** `dna github connect` no longer marks `authenticated` without a real token; `dna init -y` auto-connects from git remote; **`dna doctor` opens browser GitHub sign-in automatically** when not signed in (skips in CI / `--check-only`).
- **CI / Docker / hooks:** doctor and `dna ci install` now scaffold Docker alongside workflows and pre-push hooks; doctor reports CI, Docker, hooks, and runtime storage status with setup hints.

### Fixed

- **Workflow cleanup:** Restore `cleanup-failed-runs.yml` with `workflow_run` deletion after completion — inline delete jobs returned 403 because GitHub cannot delete a run while it is still in progress. Scheduled and manual sweeps remove failed/cancelled backlog.
- **GitHub auth UX:** Doctor and docs steer users to `dna github login` + `dna github connect` instead of `GITHUB_TOKEN`-only setup. `dna github issue` resolves stored, `gh`, and env tokens.
- **Platform knowledge pack rename:** `platforms/humaan-stack` → `platforms/dna-stack`; knowledge files moved from `platforms/humaan/*.dna.md` to `platforms/dna/*.dna.md`.
- **Reference project paths:** `dna platform projects` no longer prints author-specific absolute paths. Set `DNA_REFERENCE_ROOT` to the parent folder containing `AIStudio`, `ColorParty`, `Humaan`, and `Soli` clones.

### Migration — `platforms/humaan-stack` → `platforms/dna-stack`

If you installed the platform pack before this rename:

1. **Refresh the pack** (recommended):

   ```bash
   dna marketplace install platforms/dna-stack
   ```

2. **Update installed registry** — if `.DNA/marketplace/installed.json` still lists `platforms/humaan-stack`, you can remove that entry after installing `platforms/dna-stack`, or leave it; the new install is what matters.

3. **Knowledge paths on disk** — old files under `.DNA/knowledge/platforms/humaan/` are replaced when you install `platforms/dna-stack`. Remove the old folder if you want a clean tree:

   ```bash
   rm -rf .DNA/knowledge/platforms/humaan
   ```

4. **Committed config** — if `neuralNetwork.json` or feature plans reference `platforms/humaan/*.dna.md`, update to `platforms/dna/*.dna.md` or regenerate plans with `dna plan feature <id>`.

5. **Remote marketplace** — online catalog at [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) should list `platforms/dna-stack`; bundled offline catalog always includes the new ID.

## Unreleased

### Added

- _Nothing yet._

### Changed

- _Nothing yet._
