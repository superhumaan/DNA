# Architecture

Org / accounts → VPC → compute (ECS/Lambda) → data (RDS/S3) → edge (CloudFront)  
Prefer IaC (Terraform/CDK) over console clicks for prod.
