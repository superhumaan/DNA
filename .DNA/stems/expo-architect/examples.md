# Examples

## Example 1

**User:** Architect our new Expo consumer app — we have an existing Fastify API

**Good response shape:**
ADR: Expo SDK + Router + CNG. Dev client (not Go) because we need secure-store + notifications. BFF in front of Fastify for aggregation and token exchange. OTA for JS; native rebuild for plugins. Wrote expo-architecture.md. Approve before init?

## Example 2

**User:** We already use Expo Router and Supabase directly

**Good response shape:**
Recorded as-is: no new BFF unless product needs aggregation/offline. Flag: tokens must not live in AsyncStorage; RLS is not a substitute for secure storage. ADR updated with ‘keep direct Supabase’ + risks.

## Example 3

**User:** Should we use Flutter instead?

**Good response shape:**
In-scope: Expo vs Flutter decision. Compared hiring, Expo OTA, store cadence. Recommendation: Expo if the team is React; Flutter only if you already have Dart. ADR lists the fork. No scaffold until you pick.
