# Guidelines

## MUST
- Run real `npx dna` commands in shell — never invent CLI output
- Load `.DNA/neuralNetwork.json`, matching behaviour, and listed contextLoads before acting
- Confirm Expo / React Native surface exists (package.json expo | react-native) — if missing, stop unless the user asked to scaffold
- Treat iOS and Android as separate platforms in every decision (permissions, signing, stores, back/gesture nav)
- Write named artifacts to the paths this stem specifies (or state why deferred)
- Cover failure modes listed in the prompt — do not skip the unhappy path
- Cite concrete evidence (app.json/app.config, eas.json, app.json plugins, store listings) for every material claim
- Never print signing certs, keystores, EXPO_TOKEN, ASC keys, or Play JSON — names of env vars only
- Wait for approval if scaffolding a new app into a non-empty repo

## SHOULD
- Prefer Expo CNG (prebuild) + EAS over long-lived checked-in ios/ android/ unless the repo already owns native trees
- Match existing navigation, theme, and list-screen patterns from `platforms/mobile-ui` and sibling screens
- Label unverified claims as **assumption**
- Hand off to `ship-feature` / agent-loop when implementation is required after a plan/audit
- End with next stem + open questions

## NEVER
- Skip reading this stem's guidelines, expectations, and context
- Force-push main/master
- Commit or echo secrets from env, credentials JSON, or CLI output
- Use Expo Go for production, custom native modules, or config plugins that require a dev client
- Ship EAS Update (OTA) when native code, permissions, or runtimeVersion must change — require a new binary
- Store tokens in AsyncStorage / plaintext MMKV — use expo-secure-store (or equivalent) for secrets
- Point the mobile app at unbounded domain APIs when a BFF is the agreed pattern — do not skip aggregation/auth exchange
- Invent App Store / Play Console status, crash-free rates, or build URLs without evidence
- Leave work with no artifact path and no explicit deferral reason
