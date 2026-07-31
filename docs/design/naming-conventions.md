# Naming conventions

DNA uses several related names. This page defines what each means so docs, pack IDs, and CLI output stay consistent.

## Layers

| Name | Meaning | Examples |
|------|---------|----------|
| **Humaan** | Company / studio that ships DNA | [humaan.com](https://humaan.com), `*.humaan.app` |
| **DNA** | Open-source product — project intelligence, marketplace, CLI | `dna init`, `.DNA/`, `platforms/dna-stack` |
| **DNA by Humaan** | Full product name (npm, generated files, CLI banner) | `@superhumaan/dna-by-humaan`, `PRODUCT_NAME` in config |
| **Superlite** | Parent company | Author line in package.json |

**Rule of thumb:** **Humaan** = who ships it. **DNA** = the tooling and knowledge namespace inside your repo.

## Pack and path IDs

| ID / path | Role |
|-----------|------|
| `platforms/dna-stack` | Marketplace pack — admin, auth, cloud, integrations |
| `platforms/dna/*.dna.md` | Knowledge files inside that pack (not `platforms/humaan/` — retired) |

### Retired IDs (aliases)

DNA resolves these automatically — no manual migration required for resolution:

| Retired | Current |
|---------|---------|
| `platforms/humaan-stack` | `platforms/dna-stack` |
| `platforms/humaan/*.dna.md` | `platforms/dna/*.dna.md` |

Reinstalling `platforms/dna-stack` refreshes on-disk knowledge files. See [CHANGELOG](../CHANGELOG.md).

## Git commits, PRs, and AI repair (project tag)

Every DNA project has a **project tag** used by AI for commits, PR titles, and repair branches. Resolved from `projectId` / `projectName`, overridable in `.DNA/config.dna.json`:

```json
{
  "git": {
    "projectTag": "MyApp",
    "branchSlug": "myapp"
  }
}
```

| Artifact | Format | Example |
|----------|--------|---------|
| Commit | `[Tag] type(scope): summary` | `[MyApp] fix(admin): dedupe filter` |
| PR title | `[Tag] Type: summary` | `[MyApp] Fix: uncaught exception` |
| Branch | `<slug>/type/short-id` | `myapp/fix/abc123` |

**Defaults:** `dna-by-humaan` → `DNA`; otherwise title-case from `projectName` / `projectId`. Prefer `fix`/`feat` over bare `chore` unless deps/tooling.

Installed into always-on AI rules via `dna doctor` / `dna workbench install` / `dna update`. Helper: `resolveProjectGitIdentity()` in `@superhumaan/dna-config`.

## npm scope

`@superhumaan/*` is the npm scope for published packages. It reflects the GitHub org (`superhumaan/DNA`), not the `platforms/dna-stack` pack ID. Changing the scope would be a separate, breaking release.

## Domains

- **dna.humaan.app** — DNA website and marketplace (Humaan-hosted product surface)
- **\*.humaan.app** — Humaan-hosted apps (SSO and related patterns in knowledge packs)

## When to rename what

| Change | Update |
|--------|--------|
| New knowledge in the DNA platform pack | `platforms/dna/` paths, `platforms/dna-stack` pack |
| User-facing product branding | `PRODUCT_NAME`, README, CLI strings — keep “DNA by Humaan” unless doing a full brand release |
| Company / legal | `COMPANY_NAME`, CONTRIBUTING, LICENSE |

See [CHANGELOG.md](../CHANGELOG.md) for the `humaan-stack` → `dna-stack` migration.
