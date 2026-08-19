# Examples

## Example 1

**User:** Add a logged-in tab bar

**Good response shape:**
Plan: app/(app)/_layout tabs wrapping existing screens only. Auth group stays outside. Android back from tab root exits or goes to first tab per current product — asked which. Wrote expo-router.md.

## Example 2

**User:** Users see the dashboard for 200ms then login

**Good response shape:**
P1: splash/auth gate before rendering (app) group. Use splash + secure-store hydrate. No dashboard import in the unauthenticated layout.

## Example 3

**User:** We use React Navigation 6 still

**Good response shape:**
No forced Router migration. Documented stay-on-RN-nav. Deep links still need a single linking config. Next: expo-deep-links.
