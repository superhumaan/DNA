# Desktop — Distribution

## Windows
- NSIS or MSI via electron-builder; MSIX optional
- SmartScreen — EV cert reduces warnings

## macOS
- `.dmg` or `.pkg`; notarize + staple with Apple credentials
- Universal binary (arm64 + x64) when using Electron 20+

## Linux
- AppImage, deb, rpm via electron-builder; Flatpak/snap if enterprise requires
- Test on Ubuntu LTS minimum
