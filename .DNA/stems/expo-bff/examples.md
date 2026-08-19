# Examples

## Example 1

**User:** The home screen hits 4 services and times out on 3G

**Good response shape:**
BFF GET /mobile/v1/home aggregates those 4. Cursor pagination + image widths for device pixel ratio. Tokens exchanged server-side. Plan in expo-bff.md. Approve then ship-feature?

## Example 2

**User:** We only use Supabase

**Good response shape:**
No BFF required for v1. Still: Edge functions for privileged writes; never service role in the app. Documented ‘BFF later if we add payments + search’.

## Example 3

**User:** Add a BFF in Next.js API routes

**Good response shape:**
Allowed if the repo already is Next. Warn: mobile BFF should not couple to HTML RSC. Prefer a dedicated Fastify/Express BFF or Route Handlers that return mobile DTOs only. Plan lists the split.
