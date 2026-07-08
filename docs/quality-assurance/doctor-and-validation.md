# Doctor and validation

DNA's built-in health checks ensure projects stay aligned with Behaviour rules and configuration.

---

## doctor

Full project health check:

```bash
dna doctor
```

Checks include:

- `.DNA/` structure completeness
- config.dna.json validity
- Behaviour files present
- neuralNetwork.json valid
- Knowledge pack integrity
- Runtime configuration (if enabled)
- AI tool file sync

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
| After `dna init` | `dna doctor` |
| Before commits | `dna validate` |
| In CI | Both |
| After marketplace update | `dna doctor` |

---

## Related

- [Testing strategy](./testing-strategy.md)
- [CLI reference](../engineering/cli-reference.md)
