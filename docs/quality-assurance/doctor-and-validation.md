# Doctor and validation

DNA's built-in health checks ensure projects stay aligned with Behaviour rules and configuration.

---

## doctor

Full project health check:

```bash
dna doctor
```

Doctor scaffolds and repairs DNA in one pass. When GitHub is enabled and you are not signed in, it opens browser login (via `gh` or device flow). Skips login in CI or with `--check-only`.

Checks include:

- `.DNA/` structure completeness
- config.dna.json validity
- Behaviour files present
- neuralNetwork.json valid
- Knowledge pack integrity
- Runtime storage (`.DNA/data/runtime.db`) and auto-wire status
- CI, Docker, and git hooks scaffolding
- AI tool file sync
- GitHub connection (browser login + remote auto-detect)
- Preview deploy workflow when `ci.pushToPreview` is enabled
- Upstream feedback config (`feedback` block — enabled by default, `dna-only` auto-report)

---

## validate

Behaviour rule compliance:

```bash
dna validate
dna validate --strict
```

Validates the project against all six Behaviour files:

| File | Governs |
|------|---------|
| `ai.behaviour.md` | Master AI instructions |
| `coding.behaviour.md` | Code style and patterns |
| `testing.behaviour.md` | Test requirements |
| `documentation.behaviour.md` | Doc standards |
| `security.behaviour.md` | Security rules |
| `runtime.behaviour.md` | Incident and observability rules |

---

## When to run

| Moment | Command |
|--------|---------|
| After first setup | `dna doctor` (replaces separate `init` + `ci install` + `runtime install`) |
| Before commits | `dna validate` |
| In CI | Both |
| After marketplace update | `dna doctor` |

---

## Related

- [Testing strategy](./testing-strategy.md)
- [CLI reference](../engineering/cli-reference.md)
