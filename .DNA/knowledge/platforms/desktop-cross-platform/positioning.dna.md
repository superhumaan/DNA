# Desktop Cross-Platform — Positioning

One codebase → Windows, macOS, Linux installers.

## Choose framework
| | Electron | Tauri |
|---|----------|-------|
| Runtime | Chromium + Node | System WebView + Rust shell |
| Bundle size | Larger | Smaller |
| Native APIs | Mature | Growing via plugins |
| Team skills | JS/TS only | Rust for native bridges |

Use `desktop-electron` or `desktop-tauri` archetype. Frontend: React + Vite common to both.
