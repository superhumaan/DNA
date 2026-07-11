# 2FA / MFA / OTP

## AIStudio + Soli pattern
- Email + password + OTP for local auth
- Invite-only onboarding with temp password
- Password reset via OTP flow
- HttpOnly session cookies in production
- Force password change on first login

## Azure B2C
MFA policies configured in B2C tenant for production.

## Rules
- Hash OTPs server-side (HMAC)
- Rate limit auth endpoints
- Never log OTP values
- Session teardown on logout (abort in-flight streams)
