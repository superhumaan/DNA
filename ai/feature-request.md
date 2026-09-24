# Feature Request

_Auto-maintained by DNA. Updated 2026-09-24._

## Latest request

> Setup a simple way to (1) install DNA without DNA Labs and runtime, and (2) after someone upgrades to the latest version, uninstall DNA runtime and Labs easily. Uninstall must remove all of that code so it never comes back unless they choose to re-install it.

## Problem

DNA init, doctor, and update always scaffold the runtime observer and DNA Lab, then doctor forces `runtime.enabled` back to true. There is no install path that skips both, and no uninstall that deletes the wired code and stays deleted.

## Pain

- Projects that only want DNA intelligence (rules, knowledge, CI) still get Lab assets, runtime snippets, and middleware wired into the app
- Setting `runtime.enabled: false` does not stick — `dna doctor` turns it back on
- `dna update` refreshes Lab wiring whenever `lab.enabled` is not false
- There is no command that removes the injected observer and `/labs` code from the project

## Users

- Teams installing DNA for co-pilot / knowledge / CI only
- Existing projects that upgrade and want Labs and the runtime observer gone
- Operators who may later opt back in with an explicit install

## Desired behaviour

1. `dna init --core` (and `--no-runtime` / `--no-lab`) scaffolds DNA without the runtime observer and without Lab
2. `dna runtime uninstall` and `dna lab uninstall` delete scaffolded files and unwind middleware from the app
3. Uninstall writes a sticky opt-out. `dna doctor` and `dna update` must not recreate those files or re-enable the feature
4. `dna runtime install` and `dna lab install` clear the opt-out and put the feature back
5. Agent Mesh (`.DNA/runtime/agents.db` and hooks) stays. Uninstall targets the observer and Lab only

## Edge cases

- Doctor on an existing project that never opted out still keeps runtime and Lab (current default)
- Uninstall is idempotent when the feature is already gone
- Agent Mesh files under `.DNA/runtime/` are not deleted
- App dependency `@superhumaan/dna-by-humaan` is removed only when no runtime or Lab import remains
- Re-install after uninstall restores scaffolding and clears the opt-out

## Acceptance criteria

- [x] `dna init --core` leaves runtime and Lab disabled and does not write their files
- [x] `dna runtime uninstall` removes observer snippets, `runtime.db`, and wired middleware, and doctor/update do not restore them
- [x] `dna lab uninstall` removes `.DNA/lab`, lab store, and wired `/labs` middleware, and doctor/update do not restore them
- [x] `dna runtime install` / `dna lab install` opt back in
- [x] Agent Mesh files survive runtime uninstall
- [x] Tests cover opt-out stickiness for doctor and update paths
