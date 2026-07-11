# Safari Web Extension — Positioning

Safari uses Web Extensions API (similar to MV3) wrapped in native Xcode project.

## Flow
1. Build web extension assets (shared with Chrome where possible)
2. Xcode `Safari Web Extension` target
3. Test in Safari Develop menu
4. Distribute via Mac App Store (extension + container app)

Use `browser-extension-safari` archetype. Pair with Chrome pack for shared codebase notes.
