# Examples

## Example 1

**User:** Field staff have no signal

**Good response shape:**
Read cache + outbox for report submits. Idempotency keys. Conflict: server-wins on profile, user prompt on reports. Plan in expo-offline.md.

## Example 2

**User:** Just use TanStack persist

**Good response shape:**
OK for reads. Writes still need an outbox. Documented gap if persist-only.

## Example 3

**User:** Sync every 15 minutes in background

**Good response shape:**
Not guaranteed on iOS. Use opportunistic NetInfo + user-open sync. Background fetch as best-effort only.
