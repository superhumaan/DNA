# Cross-App SSO Bridge (DNA)

## Pattern
Sibling apps on a shared parent domain share `JWT_SECRET`.

## Flow
1. User logged into source app
2. Target app probes `/api/auth/session` with `X-Session-Probe: 1`
3. Or OTT handoff: `?ott=` → exchange at source `/api/auth/ott/exchange`
4. Target `POST /api/auth/establish-session` → httpOnly cookie

## Implementation
- CORS allow sibling origins on the shared parent domain
- Verify shared SSO JWT; re-issue app-specific token
- Upsert user record on first bridge login

## Reference
- `ssoBridge.js` (or equivalent) in the source app
- `SsoBridge.jsx` (or equivalent) in the target app
