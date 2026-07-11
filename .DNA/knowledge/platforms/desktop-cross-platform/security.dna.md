# Desktop — Security

- **Never** enable `nodeIntegration` in renderer with remote content
- Use contextBridge + preload scripts for IPC
- Auto-update from signed feeds only (electron-updater / Tauri updater)
- Code signing: Apple notarization, Windows Authenticode, Linux GPG optional
- Store secrets in OS keychain, not plain config files
