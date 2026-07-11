# DICOM & Imaging — Architecture

## When to use
# DICOM

Imaging standard for radiology/pathology. **Large binaries** — separate archive from OLTP DB.

## Stack
Orthanc, DCM4CHEE, or cloud PACS; OHIF viewer; DICOMweb WADO-RS

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
