# Feature Request

_Auto-maintained by DNA. Updated 2026-07-31._

## Latest request

> I see "CHORE" in all commits across all projects, in particular Color Party. Color Party is working on fixing bugs, but we need a project naming convention pushed to AI for commits and PRs (like the `[DNA]` tag on repair PRs).

## Problem

AI-authored git history is brand-blind and type-lazy:

1. **Commits** default to generic conventional types (`chore:`, `feat:`, `fix:`) with no project identity — across ColorParty, DNA, Humaan, etc. everything looks the same in GitHub/Skeletor fleets.
2. **AI repair PRs** hardcode `[DNA]` in `packages/dna-ai` even when the host project is ColorParty / Soli / etc.
3. **Workbench / stems / agent loop** tell AI to push with `chore: preview` / `feat: <summary>` but never inject a per-project tag from `.DNA/config.dna.json`.
4. ColorParty already has `projectId: "colorparty"` but that never reaches commit/PR title rules the AI must obey.

## Pain

- Cannot tell which lab a commit/PR belongs to when scanning fleets or comparing tabs
- `chore:` hides real bugfix / feature work
- DNA repair PRs all look identical (`[DNA] Fix: CRITICAL: uncaught_exception…`) and fail CI without project-specific context

## Users

- Studio operators scanning GitHub across ColorParty, DNA, AIStudio, Humaan, Soli
- AI agents (Cursor / Claude) committing and opening PRs inside each DNA project
- DNA aggressive repair (automated PR factory)

## Desired behaviour

1. Every DNA project has a **project tag** (e.g. `ColorParty`, `DNA`, `AIStudio`, `Humaan`, `Soli`) derived from config, overridable.
2. AI is instructed (always-on rules + delivery behaviour + stems) to use that tag on:
   - **Commits:** `[Tag] type(scope): summary` — prefer `fix`/`feat`/`docs` over bare `chore` unless truly chore
   - **PR titles:** `[Tag] Type: summary` (match existing DNA repair style)
   - **Branches:** `<tag-slug>/fix|feat/<short-id>` (e.g. `colorparty/fix/…`)
3. DNA AI repair reads project tag from config — no hardcoded `[DNA]` / `fix(dna):` / `dna/fix/` when host project differs.
4. Convention is documented in `docs/design/naming-conventions.md` and regenerated into workbench on `dna doctor` / `dna workbench install` / update.

## Edge cases

- Override via config when display name ≠ slug (`projectTag: "ColorParty"` while `projectId: "colorparty"`)
- Monorepo / DNA itself stays `[DNA]`
- Existing open PRs are not rewritten; convention applies going forward
- `chore` still allowed for deps/tooling/version bumps — but must keep the project tag
- Semantic-release / version bump scripts that parse `feat:`/`fix:`/`chore:` must still see the conventional type (tag is a prefix, type stays parseable)

## Acceptance criteria

- [ ] Config supports `git.projectTag` (or equivalent) with sensible default from `projectName`/`projectId`
- [ ] Always-on AI instructions (AGENTS / workbench / delivery behaviour) include commit + PR + branch naming rules with the live tag
- [ ] AI repair PR title / commit / branch use host project tag, not hardcoded DNA
- [ ] Stems and ship close-out examples use tagged messages (`[ColorParty] feat: …`) not bare `chore:`
- [ ] Docs updated (`docs/design/naming-conventions.md`, CHANGELOG)
- [ ] Unit tests for tag derivation + repair title/branch formatting
- [ ] ColorParty can pick up convention via `dna doctor` / workbench sync after DNA release (or local link)

## Out of scope

- Rewriting historical commits/PRs
- Changing ColorParty bug fixes themselves (separate agent working on those)
- Skeletor UI changes (fleet already shows repo names)
