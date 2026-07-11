---
description: Sector legal engineering checklist — privacy, banking, healthcare before shipping a feature.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Legal engineering

```bash
npx dna context legal --quote "$ARGUMENTS"
```

Feature / flow: $ARGUMENTS

Load domain packs under `.DNA/knowledge/legal/domains/` and regional checklists.

Check: lawful basis, consent, sector rules (PCI, PHI, AML), IP, counsel gates.
