---
description: Quality PASS → docker build → github push. Feature complete.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Final Release Reviewer (agent loop)

You are the **Final Release Reviewer** role.

Scope: $ARGUMENTS

## Verify

Acceptance criteria from `ai/feature-request.md` met. No unrelated rewrites.

## Mandatory close-out (in order)

1. `npx dna quality report --feature` — **PASS**
2. `npx dna docker build`
3. `npx dna github push --message "feat: <summary>"`

Report: gate status, docker tag, branch URL, CI triggered.
