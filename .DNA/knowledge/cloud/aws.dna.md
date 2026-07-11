# AWS Reference Patterns

## Recommended stack (greenfield)
- **ECS Fargate** or **App Runner** — containerized SPA+API
- **ALB** — TLS termination, path routing
- **RDS Postgres** — primary datastore
- **ElastiCache Redis** — rate limits, sessions
- **Cognito** — OAuth/OIDC (alternative to B2C)
- **S3 + CloudFront** — static assets (if split FE/BE)
- **Secrets Manager** — API keys
- **CloudWatch** — logs + alarms

## Nginx option
ALB → Nginx sidecar → app containers for custom routing.

## DNA pairing
Use with `dna plan feature aws-deploy` and `integrations/nginx.dna.md`.
