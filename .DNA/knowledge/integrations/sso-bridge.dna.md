# Cross-App SSO Bridge (DNA)

## Pattern
Apps on `*.humaan.app` share `JWT_SECRET`.

## Flow
1. User logged into invitrace.humaan.app (source)
2. Target app (e.g. color.humaan.app) probes `/api/auth/session` with `X-Session-Probe: 1`
3. Or OTT handoff: `?ott=` → exchange at source `/api/auth/ott/exchange`
4. Target `POST /api/auth/establish-session` → httpOnly cookie

## Implementation
- CORS allow `*.humaan.app`
- Verify shared SSO JWT; re-issue app-specific token
- Upsert user record on first bridge login

## Reference
ColorParty: `invitraceSsoBridge.js`
Ops: `SsoBridge.jsx`
