# Azure (AIStudio, Soli)

## Services used in production
- **Azure Container Apps** — SPA + API single container
- **Azure Files** — persistent SQLite/data mount
- **Azure Key Vault** — secrets
- **Azure AD B2C** — production SSO (MSAL + server session exchange)
- **Azure Communication Email** — transactional email
- **Azure SQL** — Soli multi-tenant persistence option
- **Log Analytics** — observability

## Terraform
Per-customer module: `infra/terraform/modules/customer/`

## Deploy flow
Build Docker image → push ACR → terraform apply → provision tenant script

## Env fail-fast
Reject AUTH_DEBUG, missing SESSION_SECRET in production.
