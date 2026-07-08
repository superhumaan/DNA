# Security Policy

DNA by Humaan takes security seriously. We appreciate responsible disclosure from researchers and users.

## Supported versions

Security fixes are applied to the latest release on npm (`@superhumaan/dna-by-humaan`). Pre-release and development builds on `main` may receive fixes before the next tagged release.

| Version | Supported |
| ------- | --------- |
| `0.1.x` (latest) | Yes |
| `< 0.1.0` | No |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report them privately using one of these channels:

1. **GitHub private vulnerability reporting (preferred)**  
   [Report a vulnerability](https://github.com/superhumaan/DNA/security/advisories/new) on this repository’s Security tab.

2. **Email**  
   Send details to [security@humaan.com](mailto:security@humaan.com) with the subject line `DNA Security Report`.

Include as much of the following as you can:

- A clear description of the issue and its impact
- Steps to reproduce, or a proof of concept
- Affected component (CLI, runtime observer, GitHub integration, marketplace packs, etc.)
- DNA version (`dna --version`) and Node.js version
- Your name or handle if you would like credit (optional)

## What we consider in scope

- Remote code execution, privilege escalation, or sandbox escape in DNA tooling
- Credential or token leakage through the CLI, runtime observer, or GitHub automation
- Unsafe defaults that expose secrets, tokens, or private repository data
- Supply-chain or integrity issues in published npm packages or generated project artifacts

## Out of scope

- Vulnerabilities in third-party dependencies already tracked by public advisories (please report upstream; we will still update when fixes are available)
- Issues in consumer projects scaffolded by DNA unless they stem from unsafe DNA defaults or generated templates
- Social engineering, physical attacks, or denial-of-service against Humaan infrastructure
- Missing security hardening with no demonstrated exploit path

## Response timeline

| Stage | Target |
| ----- | ------ |
| Initial acknowledgement | Within 3 business days |
| Triage and severity assessment | Within 10 business days |
| Fix or mitigation plan | Depends on severity; critical issues are prioritised |
| Coordinated disclosure | After a fix is available, unless earlier disclosure is required |

We will keep you informed of progress. If you prefer to remain anonymous, say so in your report.

## Safe harbour

We support responsible disclosure. We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service disruption
- Give us reasonable time to investigate and remediate before public disclosure
- Do not exploit the issue beyond what is needed to demonstrate it

## Security updates

Fixed vulnerabilities are announced through [GitHub Security Advisories](https://github.com/superhumaan/DNA/security/advisories) and noted in [CHANGELOG.md](./CHANGELOG.md). Update to the latest npm release after advisories are published.

## Questions

For non-security questions, use [GitHub Issues](https://github.com/superhumaan/DNA/issues). For general product enquiries, visit [dna.humaan.app](https://dna.humaan.app).
