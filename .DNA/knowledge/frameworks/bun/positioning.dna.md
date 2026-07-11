# Bun — Positioning

Alternative JS runtime. Use when team commits to Bun for dev+prod Node replacement.

## Rules
- Lock `bun.lock`; CI uses same Bun version
- Verify native module compatibility vs Node before migration
- Hono + Bun is common pairing