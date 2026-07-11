# Healthcare Overview — European Union — Integration

1. **Country-specific pack** — prefer `healthcare/overview-de`, `-fr`, etc. over this generic EU pack when known
2. **National health APIs** — Gematik (DE), INS/DMP (FR), Nictiz (NL)
3. **iPaas** — Redox, MuleSoft for multi-country rollouts
4. **Data residency** — EU region; SCCs for transfers outside EEA

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- CE marking path via `healthcare/mdr-eu` if SaMD
- Pair with: `healthcare/mdr-eu`, `healthcare/fhir-r4`