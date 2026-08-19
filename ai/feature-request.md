# Feature Request

_Auto-maintained by DNA. Updated 2026-08-19._

## Latest request

> WE NEED react expo stem packs immediately, as many mobile ios and android as possible, best practices. Dynamic builds. Include decision making, architect, even things like backend for frontend.

## Problem

DNA has Tauri/desktop stems and a thin `frameworks/react-native` knowledge pack, but **no Expo / React Native prompt stem library**. Agents building iOS/Android apps improvise Expo Go vs dev client, EAS Update vs native rebuild, App Store vs Play, and whether the app should talk to a BFF.

## Pain

- Agents pick Expo Go for production work that needs custom native modules
- OTA / “dynamic builds” (EAS Update) shipped when native code changed — or native rebuilds when JS-only would suffice
- No BFF guidance — mobile clients hit raw domain APIs, over-fetch, and leak tokens
- iOS vs Android permissions, signing, and store policy treated as one checklist
- Architecture decisions (Router, state, auth storage) reinvented per session

## Users

- Teams shipping Expo / React Native apps on iOS and Android
- DNA projects using the `mobile-expo` stack archetype
- Agents that need a decision record before scaffolding or shipping

## Desired behaviour

1. **Default-on Expo stem packs** — slash commands for architect, BFF, dynamic builds, EAS, iOS, Android, auth, offline, a11y, perf, testing, notifications, deep links
2. **Decision-first** — `/expo-architect` and `/expo-workflow-decision` produce an ADR before code
3. **BFF is first-class** — `/expo-bff` plans a mobile Backend-for-Frontend (aggregation, auth exchange, payload shaping)
4. **Dynamic builds** — `/expo-dynamic-builds` covers EAS Update channels, `runtimeVersion`, what may OTA vs what requires a new binary
5. **Platform-specific ship** — iOS TestFlight/App Store and Android Play tracks as separate stems
6. Knowledge pack `frameworks/react-native` deepened so stem `contextLoads` are real, not stubs
7. Marketplace combo `combo/expo-mobile` installs packs + stems together

## Edge cases

- No Expo/RN app in repo → stems stop; do not invent a mobile app unless asked
- Bare / CNG prebuild needed → document native dirs; do not pretend Expo Go is enough
- Native module or permission change → block OTA; require EAS Build
- Secrets (Apple certs, Play keystore, EXPO_TOKEN) — names only, never print values
- Web-only repo using React — do not apply Expo stems

## Acceptance criteria

- [x] Expo prompt stems exist, quality-baseline compliant (checklist + artifacts + failure modes, 2–3 examples)
- [x] Stems cover: architect/decisions, BFF, Expo init/router, dynamic builds (EAS Update), EAS Build, dev client, app.config, iOS ship + permissions, Android ship + permissions, auth, offline, perf, a11y, testing, notifications, deep links, store submit, CI, native modules
- [x] Slash commands install to `.cursor/commands/` and `.claude/commands/`
- [x] `frameworks/react-native` knowledge includes architecture decisions, BFF, EAS, OTA, iOS, Android
- [x] `combo/expo-mobile` purpose combo maps to real pack + stem ids
- [x] Intelligence catalog bumped; tests cover unique ids + Expo quality bar
- [x] Docs/CHANGELOG updated with new stem family
