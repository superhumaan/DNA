# Naming conventions

DNA uses several related names. This page defines what each means so docs, pack IDs, and CLI output stay consistent.

## Layers

| Name | Meaning | Examples |
|------|---------|----------|
| **Humaan** | Company / studio that builds DNA and reference products | [humaan.com](https://humaan.com), `*.humaan.app`, “Humaan Operations” (internal ops app) |
| **DNA** | Open-source product — project intelligence, marketplace, CLI | `dna init`, `.DNA/`, `platforms/dna-stack` |
| **DNA by Humaan** | Full product name (npm, generated files, CLI banner) | `@superhumaan/dna-by-humaan`, `PRODUCT_NAME` in config |
| **Superlite** | Parent company | Author line in package.json |

**Rule of thumb:** **Humaan** = who ships it and real production apps. **DNA** = the tooling and knowledge namespace inside your repo.

## Pack and path IDs

| ID / path | Role |
|-----------|------|
| `platforms/dna-stack` | Marketplace pack — admin, auth, cloud, integrations distilled from production |
| `platforms/dna/*.dna.md` | Knowledge files inside that pack (not `platforms/humaan/` — retired) |
| `platforms/aistudio/`, `platforms/soli/`, `platforms/colorparty/` | Per–reference-project packs where patterns are project-specific |

### Retired IDs (aliases)

DNA resolves these automatically — no manual migration required for resolution:

| Retired | Current |
|---------|---------|
| `platforms/humaan-stack` | `platforms/dna-stack` |
| `platforms/humaan/*.dna.md` | `platforms/dna/*.dna.md` |

Reinstalling `platforms/dna-stack` refreshes on-disk knowledge files. See [CHANGELOG](../CHANGELOG.md).

## Reference projects

The platform catalog learns from four **reference projects** (not product renames):

| ID | Display name | Notes |
|----|--------------|-------|
| `aistudio` | AI Studio | |
| `colorparty` | ColorParty | |
| `humaan` | Humaan Operations | Internal ops product; ID stays `humaan` for CLI `--reference-project` |
| `soli` | Soli | |

Code constants use `DNA_REFERENCE_PROJECT_DEFS` (formerly `HUMAAN_PROJECTS`). The `humaan` project ID refers to the **Humaan Ops** app, not the company name alone.

## Git commits, PRs, and AI repair (project tag)

Every DNA project has a **project tag** used by AI for commits, PR titles, and repair branches. Resolved from `projectId` / `projectName`, overridable in `.DNA/config.dna.json`:

```json
{
  "git": {
    "projectTag": "ColorParty",
    "branchSlug": "colorparty"
  }
}
```

| Artifact | Format | Example (ColorParty) |
|----------|--------|----------------------|
| Commit | `[Tag] type(scope): summary` | `[ColorParty] fix(admin): dedupe filter` |
| PR title | `[Tag] Type: summary` | `[ColorParty] Fix: uncaught exception` |
| Branch | `<slug>/type/short-id` | `colorparty/fix/abc123` |

**Defaults:** `colorparty` → `ColorParty`, `dna-by-humaan` → `DNA`, `ai-studio` → `AIStudio`, `humaan` → `Humaan`, `soli` → `Soli`. Prefer `fix`/`feat` over bare `chore` unless deps/tooling.

Installed into always-on AI rules via `dna doctor` / `dna workbench install` / `dna update`. Helper: `resolveProjectGitIdentity()` in `@superhumaan/dna-config`.

## npm scope

`@superhumaan/*` is the npm scope for published packages. It reflects the GitHub org (`superhumaan/DNA`), not the `platforms/dna-stack` pack ID. Changing the scope would be a separate, breaking release.

## Domains

- **dna.humaan.app** — DNA website and marketplace (Humaan-hosted product surface)
- **\*.humaan.app** — Production apps (SSO bridge, Invitrace, etc.) documented in knowledge packs

## When to rename what

| Change | Update |
|--------|--------|
| New knowledge in the DNA platform pack | `platforms/dna/` paths, `platforms/dna-stack` pack |
| New pattern from a specific shipped app | Reference project ID + optional `platforms/<project>/` pack |
| User-facing product branding | `PRODUCT_NAME`, README, CLI strings — keep “DNA by Humaan” unless doing a full brand release |
| Company / legal | `COMPANY_NAME`, CONTRIBUTING, LICENSE |

See [CHANGELOG.md](../CHANGELOG.md) for the `humaan-stack` → `dna-stack` migration.
