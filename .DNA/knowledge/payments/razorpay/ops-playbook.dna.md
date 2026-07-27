# Ops playbook — Razorpay

## Runtime context
Razorpay (payments/razorpay) in a DNA project

## Ownership
- **Primary:** team that ships changes to this surface
- **Escalation:** on-call → platform → vendor support (if managed)
- **Change window:** prefer low-traffic; always have rollback

## Pre-deploy
1. Diff reviewed; secrets/config validated
2. Migrations / contract changes backward compatible or dual-written
3. Feature flag or canary plan stated
4. `dna quality report --feature` PASS when this is product code
5. Dashboards/alerts known for the blast radius

## Deploy
1. Apply to staging; smoke the recipes in `recipes.dna.md`
2. Promote with the same artifact digest when possible
3. Watch error rate + latency for 15–30 minutes
4. Announce in the team channel with rollback command

## Incident first 15 minutes
1. Declare severity; page if user-facing money/auth/data loss
2. Stabilize (rollback / flag off / scale) before root-causing
3. Capture timeline in CellularMemory amygdala / incident notes
4. Never invent “fixed” from stub Impressions — use logs + traces

## Post-incident
1. Blameless review within 5 business days
2. Update `troubleshooting.dna.md` with the new failure mode
3. File follow-ups as tickets — not chat-only
4. Sync CellularMemory amygdala / temporalLobe when the fix is structural

## Environments
| Env | Purpose | Data rules |
|-----|---------|------------|
| local | Dev | Fake/synthetic only |
| staging | Pre-prod | Anonymized or synthetic |
| prod | Live | Least privilege; change control |

Never copy prod secrets into local gitignored files that might be shared.
