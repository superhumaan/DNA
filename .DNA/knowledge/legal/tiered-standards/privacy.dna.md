# Privacy & Data Protection — Legal Engineering

## Core obligations (most jurisdictions)
- Lawful basis documented per processing purpose
- Notice at collection; privacy policy accurate to flows
- Data subject rights: access, rectification, erasure, portability
- Breach notification within statutory windows
- Cross-border transfer mechanism where required

## Engineering checklist
- [ ] Data inventory maps fields → purpose → retention → lawful basis
- [ ] Consent records: what, when, version of policy
- [ ] Erasure cascades to backups/analytics within SLA
- [ ] Subprocessor register matches actual vendors
- [ ] DPIA for high-risk processing (profiling, biometrics, children)

## Regional packs
Install country packs: `dna marketplace install legal/regions/sg-pdpa`
