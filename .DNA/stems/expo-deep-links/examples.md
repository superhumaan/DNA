# Examples

## Example 1

**User:** Emails should open the invoice screen

**Good response shape:**
https://app.example.com/invoices/:id + AASA/assetlinks. Router file invoices/[id]. Unauth → login → replay. Plan in expo-deeplinks.md.

## Example 2

**User:** Use myapp:// everywhere

**Good response shape:**
OK for local/dev. Production still needs HTTPS app links for email/SMS. Documented split.

## Example 3

**User:** Links open Safari not the app

**Good response shape:**
Verify AASA JSON, associatedDomains, team ID. Android: sha256 fingerprints in assetlinks. Do not guess live DNS — check evidence.
