# Feature Request

_Auto-maintained by DNA. Updated 2026-07-27._

## Latest request

> **Skeletor** is the IDE built with Labs + DNA. Purpose: enhance the AI experience while building with AI — without forcing migration, double billing, or upgrades. Users can (1) install DNA npm into Cursor + install Skeletor and the two auto-connect, or (2) install Skeletor alone and it auto-installs DNA into Cursor (same for Claude). That unlocks packs/guidance/knowledge plus live Labs for local dev that push Labs into production.

## Problem

AI coding happens in Cursor/Claude. DNA already improves that via npm. There is no Lab-first desktop surface that **bridges** to those editors — only parallel tools that force a new platform or a second AI bill.

## Pain

- Lab local → production has no dedicated IDE home
- Installing DNA + opening Lab is fragmented across terminal/browser
- Fear of “new IDE = migrate + re-pay for AI”
- Cursor/Claude users need DNA packs/rules without leaving their editor

## Users

- Developers in Cursor or Claude Code who want DNA + Lab without switching editors
- Teams that want local Lab while coding, then the same Lab in production
- People who install Skeletor first and expect DNA to land in their existing AI IDE automatically

## Desired Behaviour

1. **Skeletor** = Lab-first IDE shell powered by DNA (theme aligned with dna.humaan.app)
2. **Non-displace:** keep using Cursor/Claude AI; no forced platform migration; no double AI billing; no forced upgrade
3. **Auth (locked):**
   - **Sign in** with Google, Apple, or Microsoft (identity only)
   - **Then connect** AI accounts (Anthropic, Gemini, etc.) — separate step; BYOK / official APIs; no second forced AI subscription
4. **Bridge modes:**
   - DNA already in project + Skeletor installed → auto-detect and connect (shared `.DNA/`, Lab, runtime)
   - Skeletor only → detect Cursor and/or Claude Code → auto-run DNA install (doctor/workbench) into that environment
5. Bridge enables packs, stems, guidance, knowledge in the AI IDE the user already pays for
6. Skeletor provides **live Lab** for local development
7. Same Lab contract **pushes / continues into production** Lab
8. npm path remains first-class (`npx dna` without Skeletor)

## Acceptance criteria

- [ ] Skeletor scaffold in monorepo; DNA theme; Lab as primary surface
- [ ] Sign-in: Google, Apple, Microsoft (OIDC identity)
- [ ] Post-login: Connect AI accounts flow (separate from identity)
- [ ] Bridge protocol: Skeletor ↔ project `.DNA/` ↔ Cursor/Claude workbench
- [ ] If DNA missing: Skeletor auto-installs DNA into detected Cursor and/or Claude project
- [ ] If DNA present: Skeletor connects without reinstall / without touching AI billing
- [ ] Local Lab live in Skeletor; production Lab continuity documented + wired
- [ ] Explicit non-goals enforced in UX copy: no migrate-off-Cursor, no second AI subscription required
- [ ] Architect plan approved before implementation

## Edge cases

- Neither Cursor nor Claude installed → Skeletor still runs Lab + offers npm/CLI DNA install into folder
- Multiple projects / portfolio parent `.DNA/` → bridge to parent when applicable
- User declines auto-install → manual path; no silent global mutation outside chosen project
- Cursor vs Claude both present → install DNA once at project; workbench rules for both
- Offline: bridge uses local `.DNA/` + local Lab; cloud IdP optional

## Out of scope (v0)

- Replacing Cursor/Claude as the AI coding host
- Reselling Cursor/Claude subscription tokens
- Full Code-OSS fork parity on day one (Lab + bridge first; editor host can be thin)
- Forcing Skeletor account to use models
