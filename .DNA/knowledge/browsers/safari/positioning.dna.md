# Apple Safari — Browser Target

Engine: **WebKit**

**Mandatory** for iOS/macOS audiences. ITP, date input, PWA limitations, 100vh bugs.

## Rules
- Test on real iPhone — Simulator insufficient for PWA install
- `-webkit-` prefixes only when standards track requires
- Cookie `SameSite=None; Secure` for cross-site embeds

Pair with `browsers/cross-browser` for CI matrix and support policy.
