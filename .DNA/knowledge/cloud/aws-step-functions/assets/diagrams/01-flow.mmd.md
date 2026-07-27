# Diagram — AWS Step Functions flow

```mermaid
flowchart LR
  A[Intake] --> B[Plan]
  B --> C[Build]
  C --> D[Verify]
  D --> E[Ship]
```
