# Feature Factory Workflow

Triggered automatically when the user describes a feature in Cursor or Claude.

## Agent flow

1. User describes what they want in plain language
2. Agent writes `ai/feature-request.md` from their message
3. Agent executes `ai/agent-loop.md` role by role
4. Agent stops after Solution Architect plan — waits for approval
5. After approval — implement through all engineering roles
6. Code Quality Analyst runs `dna quality report --feature` — gate must PASS

## Definition of done

See `.cursor/rules/qa.mdc`, `.cursor/rules/code-quality.mdc`, and success criteria in `ai/feature-request.md`.

Quality reports: `.DNA/reports/quality/`
