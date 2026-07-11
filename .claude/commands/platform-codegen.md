---
description: Scaffold SSO, multi-tenant, feature flags, gradual rollout, or audit logging.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Platform codegen

```bash
npx dna generate feature audit-logging
npx dna generate feature sso
npx dna generate feature multi-tenant
npx dna generate feature feature-flags
npx dna generate feature gradual-rollout
```

Target: $ARGUMENTS

Pick the matching feature ID. Review `.DNA/plans/` output. Wire scaffolds into the app — pair gradual-rollout with feature-flags when needed.
