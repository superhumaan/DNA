# Healthcare — Legal Engineering

## US (HIPAA)
- PHI minimum necessary
- BAA with all vendors touching ePHI
- Security Rule: access, audit, integrity, transmission security

## EU/UK
- Health data often **special category** under GDPR — stricter lawful basis
- Medical device software may trigger MDR/IVDR

## APAC
- Singapore HCSA, Thailand PDPA health provisions, Malaysia PDPA sensitive data

## Engineering checklist
- [ ] PHI field-level encryption and access logging
- [ ] No PHI in application logs, crash reports, or AI prompts
- [ ] Clinical decision support: human-in-the-loop where regulated
- [ ] Telehealth: jurisdiction of practitioner and patient

## Pair with
`healthcare/overview` packs + `dna plan compliance --frameworks hipaa`
