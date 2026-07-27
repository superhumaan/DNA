# Appendix — India DPDP Act deep dive

## Decision record template
- **Context:** why India DPDP Act was chosen for this project
- **Options considered:**
- **Decision:**
- **Consequences:** ops, cost, lock-in, team skill
- **Review by:** date

## Glossary
| Term | Meaning in this pack |
|------|----------------------|
| SoR | System of record |
| Blast radius | What fails if this surface fails |
| Expand/contract | Compatible migration pattern |
| Impression Guard | Stub Impressions ≠ truth |
| STRATEGY_COMPLETE | Handoff JSON before Feature Factory |

## Anti-stub rule
If an Impression or policy file about **India DPDP Act** is empty, TODO, or generic, mark EMPTY_STUB_RESOLVED and ground in code + CellularMemory + runtime evidence.

## Quality bar (DNA)
1. Spec / plan approved when product-facing
2. Tests for critical paths
3. `dna quality report --feature` PASS
4. `dna docker build` when shipping
5. Preview push — do not leave work localhost-only

## Operator cheat sheet
- Find owners in CODEOWNERS / team roster
- Find dashboards linked from `observability.dna.md`
- Find rollback in `migration-upgrade.dna.md`
- Find security expectations in `security-hardening.dna.md`

## Related packs
Install purpose combos when they exist (e.g. `combo/nextjs-fullstack`, `combo/scrum-team`). Prefer composing packs over duplicating guidance.

## Change log hygiene
Every material change to how **India DPDP Act** is used in-repo should update CHANGELOG + CellularMemory recent-changes when architecture shifts.

## Training notes
New engineers: read positioning → architecture → recipes → ops playbook. Skip marketing blogs as source of truth.

## Review prompts for agents
1. What evidence proves this claim?
2. What is the rollback?
3. What PII/PHI/secrets are in play?
4. Did Impression Guard run?
5. Is Feature Factory the next step or still strategy?

_End of India DPDP Act appendix — keep this file updated when operating model changes._
