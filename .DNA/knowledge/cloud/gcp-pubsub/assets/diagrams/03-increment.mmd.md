# Diagram — Google Cloud Pub/Sub increment

```mermaid
sequenceDiagram
  participant B as Backlog
  participant T as Team
  participant S as Stakeholders
  B->>T: Pull work
  T->>T: Build + test
  T->>S: Demo increment
```
