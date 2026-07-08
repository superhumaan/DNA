# Changelog

All notable changes to DNA are documented here.

## Unreleased

### Changed

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

### Added

- `DNA_REFERENCE_ROOT` environment variable for locating DNA reference repos on your machine. See [integrations.md](./docs/integrations.md).
- `DNA_GDPR_SOURCE_DOCS` environment variable for GDPR doc ingest (`pnpm gdpr:ingest`).
- [Naming conventions](./docs/naming.md) — how **Humaan** (company), **DNA** (product), and pack IDs relate.
- **Backward-compatible aliases** — `platforms/humaan-stack` and `platforms/humaan/*` knowledge paths resolve to `platforms/dna-stack` / `platforms/dna/*` automatically.
