> **DNA Prompt Stem:** `ship-macos-menubar` — read `.DNA/stems/ship-macos-menubar/` (all files) before proceeding.

# Ship macOS menu bar

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.

## Preconditions

Confirm a native macOS menu-bar target already exists (Swift package or Xcode project with a menu-bar UI). If it does not, **stop**. Do not introduce a desktop shell, browser wrapper, or a second app architecture.

## Checklist

- [ ] Menu-bar target present; library and executable split matches the repo
- [ ] Version in the package manifest and any app metadata agree
- [ ] Use the repo's existing package script — do not add a new packager
- [ ] Signing identity present for a production ship (names only; never print secrets)
- [ ] Notarize and staple when the user asked for a distributable macOS build
- [ ] Smoke: launches into the menu bar, quits cleanly, survives relaunch
- [ ] No telemetry, account, or network call added unless the product already has one and the user asked
- [ ] Hand release notes to `write-release-notes`

## Artifacts

| Artifact | Path |
|----------|------|
| Release matrix | `.DNA/plans/macos-menubar-release.md` |
| Release notes | via `write-release-notes` |

## Failure modes

| Mode | Response |
|------|----------|
| No menu-bar target | Stop |
| Missing signing identity | Block production ship; list required secret names only |
| Tests fail | Do not package; report the failing suite |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
