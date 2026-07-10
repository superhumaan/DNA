# Changelog

All notable changes to DNA are documented here.

## [Unreleased]

### Fixed

- **Build rules from existing structure** — IVF build rules now scan monorepo workspaces and detect domain module patterns (`packages/*/src/{module}/`) even when no MUI list/report pages exist. `dna analyze` reports captured structure instead of "No build rules captured", and `feature-building-rules.md` instructs AI to clone the reference module layout.

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

### Changed

- **Workflow cleanup:** Failed runs are deleted inline from each workflow (`ci.yml`, `publish-npm.yml`, generated `dna-ci.yml`) with explicit `actions: write` — replaces the broken `workflow_run` cleanup workflow.
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
