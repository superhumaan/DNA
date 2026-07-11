---
description: Write work items in org-correct format (Jira, Linear, GitHub, Azure DevOps).
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Create ticket

Write work item(s) matching this team's delivery profile.

Scope: $ARGUMENTS

## Before writing

```bash
npx dna context methodology
```

Read `methodologies/ticket-writing` and active methodology pack.

## Output format

- Use correct hierarchy level (epic/story/task/etc.)
- Use ticket system field names (Jira vs Linear vs GitHub)
- Include acceptance criteria and labels from custom profile
- Copy-paste ready — user should paste directly into their tool
