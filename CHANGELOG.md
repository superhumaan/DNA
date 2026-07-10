# Changelog

All notable changes to DNA are documented here.

## [0.3.2] - 2026-07-10

### Added

- **Sponsors & commercial services:** public sponsor ledger ([`sponsors.json`](./sponsors.json)), `pnpm sponsors:sync`, `dna credits`, bundled `CREDITS.md` / `SPONSORS.md`, npm `funding` + `contributors`. DNA-Web `/sponsors` and `/services` pages with monthly homepage logo rotation for company sponsors.
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
