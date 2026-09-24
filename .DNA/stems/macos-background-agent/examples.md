# Examples

## Example 1

**User:** The helper should start at login and stay invisible

**Good response shape:**
Helper target is separate from the menu-bar app. Login item registers on enable and is removed on disable. Smoke: process present after enable, gone after disable. Notes in macos-background-agent.md.

## Example 2

**User:** Phone home on a timer so we know it is alive

**Good response shape:**
Refused a new network check-in. The helper stays local. Liveness is the existing local log. Say if the product already has an approved telemetry channel to reuse.

## Example 3

**User:** We only have a website

**Good response shape:**
Stopped. No native macOS target. This stem does not add a desktop app.
