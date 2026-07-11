# France — DMP & Mon Espace Santé

The **Dossier Médical Partagé (DMP)** / **Mon Espace Santé** is the citizen health record hub.

## Integration
- Follow **ANS** CI-SIS FHIR profiles for clinical documents
- Patient consent and access controls are mandatory
- **MSSanté** for secure professional messaging where applicable

## Architecture
- Separate citizen-facing portal auth from clinician auth
- Document consent artefacts and retention
- Test with ANS conformance environments before production