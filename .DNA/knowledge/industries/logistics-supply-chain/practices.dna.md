# Logistics & Supply Chain — Best Practices

**Do:**
- Idempotent shipment state machine (picked → in-transit → delivered)
- GPS privacy for drivers; geofence with consent
- Handle partial deliveries and exceptions explicitly
- Timezone-aware ETAs
- Offline-capable driver apps

**Don't:**
- Lose audit trail on custody transfers
- Expose internal cost data to shipper portals
- Skip retry on partner API failures