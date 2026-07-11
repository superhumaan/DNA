# United States — Payer & RCM Integration

US billing still relies on **X12 EDI** (837/835) via clearinghouses.

## FHIR payer IGs (Da Vinci)
- PDex, PAS (prior auth), CDex
- Pair with `healthcare/da-vinci` and `healthcare/x12-edi`

Never store raw 837 files unencrypted.