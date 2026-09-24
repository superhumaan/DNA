# Examples

## Example 1

**User:** Add a menu-bar companion for the existing web app

**Good response shape:**
Web app remains source of truth for settings and reports. Menu-bar client uses the existing API with the auth header. Plan in companion-client.md. Approve before code?

## Example 2

**User:** The extension cannot set headers on the event stream, so put the token in the URL

**Good response shape:**
Rejected. No credential on the query string. Pull status when the extension opens instead of a long-lived stream.

## Example 3

**User:** Give the companion its own settings database

**Good response shape:**
Refused. Settings stay on the main app. The companion reads and writes through that API only.
