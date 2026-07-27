# HL7 v2.x — Examples

## Happy path
- Use interface engine (Mirth Connect) — do not parse v2 in app server ad hoc
- ACK/NACK handling mandatory
- Message versioning per receiving facility
- Never expose MLLP to public internet — VPN/private link

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
