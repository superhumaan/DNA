# Google OAuth + Directory Sync

## OAuth sign-in
- Redirect to `/api/auth/google`
- Domain lock: `ALLOWED_DOMAIN` email suffix
- httpOnly JWT + encrypted refresh cookie

## Directory sync (admin)
- Service account + domain-wide delegation
- Sync: email, name, title, department, manager, photo
- Map job titles via Job Directory (Ops)
- Archive leavers; never auto-create departments from people alone

## Cron
Daily sync (Bangkok midnight in DNA production).

## Admin UI
Manual sync button + per-person resync.
