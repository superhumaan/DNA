# GDPR UX Design (DNA)

From DNA production — pair with legal/DPO for policy text.

## Data subjects
- **Employees** — people records, allocations, admin views
- **Survey respondents** — external CSS/NPS via token + passcode only

## Transparency UX
- Login: link to privacy notice where personal data is processed
- Person profile: show only fields appropriate to viewer role
- Surveys: purpose statement before optional PII fields
- Admin export: confirm scope ("You are exporting N people")

## Data minimisation
- Hide admin-only fields from contributors
- Survey field builder: default to minimum questions
- Search/lists: no sensitive attributes in columns unless required
- View-as admin: banner that session simulates another role

## Rights request UX hooks
| Right | Pattern |
|-------|---------|
| Access/export | Export with confirmation |
| Rectification | Edit profile + admin audit |
| Erasure | Admin workflow + destructive confirmation modal |

## Security UX
- Session expiry → login redirect; no sensitive IDs in errors
- JWT never shown in UI
- 403 explains "no permission" without leaking resource existence
