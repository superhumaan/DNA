# Examples

## Example 1

**User:** Preview and prod both called the same on my phone

**Good response shape:**
Suffix applicationId/bundleIdentifier + display name for preview. Dynamic app.config. Plan in expo-app-config.md.

## Example 2

**User:** Put STRIPE_SECRET in extra for convenience

**Good response shape:**
Never. Client extra is public. BFF holds Stripe secret. Flag as P1 if already committed — rotate.

## Example 3

**User:** We only have app.json

**Good response shape:**
OK until flavors exist. When preview ids diverge, migrate to app.config.ts. Documented trigger.
