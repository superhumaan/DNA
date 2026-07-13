# Feature Request

_Auto-maintained by DNA. Updated 2026-07-13T09:31:00.000Z._

## Latest request

> DNA needs to be much more aggressive in logging, memory, solutions, and forcing AI to fix recurring production errors. User has pushed the same error (502 Bad Gateway on `colorparty.invitrace.ai`) back **187 times** and AI has never attempted a proper fix.

## Problem

DNA's runtime → repair loop is **observability-only**. It classifies errors, logs them, optionally opens GitHub issues, and optionally opens PRs — but it does **not** close the loop on recurring failures. Real AI providers return diagnosis text with **zero code patches**. Mock provider produces useless generic patches. Repeated failures append a one-line entry to `amygdala/repeated-failures.md` but never trigger escalation, deduplication, retry, or forced agent repair.

A 502 Bad Gateway (Cloudflare origin down) is especially poorly served: no stack trace, category `unknown`, confidence 0.4, and if the error never reaches the Node process (edge/gateway failure), runtime observer never fires at all.

## Current Pain

- Same error reported 187× with **no learning** — `temporalLobe/previous-solutions.md` is never written by repair code
- `repeated-failures.md` stays empty or gets one-line appends with no actionable context
- GitHub issues created **without dedup** — 187 events could mean 187 duplicate issues (or all dry-run without token)
- `dna ai repair` opens PRs with **empty or wrong patches** — OpenAI/Anthropic return `proposedChanges: []`
- Config knobs (`ai.repair.enabled`, `autoPr`, `requireReview`, `aiRepair.enabled`) exist in schema but are **not enforced** in pipeline
- AI agents in Cursor read stems that say "optional: npx dna ai repair" — no **mandatory** repair gate for repeated failures
- Immune rules document `count >= N in 5m` escalation but `ruleMatches()` **does not implement** count/window logic
- No classifier patterns for 502/503/504 gateway errors
- User must manually re-prompt AI every time; DNA never **forces** the agent loop on known repeated failures

## Proposed Solution

**Aggressive Repair Loop (ARL)** — a closed-loop system that treats repeated failures as **blockers**, not advisory logs.

### Pillar 1 — Aggressive logging
- Rich HTTP error context: status, endpoint, response body snippet, request ID, upstream headers
- Issue fingerprinting: `hash(endpoint + status + message + category)`
- Escalation log in `runtime.db`: `repeatCount`, `firstSeen`, `lastSeen`, `repairAttempts`, `repairStatus`
- Gateway probe: optional synthetic health check for edge 502s that never reach the app

### Pillar 2 — Aggressive memory
- On repeat ≥3: write structured block to `amygdala/repeated-failures.md` (count, fingerprint, diagnosis attempts, files touched)
- On repair attempt: append to `temporalLobe/previous-solutions.md` (what was tried, outcome)
- On session start / debug intent: **auto-inject** repeated-failure context into agent prompt (workbench rule)
- `prefrontalCortex/blockers.md` auto-updated when repeatCount ≥ threshold (default 5)

### Pillar 3 — Aggressive solutions
- Parse AI responses into structured JSON patches (unified diff or search-replace blocks)
- HTTP/gateway repair playbook: deploy config, health routes, timeout, upstream URL, process crash
- Issue dedup: comment on existing GitHub issue instead of creating new ones
- Repair retry: re-run repair if open issue age > 24h and still failing

### Pillar 4 — Force AI to fix
- New config: `ai.repair.aggressive` (default **true** after doctor)
  - `minRepeatForRepair`: 3
  - `minRepeatForBlocker`: 5
  - `forceAgentLoop`: true — workbench rules **mandate** 9-role loop for blockers
  - `dedupeIssues`: true
  - `retryOpenRepairs`: true
- Wire all `ai.repair.*` flags in `pipeline.ts`
- New stem/command: `/dna-force-repair` — loads blocker context, runs OODA, **cannot** mark complete without code change + test
- Workbench rule update: repeated failure in amygdala → **mandatory** debug path, not optional

## Users

- Product engineers using DNA on production apps (Invitrace, ColorParty, etc.)
- AI agents in Cursor/Claude Code that keep getting the same error pushed back
- DNA maintainers shipping the repair loop

## Desired Behaviour

1. Error occurs (runtime or synthetic probe) → classified → fingerprinted → logged with full context
2. Repeat count increments; at 3 → amygdala memory block; at 5 → blocker flag
3. GitHub: dedupe by fingerprint — comment + reopen, don't spam 187 issues
4. Repair: structured patches from real AI; retry if previous attempt had zero changes
5. Agent in Cursor: on any message, if open blockers exist → load them first; on debug/engineering intent → **forced** repair loop
6. Success: error stops recurring OR repair PR merged with regression test OR explicit user waiver

## Edge Cases

- Cloudflare 502 where origin never runs — synthetic probe + deploy/infra playbook, not app code patch
- No GitHub token — local repair branch + blocker file still updated; agent forced via workbench
- Mock provider in dev — clearly labelled; aggressive mode warns if provider can't produce patches
- False positive repeats — fingerprint includes endpoint; allow `immuneSystem` override to suppress
- Multi-service blast radius — escalate to user at repeat 10 if 3 repair attempts failed

## Success Criteria

The feature is only complete when:

- [x] `ai.repair.aggressive` config wired and respected in pipeline
- [x] Issue fingerprinting + GitHub dedup prevents duplicate issues for same error
- [x] OpenAI/Anthropic providers return parseable `proposedChanges` (structured JSON output)
- [x] `amygdala/repeated-failures.md` and `temporalLobe/previous-solutions.md` auto-updated with structured entries
- [x] `amygdala/blockers.md` auto-created for repeatCount ≥ threshold
- [x] Immune classifier includes 502/503/504 patterns; count-based rules implemented
- [x] Workbench rules force agent repair loop when blockers exist
- [x] `dna ai force-repair` CLI command
- [x] Unit tests for fingerprint, dedup, escalation, patch parsing
- [ ] Local quality gate passes (`dna quality report --feature`)
- [ ] Docker image builds (`dna docker build`)
- [ ] Changes pushed to GitHub (`dna github push`)
- [ ] No unrelated files are modified
- [ ] Existing behaviour is not broken (non-aggressive mode still works)

---

**Project:** dna-by-humaan
