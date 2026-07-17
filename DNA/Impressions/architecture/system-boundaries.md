# System Boundaries

## In scope

- DNA CLI, generators, knowledge/workbench assets, and project intelligence
- Runtime capture pipeline and supported framework adapters
- DNA Lab UI, APIs, authentication, pairing, state, and quality views
- Local/shared Lab state contracts and atomic runtime JSON
- Test, quality, security, Docker, GitHub, and npm delivery pipelines
- Sanitized public health report contract

## External boundaries

- Consumer applications own their framework, database, users, and deployment
- GitHub owns repository, workflow, issue, and release availability
- npm owns package distribution
- `superhumaan/DNA-Web` owns the public `/health` presentation and marketplace
- Optional shared-state infrastructure is operator-provisioned

## Explicitly out of scope

- Hosted DNA SaaS or customer runtime-data aggregation
- External uptime monitoring
- Automatic merging of repair pull requests
- Exposing private runtime events or source paths in public health reports
