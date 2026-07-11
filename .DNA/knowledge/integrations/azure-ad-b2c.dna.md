# Azure AD B2C

## Client
MSAL browser → acquire idToken → `POST /api/v1/auth/b2c/session`

## Server
Verify JWT via JWKS (`jose`)
Map claims: `extension_accountUrl`, `extension_tenantId`
Issue app session cookie

## Account URL
Users sign in at tenant-specific URL; validate at login.

## Local dev fallback
`AUTH_PROVIDER=local` with OTP for development.
