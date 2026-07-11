---
description: Load domain DNA context — security, backend, frontend, QA, compliance.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Load DNA context

Load domain-specific intelligence for this session.

Target: $ARGUMENTS

## Run

```bash
npx dna context <target>
```

Valid targets: cursor, claude, security, backend, frontend, qa, compliance, devops, ux, architecture.

## Apply

Read referenced `.DNA/knowledge/` files. Summarize what rules and patterns apply to this session.
