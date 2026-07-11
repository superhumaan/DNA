# React — Anti-patterns

- Do not store derived state — compute in render or useMemo
- Do not use useEffect for data fetching when a data library exists
- Do not bypass React for DOM manipulation except refs for focus/scroll
- Do not put secrets or API keys in client bundles
