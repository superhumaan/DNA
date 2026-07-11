> **DNA Prompt Stem:** `agent-loop-full` — read `.DNA/stems/agent-loop-full/` (all files) before proceeding.

# Full agent loop

Execute `ai/agent-loop.md` **role by role**. One role per phase; complete handoffs.

Feature context: $ARGUMENTS

## Order

1. **Product Analyst** → update `ai/feature-request.md`
2. **Solution Architect** → plan → **STOP for approval**
3. *(after approval)* Backend → Frontend → UX → QA → Code Quality → Refactor → Final Release

## Per role

Read `.DNA/stems/role-<name>/` (all files) before each role.

Use slash commands: `/product-analyst`, `/solution-architect`, `/backend-engineer`, etc.

## Gates

- No code before architect approval
- Quality **PASS** before final release
- Docker + github push on close-out
