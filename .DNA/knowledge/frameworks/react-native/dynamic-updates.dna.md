# Expo — Dynamic builds (EAS Update)

OTA **JS/assets** when `runtimeVersion` matches the installed binary.

## OTA allowed
- JS/TS, most update assets, flags that do not need new entitlements

## Binary required (block OTA-only)
- Native modules, config plugins, permissions, splash/icon native resources, SDK bump

Channels: preview vs production. Document rollback. Stem: `/expo-dynamic-builds`.
