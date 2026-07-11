---
description: Decompose initiative/epic into stories or scopes per methodology hierarchy.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Break down work

Decompose work using the team's hierarchy from delivery profile.

Scope: $ARGUMENTS

## Run

```bash
npx dna context methodology
```

## Output

Tree: initiative → epic → story (or bet → scope → task for Shape Up)

Each leaf item:
- Title, one-line outcome
- Suggested owner (squad/role if archetype applies)
- Dependencies between items
- Sizing hint (points, appetite, or t-shirt) per methodology
