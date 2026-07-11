---
description: Turn analyze output into an actionable plan — P1 gaps, IVF, shared library, features.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# What next after analyze?

The user has analysis output (or will paste it). Turn gaps into an actionable plan.

User context / analyze output: $ARGUMENTS

## Interpret

1. Explain **P1 gaps in plain English** — not a raw CLI dump.
2. Map each P1 to a DNA action:
   - Shared library → `npx dna ivf shared-library --dry-run`, scaffold `packages/humaan-ui`
   - Build rules → capture MUI/patterns into `.DNA/knowledge/`
   - Behaviour restructure → `npx dna validate`, update behaviour files
   - Impressions drift → `npx dna plan impressions-sync` or `npx dna scan --open-pr`
   - Platform features → `npx dna generate feature <id>` (sso, multi-tenant, feature-flags, gradual-rollout, audit-logging)
   - Team memory → `npx dna memory sync`
3. Optional: `npx dna plan ivf` for phased migration.

## Ask

Present 2–3 paths. User picks one. Then execute or hand off to the right stem (ship-feature, ivf-run, etc.).
