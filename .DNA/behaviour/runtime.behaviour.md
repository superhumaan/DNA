<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Runtime Behaviour

## Runtime Status

Runtime enabled: yes
Backend watching: yes
Frontend watching: yes
Storage: json (atomic JSON; compatibility filename `.DNA/data/runtime.db`)
AI repair: yes

## Rules

- All production errors must be captured by DNA runtime (backend + frontend)
- Runtime issues are stored in `.DNA/data/runtime.db` (not JSONL)
- Runtime issues are classified by the Immune System
- GitHub issues are created for high/critical severity issues
- AI repair creates PRs but never auto-merges
- **Bug loop:** issue → fix → retest → push preview → CI green
- Never deploy fixes without human approval
- Update CellularMemory amygdala/repeated-failures.md for recurring issues
