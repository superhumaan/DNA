# Lab open auth — `requireAuthInProduction`

DNA Lab config flag. Documented for DNA Lab only.

## Behaviour

| Setting | Effect |
|---------|--------|
| `lab.requireAuthInProduction: true` (default) | Non-loopback hosts require Lab pairing / sign-in for Lab APIs |
| `lab.requireAuthInProduction: false` | Lab APIs open without pairing on public hosts (use only for intentional open Lab) |
| Loopback `Host` | Always treated as local open access when `openLocalWithoutAuth` is true |

```json
{
  "lab": {
    "enabled": true,
    "path": "/labs",
    "requireAuthInProduction": true,
    "openLocalWithoutAuth": true
  }
}
```

Or pass the same into `createLabMiddleware({ config: { lab: { … } } })`.

Do **not** treat `NODE_ENV=development` as open — only this flag or loopback Host.

Covered by regression tests in `packages/dna-core/src/lab/server.test.ts`.
