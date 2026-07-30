# UI Patterns

## DNA Lab

- Dedicated `/labs` shell with overview and quality navigation
- Poll only request-specific APIs; pause hidden tabs and use ETag/304 revalidation
- Load issue event detail on demand rather than expanding the hot payload
- Reuse table/search/tab/status primitives and consistent empty/error/loading states
- Never expose admin/auth surfaces solely through visual hiding
- **Mobile (≤900px):** ColorParty-style off-canvas nav — `settings-mobile-chrome` hamburger, backdrop, Escape/tab-close; tables scroll horizontally (`min-width: 640px`)

## DNA-Web

- Dark DNA tokens, DM Sans body type, Syne display type, emerald accent
- `max-w-6xl`, six-unit horizontal padding, bordered translucent report cards
- Public report pages are server-rendered from sanitized committed data
- Status always uses text + icon/label, never colour alone
- Responsive grids collapse to a readable single column on small screens
