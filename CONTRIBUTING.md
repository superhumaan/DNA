# Contributing to DNA

Thank you for contributing to **DNA by Humaan**.

## Repository

https://github.com/superhumaan/DNA

## Development setup

```bash
git clone https://github.com/superhumaan/DNA.git
cd DNA
pnpm install
pnpm build
pnpm test
```

## Pull request guidelines

1. Branch from `main`
2. Keep changes focused — one feature or fix per PR
3. Run `pnpm build && pnpm test && pnpm typecheck` before opening
4. Update docs if you change CLI behaviour or public APIs
5. Follow existing code style (TypeScript, ESM, minimal scope)

## Reporting issues

Use [GitHub Issues](https://github.com/superhumaan/DNA/issues) with:

- DNA version (`dna --version` or `0.1.0`)
- Node version
- Steps to reproduce
- Expected vs actual behaviour

## License

By contributing, you agree your contributions are licensed under the [MIT License](./LICENSE).

© 2026 Humaan by Superlite
