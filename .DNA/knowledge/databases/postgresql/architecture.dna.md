# Architecture

App → pooler (PgBouncer) → primary → replicas (optional)  
Migrations expand/contract. Logical backups + PITR for prod.
